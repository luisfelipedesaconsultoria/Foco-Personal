import { useCallback, useEffect, useRef, useState } from "react";
import { HeartRateMonitor, isBluetoothSupported } from "../lib/bluetoothHeartRate";
import { estimateMaxHR, getHRZone, caloriesPerMinute, kJtoKcal } from "../lib/calorieCalc";

export function useHeartRateMonitor({ weightKg, age, gender }) {
  const supported = isBluetoothSupported();
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [deviceName, setDeviceName] = useState(null);
  const [bpm, setBpm] = useState(null);
  const [battery, setBattery] = useState(null);
  const [calories, setCalories] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ avg: null, max: null, min: null });

  const monitorRef = useRef(null);
  const samplesRef = useRef([]);
  const startedAtRef = useRef(null);
  const lastSampleAtRef = useRef(null);
  const caloriesAccRef = useRef(0);
  const baseEnergyRef = useRef(null);
  const intervalRef = useRef(null);

  const maxHR = estimateMaxHR(age);
  const zone = getHRZone(bpm, maxHR);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const monitor = new HeartRateMonitor();
      monitorRef.current = monitor;
      samplesRef.current = [];
      caloriesAccRef.current = 0;
      baseEnergyRef.current = null;
      startedAtRef.current = Date.now();
      lastSampleAtRef.current = Date.now();

      monitor.addEventListener("heartrate", (e) => {
        const { heartRate, energyExpended } = e.detail;
        const now = Date.now();
        samplesRef.current.push(heartRate);
        setBpm(heartRate);

        if (energyExpended != null) {
          if (baseEnergyRef.current == null) baseEnergyRef.current = energyExpended;
          caloriesAccRef.current = kJtoKcal(energyExpended - baseEnergyRef.current);
        } else {
          const minutesSinceLast = (now - lastSampleAtRef.current) / 60000;
          caloriesAccRef.current += caloriesPerMinute({ bpm: heartRate, weightKg, age, gender }) * minutesSinceLast;
        }
        lastSampleAtRef.current = now;
        setCalories(Math.round(caloriesAccRef.current));

        const s = samplesRef.current;
        setStats({
          avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length),
          max: Math.max(...s),
          min: Math.min(...s),
        });
      });
      monitor.addEventListener("battery", (e) => setBattery(e.detail.level));
      monitor.addEventListener("disconnected", () => {
        setStatus("idle");
        clearInterval(intervalRef.current);
      });

      const { name } = await monitor.connect();
      setDeviceName(name);
      setStatus("connected");

      intervalRef.current = setInterval(() => {
        setElapsedSec(Math.round((Date.now() - startedAtRef.current) / 1000));
      }, 1000);
    } catch (err) {
      if (err.name === "NotFoundError") {
        setStatus("idle");
      } else {
        setStatus("error");
        setError(err.message);
      }
    }
  }, [weightKg, age, gender]);

  const getSummary = useCallback(
    () => ({
      deviceName,
      avgBpm: stats.avg,
      maxBpm: stats.max,
      minBpm: stats.min,
      calories: Math.round(caloriesAccRef.current),
      durationSec: elapsedSec,
    }),
    [deviceName, stats, elapsedSec]
  );

  const disconnect = useCallback(() => {
    monitorRef.current?.disconnect();
    clearInterval(intervalRef.current);
    setStatus("idle");
  }, []);

  useEffect(() => () => {
    monitorRef.current?.disconnect();
    clearInterval(intervalRef.current);
  }, []);

  return { supported, status, deviceName, bpm, battery, calories, elapsedSec, error, zone, maxHR, stats, connect, disconnect, getSummary };
}

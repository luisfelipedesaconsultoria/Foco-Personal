// Web Bluetooth API + GATT Heart Rate Service padrão (0x180D) — não usa SDK de
// fabricante nenhum, funciona com qualquer bracelete BLE (COOSPO, Polar, Garmin...).
// Só roda em Chrome/Edge (desktop ou Android); no iPhone use o app Bluefy.

const HR_SERVICE = "heart_rate";
const HR_MEASUREMENT_CHAR = "heart_rate_measurement";
const BATTERY_SERVICE = "battery_service";
const BATTERY_LEVEL_CHAR = "battery_level";

export function isBluetoothSupported() {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

export function parseHeartRateValue(dataview) {
  const flags = dataview.getUint8(0);
  const is16bit = flags & 0x1;
  const contactSupported = !!(flags & 0x4);
  const contactDetected = !!(flags & 0x2);
  const energyPresent = !!(flags & 0x8);
  const rrPresent = !!(flags & 0x10);

  let offset = 1;
  let heartRate;
  if (is16bit) {
    heartRate = dataview.getUint16(offset, true);
    offset += 2;
  } else {
    heartRate = dataview.getUint8(offset);
    offset += 1;
  }

  let energyExpended;
  if (energyPresent) {
    energyExpended = dataview.getUint16(offset, true);
    offset += 2;
  }

  const rrIntervals = [];
  if (rrPresent) {
    while (offset + 1 < dataview.byteLength) {
      rrIntervals.push(dataview.getUint16(offset, true) / 1024);
      offset += 2;
    }
  }

  return { heartRate, contactSupported, contactDetected, energyExpended, rrIntervals };
}

export class HeartRateMonitor extends EventTarget {
  constructor() {
    super();
    this.device = null;
    this.server = null;
    this._onValueChanged = this._onValueChanged.bind(this);
    this._onDisconnected = this._onDisconnected.bind(this);
  }

  async connect() {
    if (!isBluetoothSupported()) {
      throw new Error("Este navegador não suporta Bluetooth. Use Chrome/Edge, ou no iPhone o app Bluefy.");
    }
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [HR_SERVICE] }],
      optionalServices: [BATTERY_SERVICE],
    });
    this.device.addEventListener("gattserverdisconnected", this._onDisconnected);

    this.server = await this.device.gatt.connect();
    const hrService = await this.server.getPrimaryService(HR_SERVICE);
    this.hrChar = await hrService.getCharacteristic(HR_MEASUREMENT_CHAR);
    await this.hrChar.startNotifications();
    this.hrChar.addEventListener("characteristicvaluechanged", this._onValueChanged);

    this._readBatteryLevel();

    return { name: this.device.name || "Bracelete BLE" };
  }

  async _readBatteryLevel() {
    try {
      const battService = await this.server.getPrimaryService(BATTERY_SERVICE);
      const battChar = await battService.getCharacteristic(BATTERY_LEVEL_CHAR);
      const value = await battChar.readValue();
      this.dispatchEvent(new CustomEvent("battery", { detail: { level: value.getUint8(0) } }));
    } catch {
      // nem todo dispositivo expõe nível de bateria — ignora silenciosamente
    }
  }

  _onValueChanged(event) {
    const parsed = parseHeartRateValue(event.target.value);
    this.dispatchEvent(new CustomEvent("heartrate", { detail: parsed }));
  }

  _onDisconnected() {
    this.dispatchEvent(new CustomEvent("disconnected"));
  }

  disconnect() {
    if (this.hrChar) {
      this.hrChar.removeEventListener("characteristicvaluechanged", this._onValueChanged);
    }
    if (this.device) {
      this.device.removeEventListener("gattserverdisconnected", this._onDisconnected);
      if (this.device.gatt?.connected) this.device.gatt.disconnect();
    }
  }
}

/* =========================================================
   ÍCONES — SVGs reais no lugar de marcadores abstratos
========================================================= */
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
  dumbbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6M20 9v6"/><rect x="2" y="8" width="3" height="8" rx="1"/><rect x="19" y="8" width="3" height="8" rx="1"/><path d="M7 12h10"/><rect x="6" y="9.5" width="2.2" height="5" rx="0.6"/><rect x="15.8" y="9.5" width="2.2" height="5" rx="0.6"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.2 3-5 6.5-5s6.5 1.8 6.5 5"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.8 10.4c2.5.4 4.2 1.9 4.2 4.3"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2v1h16v-1z"/><path d="M10 21a2 2 0 004 0"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.5 4c2-.3 3.8.7 4.9 2.3C11.5 4.7 13.3 3.7 15.3 4c3.5.5 5 4 3.5 7.7C16.3 16.4 12 21 12 21z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 01-8.5 8.4H3.6L3 21l1.2-3.5a8.3 8.3 0 01-1.7-5A8.4 8.4 0 0111 3.6a8.4 8.4 0 0110 7.9z"/></svg>`,
};
document.querySelectorAll('ic[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ''; });

/* =========================================================
   NAVEGAÇÃO — troca de tela dentro de cada papel (poucos cliques)
========================================================= */
document.querySelectorAll('.bottomnav').forEach(nav=>{
  nav.querySelectorAll('button').forEach(btn=>{
    btn.onclick = () => {
      const root = btn.closest('.role-screen');
      root.querySelectorAll('.bottomnav button').forEach(b=>b.classList.remove('active'));
      root.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.view).classList.add('active');
    };
  });
});

/* =========================================================
   SWITCH DE PAPEL — só existe neste modo de demonstração.
   No produto real, o papel vem do login (aluno vs treinador),
   não de um botão visível.
========================================================= */
document.querySelectorAll('#devswitch .devswitch-btns button').forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll('#devswitch .devswitch-btns button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('screen-aluno').style.display = btn.dataset.role==='aluno' ? 'block':'none';
    document.getElementById('screen-treinador').style.display = btn.dataset.role==='treinador' ? 'block':'none';
  };
});

/* =========================================================
   DADOS DE DEMONSTRAÇÃO — trocar por leitura real (Supabase/Firestore)
========================================================= */
const NOTIF_ICONS = {
  coral: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 8l9 6 9-6"/></svg>`, // pagamento
  teal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`, // validação/check
};

let notifications = [
  {title:"Lembrete de pagamento", desc:"Sua mensalidade vence em 3 dias.", tag:"coral", time:"Hoje, 08:00", read:false},
  {title:"Validação semanal", desc:"Como foi sua semana? Toque para responder.", tag:"teal", time:"Sex, 18:00", read:false},
];

function renderNotifList(){
  const el = document.getElementById('notifList');
  if(!el) return;
  el.innerHTML = notifications.map((n,i)=>`
    <div class="notif-item ${n.read?'read':''}" data-idx="${i}">
      <div class="notif-icon ${n.tag==='coral'?'coral':''}">${NOTIF_ICONS[n.tag]||''}</div>
      <div style="flex:1;">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
      ${n.read ? '<span class="chevron">›</span>' : '<span class="unread-dot"></span>'}
    </div>`).join('');
  el.querySelectorAll('.notif-item').forEach(item=>{
    item.onclick = () => { notifications[item.dataset.idx].read = true; renderNotifList(); updateBellState(); };
  });
  updateBellState();
}
function updateBellState(){
  const bell = document.getElementById('bellBtn');
  if(!bell) return;
  const hasUnread = notifications.some(n=>!n.read);
  bell.classList.toggle('has-unread', hasUnread);
}
renderNotifList();

document.getElementById('bellBtn').onclick = () => {
  notifications.forEach(n=>n.read=true);
  renderNotifList();
  document.querySelector('#screen-aluno .bottomnav button[data-view="aluno-inicio"]').click();
};

let sentLog = [];
function renderSentLog(){
  const el = document.getElementById('sentLog');
  if(!el) return;
  el.innerHTML = sentLog.length ? sentLog.map(n=>`
    <div class="notif-item">
      <div class="tag ${n.tag==='coral'?'coral':''}"></div>
      <div>
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc} · ${n.audience}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
    </div>`).join('') : `<div class="empty-desc">Nenhum envio ainda.</div>`;
}
renderSentLog();

const alunosDemo = [
  {nome:"Rebeca Vaz", tipo:"Consultoria online", status:"Em dia"},
  {nome:"João Pedro", tipo:"Presencial", status:"Pagamento pendente"},
  {nome:"Marina Costa", tipo:"Consultoria online", status:"Em dia"},
];
document.getElementById('alunoListTr').innerHTML = alunosDemo.map(a=>`
  <div class="notif-item">
    <div class="tag ${a.status.includes('pendente')?'coral':''}"></div>
    <div>
      <div class="notif-item-title">${a.nome}</div>
      <div class="notif-item-desc">${a.tipo} · ${a.status}</div>
    </div>
  </div>`).join('');

/* =========================================================
   ENVIO (PAINEL DO TREINADOR)
   Aqui é o ponto real de integração: em produção, este fetch
   chama a function serverless (functions/send-notification.js),
   que usa o Firebase Admin SDK para disparar o push de verdade.
========================================================= */
const templates = {
  motiv: {title:"Segunda de partida", body:"Sua semana começa agora. Mantenha a rotina."},
  pag: {title:"Lembrete de pagamento", body:"Sua mensalidade vence em breve."},
  valid: {title:"Validação semanal", body:"Como foi sua semana? Toque para responder."},
};
document.getElementById('templateSelect').onchange = (e) => {
  const t = templates[e.target.value];
  if(t){ document.getElementById('notifTitleInput').value = t.title; document.getElementById('notifBodyInput').value = t.body; updatePreview(); }
};

/* --- pré-visualização ao vivo --- */
function updatePreview(){
  const title = document.getElementById('notifTitleInput').value.trim();
  const body = document.getElementById('notifBodyInput').value.trim();
  document.getElementById('previewTitle').textContent = title || "Título aparece aqui";
  document.getElementById('previewBody').textContent = body || "A mensagem aparece aqui conforme você digita.";
}
document.getElementById('notifTitleInput').addEventListener('input', updatePreview);
document.getElementById('notifBodyInput').addEventListener('input', updatePreview);

/* --- destinatário específico revela seletor de aluno --- */
const audienceSelect = document.getElementById('audienceSelect');
const studentPicker = document.getElementById('studentPicker');
let selectedStudent = null;
audienceSelect.onchange = () => {
  if(audienceSelect.value === 'especifico'){
    studentPicker.style.display = 'block';
    studentPicker.innerHTML = alunosDemo.map((a,i)=>`<div class="sp-item" data-i="${i}">${a.nome}<span>${selectedStudent===i?'✓':''}</span></div>`).join('');
    studentPicker.querySelectorAll('.sp-item').forEach(item=>{
      item.onclick = () => { selectedStudent = parseInt(item.dataset.i); audienceSelect.onchange(); };
    });
  } else {
    studentPicker.style.display = 'none';
    selectedStudent = null;
  }
};

/* --- chips de recorrência (Seg/Qua/Sex) --- */
document.querySelectorAll('.chip').forEach(chip=>{
  chip.onclick = () => {
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const targetDay = parseInt(chip.dataset.day);
    const [h,m] = chip.dataset.time.split(':').map(Number);
    const d = new Date();
    d.setHours(h,m,0,0);
    let diff = (targetDay - d.getDay() + 7) % 7;
    if(diff===0 && d < new Date()) diff = 7;
    d.setDate(d.getDate() + diff);
    document.getElementById('scheduleInput').value = d.toISOString().slice(0,16);
  };
});

/* --- envio real, com confirmação antes de disparar --- */
function audienceLabel(){
  const v = audienceSelect.value;
  if(v === 'especifico') return selectedStudent!=null ? alunosDemo[selectedStudent].nome : 'nenhum aluno selecionado';
  return v;
}

function requestSend(scheduled){
  const title = document.getElementById('notifTitleInput').value.trim();
  const body = document.getElementById('notifBodyInput').value.trim();
  const feedback = document.getElementById('sendFeedback');
  if(!title || !body){ feedback.textContent = "Preencha título e mensagem."; return; }
  if(audienceSelect.value === 'especifico' && selectedStudent==null){ feedback.textContent = "Escolha um aluno."; return; }

  const label = audienceLabel();
  document.getElementById('confirmSendDesc').textContent =
    (scheduled ? `Isso vai agendar o envio para ${label}. ` : `Isso vai enviar agora para ${label}. `) +
    (audienceSelect.value !== 'especifico' ? 'Confirma o disparo em massa?' : 'Confirma?');
  pendingSend = scheduled;
  document.getElementById('confirmSendSheet').classList.add('show');
}

let pendingSend = null;
document.getElementById('confirmSendBtn').onclick = () => {
  document.getElementById('confirmSendSheet').classList.remove('show');
  dispatchNotification(pendingSend);
};
document.getElementById('cancelSendBtn').onclick = () => {
  document.getElementById('confirmSendSheet').classList.remove('show');
};

async function dispatchNotification(scheduled){
  const title = document.getElementById('notifTitleInput').value.trim();
  const body = document.getElementById('notifBodyInput').value.trim();
  const audience = audienceLabel();
  const feedback = document.getElementById('sendFeedback');

  const payload = { title, body, audience, scheduledFor: scheduled ? document.getElementById('scheduleInput').value : null };

  try{
    // Endpoint real, criado no scaffold /functions/send-notification.js
    const res = await fetch('/.netlify/functions/send-notification', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('offline');
    feedback.textContent = scheduled ? "Envio agendado com sucesso." : "Notificação enviada.";
  }catch(err){
    feedback.textContent = scheduled
      ? "Agendado (modo demonstração — sem backend conectado ainda)."
      : "Enviado (modo demonstração — sem backend conectado ainda).";
  }

  sentLog.unshift({title, desc:body, audience, tag:'teal', time:"agora"});
  renderSentLog();
  if(audienceSelect.value !== 'especifico'){
    notifications.unshift({title, desc:body, tag:'teal', time:"agora", read:false});
    renderNotifList();
  }
}
document.getElementById('sendBtn').onclick = () => requestSend(false);
document.getElementById('scheduleBtn').onclick = () => requestSend(true);

/* =========================================================
   PERMISSÃO DE PUSH + REGISTRO DO SERVICE WORKER (REAL)
   Isto é código funcional de verdade — falta apenas o
   firebase-config.js com as chaves do seu projeto Firebase.
========================================================= */
document.getElementById('permBtn').onclick = () => {
  document.getElementById('pushPrimeSheet').classList.add('show');
};
document.getElementById('primeDismissBtn').onclick = () => {
  document.getElementById('pushPrimeSheet').classList.remove('show');
};
document.getElementById('primeAcceptBtn').onclick = () => {
  document.getElementById('pushPrimeSheet').classList.remove('show');
  setupPush();
};

async function setupPush(){
  const statusEl = document.getElementById('permStatus');
  const tokenEl = document.getElementById('tokenBox');
  const btn = document.getElementById('permBtn');

  if(!('serviceWorker' in navigator) || !('PushManager' in window)){
    statusEl.textContent = "Este navegador não suporta push."; btn.disabled = true; return;
  }
  if(typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey){
    statusEl.textContent = "Config Firebase pendente (firebase-config.js)";
    return;
  }

  try{
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){ statusEl.textContent = "Permissão negada"; return; }

    const app = firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    const token = await messaging.getToken({
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: registration
    });

    statusEl.textContent = "Ativadas";
    tokenEl.textContent = token;
    // Em produção: enviar este token pro backend (Supabase) vinculado ao aluno logado.
  }catch(err){
    statusEl.textContent = "Erro ao ativar: " + err.message;
  }
}

/* =========================================================
   ANÉIS ANIMADOS (elemento de assinatura da nova identidade)
========================================================= */
function animateRing(id, pct){
  const el = document.getElementById(id);
  if(!el) return;
  const c = 2 * Math.PI * 45;
  el.style.strokeDasharray = c;
  el.style.strokeDashoffset = c;
  setTimeout(()=>{ el.style.strokeDashoffset = c - (pct/100)*c; }, 150);
}
animateRing('ringFill', (5/7)*100);
animateRing('ringFillTr', 87);

/* =========================================================
   FEED SOCIAL — posts com curtida real (toggle + animação)
========================================================= */
let feedPosts = [
  {who:"Luis Felipe", initials:"LF", when:"Hoje, 08:00", body:"Bora começar a semana com o pé direito. Rebeca, sua constância nas últimas 3 semanas está acima da média da consultoria — segue assim.", highlight:null, likes:4, liked:false},
  {who:"Você", initials:"RV", when:"Ontem, 19:40", body:null, highlight:"🔥 4 semanas seguidas em dia com a rotina.", likes:9, liked:true},
  {who:"Luis Felipe", initials:"LF", when:"Sex, 18:00", body:"Boa validação essa semana. Toque em Avaliação pra ver como sua evolução está de fato, em número.", highlight:null, likes:2, liked:false},
];

function renderFeed(){
  const el = document.getElementById('feedList');
  if(!el) return;
  el.innerHTML = feedPosts.map((p,i)=>`
    <div class="post-card">
      <div class="post-head">
        <div class="avatar">${p.initials}</div>
        <div><div class="post-who">${p.who}</div><div class="post-when">${p.when}</div></div>
      </div>
      ${p.body ? `<div class="post-body">${p.body}</div>` : ''}
      ${p.highlight ? `<div class="post-highlight">${p.highlight}</div>` : ''}
      <div class="post-actions">
        <button class="post-action ${p.liked?'liked':''}" data-i="${i}" data-act="like">${ICONS.heart}<span>${p.likes}</span></button>
        <button class="post-action" data-act="comment">${ICONS.comment}<span>Comentar</span></button>
      </div>
    </div>`).join('');
  el.querySelectorAll('[data-act="like"]').forEach(btn=>{
    btn.onclick = () => {
      const p = feedPosts[btn.dataset.i];
      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;
      renderFeed();
    };
  });
}
renderFeed();

/* =========================================================
   PERÍODOS — fonte única de dados para Avaliação E Relatórios
   (um é o recorte do outro, não duas bases separadas)
========================================================= */
const periods = [
  {label:"Junho 2026", date:"10 jun 2026", peso:106.7, cintura:104, gordura:38.5, engajamento:78, pagamento:"Pago",
   ratings:{adesao:3, energia:3, satisfacao:4}, quote:"Comecei bem, mas a primeira semana foi difícil de adaptar a rotina.",
   notes:"Fase inicial de adaptação. Iniciar Mês 1 com foco técnico.", proximo:"Avançar para Mês 2 — aumento de volume."},
  {label:"Julho 2026", date:"10 jul 2026", peso:103.2, cintura:100, gordura:36.8, engajamento:92, pagamento:"Pago",
   ratings:{adesao:4, energia:3, satisfacao:5}, quote:"Consegui manter a rotina mesmo com a semana corrida no trabalho. Senti mais disposição depois da segunda semana.",
   notes:"Resposta positiva ao cardio intervalado, sem queixas no joelho.", proximo:"Avançar para Mês 3 — RIR 1."},
  {label:"Agosto 2026", date:"07 ago 2026", peso:100.4, cintura:97, gordura:34.9, engajamento:88, pagamento:"Pago",
   ratings:{adesao:4, energia:4, satisfacao:5}, quote:"Já sinto diferença na roupa. Motivada pro próximo mês.",
   notes:"Evolução consistente. Pequeno ajuste de carga recomendado.", proximo:"Avançar para Mês 4 — manter intensidade."},
];
const METRICS = [
  {key:'peso', label:'Peso', unit:'kg', lowerBetter:true},
  {key:'cintura', label:'Cintura', unit:'cm', lowerBetter:true},
  {key:'gordura', label:'% Gordura', unit:'%', lowerBetter:true},
  {key:'engajamento', label:'Engajamento', unit:'%', lowerBetter:false},
];

let compareIdx = periods.length - 1;

function renderCompareChips(){
  const el = document.getElementById('avalCompareChips');
  el.innerHTML = periods.map((p,i)=>`<button class="chip ${i===compareIdx?'active':''}" data-i="${i}">${p.label.split(' ')[0]}</button>`).join('');
  el.querySelectorAll('.chip').forEach(c=>{
    c.onclick = () => { compareIdx = parseInt(c.dataset.i); renderCompareChips(); renderCompareGrid(); };
  });
}

function renderCompareGrid(){
  const el = document.getElementById('avalCompareGrid');
  const cur = periods[compareIdx];
  const prev = periods[compareIdx - 1];
  el.innerHTML = METRICS.map(m=>{
    const val = cur[m.key];
    let deltaHtml = '<div class="ci-delta">Primeiro registro</div>';
    if(prev){
      const diff = val - prev[m.key];
      const better = m.lowerBetter ? diff < 0 : diff > 0;
      const cls = Math.abs(diff) < 0.05 ? '' : (better ? 'better' : 'worse');
      const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '=';
      deltaHtml = `<div class="ci-delta ${cls}">${arrow} ${Math.abs(diff).toFixed(1)}${m.unit} vs ${prev.label.split(' ')[0]}</div>`;
    }
    return `<div class="compare-item"><div class="ci-lbl">${m.label}</div><div class="ci-val">${val}${m.unit}</div>${deltaHtml}</div>`;
  }).join('');
}

function renderAvalHistory(){
  const hist = document.getElementById('avalHistory');
  hist.innerHTML = periods.slice().reverse().map(p=>`
    <div class="pay-row">
      <div><div class="pr-date">${p.date}</div><div class="pr-sub">${p.peso}kg · ${p.cintura}cm · ${p.gordura}% gordura</div></div>
    </div>`).join('');
}

function renderReportList(){
  const el = document.getElementById('reportList');
  el.innerHTML = periods.slice().reverse().map((p)=>{
    const realIdx = periods.indexOf(p);
    return `
    <div class="notif-item" data-i="${realIdx}">
      <div class="notif-icon">${NOTIF_ICONS.teal}</div>
      <div style="flex:1;">
        <div class="notif-item-title">Relatório — ${p.label}</div>
        <div class="notif-item-desc">Toque para abrir a versão interativa</div>
      </div>
      <span class="chevron">›</span>
    </div>`;
  }).join('');
  el.querySelectorAll('.notif-item').forEach(item=>{
    item.onclick = () => openReport(parseInt(item.dataset.i));
  });
}

renderCompareChips();
renderCompareGrid();
renderAvalHistory();
renderReportList();
animateRing('ringFillAval', 84);

document.getElementById('newAvalBtn').onclick = () => alert('Abriria o formulário de nova avaliação (modelos + campos personalizados).');
document.getElementById('exportAvalBtn').onclick = () => alert('Exportaria o card de evolução como imagem.');

/* =========================================================
   RELATÓRIO — visão interativa em tempo real, dentro do app
========================================================= */
let reportChartInstance = null;
let reportIdx = periods.length - 1;

function openReport(idx){
  reportIdx = idx;
  document.querySelectorAll('#screen-aluno .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('aluno-relatorio').classList.add('active');
  renderReportDetail();
}
document.getElementById('backFromReportBtn').onclick = () => {
  document.querySelectorAll('#screen-aluno .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('aluno-avaliacao').classList.add('active');
};

function renderReportDetail(){
  const p = periods[reportIdx];
  const prev = periods[reportIdx - 1];

  document.getElementById('reportTitle').textContent = `Relatório — ${p.label}`;

  const chipsEl = document.getElementById('reportPeriodChips');
  chipsEl.innerHTML = periods.map((pp,i)=>`<button class="chip ${i===reportIdx?'active':''}" data-i="${i}">${pp.label.split(' ')[0]}</button>`).join('');
  chipsEl.querySelectorAll('.chip').forEach(c=>{ c.onclick = () => { reportIdx = parseInt(c.dataset.i); renderReportDetail(); }; });

  const deltaPeso = prev ? (p.peso - prev.peso).toFixed(1) : null;
  document.getElementById('reportKpis').innerHTML = `
    <div class="stat-card"><div class="stat-num">${deltaPeso!==null ? (deltaPeso>0?'+':'')+deltaPeso+'kg' : p.peso+'kg'}</div><div class="stat-lbl">${deltaPeso!==null?'Variação no período':'Peso registrado'}</div></div>
    <div class="stat-card"><div class="stat-num">${p.engajamento}%</div><div class="stat-lbl">Engajamento com avisos</div></div>
    <div class="stat-card"><div class="stat-num">${p.pagamento}</div><div class="stat-lbl">Status pagamento</div></div>
    <div class="stat-card"><div class="stat-num">${p.gordura}%</div><div class="stat-lbl">Percentual de gordura</div></div>`;

  const ctx = document.getElementById('reportChart');
  if(typeof Chart !== 'undefined'){
    const data = { labels: periods.map(pp=>pp.label.split(' ')[0]),
      datasets: [{ label:'Peso (kg)', data: periods.map(pp=>pp.peso),
        backgroundColor: periods.map((pp,i)=> i===reportIdx ? '#31E17A' : '#232739'),
        borderRadius:6 }] };
    if(reportChartInstance) reportChartInstance.destroy();
    reportChartInstance = new Chart(ctx, { type:'bar', data,
      options:{ responsive:true, plugins:{legend:{display:false}},
        scales:{ x:{ticks:{color:'#8A8FA3', font:{size:10}}, grid:{display:false}},
                 y:{ticks:{color:'#8A8FA3', font:{size:10}}, grid:{color:'#212620'}} } } });
  } else {
    // fallback leve caso o Chart.js não carregue (ex.: sem internet) — barras em CSS puro
    ctx.style.display = 'none';
    let fb = document.getElementById('reportChartFallback');
    if(!fb){ fb = document.createElement('div'); fb.id = 'reportChartFallback'; ctx.parentNode.appendChild(fb); }
    const max = Math.max(...periods.map(pp=>pp.peso));
    fb.style.cssText = 'display:flex; align-items:flex-end; gap:10px; height:140px; padding-top:10px;';
    fb.innerHTML = periods.map((pp,i)=>`
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="font-size:10px; color:#8A8FA3;">${pp.peso}kg</div>
        <div style="width:100%; border-radius:6px 6px 0 0; background:${i===reportIdx?'#31E17A':'#232739'}; height:${(pp.peso/max)*100}px;"></div>
        <div style="font-size:10px; color:#8A8FA3;">${pp.label.split(' ')[0]}</div>
      </div>`).join('');
  }

  document.getElementById('reportRatings').innerHTML = Object.entries({adesao:'Adesão à rotina', energia:'Energia/disposição', satisfacao:'Satisfação'})
    .map(([k,label])=>{
      const v = p.ratings[k];
      const dots = Array.from({length:5},(_, i)=> i<v ? '<div class="dot-fill" style="background:#31E17A;width:8px;height:8px;border-radius:50%;"></div>' : '<div style="background:#232739;width:8px;height:8px;border-radius:50%;"></div>').join('');
      return `<div class="settings-row" style="padding:9px 0;"><span style="font-size:12.5px;">${label}</span><div style="display:flex;gap:4px;">${dots}</div></div>`;
    }).join('');
  document.getElementById('reportQuote').innerHTML = `<div class="qtext">"${p.quote}"</div><div class="qmeta">Enviado durante ${p.label}</div>`;

  document.getElementById('reportPayments').innerHTML = `<div class="pay-row"><div><div class="pr-date">Mensalidade — ${p.label}</div></div><div class="pr-val ok">${p.pagamento}</div></div>`;
  document.getElementById('reportNotes').innerHTML = `${p.notes}<br><br><strong>Próximo período:</strong> ${p.proximo}`;
}

document.getElementById('downloadReportBtn').onclick = () => alert('Geraria e baixaria o PDF deste período (mesmo layout, opcional).');


/* =========================================================
   PAGAMENTOS (ALUNO)
========================================================= */
const payHistoryDemo = [
  {date:"12 jul 2026", label:"Mensalidade — julho", status:"Pago", ok:true},
  {date:"12 jun 2026", label:"Mensalidade — junho", status:"Pago", ok:true},
  {date:"12 mai 2026", label:"Mensalidade — maio", status:"Pago", ok:true},
];
const payHistEl = document.getElementById('payHistory');
if(payHistEl) payHistEl.innerHTML = payHistoryDemo.map(p=>`
  <div class="pay-row">
    <div><div class="pr-date">${p.label}</div><div class="pr-sub">${p.date}</div></div>
    <div class="pr-val ${p.ok?'ok':'pending'}">${p.status}</div>
  </div>`).join('');

/* =========================================================
   TREINADOR — comunidade (reaproveita alunosDemo já existente)
========================================================= */
const alunoListTrEl = document.getElementById('alunoListTr');
if(alunoListTrEl) alunoListTrEl.innerHTML = alunosDemo.map(a=>`
  <div class="post-card">
    <div class="post-head">
      <div class="avatar">${a.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
      <div><div class="post-who">${a.nome}</div><div class="post-when">${a.tipo}</div></div>
    </div>
    <div class="post-highlight" style="${a.status.includes('pendente')?'background:rgba(255,122,69,0.14);border-color:#FF7A45;color:#FF7A45;':''}">${a.status}</div>
  </div>`).join('');

/* =========================================================
   TREINADOR — financeiro
========================================================= */
const finListEl = document.getElementById('finList');
if(finListEl) finListEl.innerHTML = alunosDemo.filter(a=>a.status.includes('pendente')).map(a=>`
  <div class="pay-row">
    <div><div class="pr-date">${a.nome}</div><div class="pr-sub">${a.tipo}</div></div>
    <div class="pr-val pending">Pendente</div>
  </div>`).join('') || '<div class="empty-desc">Nenhuma pendência.</div>';

/* =========================================================
   Compor notificação — botão de ação, não aba fixa
========================================================= */
document.getElementById('composeNotifBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-notif').classList.add('active');
};
document.getElementById('backFromNotifBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-inicio').classList.add('active');
  document.querySelectorAll('#screen-treinador .bottomnav button').forEach(b=>b.classList.remove('active'));
  document.querySelector('#screen-treinador .bottomnav button[data-view="tr-inicio"]').classList.add('active');
};

/* =========================================================
   TREINADOR — publicar relatório (dispara push automático)
========================================================= */
const publishStudentSelect = document.getElementById('publishStudentSelect');
if(publishStudentSelect) publishStudentSelect.innerHTML = alunosDemo.map(a=>`<option>${a.nome}</option>`).join('');

document.getElementById('publishReportBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-publicar').classList.add('active');
};
document.getElementById('backFromPublishBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-inicio').classList.add('active');
  document.querySelectorAll('#screen-treinador .bottomnav button').forEach(b=>b.classList.remove('active'));
  document.querySelector('#screen-treinador .bottomnav button[data-view="tr-inicio"]').classList.add('active');
};
document.getElementById('publishPeriodSelect').onchange = (e) => {
  document.getElementById('publishPeriodPreview').textContent = e.target.value;
};

document.getElementById('confirmPublishBtn').onclick = async () => {
  const aluno = publishStudentSelect.value;
  const periodo = document.getElementById('publishPeriodSelect').value;
  const feedback = document.getElementById('publishFeedback');
  const title = "Seu relatório está disponível";
  const body = `O relatório de ${periodo} já pode ser visto no app.`;

  try{
    const res = await fetch('/.netlify/functions/send-notification', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ title, body, audience: aluno, type: 'relatorio', periodo })
    });
    if(!res.ok) throw new Error('offline');
    feedback.textContent = `Publicado e notificação enviada para ${aluno}.`;
  }catch(err){
    feedback.textContent = `Publicado (modo demonstração — push real depende do backend conectado) para ${aluno}.`;
  }

  // reflete no feed de notificações do aluno (mesma central de avisos já existente)
  notifications.unshift({title, desc:body, tag:'teal', time:"agora", read:false});
  sentLog.unshift({title, desc:`${body} · relatório`, audience: aluno, tag:'teal', time:"agora"});
  renderNotifList();
  renderSentLog();
};

/* =========================================================
   CHECK-IN — fluxo dedicado, grava direto no período atual
   (mesma base de dados que alimenta Avaliação e Relatório)
========================================================= */
let checkinAnswers = { adesao:null, energia:null, satisfacao:null, texto:'' };
let checkinStep = 0;
const checkinFields = ['adesao','energia','satisfacao'];

function buildRateRows(){
  document.querySelectorAll('.rate-row').forEach(row=>{
    const field = row.dataset.field;
    row.innerHTML = [1,2,3,4,5].map(n=>`<button class="rate-btn" data-val="${n}">${n}</button>`).join('');
    row.querySelectorAll('.rate-btn').forEach(btn=>{
      btn.onclick = () => {
        checkinAnswers[field] = parseInt(btn.dataset.val);
        row.querySelectorAll('.rate-btn').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        setTimeout(()=> goToCheckinStep(checkinStep + 1), 280);
      };
    });
  });
}
buildRateRows();

function goToCheckinStep(step){
  checkinStep = step;
  document.querySelectorAll('.checkin-step').forEach(s=>s.classList.remove('active'));
  document.querySelector(`.checkin-step[data-step="${step}"]`).classList.add('active');
  document.getElementById('checkinProgress').style.width = step === 'done' ? '100%' : `${Math.min((step+1)/4,1)*100}%`;
}

function openCheckin(){
  checkinAnswers = { adesao:null, energia:null, satisfacao:null, texto:'' };
  document.querySelectorAll('.rate-btn').forEach(b=>b.classList.remove('selected'));
  document.getElementById('checkinTexto').value = '';
  goToCheckinStep(0);
  document.querySelectorAll('#screen-aluno .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('aluno-checkin').classList.add('active');
}
document.getElementById('openCheckinBtn').onclick = openCheckin;
document.getElementById('closeCheckinBtn').onclick = () => {
  document.querySelectorAll('#screen-aluno .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('aluno-feed').classList.add('active');
};

document.getElementById('submitCheckinBtn').onclick = () => {
  checkinAnswers.texto = document.getElementById('checkinTexto').value.trim() || "Sem comentários adicionais.";

  // grava no período atual — mesma fonte usada por Avaliação e Relatório
  const current = periods[periods.length - 1];
  current.ratings = { adesao: checkinAnswers.adesao || 3, energia: checkinAnswers.energia || 3, satisfacao: checkinAnswers.satisfacao || 3 };
  current.quote = checkinAnswers.texto;

  // reflete imediatamente em Avaliação/Relatório se já renderizados
  if(typeof renderCompareGrid === 'function') renderCompareGrid();
  if(typeof renderReportDetail === 'function' && reportIdx === periods.length - 1) renderReportDetail();

  document.getElementById('checkinCard').classList.add('done');
  document.getElementById('checkinCard').innerHTML = `
    <div class="checkin-icon">✓</div>
    <div class="checkin-text"><div class="checkin-title">Check-in de Agosto respondido</div><div class="checkin-desc">Obrigado — já está no seu relatório.</div></div>`;

  goToCheckinStep('done');
};
document.getElementById('doneCheckinBtn').onclick = () => {
  document.querySelectorAll('#screen-aluno .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('aluno-feed').classList.add('active');
};

/* =========================================================
   AUTENTICAÇÃO — Firebase Auth, link mágico por e-mail
   Real: funciona assim que firebase-config.js tiver as chaves.
========================================================= */
const AUTH_CONFIGURED = typeof firebaseConfig !== 'undefined' && !!firebaseConfig.apiKey;
let authApp = null, auth = null;
if(AUTH_CONFIGURED){
  authApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
}

function showApp(role){
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-confirming').style.display = 'none';
  document.getElementById('screen-aluno').style.display = role === 'treinador' ? 'none' : 'block';
  document.getElementById('screen-treinador').style.display = role === 'treinador' ? 'block' : 'none';
  document.getElementById('devswitch').style.display = 'flex'; // troca de papel visível só neste protótipo — no produto real o papel vem do login
}

document.getElementById('demoContinueBtn').onclick = () => showApp('aluno');

document.getElementById('sendLoginLinkBtn').onclick = async () => {
  const email = document.getElementById('loginEmailInput').value.trim();
  const feedback = document.getElementById('loginFeedback');
  if(!email){ feedback.textContent = "Digite um e-mail válido."; return; }

  if(!AUTH_CONFIGURED){
    feedback.textContent = "Firebase ainda não configurado — use 'Continuar em modo demonstração' por enquanto.";
    return;
  }

  const actionCodeSettings = { url: window.location.href, handleCodeInApp: true };
  try{
    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    window.localStorage.setItem('loginEmail', email);
    feedback.textContent = "Link enviado — confira seu e-mail.";
  }catch(err){
    feedback.textContent = "Erro ao enviar: " + err.message;
  }
};

/* completar login ao voltar pelo link recebido por e-mail */
(function checkEmailLinkSignIn(){
  if(!AUTH_CONFIGURED) return;
  if(auth.isSignInWithEmailLink(window.location.href)){
    document.getElementById('screen-login').style.display = 'none';
    document.getElementById('screen-confirming').style.display = 'flex';
    let email = window.localStorage.getItem('loginEmail');
    if(!email) email = window.prompt('Confirme seu e-mail para concluir o acesso:');
    auth.signInWithEmailLink(email, window.location.href)
      .then(() => { window.localStorage.removeItem('loginEmail'); showApp('aluno'); })
      .catch(err => { document.getElementById('screen-login').style.display='flex'; document.getElementById('screen-confirming').style.display='none';
        document.getElementById('loginFeedback').textContent = "Link inválido ou expirado: " + err.message; });
  }
})();

if(AUTH_CONFIGURED){
  auth.onAuthStateChanged(user => { if(user) showApp('aluno'); });
}

/* =========================================================
   CADASTRO MANUAL (TREINADOR) — gera link real de acesso
========================================================= */
document.getElementById('openCadastroBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-cadastro').classList.add('active');
};
document.getElementById('backFromCadastroBtn').onclick = () => {
  document.querySelectorAll('#screen-treinador .view').forEach(v=>v.classList.remove('active'));
  document.getElementById('tr-comunidade').classList.add('active');
  document.querySelectorAll('#screen-treinador .bottomnav button').forEach(b=>b.classList.remove('active'));
  document.querySelector('#screen-treinador .bottomnav button[data-view="tr-comunidade"]').classList.add('active');
};

document.getElementById('gerarLinkBtn').onclick = async () => {
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const telefone = document.getElementById('cadTelefone').value.trim();
  const tipo = document.getElementById('cadTipo').value;
  const feedback = document.getElementById('cadFeedback');
  if(!nome || !email){ feedback.textContent = "Preencha nome e e-mail."; return; }

  try{
    const res = await fetch('/.netlify/functions/invite-student', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ nome, email, telefone, tipo })
    });
    if(!res.ok) throw new Error('offline');
    const data = await res.json();
    document.getElementById('cadLinkBox').textContent = data.link;
    document.getElementById('cadResultado').style.display = 'block';
    feedback.textContent = "Aluno cadastrado. Envie o link acima pra ele.";
  }catch(err){
    const fakeLink = `https://seu-app.netlify.app/?convite=${btoa(email)}`;
    document.getElementById('cadLinkBox').textContent = fakeLink;
    document.getElementById('cadResultado').style.display = 'block';
    feedback.textContent = "Link de demonstração (backend ainda não conectado).";
  }
  alunosDemo.push({nome, tipo, status:"Convite enviado"});
  if(document.getElementById('alunoListTr')) alunoListTrEl.innerHTML = alunosDemo.map(a=>`
    <div class="post-card"><div class="post-head"><div class="avatar">${a.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
    <div><div class="post-who">${a.nome}</div><div class="post-when">${a.tipo}</div></div></div>
    <div class="post-highlight">${a.status}</div></div>`).join('');
};

document.getElementById('copyLinkBtn').onclick = () => {
  navigator.clipboard?.writeText(document.getElementById('cadLinkBox').textContent);
  document.getElementById('cadFeedback').textContent = "Link copiado.";
};

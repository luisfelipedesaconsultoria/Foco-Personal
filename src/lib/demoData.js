// Dados de demonstração — usados só quando não há Firebase configurado ou o
// usuário escolhe "Continuar em modo demonstração" no login. Nenhuma chamada
// de API acontece nesse modo.

export const demoTreinador = { id: "demo-treinador", nome: "Luis Felipe", marca: "GO ON Digital Fit", brandColor: "#31E17A" };

export const demoAlunos = [
  { id: "demo-1", treinadorId: "demo-treinador", nome: "Rebeca Vaz", tipo: "consultoria", status: "ativo", idade: 29, pesoKg: 68, genero: "feminino" },
  { id: "demo-2", treinadorId: "demo-treinador", nome: "João Pedro", tipo: "presencial", status: "ativo", idade: 34, pesoKg: 82, genero: "masculino" },
  { id: "demo-3", treinadorId: "demo-treinador", nome: "Marina Costa", tipo: "consultoria", status: "ativo", idade: 26, pesoKg: 60, genero: "feminino" },
];

export const demoAluno = demoAlunos[0];

export const demoPeriodos = [
  { id: "p1", label: "Junho 2026", date: "10 jun 2026", peso: 106.7, cintura: 104, gordura: 38.5, engajamento: 78, pagamentoStatus: "pago", ratings: { adesao: 3, energia: 3, satisfacao: 4 }, quote: "Comecei bem, mas a primeira semana foi difícil de adaptar a rotina.", notasTreinador: "Fase inicial de adaptação." },
  { id: "p2", label: "Julho 2026", date: "10 jul 2026", peso: 103.2, cintura: 100, gordura: 36.8, engajamento: 92, pagamentoStatus: "pago", ratings: { adesao: 4, energia: 3, satisfacao: 5 }, quote: "Consegui manter a rotina mesmo com a semana corrida no trabalho.", notasTreinador: "Resposta positiva ao cardio intervalado." },
  { id: "p3", label: "Agosto 2026", date: "07 ago 2026", peso: 100.4, cintura: 97, gordura: 34.9, engajamento: 88, pagamentoStatus: "pago", ratings: { adesao: 4, energia: 4, satisfacao: 5 }, quote: "Já sinto diferença na roupa. Motivada pro próximo mês.", notasTreinador: "Evolução consistente." },
];

export const demoNotificacoes = [
  { id: "n1", titulo: "Segunda de partida", corpo: "Sua semana começa agora. Mantenha a rotina.", tipo: "aviso", enviadoEm: "2026-09-01T07:00:00Z", lido: false, curtidas: 4 },
  { id: "n2", titulo: "4 semanas seguidas em dia", corpo: "Constância acima da média da consultoria — segue assim.", tipo: "conquista", enviadoEm: "2026-08-30T19:40:00Z", lido: true, curtidas: 9 },
  { id: "n3", titulo: "Validação semanal", corpo: "Como foi sua semana? Toque para responder.", tipo: "checkin", enviadoEm: "2026-08-29T18:00:00Z", lido: false, curtidas: 2 },
];

export const demoPagamentos = [
  { id: "pg1", referencia: "Mensalidade — agosto", status: "pago", data: "2026-08-12" },
  { id: "pg2", referencia: "Mensalidade — julho", status: "pago", data: "2026-07-12" },
  { id: "pg3", referencia: "Mensalidade — junho", status: "pago", data: "2026-06-12" },
];

export const demoHRSessions = [
  { id: "hr1", createdAt: "2026-08-28T18:30:00Z", modo: "individual", avgBpm: 138, maxBpm: 172, minBpm: 98, calorias: 410, duracaoSeg: 2640 },
  { id: "hr2", createdAt: "2026-08-25T18:10:00Z", modo: "turma", avgBpm: 145, maxBpm: 180, minBpm: 102, calorias: 380, duracaoSeg: 2400 },
];

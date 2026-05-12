// ======= Config =======
const TOTAL_QUESTIONS = 10;
const CONCRETE_MAX = 5;
const CONCRETE_MAX_TOTAL = 12;
const FEEDBACK_DELAY_MS = 3000;
const DIVIDER_IMG = "img/dividir.png";
const PHASES = ["concreta", "grafica", "simbolica", "complementaria"];

const TOKENS = [
  { key: "ball", img: "img/ball.png", label: "balón" },
  { key: "key",  img: "img/key.png",  label: "llave" },
  { key: "box",  img: "img/box.png",  label: "caja" },
];

const OPS = [
  { sym: "+", name: "suma" },
  { sym: "-", name: "resta" },
  { sym: "\u00D7", name: "multiplicación" },
  { sym: "\u00F7", name: "división" },
];

const OPS_CONCRETE = [
  { sym: "+", name: "suma" },
  { sym: "-", name: "resta" },
  { sym: "\u00D7", name: "multiplicación" },
  { sym: "\u00F7", name: "división" },
];

const OPS_GRAFICA = [
  { sym: "+", name: "suma" },
  { sym: "-", name: "resta" },
  { sym: "×", name: "multiplicación" },
  { sym: "÷", name: "división" },
];

// ======= State =======
let game = {
  questions: [],
  current: 0,
  answer: 0,
  locked: false,
};

// NUEVO: lista de errores de la partida
let errores = [];
let phase = "concreta";
let groupCounts = [];
let groupEls = [];
let unlockedIndex = 0;
let graphicShape = "square";
let drawState = {
  active: false,
  zone: null,
  preview: null,
  startX: 0,
  startY: 0,
};

// ======= DOM =======
const qIndexEl = document.getElementById("qIndex");
const visualOpEl = document.getElementById("visualOp");
const mathOpEl = document.getElementById("mathOp");
const visualConcreteEl = document.getElementById("visualConcrete");
const concreteSubEl = document.getElementById("concreteSub");
const tokenPoolEl = document.getElementById("tokenPool");
const dropzoneEl = document.getElementById("dropzone");
const answerLabelEl = document.getElementById("answerLabel");
const answerCountEl = document.getElementById("answerCount");
const answerSummaryWrapEl = answerCountEl.parentElement;
const feedbackEl = document.getElementById("feedback");
const tokensPanelEl = document.getElementById("tokensPanel");
const answerPanelEl = document.getElementById("answerPanel");
const graphicWorkspaceEl = document.getElementById("graphicWorkspace");
const drawToolsEl = document.getElementById("drawTools");
const drawZoneAEl = document.getElementById("drawZoneA");
const drawZoneBEl = document.getElementById("drawZoneB");
const drawTaskAEl = drawZoneAEl.closest(".drawTask");
const drawTaskBEl = drawZoneBEl.closest(".drawTask");
const drawStatementAEl = document.getElementById("drawStatementA");
const drawStatementBEl = document.getElementById("drawStatementB");
const drawCountAEl = document.getElementById("drawCountA");
const drawCountBEl = document.getElementById("drawCountB");
const inputAnswerWrapEl = document.getElementById("inputAnswerWrap");
const numericAnswerEl = document.getElementById("numericAnswer");
const numericAnswerLabelEl = document.querySelector('label[for="numericAnswer"]');
const optionsWrapEl = document.getElementById("optionsWrap");
const clearBtnEl = document.getElementById("clearBtn");
const checkBtnEl = document.getElementById("checkBtn");
const answerBarEl = clearBtnEl.parentElement;

// NUEVO: DOM para mostrar errores
const showErrorsBtn = document.getElementById("showErrorsBtn");
const exportLogBtn = document.getElementById("exportLogBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const errorsPanel = document.getElementById("errorsPanel");
const errorsList = document.getElementById("errorsList");
const phaseBtns = Array.from(document.querySelectorAll(".phaseBtn"));
const studentModalEl = document.getElementById("studentModal");
const studentFormEl = document.getElementById("studentForm");
const studentNameInputEl = document.getElementById("studentNameInput");
const studentNameDisplayEl = document.getElementById("studentNameDisplay");
const changeStudentBtnEl = document.getElementById("changeStudentBtn");

const STORAGE_KEYS = {
  currentStudent: "matedrag.currentStudent",
  currentSession: "matedrag.currentSession",
  sessions: "matedrag.sessions",
};

let studentName = "";
let sessionLog = null;

clearBtnEl.addEventListener("click", clearAnswer);
checkBtnEl.addEventListener("click", checkAnswer);
document.getElementById("newGameBtn").addEventListener("click", newGame);
changeStudentBtnEl.addEventListener("click", () => openStudentModal(true));
numericAnswerEl.addEventListener("input", () => {
  const value = Number.parseInt(numericAnswerEl.value, 10);
  game.answer = Number.isFinite(value) ? value : 0;
  answerCountEl.textContent = String(game.answer);
});

showErrorsBtn.addEventListener("click", () => {
  renderSessionLog();
  errorsPanel.style.display = "block";
});

exportLogBtn.addEventListener("click", exportSessionLog);
copyLinkBtn.addEventListener("click", copyShareLink);
studentFormEl.addEventListener("submit", handleStudentSubmit);

dropzoneEl.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzoneEl.classList.add("dragover");
});
dropzoneEl.addEventListener("dragleave", () => {
  dropzoneEl.classList.remove("dragover");
});
dropzoneEl.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzoneEl.classList.remove("dragover");

  const q = game.questions[game.current];
  if (phase === "concreta" && q.op.sym !== "+") return;

  const tokenKey = e.dataTransfer.getData("text/tokenKey");
  if (!tokenKey) return;

  // Solo contamos si coincide con el tipo de ficha del problema actual
  if (tokenKey !== q.token.key) return;

  addTokenToAnswer(q.token);
});

// ======= Game builders =======
function randInt(min, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Genera una pregunta con 1 cifra. Para división, siempre exacta.
function makeQuestion(op = pick(OPS)) {
  const token = pick(TOKENS);

  let a = randInt(1, 9);
  let b = randInt(1, 9);

  if (op.sym === "-") {
    // evitar negativo
    if (b > a) [a, b] = [b, a];
  }

  if (op.sym === "÷") {
    // división exacta con 1 cifra en resultado (1..9)
    const result = randInt(1, 9);
    b = randInt(1, 9);
    a = result * b; // a puede ser 2 cifras, pero b es 1 cifra
  }

  const correct = compute(a, b, op.sym);
  return { a, b, op, token, correct };
}

function makeQuestionConcrete(op = pick(OPS_CONCRETE)) {
  const token = pick(TOKENS);

  let a = randInt(1, CONCRETE_MAX);
  let b = randInt(1, CONCRETE_MAX);

  if (op.sym === "-") {
    // evitar negativo
    if (b > a) [a, b] = [b, a];
  }

  if (op.sym === "×") {
    let groups = randInt(2, CONCRETE_MAX);
    let perGroup = randInt(1, CONCRETE_MAX);
    while (groups * perGroup > CONCRETE_MAX_TOTAL) {
      groups = randInt(2, CONCRETE_MAX);
      perGroup = randInt(1, CONCRETE_MAX);
    }
    a = perGroup;
    b = groups;
  }

  if (op.sym === "÷") {
    let groups = randInt(2, CONCRETE_MAX);
    let perGroup = randInt(1, CONCRETE_MAX);
    while (groups * perGroup > CONCRETE_MAX_TOTAL) {
      groups = randInt(2, CONCRETE_MAX);
      perGroup = randInt(1, CONCRETE_MAX);
    }
    a = groups * perGroup;
    b = groups;
  }

  const correct = compute(a, b, op.sym);
  return {
    a,
    b,
    op,
    token,
    correct,
    groupCount: op.sym === "×" ? b : (op.sym === "÷" ? b : 0),
    groupSize: op.sym === "×" ? a : (op.sym === "÷" ? a / b : 0)
  };
}

function makeQuestionGrafica(op = pick(OPS_GRAFICA)) {
  const token = pick(TOKENS);
  let a = randInt(1, 9);
  let b = randInt(1, 9);
  if (op.sym === "-" && b > a) [a, b] = [b, a];
  if (op.sym === "×") {
    a = randInt(1, 4);
    b = 2;
  }
  if (op.sym === "÷") {
    const perGroup = randInt(1, 4);
    a = perGroup * 2;
    b = 2;
  }
  const requiredShape = pick(["square", "star", "circle"]);
  const correct = compute(a, b, op.sym);
  return {
    a,
    b,
    op,
    token,
    requiredShape,
    correct,
    groupCount: (op.sym === "×" || op.sym === "÷") ? 2 : 0,
    groupSize: op.sym === "×" ? a : (op.sym === "÷" ? correct : 0),
  };
}

function compute(a, b, sym) {
  switch (sym) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return a / b;
    default: return 0;
  }
}

function buildBalancedOperationList(ops, total) {
  const baseCount = Math.floor(total / ops.length);
  const remainder = total % ops.length;
  const counts = ops.map((op, index) => ({ op, count: baseCount + (index < remainder ? 1 : 0) }));
  return counts.flatMap(({ op, count }) => Array.from({ length: count }, () => op));
}

function generateBalancedQuestions(builder, ops) {
  const operationList = shuffle(buildBalancedOperationList(ops, TOTAL_QUESTIONS));
  return operationList.map((op) => builder(op));
}

function opMarkup(op) {
  if (op.sym === "÷") {
    return `<img src="${DIVIDER_IMG}" alt="dividir" class="op-img">`;
  }
  return `<span class="symbol">${op.sym}</span>`;
}

function updateAnswerLabel() {
  const q = game.questions[game.current];
  if (!q || !answerLabelEl) return;

  if (phase === "concreta" && q.op.sym === "÷") {
    answerLabelEl.textContent = `Por lo tanto ${q.a} dividido para ${q.b} es`;
    return;
  }

  answerLabelEl.textContent = "Respuesta:";
}

function updateAnswerInputVisibility() {
  const q = game.questions[game.current];
  const useTypedAnswer = phase === "grafica" || (phase === "concreta" && q && q.op.sym === "÷");

  inputAnswerWrapEl.style.display = useTypedAnswer ? "block" : "none";
  if (answerSummaryWrapEl) {
    answerSummaryWrapEl.style.display = useTypedAnswer ? "none" : "";
  }

  if (phase === "concreta" && q && q.op.sym === "÷" && numericAnswerLabelEl) {
    numericAnswerLabelEl.textContent = `Por lo tanto ${q.a} dividido para ${q.b} es...`;
  }
}

function createEmptyPhaseBuckets() {
  return PHASES.reduce((acc, phaseKey) => {
    acc[phaseKey] = [];
    return acc;
  }, {});
}

function createSessionLog(name) {
  const now = new Date().toISOString();
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentName: name,
    startedAt: now,
    updatedAt: now,
    phases: createEmptyPhaseBuckets(),
  };
}

function loadStoredJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function loadStoredSessions() {
  return loadStoredJson(STORAGE_KEYS.sessions) || {};
}

function saveStoredSessions(sessions) {
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
}

function saveSessionLog() {
  if (!sessionLog) return;
  sessionLog.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
  const sessions = loadStoredSessions();
  sessions[sessionLog.id] = sessionLog;
  saveStoredSessions(sessions);
}

function getSessionById(sessionId) {
  const sessions = loadStoredSessions();
  return sessions[sessionId] || null;
}

function getSessionByStudent(student) {
  const sessions = Object.values(loadStoredSessions());
  return sessions.find((session) => session.studentName === student) || null;
}

function setStudentNameUI() {
  studentNameDisplayEl.textContent = studentName || "Sin registrar";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function phaseLabel(phaseKey) {
  switch (phaseKey) {
    case "concreta": return "Fase concreta";
    case "grafica": return "Fase gráfica";
    case "simbolica": return "Fase simbólica";
    case "complementaria": return "Fase complementaria";
    default: return phaseKey;
  }
}

function operationLabel(sym) {
  switch (sym) {
    case "+": return "Suma";
    case "-": return "Resta";
    case "×": return "Multiplicación";
    case "÷": return "División";
    default: return sym;
  }
}

function recordPrompt(q, currentPhase) {
  const plural = tokenPlural(q.token);
  if (currentPhase === "complementaria") {
    return q.story || buildStory(q);
  }
  if (currentPhase === "grafica") {
    return `Representa gráficamente ${q.a} ${q.op.sym} ${q.b}.`;
  }
  if (currentPhase === "simbolica") {
    return `${q.a} ${q.op.sym} ${q.b} = ?`;
  }
  switch (q.op.sym) {
    case "+":
      return `Une ${q.a} ${plural} con ${q.b} ${plural} y encuentra el total.`;
    case "-":
      return `Empieza con ${q.a} ${plural}, quita ${q.b} y encuentra cuántos quedan.`;
    case "×":
      return `Forma ${q.b} grupos de ${q.a} ${plural} y encuentra el total.`;
    case "÷":
      return `Reparte ${q.a} ${plural} en ${q.b} grupos iguales y encuentra cuántos van en cada grupo.`;
    default:
      return `${q.a} ${q.op.sym} ${q.b}`;
  }
}

function addAttemptRecord(entry) {
  if (!sessionLog) return;
  if (!sessionLog.phases[entry.phase]) {
    sessionLog.phases[entry.phase] = [];
  }
  sessionLog.phases[entry.phase].push(entry);
  saveSessionLog();
  if (errorsPanel.style.display === "block") {
    renderSessionLog();
  }
}

function renderSessionLog() {
  if (!sessionLog) {
    errorsList.innerHTML = "<p>No hay un estudiante registrado todavía.</p>";
    return;
  }

  const allEntries = PHASES.flatMap((phaseKey) => sessionLog.phases[phaseKey] || []);
  const totalAnswers = allEntries.length;
  const totalCorrect = allEntries.filter((entry) => entry.isCorrect).length;
  const summaryHtml = `
    <div class="recordSummary">
      <strong>Estudiante:</strong> ${escapeHtml(sessionLog.studentName)}<br>
      <strong>Respuestas guardadas:</strong> ${totalAnswers}<br>
      <strong>Correctas:</strong> ${totalCorrect}<br>
      <strong>Incorrectas:</strong> ${totalAnswers - totalCorrect}
    </div>
  `;

  const phaseHtml = PHASES.map((phaseKey) => {
    const entries = sessionLog.phases[phaseKey] || [];
    const correctCount = entries.filter((entry) => entry.isCorrect).length;
    const header = `
      <div class="recordPhase">
        <h3>${phaseLabel(phaseKey)}</h3>
        <p class="recordMeta">Respuestas: ${entries.length} | Correctas: ${correctCount} | Incorrectas: ${entries.length - correctCount}</p>
    `;
    if (entries.length === 0) {
      return `${header}<p>Aún no hay respuestas guardadas en esta fase.</p></div>`;
    }
    const items = entries.map((entry, index) => `
      <div class="recordItem ${entry.isCorrect ? "ok" : "bad"}">
        <strong>${index + 1}. ${entry.isCorrect ? "Correcta" : "Incorrecta"}</strong><br>
        <span><strong>Operación:</strong> ${escapeHtml(operationLabel(entry.operation))}</span><br>
        <span><strong>Problema:</strong> ${escapeHtml(entry.problem)}</span><br>
        <span><strong>Respuesta del estudiante:</strong> ${escapeHtml(entry.studentAnswer)}</span><br>
        <span><strong>Respuesta correcta:</strong> ${escapeHtml(entry.correctAnswer)}</span><br>
        <span><strong>Retroalimentación:</strong> ${escapeHtml(entry.feedback)}</span>
      </div>
    `).join("");
    return `${header}${items}</div>`;
  }).join("");

  errorsList.innerHTML = summaryHtml + phaseHtml;
}

function exportSessionLog() {
  if (!sessionLog) return;
  const blob = new Blob([JSON.stringify(sessionLog, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = sessionLog.studentName.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "estudiante";
  link.href = url;
  link.download = `registro-${safeName}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function copyShareLink() {
  if (!sessionLog) return;
  const url = new URL(window.location.href);
  url.searchParams.set("session", sessionLog.id);
  url.searchParams.delete("student");
  const text = url.toString();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Enlace copiado al portapapeles. Puedes compartirlo para reanudar esta sesión.");
    }).catch(() => {
      prompt("Copia este enlace para compartirlo:", text);
    });
  } else {
    prompt("Copia este enlace para compartirlo:", text);
  }
}

function openStudentModal(forceNewSession = false) {
  studentModalEl.classList.add("open");
  if (forceNewSession) {
    studentNameInputEl.value = "";
  } else {
    studentNameInputEl.value = studentName || localStorage.getItem(STORAGE_KEYS.currentStudent) || "";
  }
  setTimeout(() => studentNameInputEl.focus(), 0);
}

function closeStudentModal() {
  studentModalEl.classList.remove("open");
}

function beginStudentSession(name) {
  studentName = name;
  sessionLog = createSessionLog(name);
  phase = "concreta";
  unlockedIndex = 0;
  localStorage.setItem(STORAGE_KEYS.currentStudent, name);
  localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
  saveSessionLog();
  setStudentNameUI();
  closeStudentModal();
  errorsPanel.style.display = "none";
  resetPhaseUI();
  updatePhaseButtons();
  newGame();
}

function handleStudentSubmit(event) {
  event.preventDefault();
  const name = studentNameInputEl.value.trim();
  if (!name) {
    studentNameInputEl.focus();
    return;
  }
  beginStudentSession(name);
}

function hydrateStudentSession() {
  const params = new URLSearchParams(window.location.search);
  const sessionParam = params.get("session");
  const studentParam = (params.get("student") || "").trim();

  if (sessionParam) {
    const storedSession = getSessionById(sessionParam);
    if (storedSession) {
      sessionLog = storedSession;
      studentName = storedSession.studentName;
      localStorage.setItem(STORAGE_KEYS.currentStudent, studentName);
      localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
      setStudentNameUI();
      return true;
    }
  }

  const storedStudent = localStorage.getItem(STORAGE_KEYS.currentStudent) || "";
  const storedSessionId = localStorage.getItem(STORAGE_KEYS.currentSession) || "";
  const storedSession = storedSessionId ? getSessionById(storedSessionId) : null;

  if (studentParam) {
    const studentSession = getSessionByStudent(studentParam);
    if (studentSession) {
      sessionLog = studentSession;
      studentName = studentSession.studentName;
      localStorage.setItem(STORAGE_KEYS.currentStudent, studentName);
      localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
      setStudentNameUI();
      return true;
    }
  }

  if (storedStudent && storedSession && storedSession.studentName === storedStudent) {
    studentName = storedStudent;
    sessionLog = storedSession;
    setStudentNameUI();
    return true;
  }

  setStudentNameUI();
  return false;
}

function newGame() {
  // NUEVO: reinicia errores y oculta panel
  errores = [];
  errorsPanel.style.display = "none";
  errorsList.innerHTML = "";

  if (phase === "simbolica") {
    game.questions = generateBalancedQuestions(makeQuestion, OPS);
  } else if (phase === "grafica") {
    game.questions = generateBalancedQuestions(makeQuestionGrafica, OPS_GRAFICA);
  } else if (phase === "concreta" || phase === "complementaria") {
    game.questions = generateBalancedQuestions(makeQuestionConcrete, OPS_CONCRETE);
  } else {
    game.questions = Array.from({ length: TOTAL_QUESTIONS }, makeQuestionConcrete);
  }

  game.current = 0;
  loadQuestion();
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildChoices(correct) {
  const choices = new Set([correct]);
  let attempts = 0;
  while (choices.size < 4 && attempts < 80) {
    attempts += 1;
    const delta = randInt(-6, 6);
    if (delta === 0) continue;
    const candidate = correct + delta;
    if (candidate < 0) continue;
    choices.add(candidate);
  }
  while (choices.size < 4) {
    choices.add(randInt(0, 20));
  }
  return shuffle(Array.from(choices));
}

function renderAbstractOptions(q) {
  const choices = buildChoices(q.correct);
  optionsWrapEl.innerHTML = "";

  choices.forEach((value) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "optionBtn";
    btn.textContent = String(value);
    btn.addEventListener("click", () => {
      if (game.locked) return;
      game.answer = value;
      answerCountEl.textContent = String(value);
      optionsWrapEl.querySelectorAll(".optionBtn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      checkAnswer();
    });
    optionsWrapEl.appendChild(btn);
  });
}

function shapePluralLabel(shape) {
  switch (shape) {
    case "star": return "estrellas";
    case "circle": return "círculos";
    default: return "cuadros";
  }
}

function updateGraphicStatements(q) {
  const requiredShape = q.requiredShape || "square";
  const noun = shapePluralLabel(requiredShape);
  if (q.op.sym === "-") {
    drawStatementAEl.textContent = `Dibuja ${q.a} ${noun}.`;
    drawStatementBEl.textContent = "Clickea en la figura para restar.";
    if (numericAnswerLabelEl) {
      numericAnswerLabelEl.textContent = `¿Cuántos ${noun} quedan?`;
    }
    return;
  }
  if (q.op.sym === "×") {
    drawStatementAEl.textContent = `Dibuja ${q.a} ${noun} en el grupo 1.`;
    drawStatementBEl.textContent = `Dibuja ${q.a} ${noun} en el grupo 2.`;
    if (numericAnswerLabelEl) {
      numericAnswerLabelEl.textContent = `¿Cuántos ${noun} hay en total?`;
    }
    return;
  }
  if (q.op.sym === "÷") {
    drawStatementAEl.textContent = `Dibuja ${q.correct} ${noun} en el grupo 1.`;
    drawStatementBEl.textContent = `Dibuja ${q.correct} ${noun} en el grupo 2.`;
    if (numericAnswerLabelEl) {
      numericAnswerLabelEl.textContent = `¿Cuántos ${noun} hay en cada grupo?`;
    }
    return;
  }

  drawStatementAEl.textContent = `Dibuja ${q.a} ${noun}.`;
  drawStatementBEl.textContent = `Dibuja ${q.b} ${noun}.`;
  if (numericAnswerLabelEl) {
    numericAnswerLabelEl.textContent = `¿Cuántos ${noun} hay en total?`;
  }
}

function detectShapeFromElement(shapeEl) {
  if (!shapeEl) return "square";
  if (shapeEl.classList.contains("star")) return "star";
  if (shapeEl.classList.contains("circle")) return "circle";
  return "square";
}

function updateGraphicCounts() {
  const q = game.questions[game.current];
  const countA = drawZoneAEl.querySelectorAll(".draw-shape:not(.preview)").length;
  const countB = drawZoneBEl.querySelectorAll(".draw-shape:not(.preview)").length;

  if (phase === "grafica" && q && q.op.sym === "-") {
    const removed = drawZoneAEl.querySelectorAll(".draw-shape.removed:not(.preview)").length;
    drawCountAEl.textContent = String(countA);
    drawCountBEl.textContent = String(removed);
    return;
  }

  drawCountAEl.textContent = String(countA);
  drawCountBEl.textContent = String(countB);
}

function clearGraphicWorkspace() {
  stopGraphicDraw();
  drawZoneAEl.innerHTML = "";
  drawZoneBEl.innerHTML = "";
  numericAnswerEl.value = "";
  answerCountEl.textContent = "0";
  game.answer = 0;
  updateGraphicCounts();
}

function stopGraphicDraw() {
  if (!drawState.active || !drawState.zone || !drawState.preview) return;

  const width = Number.parseFloat(drawState.preview.style.width || "0");
  const height = Number.parseFloat(drawState.preview.style.height || "0");

  if (width < 8 || height < 8) {
    drawState.preview.remove();
  } else {
    drawState.preview.classList.remove("preview");
    const q = game.questions[game.current];
    if (phase === "grafica" && q && q.op.sym === "-" && drawState.zone === drawZoneAEl) {
      drawState.preview.addEventListener("click", handleGraphicSubtractionClick);
    }
  }

  drawState.active = false;
  drawState.zone = null;
  drawState.preview = null;
  updateGraphicCounts();
}

function handleGraphicSubtractionClick(e) {
  if (phase !== "grafica") return;
  const q = game.questions[game.current];
  if (!q || q.op.sym !== "-") return;

  e.stopPropagation();
  const shapeEl = e.currentTarget;
  shapeEl.classList.toggle("removed");
  updateGraphicCounts();
}

function getZonePoint(zoneEl, clientX, clientY) {
  const rect = zoneEl.getBoundingClientRect();
  const baseWidth = zoneEl.clientWidth || rect.width || 1;
  const baseHeight = zoneEl.clientHeight || rect.height || 1;
  const scaleX = rect.width / baseWidth || 1;
  const scaleY = rect.height / baseHeight || 1;

  const localX = (clientX - rect.left) / scaleX;
  const localY = (clientY - rect.top) / scaleY;

  return {
    x: Math.max(0, Math.min(localX, baseWidth)),
    y: Math.max(0, Math.min(localY, baseHeight)),
  };
}

function updateGraphicPreview(clientX, clientY, lockProportion = false) {
  if (!drawState.active || !drawState.zone || !drawState.preview) return;
  const point = getZonePoint(drawState.zone, clientX, clientY);
  let x = point.x;
  let y = point.y;

  if (lockProportion) {
    const dx = x - drawState.startX;
    const dy = y - drawState.startY;
    const signX = dx === 0 ? (dy >= 0 ? 1 : -1) : Math.sign(dx);
    const signY = dy === 0 ? (dx >= 0 ? 1 : -1) : Math.sign(dy);
    const rawSize = Math.max(Math.abs(dx), Math.abs(dy));
    const maxX = signX > 0 ? drawState.zone.clientWidth - drawState.startX : drawState.startX;
    const maxY = signY > 0 ? drawState.zone.clientHeight - drawState.startY : drawState.startY;
    const size = Math.min(rawSize, maxX, maxY);
    x = drawState.startX + signX * size;
    y = drawState.startY + signY * size;
  }

  const left = Math.min(drawState.startX, x);
  const top = Math.min(drawState.startY, y);
  const width = Math.abs(drawState.startX - x);
  const height = Math.abs(drawState.startY - y);

  drawState.preview.style.left = `${left}px`;
  drawState.preview.style.top = `${top}px`;
  drawState.preview.style.width = `${width}px`;
  drawState.preview.style.height = `${height}px`;
}

function startGraphicDraw(zoneEl, e) {
  if (e.button !== 0) return;
  const point = getZonePoint(zoneEl, e.clientX, e.clientY);
  const x = point.x;
  const y = point.y;

  const shape = document.createElement("div");
  shape.className = `draw-shape ${graphicShape} preview`;
  if (graphicShape === "star") {
    shape.innerHTML = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon class="star-fill" points="50,2 61,35 98,35 68,57 79,95 50,72 21,95 32,57 2,35 39,35"></polygon>
      </svg>
    `;
  }
  shape.style.left = `${x}px`;
  shape.style.top = `${y}px`;
  shape.style.width = "0px";
  shape.style.height = "0px";
  zoneEl.appendChild(shape);

  drawState.active = true;
  drawState.zone = zoneEl;
  drawState.preview = shape;
  drawState.startX = x;
  drawState.startY = y;
}

function initGraphicTools() {
  drawToolsEl.querySelectorAll(".shapeBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      graphicShape = btn.dataset.shape;
      drawToolsEl.querySelectorAll(".shapeBtn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  [drawZoneAEl, drawZoneBEl].forEach((zone) => {
    zone.addEventListener("mousedown", (e) => {
      if (e.target !== zone) return;
      const q = game.questions[game.current];
      if (phase === "grafica" && q && q.op.sym === "-" && zone === drawZoneBEl) return;
      startGraphicDraw(zone, e);
    });
  });

  window.addEventListener("mousemove", (e) => updateGraphicPreview(e.clientX, e.clientY, e.shiftKey));
  window.addEventListener("mouseup", stopGraphicDraw);
}

function loadQuestion() {
  const q = game.questions[game.current];
  game.answer = 0;
  game.locked = false;
  answerBarEl.style.display = "";
  answerSummaryWrapEl.style.display = "";
  updateAnswerLabel();
  updateAnswerInputVisibility();

  qIndexEl.textContent = String(game.current + 1);

  if (phase === "concreta") {
    loadQuestionConcrete(q);
    return;
  }
  if (phase === "grafica") {
    loadQuestionGrafica(q);
    return;
  }
  if (phase === "complementaria") {
    loadQuestionComplementaria(q);
    return;
  }

  visualOpEl.style.display = "";
  mathOpEl.style.display = "";
  visualConcreteEl.style.display = "none";
  concreteSubEl.style.display = "none";

  tokensPanelEl.style.display = "none";
  answerPanelEl.style.display = "";
  dropzoneEl.style.display = "none";
  inputAnswerWrapEl.style.display = "none";
  optionsWrapEl.style.display = "grid";
  graphicWorkspaceEl.style.display = "none";
  clearBtnEl.style.display = "none";
  checkBtnEl.style.display = "none";

  // Abstracto sin iconos: solo números y operador
  visualOpEl.innerHTML = `
    <span>${q.a}</span>
    <span class="symbol">${q.op.sym}</span>
    <span>${q.b}</span>
    <span class="symbol">= ?</span>
  `;
  mathOpEl.textContent = "Elige una opción.";

  // Reset UI
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  answerCountEl.textContent = "0";
  renderAbstractOptions(q);
  clearDropzoneVisuals();
}

function loadQuestionConcrete(q) {
  optionsWrapEl.style.display = "none";
  graphicWorkspaceEl.style.display = "none";
  clearBtnEl.style.display = "";
  checkBtnEl.style.display = "";
  visualOpEl.style.display = "none";
  mathOpEl.style.display = "none";
  visualConcreteEl.style.display = "flex";

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  updateAnswerLabel();
  updateAnswerInputVisibility();
  numericAnswerEl.value = "";
  answerCountEl.textContent = "0";

  if (q.op.sym === "+") {
    tokensPanelEl.style.display = "";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "";
    concreteSubEl.style.display = "none";

    visualConcreteEl.innerHTML = `
      <div class="obj-group" id="groupA"></div>
      ${opMarkup(q.op)}
      <div class="obj-group" id="groupB"></div>
      <span class="symbol">= ?</span>
    `;

    renderObjectGroup(document.getElementById("groupA"), q.token, q.a, false);
    renderObjectGroup(document.getElementById("groupB"), q.token, q.b, false);

    tokenPoolEl.innerHTML = "";
    const poolSize = Math.max(9, q.a + q.b);
    for (let i = 0; i < poolSize; i++) {
      tokenPoolEl.appendChild(createDraggableToken(q.token));
    }

    clearDropzoneVisuals();
  } else if (q.op.sym === "-") {
    tokensPanelEl.style.display = "none";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "none";
    concreteSubEl.style.display = "block";

    visualConcreteEl.innerHTML = `
      <div class="obj-group" id="groupA"></div>
      ${opMarkup(q.op)}
      <div class="obj-group" id="groupB"></div>
      <span class="symbol">= ?</span>
    `;
    renderObjectGroup(document.getElementById("groupA"), q.token, q.a, false);
    renderObjectGroup(document.getElementById("groupB"), q.token, q.b, false);

    renderSubtractionGroup(q);
  } else {
    tokensPanelEl.style.display = "";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "none";
    concreteSubEl.style.display = "block";

    const opText = q.op.sym === "×"
      ? `Formar ${q.groupCount} grupos de ${q.groupSize} fichas.`
      : `Repartir ${q.a} fichas en ${q.groupCount} grupos iguales.`;

    visualConcreteEl.innerHTML = `
      <div class="obj-group" id="groupA"></div>
      ${opMarkup(q.op)}
      <div class="obj-group" id="groupB"></div>
      <span class="symbol">= ?</span>
    `;
    renderObjectGroup(document.getElementById("groupA"), q.token, q.a, false);
    renderObjectGroup(document.getElementById("groupB"), q.token, q.b, false);

    renderGroupArea(q, opText);

    tokenPoolEl.innerHTML = "";
    const poolSize = q.op.sym === "×" ? q.groupCount * q.groupSize : q.a;
    for (let i = 0; i < poolSize; i++) {
      tokenPoolEl.appendChild(createDraggableToken(q.token));
    }
    clearDropzoneVisuals();
  }
}

function loadQuestionGrafica(q) {
  optionsWrapEl.style.display = "none";
  graphicWorkspaceEl.style.display = "block";
  clearBtnEl.style.display = "";
  checkBtnEl.style.display = "";
  visualOpEl.style.display = "";
  mathOpEl.style.display = "";
  visualConcreteEl.style.display = "none";
  concreteSubEl.style.display = "none";

  tokensPanelEl.style.display = "none";
  answerPanelEl.style.display = "";
  dropzoneEl.style.display = "none";

  visualOpEl.innerHTML = `
    <span>${q.a}</span>
    <span class="symbol">${q.op.sym}</span>
    <span>${q.b}</span>
    <span class="symbol">= ?</span>
  `;
  if (q.op.sym === "-") {
    mathOpEl.textContent = "Dibuja la cantidad inicial, resta haciendo clic sobre las figuras y escribe el resultado.";
  } else if (q.op.sym === "×") {
    mathOpEl.textContent = "Dibuja dos grupos iguales y escribe el total.";
  } else if (q.op.sym === "÷") {
    mathOpEl.textContent = "Reparte en dos grupos iguales dibujando en cada zona y escribe cuántas figuras van en cada grupo.";
  } else {
    mathOpEl.textContent = "Dibuja en cada zona y escribe el resultado numérico.";
  }
  updateGraphicStatements(q);
  drawTaskAEl.style.display = "";
  drawTaskBEl.style.display = q.op.sym === "-" ? "none" : "";

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  updateAnswerLabel();
  updateAnswerInputVisibility();
  answerCountEl.textContent = "0";
  clearGraphicWorkspace();
  clearDropzoneVisuals();
}

function loadQuestionComplementaria(q) {
  optionsWrapEl.style.display = "grid";
  graphicWorkspaceEl.style.display = "none";
  clearBtnEl.style.display = "none";
  checkBtnEl.style.display = "none";
  visualOpEl.style.display = "";
  mathOpEl.style.display = "";
  visualConcreteEl.style.display = "none";
  concreteSubEl.style.display = "none";

  tokensPanelEl.style.display = "none";
  answerPanelEl.style.display = "";
  dropzoneEl.style.display = "none";
  answerBarEl.style.display = "none";
  answerSummaryWrapEl.style.display = "none";
  inputAnswerWrapEl.style.display = "none";

  visualOpEl.textContent = "Problema";
  mathOpEl.textContent = buildStory(q);

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  numericAnswerEl.value = "";
  answerCountEl.textContent = "0";
  renderAbstractOptions(q);
  clearDropzoneVisuals();
}

function renderGraphicOp(q) {
  const left = renderDots(q.a);
  const right = renderDots(q.b);
  if (q.op.sym === "×") {
    visualConcreteEl.innerHTML = `
      <div class="dot-rows">
        ${renderRows(q.b, q.a)}
      </div>
      <span class="symbol">= ?</span>
    `;
  } else if (q.op.sym === "÷") {
    visualConcreteEl.innerHTML = `
      <div class="dot-groups">
        ${renderGroups(q.a, q.b)}
      </div>
      <span class="symbol">= ?</span>
    `;
  } else {
    visualConcreteEl.innerHTML = `
      <div class="dot-group">${left}</div>
      ${opMarkup(q.op)}
      <div class="dot-group">${right}</div>
      <span class="symbol">= ?</span>
    `;
  }
}

function renderDots(count) {
  let html = "";
  for (let i = 0; i < count; i++) html += '<span class="dot"></span>';
  return html;
}

function renderRows(perRow, rows) {
  let html = "";
  for (let r = 0; r < rows; r++) {
    html += `<div class="dot-row">${renderDots(perRow)}</div>`;
  }
  return html;
}

function renderGroups(total, groups) {
  const perGroup = Math.floor(total / groups);
  let html = "";
  for (let g = 0; g < groups; g++) {
    html += `<div class="dot-group">${renderDots(perGroup)}</div>`;
  }
  return html;
}

function buildStory(q) {
  if (q.story) return q.story;
  const plural = tokenPlural(q.token);
  const names = ["Juan", "Ana", "Sofia", "Luis", "Marta", "Pedro"];
  const personA = pick(names);
  let personB = pick(names);
  while (personB === personA) personB = pick(names);
  switch (q.op.sym) {
    case "+":
      q.story = `${personA} tiene ${q.a} ${plural} y ${personB} le regala ${q.b} más. ¿Cuántos ${plural} tiene ${personA} en total?`;
      return q.story;
    case "-":
      q.story = `${personA} tenía ${q.a} ${plural} y regaló ${q.b}. ¿Cuántos ${plural} le quedan?`;
      return q.story;
    case "×":
      q.story = `En una clase hay ${q.b} grupos y en cada grupo hay ${q.a} ${plural}. ¿Cuántos ${plural} hay en total?`;
      return q.story;
    case "÷":
      q.story = `${personA} tiene ${q.a} ${plural} y quiere repartirlos en ${q.b} grupos iguales. ¿Cuántos ${plural} van en cada grupo?`;
      return q.story;
    default:
      q.story = "";
      return q.story;
  }
}

function tokenPlural(token) {
  if (!token || !token.label) return "fichas";
  switch (token.label) {
    case "balón": return "balones";
    case "llave": return "llaves";
    case "caja": return "cajas";
    default:
      if (token.label.endsWith("s")) return token.label;
      return `${token.label}s`;
  }
}

function renderObjectGroup(container, token, count, clickable, onClick) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "obj-item" + (clickable ? " clickable" : "");
    const img = document.createElement("img");
    img.src = token.img;
    img.alt = token.key;
    item.appendChild(img);
    if (clickable && onClick) {
      item.addEventListener("click", () => onClick(item));
    }
    container.appendChild(item);
  }
}

function renderSubtractionGroup(q) {
  concreteSubEl.innerHTML = `
    <div class="obj-group" id="subGroup"></div>
    <div class="concrete-hint">Tacha haciendo clic sobre las fichas.</div>
  `;
  const subGroup = document.getElementById("subGroup");
  renderObjectGroup(subGroup, q.token, q.a, true, (item) => {
    item.classList.toggle("crossed");
    updateConcreteAnswer(q);
  });
  updateConcreteAnswer(q);
}

function updateConcreteAnswer(q) {
  const crossed = concreteSubEl.querySelectorAll(".obj-item.crossed").length;
  game.answer = Math.max(0, q.a - crossed);
  answerCountEl.textContent = String(game.answer);
}

function renderGroupArea(q, opText) {
  concreteSubEl.innerHTML = `
    <div class="concrete-hint">${opText}</div>
    <div class="obj-group groups" id="groupsWrap"></div>
  `;
  const wrap = document.getElementById("groupsWrap");
  groupCounts = Array.from({ length: q.groupCount }, () => 0);
  groupEls = [];

  for (let i = 0; i < q.groupCount; i++) {
    const group = document.createElement("div");
    group.className = "group";
    group.dataset.groupIndex = String(i);
    group.innerHTML = `<div class="group-title">Grupo ${i + 1}</div><div class="group-body"></div>`;

    group.addEventListener("dragover", (e) => {
      e.preventDefault();
      group.classList.add("dragover");
    });
    group.addEventListener("dragleave", () => {
      group.classList.remove("dragover");
    });
    group.addEventListener("drop", (e) => {
      e.preventDefault();
      group.classList.remove("dragover");
      const tokenKey = e.dataTransfer.getData("text/tokenKey");
      if (!tokenKey || tokenKey !== q.token.key) return;
      addTokenToGroup(group, q.token);
    });

    wrap.appendChild(group);
    groupEls.push(group);
  }
  updateGroupAnswerCount();
}

function addTokenToGroup(groupEl, token) {
  const idx = Number(groupEl.dataset.groupIndex);
  groupCounts[idx] += 1;

  const bubble = document.createElement("div");
  bubble.className = "token";
  bubble.draggable = false;
  const img = document.createElement("img");
  img.src = token.img;
  img.alt = token.key;
  bubble.appendChild(img);

  const body = groupEl.querySelector(".group-body");
  body.appendChild(bubble);
  updateGroupAnswerCount();
}

function updateGroupAnswerCount() {
  const total = groupCounts.reduce((a, b) => a + b, 0);
  const q = game.questions[game.current];
  if (phase === "concreta" && q && q.op.sym === "÷") {
    const groupsFilled = groupCounts.filter((count) => count > 0).length;
    game.answer = groupsFilled > 0 ? Math.floor(total / q.groupCount) : 0;
  } else {
    game.answer = total;
  }
  answerCountEl.textContent = String(game.answer);
}

function clearGroupArea(q) {
  if (!groupEls.length) return;
  groupCounts = Array.from({ length: q.groupCount }, () => 0);
  groupEls.forEach((g) => {
    const body = g.querySelector(".group-body");
    if (body) body.innerHTML = "";
  });
  updateGroupAnswerCount();
}

// ======= Drag tokens =======
function createDraggableToken(token) {
  const el = document.createElement("div");
  el.className = "token";
  el.draggable = true;
  el.dataset.tokenKey = token.key;

  const img = document.createElement("img");
  img.src = token.img;
  img.alt = token.key;

  el.appendChild(img);

  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/tokenKey", token.key);
  });

  return el;
}

function addTokenToAnswer(token) {
  if (phase === "concreta") {
    const q = game.questions[game.current];
    if (q.op.sym === "-") return;
  }
  game.answer += 1;
  answerCountEl.textContent = String(game.answer);

  // visual: clonar una ficha en la zona
  const bubble = document.createElement("div");
  bubble.className = "token";
  bubble.draggable = false;

  const img = document.createElement("img");
  img.src = token.img;
  img.alt = token.key;
  bubble.appendChild(img);

  dropzoneEl.appendChild(bubble);
  updateDropHintVisibility();
}

function clearDropzoneVisuals() {
  // quitar tokens, dejando el hint
  const keep = dropzoneEl.querySelector(".dropHint");
  dropzoneEl.innerHTML = "";
  dropzoneEl.appendChild(keep);
  updateDropHintVisibility();
}

function updateDropHintVisibility() {
  const hasTokens = dropzoneEl.querySelectorAll(".token").length > 0;
  dropzoneEl.querySelector(".dropHint").style.opacity = hasTokens ? "0" : "1";
}

// ======= Buttons =======
function clearAnswer() {
  if (game.locked) return;
  game.answer = 0;
  answerCountEl.textContent = "0";
  numericAnswerEl.value = "";
  if (phase === "simbolica") {
    optionsWrapEl.querySelectorAll(".optionBtn").forEach((b) => b.classList.remove("selected"));
  }
  const q = game.questions[game.current];
  if (phase === "grafica") {
    clearGraphicWorkspace();
  } else if (phase === "concreta") {
    if (q.op.sym === "-") {
      renderSubtractionGroup(q);
    } else if (q.op.sym === "×" || q.op.sym === "÷") {
      clearGroupArea(q);
    } else {
      clearDropzoneVisuals();
    }
  } else {
    clearDropzoneVisuals();
  }
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
}

function checkAnswer() {
  if (game.locked) return;
  game.locked = true;
  const q = game.questions[game.current];
  let ok = game.answer === q.correct;
  let customFeedback = "";
  if (phase === "grafica") {
    const requiredShape = q.requiredShape || "square";
    const countA = drawZoneAEl.querySelectorAll(".draw-shape:not(.preview)").length;
    const countB = drawZoneBEl.querySelectorAll(".draw-shape:not(.preview)").length;
    const countARequired = drawZoneAEl.querySelectorAll(`.draw-shape.${requiredShape}:not(.preview)`).length;
    const countBRequired = drawZoneBEl.querySelectorAll(`.draw-shape.${requiredShape}:not(.preview)`).length;
    const wrongShapeEls = [
      ...drawZoneAEl.querySelectorAll(`.draw-shape:not(.${requiredShape}):not(.preview)`),
      ...drawZoneBEl.querySelectorAll(`.draw-shape:not(.${requiredShape}):not(.preview)`),
    ];
    const typed = Number.parseInt(numericAnswerEl.value, 10);
    game.answer = Number.isFinite(typed) ? typed : 0;
    answerCountEl.textContent = String(game.answer);
    if (q.op.sym === "-") {
      const removedCount = drawZoneAEl.querySelectorAll(".draw-shape.removed:not(.preview)").length;
      const remainingCount = drawZoneAEl.querySelectorAll(`.draw-shape.${requiredShape}:not(.preview):not(.removed)`).length;
      ok = countARequired === q.a && removedCount === q.b && remainingCount === q.correct && game.answer === q.correct && wrongShapeEls.length === 0;
    } else if (q.op.sym === "×") {
      ok = countARequired === q.a && countBRequired === q.a && game.answer === q.correct && wrongShapeEls.length === 0;
    } else if (q.op.sym === "÷") {
      ok = countARequired === q.correct && countBRequired === q.correct && game.answer === q.correct && wrongShapeEls.length === 0;
    } else {
      ok = countARequired === q.a && countBRequired === q.b && game.answer === q.correct && wrongShapeEls.length === 0;
    }

    if (!ok && q.op.sym !== "-" && game.answer === q.correct && countA === q.a && countB === q.b && wrongShapeEls.length > 0) {
      const wrongShape = detectShapeFromElement(wrongShapeEls[0]);
      customFeedback = `La respuesta numérica es correcta, pero debías dibujar ${shapePluralLabel(requiredShape)}, no ${shapePluralLabel(wrongShape)}.`;
    } else if (!ok && q.op.sym === "-" && game.answer === q.correct && wrongShapeEls.length > 0) {
      const wrongShape = detectShapeFromElement(wrongShapeEls[0]);
      customFeedback = `La respuesta numérica es correcta, pero debías dibujar ${shapePluralLabel(requiredShape)}, no ${shapePluralLabel(wrongShape)}.`;
    }
  }
  if (phase === "concreta" && (q.op.sym === "×" || q.op.sym === "÷")) {
    const total = groupCounts.reduce((a, b) => a + b, 0);
    const everyGroupOk = groupCounts.every((c) => c === q.groupSize);
    if (q.op.sym === "×") {
      ok = everyGroupOk && total === q.groupCount * q.groupSize;
    } else {
      ok = everyGroupOk && total === q.a;
    }
  }

  // NUEVO: si falla, guardar error
  if (!ok) {
    const visualError = (phase === "simbolica" || phase === "grafica")
      ? `${q.a} ${q.op.sym} ${q.b}`
      : `${q.a} ${q.token.label} ${q.op.sym} ${q.b} ${q.token.label}`;
    errores.push({
      visual: visualError,
      correcta: q.correct,
      respuesta: game.answer
    });
  }

  const feedbackMessage = ok ? "¡Bien! ✅" : (customFeedback || `Ups... era ${q.correct}`);
  addAttemptRecord({
    phase,
    operation: q.op.sym,
    problem: recordPrompt(q, phase),
    studentAnswer: String(game.answer),
    correctAnswer: String(q.correct),
    isCorrect: ok,
    feedback: feedbackMessage,
    questionNumber: game.current + 1,
    answeredAt: new Date().toISOString(),
  });

  feedbackEl.textContent = feedbackMessage;
  feedbackEl.className = "feedback " + (ok ? "ok" : "bad");

  // Pasar al siguiente tras 3 segundos para que se vea la retroalimentacion.
  setTimeout(() => {
    game.current += 1;
    if (game.current >= TOTAL_QUESTIONS) {
      finishGame();
    } else {
      loadQuestion();
    }
  }, FEEDBACK_DELAY_MS);
}

function finishGame() {
  stopGraphicDraw();
  graphicWorkspaceEl.style.display = "none";
  inputAnswerWrapEl.style.display = "none";
  if (phase === "concreta") {
    optionsWrapEl.style.display = "none";
    visualConcreteEl.textContent = "¡Partida terminada!";
    visualConcreteEl.style.display = "flex";
    concreteSubEl.style.display = "none";
  } else {
    optionsWrapEl.style.display = "none";
    visualOpEl.textContent = "¡Partida terminada!";
    mathOpEl.textContent = "Pulsa \"Nueva partida\" para jugar otra vez.";
  }
  tokenPoolEl.innerHTML = "";
  clearDropzoneVisuals();
  answerCountEl.textContent = "0";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  unlockNextPhase();
}

function resetPhaseUI() {
  if (phase === "concreta") {
    optionsWrapEl.style.display = "none";
    graphicWorkspaceEl.style.display = "none";
    inputAnswerWrapEl.style.display = "none";
    clearBtnEl.style.display = "";
    checkBtnEl.style.display = "";
    visualOpEl.style.display = "none";
    mathOpEl.style.display = "none";
    visualConcreteEl.style.display = "flex";
    concreteSubEl.style.display = "none";
  } else if (phase === "grafica") {
    optionsWrapEl.style.display = "none";
    graphicWorkspaceEl.style.display = "block";
    inputAnswerWrapEl.style.display = "block";
    clearBtnEl.style.display = "";
    checkBtnEl.style.display = "";
    visualOpEl.style.display = "";
    mathOpEl.style.display = "";
    visualConcreteEl.style.display = "none";
    concreteSubEl.style.display = "none";
    tokensPanelEl.style.display = "none";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "none";
    drawTaskAEl.style.display = "";
    drawTaskBEl.style.display = "";
  } else if (phase === "complementaria") {
    optionsWrapEl.style.display = "grid";
    graphicWorkspaceEl.style.display = "none";
    inputAnswerWrapEl.style.display = "none";
    clearBtnEl.style.display = "none";
    checkBtnEl.style.display = "none";
    visualOpEl.style.display = "";
    mathOpEl.style.display = "";
    visualConcreteEl.style.display = "none";
    concreteSubEl.style.display = "none";
    tokensPanelEl.style.display = "none";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "none";
    answerBarEl.style.display = "none";
    answerSummaryWrapEl.style.display = "none";
  } else {
    optionsWrapEl.style.display = "grid";
    graphicWorkspaceEl.style.display = "none";
    inputAnswerWrapEl.style.display = "none";
    clearBtnEl.style.display = "none";
    checkBtnEl.style.display = "none";
    visualOpEl.style.display = "";
    mathOpEl.style.display = "";
    visualConcreteEl.style.display = "none";
    concreteSubEl.style.display = "none";
    tokensPanelEl.style.display = "none";
    answerPanelEl.style.display = "";
    dropzoneEl.style.display = "none";
  }
}

function initPhaseBar() {
  updatePhaseButtons();
  phaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.phase;
      const idx = PHASES.indexOf(target);
      if (idx <= unlockedIndex) {
        setPhase(target);
      }
    });
  });
}

function setPhase(nextPhase) {
  phase = nextPhase;
  resetPhaseUI();
  updatePhaseButtons();
  newGame();
}

function unlockNextPhase() {
  const idx = PHASES.indexOf(phase);
  if (idx >= unlockedIndex && idx < PHASES.length - 1) {
    unlockedIndex = idx + 1;
    updatePhaseButtons();
  }
}

function updatePhaseButtons() {
  phaseBtns.forEach((btn) => {
    const p = btn.dataset.phase;
    const idx = PHASES.indexOf(p);
    btn.disabled = idx > unlockedIndex;
    btn.classList.toggle("active", p === phase);
  });
}

function initApp() {
  initGraphicTools();
  initPhaseBar();
  if (hydrateStudentSession()) {
    renderSessionLog();
    newGame();
  } else {
    openStudentModal();
  }
}

// ======= Start =======
initApp();

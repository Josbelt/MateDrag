// ======= Config =======
const TOTAL_QUESTIONS = 10;
const CONCRETE_MAX = 5;
const CONCRETE_MAX_TOTAL = 12;
const FEEDBACK_DELAY_MS = 3000;
const DIVIDER_IMG = "img/dividir.png";
const PHASES = ["concreta", "grafica", "simbolica", "complementaria"];
const TEACHER_PASSWORD = "300901";
const POINTS_PER_CORRECT_ANSWER = 100;
const GRAPHIC_TAP_SHAPE_SIZE = 42;

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
let tokenDragState = {
  active: false,
  token: null,
  ghost: null,
  currentTarget: null,
  pointerId: null,
};

// ======= DOM =======
const qIndexEl = document.getElementById("qIndex");
const progressFillEl = document.querySelector(".progressFill");
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
const tokensHintEl = tokensPanelEl ? tokensPanelEl.querySelector(".hint") : null;
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
const phaseCompleteActionsEl = document.getElementById("phaseCompleteActions");
const nextPhaseBtnEl = document.getElementById("nextPhaseBtn");
const phaseHomeBtnEl = document.getElementById("phaseHomeBtn");

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
const studentLastNameInputEl = document.getElementById("studentLastNameInput");
const studentNameDisplayEl = document.getElementById("studentNameDisplay");
const menuStudentNameDisplayEl = document.getElementById("menuStudentNameDisplay");
const menuStarCountDisplayEl = document.getElementById("menuStarCountDisplay");
const starCountDisplayEl = document.getElementById("starCountDisplay");
const leaderboardBodyEl = document.getElementById("leaderboardBody");
const openLeaderboardBtns = Array.from(document.querySelectorAll("[data-open-leaderboard]"));
const leaderboardModalEl = document.getElementById("leaderboardModal");
const closeLeaderboardBtnEl = document.getElementById("closeLeaderboardBtn");
const finalCelebrationModalEl = document.getElementById("finalCelebrationModal");
const finalScoreValueEl = document.getElementById("finalScoreValue");
const finalRankValueEl = document.getElementById("finalRankValue");
const finalRankTotalEl = document.getElementById("finalRankTotal");
const finalRestartGameBtnEl = document.getElementById("finalRestartGameBtn");
const finalHomeBtnEl = document.getElementById("finalHomeBtn");
const logoutStudentBtns = Array.from(document.querySelectorAll("[data-logout-student]"));
const menuScreenEl = document.getElementById("menuScreen");
const gameScreenEl = document.getElementById("gameScreen");
const backToMenuBtnEl = document.getElementById("backToMenuBtn");
const resetPhaseBtnEl = document.getElementById("resetPhaseBtn");
const newGameBtnEl = document.getElementById("newGameBtn");
const gameMenuToggleBtnEl = document.getElementById("gameMenuToggleBtn");
const gameQuickMenuEl = document.getElementById("gameQuickMenu");
const playPhaseBtns = Array.from(document.querySelectorAll(".playPhaseBtn"));
const menuPhaseCards = Array.from(document.querySelectorAll("[data-phase-card]"));
const menuNavBtns = Array.from(document.querySelectorAll(".menuNavBtn"));
const adventureSteps = Array.from(document.querySelectorAll(".adventureTrack .step"));
const openTeacherMenuBtnEl = document.getElementById("openTeacherMenuBtn");
const openTeacherStudentBtnEl = document.getElementById("openTeacherStudentBtn");
const teacherModalEl = document.getElementById("teacherModal");
const teacherLoginFormEl = document.getElementById("teacherLoginForm");
const teacherPasswordInputEl = document.getElementById("teacherPasswordInput");
const teacherLoginErrorEl = document.getElementById("teacherLoginError");
const closeTeacherLoginBtnEl = document.getElementById("closeTeacherLoginBtn");
const teacherDashboardEl = document.getElementById("teacherDashboard");
const teacherRecordsEl = document.getElementById("teacherRecords");
const teacherSummaryEl = document.getElementById("teacherSummary");
const closeTeacherDashboardBtnEl = document.getElementById("closeTeacherDashboardBtn");
const exportAllRecordsBtnEl = document.getElementById("exportAllRecordsBtn");

const STORAGE_KEYS = {
  currentStudent: "matedrag.currentStudent",
  currentSession: "matedrag.currentSession",
  sessions: "matedrag.sessions",
  pendingCloudWrites: "matedrag.pendingCloudWrites",
};

const CLOUD_CONFIG = window.MATEDRAG_CLOUD || {};
const CLOUD_TIMEOUT_MS = 15000;

let studentName = "";
let sessionLog = null;
let suppressHistoryUpdate = false;
let cloudQueueFlushInProgress = false;
let cloudQueueFlushTimer = 0;
let storedSessionsCache = null;
let leaderboardRenderQueued = false;

clearBtnEl.addEventListener("click", clearAnswer);
checkBtnEl.addEventListener("click", checkAnswer);
if (nextPhaseBtnEl) {
  nextPhaseBtnEl.addEventListener("click", goToNextPhase);
}
if (phaseHomeBtnEl) {
  phaseHomeBtnEl.addEventListener("click", () => showMainMenu("inicio"));
}
window.addEventListener("online", () => {
  flushCloudWriteQueue().then((ok) => {
    if (ok) syncCloudSessions();
  });
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    flushCloudWriteQueue();
  }
});
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEYS.sessions) {
    storedSessionsCache = null;
    scheduleLeaderboardRender();
  }
});
newGameBtnEl.addEventListener("click", confirmNewGame);
if (resetPhaseBtnEl) {
  resetPhaseBtnEl.addEventListener("click", confirmPhaseRestart);
}
backToMenuBtnEl.addEventListener("click", () => showMainMenu("inicio"));
if (gameMenuToggleBtnEl && gameQuickMenuEl) {
  gameMenuToggleBtnEl.addEventListener("click", (event) => {
    event.stopPropagation();
    setGameMenuOpen(gameQuickMenuEl.hidden);
  });

  gameQuickMenuEl.addEventListener("click", (event) => {
    event.stopPropagation();
    const clickedButton = event.target.closest("button");
    if (clickedButton) {
      window.setTimeout(closeGameMenu, 0);
    }
  });

  document.addEventListener("click", (event) => {
    if (gameQuickMenuEl.hidden || event.target.closest(".gameMenu")) return;
    closeGameMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGameMenu();
  });
}
logoutStudentBtns.forEach((btn) => {
  btn.addEventListener("click", logoutStudent);
});
numericAnswerEl.addEventListener("input", () => {
  const value = Number.parseInt(numericAnswerEl.value, 10);
  game.answer = Number.isFinite(value) ? value : 0;
  answerCountEl.textContent = String(game.answer);
  updateCheckButtonState();
});

if (showErrorsBtn) {
  showErrorsBtn.addEventListener("click", () => {
    renderSessionLog();
    errorsPanel.style.display = "block";
  });
}

if (exportLogBtn) {
  exportLogBtn.addEventListener("click", exportSessionLog);
}

if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", copyShareLink);
}
studentFormEl.addEventListener("submit", handleStudentSubmit);

playPhaseBtns.forEach((btn) => {
  btn.addEventListener("click", () => startPhaseFromMenu(btn.dataset.phase));
});

menuNavBtns.forEach((btn) => {
  btn.addEventListener("click", () => handleMenuNav(btn.dataset.menu));
});

[openTeacherMenuBtnEl, openTeacherStudentBtnEl].filter(Boolean).forEach((btn) => {
  btn.addEventListener("click", () => {
    closeStudentModal();
    openTeacherLogin();
  });
});

if (teacherLoginFormEl) {
  teacherLoginFormEl.addEventListener("submit", handleTeacherLogin);
}

if (closeTeacherLoginBtnEl) {
  closeTeacherLoginBtnEl.addEventListener("click", closeTeacherLogin);
}

if (closeTeacherDashboardBtnEl) {
  closeTeacherDashboardBtnEl.addEventListener("click", closeTeacherDashboard);
}

if (exportAllRecordsBtnEl) {
  exportAllRecordsBtnEl.addEventListener("click", exportAllRecords);
}

openLeaderboardBtns.forEach((btn) => {
  btn.addEventListener("click", openLeaderboard);
});

if (closeLeaderboardBtnEl) {
  closeLeaderboardBtnEl.addEventListener("click", closeLeaderboard);
}

if (finalRestartGameBtnEl) {
  finalRestartGameBtnEl.addEventListener("click", () => {
    startNewGame(false);
  });
}

if (finalHomeBtnEl) {
  finalHomeBtnEl.addEventListener("click", () => {
    closeFinalCelebration();
    showMainMenu("inicio");
  });
}

window.addEventListener("beforeunload", () => {
  saveCurrentGameState(false);
  saveSessionLog();
});

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

function hasTypedNumericAnswer() {
  return numericAnswerEl.value.trim() !== "";
}

function getGraphicCompletion(q) {
  const countA = drawZoneAEl.querySelectorAll(".draw-shape:not(.preview)").length;
  const countB = drawZoneBEl.querySelectorAll(".draw-shape:not(.preview)").length;
  const removed = drawZoneAEl.querySelectorAll(".draw-shape.removed:not(.preview)").length;

  if (!q) {
    return { countA, countB, removed, requiredA: 0, requiredB: 0 };
  }

  if (q.op.sym === "-") {
    return { countA, countB, removed, requiredA: q.a, requiredB: 0, requiredRemoved: q.b };
  }
  if (q.op.sym === "×") {
    return { countA, countB, removed, requiredA: q.a, requiredB: q.a };
  }
  if (q.op.sym === "÷") {
    return { countA, countB, removed, requiredA: q.correct, requiredB: q.correct };
  }
  return { countA, countB, removed, requiredA: q.a, requiredB: q.b };
}

function canCheckCurrentAnswer() {
  const q = game.questions[game.current];
  if (!q || game.locked) return false;

  if (phase === "grafica") {
    const completion = getGraphicCompletion(q);
    if (!hasTypedNumericAnswer()) return false;
    if (q.op.sym === "-") {
      return completion.countA >= completion.requiredA && completion.removed >= completion.requiredRemoved;
    }
    return completion.countA >= completion.requiredA && completion.countB >= completion.requiredB;
  }

  if (phase === "concreta") {
    if (q.op.sym === "+") {
      return game.answer >= q.correct;
    }
    if (q.op.sym === "-") {
      const crossed = concreteSubEl.querySelectorAll(".obj-item.crossed").length;
      return crossed >= q.b;
    }
    if (q.op.sym === "×") {
      const total = groupCounts.reduce((sum, count) => sum + count, 0);
      return total >= q.groupCount * q.groupSize;
    }
    if (q.op.sym === "÷") {
      const total = groupCounts.reduce((sum, count) => sum + count, 0);
      return total >= q.a;
    }
  }

  if (phase === "simbolica" || phase === "complementaria") {
    return Boolean(optionsWrapEl.querySelector(".optionBtn.selected"));
  }

  return game.answer > 0;
}

function updateCheckButtonState() {
  if (!checkBtnEl) return;
  const canCheck = canCheckCurrentAnswer();
  checkBtnEl.disabled = !canCheck;
  checkBtnEl.setAttribute("aria-disabled", canCheck ? "false" : "true");
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
    currentPhase: "concreta",
    unlockedIndex: 0,
    starCount: 0,
    gameNumber: 1,
    events: [],
    gameState: null,
    lastView: "menu",
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

function normalizeGameState(state) {
  if (!state || typeof state !== "object") return null;
  const statePhase = PHASES.includes(state.phase) ? state.phase : null;
  const questions = Array.isArray(state.questions) ? state.questions : [];
  if (!statePhase || questions.length === 0) return null;
  const current = Number(state.current);
  return {
    phase: statePhase,
    questions,
    current: Number.isFinite(current)
      ? Math.max(0, Math.min(questions.length, current))
      : 0,
    completed: Boolean(state.completed),
  };
}

function normalizeSessionLog(session) {
  const now = new Date().toISOString();
  const safeSession = session && typeof session === "object" ? session : {};
  const phases = createEmptyPhaseBuckets();

  PHASES.forEach((phaseKey) => {
    const entries = safeSession.phases && Array.isArray(safeSession.phases[phaseKey])
      ? safeSession.phases[phaseKey]
      : [];
    phases[phaseKey] = entries.map((entry) => ({
      ...entry,
      recordType: entry.recordType || "answer",
      gameNumber: Number.isFinite(Number(entry.gameNumber)) ? Math.max(1, Number(entry.gameNumber)) : 1,
      starsEarned: Number.isFinite(Number(entry.starsEarned))
        ? Number(entry.starsEarned)
        : (entry.isCorrect ? POINTS_PER_CORRECT_ANSWER : 0),
    }));
  });
  const savedStars = Number(safeSession.starCount);
  const savedGameNumber = Number(safeSession.gameNumber);
  const normalizedGameNumber = Number.isFinite(savedGameNumber) ? Math.max(1, savedGameNumber) : 1;
  const events = Array.isArray(safeSession.events)
    ? safeSession.events.map((event) => ({
      ...event,
      gameNumber: Number.isFinite(Number(event.gameNumber)) ? Math.max(1, Number(event.gameNumber)) : 1,
      happenedAt: event.happenedAt || event.answeredAt || now,
    }))
    : [];
  const derivedStars = PHASES
    .flatMap((phaseKey) => phases[phaseKey])
    .filter((entry) => entry.isCorrect && !entry.resetExcluded && (Number(entry.gameNumber) || 1) === normalizedGameNumber)
    .length * POINTS_PER_CORRECT_ANSWER;

  return {
    id: safeSession.id || `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    studentName: safeSession.studentName || "Estudiante sin nombre",
    startedAt: safeSession.startedAt || now,
    updatedAt: safeSession.updatedAt || safeSession.startedAt || now,
    currentPhase: PHASES.includes(safeSession.currentPhase) ? safeSession.currentPhase : "concreta",
    unlockedIndex: getUnlockedIndexFromSession({ ...safeSession, phases }),
    starCount: Number.isFinite(savedStars) ? Math.max(0, savedStars) : derivedStars,
    gameNumber: normalizedGameNumber,
    events,
    gameState: normalizeGameState(safeSession.gameState),
    lastView: safeSession.lastView === "game" ? "game" : "menu",
    phases,
  };
}

function getUnlockedIndexFromSession(session) {
  const savedIndex = Number.isFinite(session.unlockedIndex)
    ? Math.max(0, Math.min(PHASES.length - 1, session.unlockedIndex))
    : 0;
  const currentGameNumber = Math.max(1, Number(session.gameNumber) || 1);
  const derivedIndex = PHASES.reduce((maxIndex, phaseKey, index) => {
    const entries = session.phases && Array.isArray(session.phases[phaseKey]) ? session.phases[phaseKey] : [];
    const activeEntries = entries.filter((entry) => !entry.resetExcluded && (Number(entry.gameNumber) || 1) === currentGameNumber);
    if (activeEntries.length >= TOTAL_QUESTIONS && index < PHASES.length - 1) {
      return Math.max(maxIndex, index + 1);
    }
    return maxIndex;
  }, 0);

  return Math.max(savedIndex, derivedIndex);
}

function loadStoredSessions() {
  if (storedSessionsCache) return storedSessionsCache;
  const sessions = loadStoredJson(STORAGE_KEYS.sessions) || {};
  Object.keys(sessions).forEach((sessionId) => {
    sessions[sessionId] = normalizeSessionLog(sessions[sessionId]);
  });
  storedSessionsCache = sessions;
  return storedSessionsCache;
}

function saveStoredSessions(sessions) {
  storedSessionsCache = sessions;
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
}

function scheduleLeaderboardRender() {
  if (leaderboardRenderQueued) return;
  leaderboardRenderQueued = true;
  const render = () => {
    leaderboardRenderQueued = false;
    renderLeaderboards();
  };
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(render);
  } else {
    window.setTimeout(render, 0);
  }
}

function loadPendingCloudWrites() {
  return loadStoredJson(STORAGE_KEYS.pendingCloudWrites) || {};
}

function savePendingCloudWrites(queue) {
  const entries = Object.entries(queue || {}).filter(([, write]) => write && write.path);
  if (entries.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.pendingCloudWrites);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.pendingCloudWrites, JSON.stringify(Object.fromEntries(entries)));
}

function queueCloudWrite(path, options = {}, error = null) {
  if (!isCloudConfigured()) return;
  const method = String(options.method || "PUT").toUpperCase();
  const key = `${method}:${path}`;
  const queue = loadPendingCloudWrites();
  const previous = queue[key] || {};
  queue[key] = {
    path,
    method,
    body: options.body || "",
    queuedAt: previous.queuedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attempts: Number(previous.attempts) || 0,
    lastError: error ? (error.message || error.name || String(error)) : "",
  };
  savePendingCloudWrites(queue);
}

function scheduleCloudWriteFlush(delay = 350) {
  if (!isCloudConfigured() || typeof fetch !== "function") return;
  window.clearTimeout(cloudQueueFlushTimer);
  cloudQueueFlushTimer = window.setTimeout(() => {
    cloudQueueFlushTimer = 0;
    flushCloudWriteQueue();
  }, delay);
}

function cloudProvider() {
  return String(CLOUD_CONFIG.provider || (CLOUD_CONFIG.firebaseProjectId ? "firestore" : "realtime"))
    .trim()
    .toLowerCase();
}

function isFirestoreProvider() {
  return cloudProvider() === "firestore";
}

function inferProjectIdFromRealtimeUrl() {
  const url = String(CLOUD_CONFIG.firebaseDatabaseURL || "").trim();
  const match = url.match(/^https:\/\/([a-z0-9-]+?)(?:-default-rtdb)?\.(?:firebaseio\.com|firebasedatabase\.app)/i);
  return match ? match[1] : "";
}

function firestoreProjectId() {
  return String(CLOUD_CONFIG.firebaseProjectId || CLOUD_CONFIG.projectId || inferProjectIdFromRealtimeUrl()).trim();
}

function firestoreDatabaseId() {
  return String(CLOUD_CONFIG.firestoreDatabaseId || "(default)").trim() || "(default)";
}

function cloudRootPath() {
  return String(CLOUD_CONFIG.rootPath || "ruta-numerica")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-");
}

function firestoreCollectionName() {
  return String(CLOUD_CONFIG.firestoreCollection || `${cloudRootPath()}-sessions`)
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-");
}

function firebaseApiKey() {
  return String(CLOUD_CONFIG.firebaseApiKey || CLOUD_CONFIG.apiKey || "").trim();
}

function firestoreBaseUrl() {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firestoreProjectId())}/databases/${encodeURIComponent(firestoreDatabaseId())}/documents`;
}

function firestoreUrl(path = "", params = {}) {
  const cleanPath = String(path || "").replace(/^\/+|\/+$/g, "");
  const query = new URLSearchParams(params);
  const key = firebaseApiKey();
  if (key) {
    query.set("key", key);
  }
  const queryString = query.toString();
  return `${firestoreBaseUrl()}/${cleanPath}${queryString ? `?${queryString}` : ""}`;
}

function realtimeCloudUrl(path = "") {
  const base = String(CLOUD_CONFIG.firebaseDatabaseURL || "").replace(/\/+$/g, "");
  const cleanPath = [cloudRootPath(), path].filter(Boolean).join("/").replace(/^\/+|\/+$/g, "");
  return `${base}/${cleanPath}.json`;
}

function isCloudConfigured() {
  if (!CLOUD_CONFIG.enabled) return false;

  if (isFirestoreProvider()) {
    const projectId = firestoreProjectId();
    return Boolean(projectId && !projectId.includes("TU-PROYECTO"));
  }

  const url = String(CLOUD_CONFIG.firebaseDatabaseURL || "").trim();
  return Boolean(
    url
    && !url.includes("TU-PROYECTO")
    && (/^https:\/\/.+\.firebaseio\.com/.test(url) || /^https:\/\/.+\.firebasedatabase\.app/.test(url))
  );
}

function cloudBackendName() {
  return isFirestoreProvider() ? "Firestore" : "Firebase";
}

function cloudTimeoutMessage() {
  return `${cloudBackendName()} no respondió en ${Math.round(CLOUD_TIMEOUT_MS / 1000)} segundos. Se guarda localmente y se reintentará automáticamente.`;
}

function isCloudTimeoutError(error) {
  return error && (error.name === "AbortError" || error.name === "TimeoutError" || error.name === "CloudTimeoutError");
}

function toFirestoreValue(value) {
  if (value === null || typeof value === "undefined") return { nullValue: null };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "object") return { mapValue: { fields: toFirestoreFields(value) } };
  return { stringValue: String(value) };
}

function toFirestoreFields(value) {
  return Object.entries(value || {}).reduce((fields, [key, fieldValue]) => {
    if (typeof fieldValue !== "undefined") {
      fields[key] = toFirestoreValue(fieldValue);
    }
    return fields;
  }, {});
}

function fromFirestoreValue(value = {}) {
  if (Object.prototype.hasOwnProperty.call(value, "stringValue")) return value.stringValue;
  if (Object.prototype.hasOwnProperty.call(value, "integerValue")) return Number(value.integerValue) || 0;
  if (Object.prototype.hasOwnProperty.call(value, "doubleValue")) return Number(value.doubleValue) || 0;
  if (Object.prototype.hasOwnProperty.call(value, "booleanValue")) return Boolean(value.booleanValue);
  if (Object.prototype.hasOwnProperty.call(value, "nullValue")) return null;
  if (Object.prototype.hasOwnProperty.call(value, "timestampValue")) return value.timestampValue;
  if (value.arrayValue) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }
  if (value.mapValue) {
    return fromFirestoreFields(value.mapValue.fields || {});
  }
  return null;
}

function fromFirestoreFields(fields = {}) {
  return Object.entries(fields).reduce((result, [key, value]) => {
    result[key] = fromFirestoreValue(value);
    return result;
  }, {});
}

function firestoreDocumentId(document = {}) {
  const rawId = String(document.name || "").split("/").pop() || "";
  try {
    return decodeURIComponent(rawId);
  } catch (error) {
    return rawId;
  }
}

function readCloudBody(options) {
  if (typeof options.body !== "string") return options.body || {};
  if (!options.body.trim()) return {};
  return JSON.parse(options.body);
}

async function cloudResponseError(response, backendName) {
  let detail = "";
  try {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    detail = data && data.error && data.error.message ? `: ${data.error.message}` : "";
  } catch (error) {
    detail = "";
  }
  return new Error(`${backendName} respondió ${response.status}${detail}`);
}

async function firestoreFetch(path, options = {}, signal) {
  const method = String(options.method || "GET").toUpperCase();

  if (method === "GET" && path === "sessions") {
    const sessions = {};
    let pageToken = "";
    do {
      const response = await fetch(firestoreUrl(firestoreCollectionName(), {
        pageSize: "300",
        ...(pageToken ? { pageToken } : {}),
      }), { method: "GET", signal });
      if (!response.ok) {
        throw await cloudResponseError(response, "Firestore");
      }
      const data = await response.json();
      (data.documents || []).forEach((document) => {
        const session = fromFirestoreFields(document.fields || {});
        const id = session.id || firestoreDocumentId(document);
        if (id) {
          sessions[id] = { ...session, id };
        }
      });
      pageToken = data.nextPageToken || "";
    } while (pageToken);
    return sessions;
  }

  if ((method === "PUT" || method === "PATCH") && path.startsWith("sessions/")) {
    const documentId = decodeURIComponent(path.slice("sessions/".length));
    const payload = readCloudBody(options);
    const response = await fetch(firestoreUrl(`${firestoreCollectionName()}/${encodeURIComponent(documentId)}`), {
      method: "PATCH",
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify({ fields: toFirestoreFields(payload) }),
    });
    if (!response.ok) {
      throw await cloudResponseError(response, "Firestore");
    }
    const data = await response.json();
    return fromFirestoreFields(data.fields || {});
  }

  throw new Error(`Operación Firestore no soportada: ${method} ${path}`);
}

async function realtimeFetch(path, options = {}, signal) {
  const response = await fetch(realtimeCloudUrl(path), {
    ...options,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw await cloudResponseError(response, "Firebase");
  }
  return await response.json();
}

async function cloudFetch(path, options = {}) {
  if (!isCloudConfigured() || typeof fetch !== "function") return null;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    if (typeof DOMException === "function") {
      controller.abort(new DOMException(cloudTimeoutMessage(), "TimeoutError"));
      return;
    }
    controller.abort();
  }, CLOUD_TIMEOUT_MS);
  try {
    return isFirestoreProvider()
      ? await firestoreFetch(path, options, controller.signal)
      : await realtimeFetch(path, options, controller.signal);
  } catch (error) {
    if (isCloudTimeoutError(error)) {
      const timeoutError = new Error(cloudTimeoutMessage());
      timeoutError.name = "CloudTimeoutError";
      throw timeoutError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function flushCloudWriteQueue() {
  if (cloudQueueFlushInProgress) {
    scheduleCloudWriteFlush(750);
    return false;
  }
  if (!isCloudConfigured() || typeof fetch !== "function") return false;
  const queue = loadPendingCloudWrites();
  const entries = Object.entries(queue);
  if (entries.length === 0) return true;

  cloudQueueFlushInProgress = true;
  try {
    for (const [key, write] of entries) {
      try {
        await cloudFetch(write.path, {
          method: write.method || "PUT",
          body: write.body || "",
        });
        const latestQueue = loadPendingCloudWrites();
        if (latestQueue[key] && latestQueue[key].updatedAt === write.updatedAt) {
          delete latestQueue[key];
          savePendingCloudWrites(latestQueue);
        }
      } catch (error) {
        const latestQueue = loadPendingCloudWrites();
        const latestWrite = latestQueue[key] || write;
        if (!latestQueue[key] || latestWrite.updatedAt === write.updatedAt) {
          latestQueue[key] = {
            ...latestWrite,
            attempts: (Number(latestWrite.attempts) || 0) + 1,
            lastAttemptAt: new Date().toISOString(),
            lastError: error.message || error.name || String(error),
          };
          savePendingCloudWrites(latestQueue);
        }
        if (isCloudTimeoutError(error)) {
          console.info(`${cloudBackendName()} en espera:`, error.message);
        } else {
          console.warn(`No se pudo subir la cola a ${cloudBackendName()}. Se reintentará luego.`, error);
        }
        return false;
      }
    }
    if (Object.keys(loadPendingCloudWrites()).length > 0) {
      scheduleCloudWriteFlush();
    }
    return true;
  } finally {
    cloudQueueFlushInProgress = false;
  }
}

function mergeSessionCollections(localSessions, cloudSessions) {
  const merged = { ...(localSessions || {}) };
  Object.entries(cloudSessions || {}).forEach(([sessionId, cloudSession]) => {
    if (!cloudSession) return;
    const normalizedCloud = normalizeSessionLog({ ...cloudSession, id: cloudSession.id || sessionId });
    const localSession = merged[sessionId] ? normalizeSessionLog(merged[sessionId]) : null;
    const cloudTime = new Date(normalizedCloud.updatedAt || normalizedCloud.startedAt || 0).getTime();
    const localTime = localSession ? new Date(localSession.updatedAt || localSession.startedAt || 0).getTime() : -1;
    if (!localSession || cloudTime >= localTime) {
      merged[normalizedCloud.id] = normalizedCloud;
    }
  });
  return merged;
}

async function syncCloudSessions(options = {}) {
  const { updateActiveSession = true, renderRanking = true } = options;
  if (!isCloudConfigured()) return false;
  try {
    const queueFlushed = await flushCloudWriteQueue();
    if (!queueFlushed && Object.keys(loadPendingCloudWrites()).length > 0) {
      console.info(`${cloudBackendName()} en espera: hay cambios locales esperando conexión para subirse.`);
      return false;
    }
    const cloudSessions = await cloudFetch("sessions", { method: "GET" });
    const localSessions = loadStoredSessions();
    const merged = mergeSessionCollections(localSessions, cloudSessions || {});
    saveStoredSessions(merged);
    if (updateActiveSession && sessionLog && merged[sessionLog.id]) {
      sessionLog = normalizeSessionLog(merged[sessionLog.id]);
      studentName = sessionLog.studentName;
      phase = sessionLog.currentPhase;
      unlockedIndex = getUnlockedIndexFromSession(sessionLog);
      setStudentNameUI();
      updatePhaseButtons();
    }
    if (renderRanking) {
      renderLeaderboards();
    }
    return true;
  } catch (error) {
    if (isCloudTimeoutError(error)) {
      console.info(`${cloudBackendName()} en espera:`, error.message);
      return false;
    }
    console.warn("No se pudo sincronizar con la base de datos en la nube.", error);
    return false;
  }
}

function saveSessionToCloud(session) {
  if (!isCloudConfigured() || !session) return;
  const payload = JSON.parse(JSON.stringify(session));
  const path = `sessions/${encodeURIComponent(payload.id)}`;
  const options = {
    method: "PUT",
    body: JSON.stringify(payload),
  };
  queueCloudWrite(path, options);
  scheduleCloudWriteFlush(0);
}

function getCurrentGameNumber() {
  return sessionLog ? Math.max(1, Number(sessionLog.gameNumber) || 1) : 1;
}

function saveCurrentGameState(completed = false) {
  if (!sessionLog || !Array.isArray(game.questions) || game.questions.length === 0) return;
  sessionLog.gameState = {
    phase,
    questions: game.questions,
    current: Math.max(0, Math.min(game.current, game.questions.length)),
    completed: Boolean(completed),
  };
}

function saveSessionLog() {
  if (!sessionLog) return;
  sessionLog.updatedAt = new Date().toISOString();
  sessionLog.currentPhase = phase;
  sessionLog.unlockedIndex = unlockedIndex;
  localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
  const sessions = loadStoredSessions();
  sessions[sessionLog.id] = sessionLog;
  saveStoredSessions(sessions);
  saveSessionToCloud(sessionLog);
  scheduleLeaderboardRender();
}

function getSessionById(sessionId) {
  const sessions = loadStoredSessions();
  return sessions[sessionId] || null;
}

function getSessionByStudent(student) {
  const sessions = Object.values(loadStoredSessions());
  return sessions
    .filter((session) => session.studentName.toLowerCase() === student.toLowerCase())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;
}

function setMainNavActive(target) {
  menuNavBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.menu === target);
  });
}

function syncBrowserHistory(view, mode = "auto") {
  if (suppressHistoryUpdate || !window.history || typeof window.history.pushState !== "function") return;
  const state = { view };
  const currentView = window.history.state && window.history.state.view;

  if (mode === "replace") {
    window.history.replaceState(state, "", window.location.href);
    return;
  }

  if (view === "game" && currentView !== "game") {
    window.history.pushState(state, "", window.location.href);
  } else if (view === "menu" && currentView !== "menu") {
    window.history.replaceState(state, "", window.location.href);
  }
}

function setupBrowserNavigation() {
  if (!window.history || typeof window.history.replaceState !== "function") return;
  window.history.replaceState({ view: "menu" }, "", window.location.href);
  window.addEventListener("popstate", () => {
    suppressHistoryUpdate = true;
    showMainMenu("inicio");
    suppressHistoryUpdate = false;
  });
}

function setGameMenuOpen(isOpen) {
  if (!gameMenuToggleBtnEl || !gameQuickMenuEl) return;
  gameQuickMenuEl.hidden = !isOpen;
  gameMenuToggleBtnEl.classList.toggle("active", isOpen);
  gameMenuToggleBtnEl.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function closeGameMenu() {
  setGameMenuOpen(false);
}

function showMainMenu(activeNav = "inicio") {
  if (drawState.active) stopGraphicDraw();
  closeGameMenu();
  closeFinalCelebration();
  menuScreenEl.hidden = false;
  gameScreenEl.hidden = true;
  setMainNavActive(activeNav);
  updatePhaseButtons();
  if (sessionLog) {
    sessionLog.lastView = "menu";
    saveSessionLog();
  }
  syncBrowserHistory("menu", "replace");
}

function showGameView(activeNav = "juegos") {
  closeGameMenu();
  closeFinalCelebration();
  menuScreenEl.hidden = true;
  gameScreenEl.hidden = false;
  setMainNavActive(activeNav);
  if (sessionLog) {
    sessionLog.lastView = "game";
    saveCurrentGameState(false);
    saveSessionLog();
  }
  syncBrowserHistory("game");
}

function showSavedView() {
  if (sessionLog && sessionLog.lastView === "game") {
    showGameView("juegos");
    return;
  }
  showMainMenu("inicio");
}

function handleMenuNav(action) {
  if (action === "juegos") {
    showGameView("juegos");
    if (!game.questions.length) restoreCurrentGame();
    return;
  }

  if (action === "progreso") {
    showGameView("progreso");
    renderSessionLog();
    errorsPanel.style.display = "block";
    return;
  }

  showMainMenu(action || "inicio");
}

function startPhaseFromMenu(targetPhase) {
  const idx = PHASES.indexOf(targetPhase);
  if (idx < 0 || idx > unlockedIndex) return;
  if (!studentName) {
    openStudentModal();
    return;
  }

  if (targetPhase !== phase || !game.questions.length) {
    setPhase(targetPhase);
  }
  showGameView("juegos");
}

function setStudentNameUI() {
  studentNameDisplayEl.textContent = studentName || "Sin registrar";
  if (menuStudentNameDisplayEl) {
    menuStudentNameDisplayEl.textContent = studentName || "Sin registrar";
  }
  logoutStudentBtns.forEach((btn) => {
    btn.hidden = !studentName;
  });
  updateStarCountUI();
}

function updateStarCountUI() {
  const score = sessionLog ? Number(sessionLog.starCount) || 0 : 0;
  if (menuStarCountDisplayEl) {
    menuStarCountDisplayEl.textContent = String(score);
  }
  if (starCountDisplayEl) {
    starCountDisplayEl.textContent = String(score);
  }
}

function updateProgressBar(currentStep = game.current) {
  if (!progressFillEl) return;
  const safeStep = Math.max(0, Math.min(TOTAL_QUESTIONS, currentStep));
  const percent = (safeStep / TOTAL_QUESTIONS) * 100;
  progressFillEl.style.width = `${percent}%`;
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
    case "complementaria": return "Fase de aplicación";
    default: return phaseKey || "Sin fase";
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
  entry.recordType = "answer";
  entry.gameNumber = getCurrentGameNumber();
  entry.resetExcluded = false;
  if (entry.isCorrect) {
    sessionLog.starCount = (Number(sessionLog.starCount) || 0) + POINTS_PER_CORRECT_ANSWER;
    entry.starsEarned = POINTS_PER_CORRECT_ANSWER;
  } else {
    entry.starsEarned = 0;
  }
  sessionLog.phases[entry.phase].push(entry);
  updateStarCountUI();
  saveSessionLog();
  if (errorsPanel.style.display === "block") {
    renderSessionLog();
  }
  if (teacherDashboardEl && !teacherDashboardEl.hidden) {
    renderTeacherDashboard();
  }
}

function addSessionEvent(type, description, targetPhase = phase) {
  if (!sessionLog) return;
  if (!Array.isArray(sessionLog.events)) {
    sessionLog.events = [];
  }
  sessionLog.events.push({
    recordType: "event",
    type,
    description,
    phase: targetPhase,
    gameNumber: getCurrentGameNumber(),
    happenedAt: new Date().toISOString(),
  });
  saveSessionLog();
  if (errorsPanel.style.display === "block") {
    renderSessionLog();
  }
  if (teacherDashboardEl && !teacherDashboardEl.hidden) {
    renderTeacherDashboard();
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
      <strong>Partida actual:</strong> ${escapeHtml(getCurrentGameNumber())}<br>
      <strong>Estrellas:</strong> ${escapeHtml(sessionLog.starCount || 0)}<br>
      <strong>Respuestas guardadas:</strong> ${totalAnswers}<br>
      <strong>Correctas:</strong> ${totalCorrect}<br>
      <strong>Incorrectas:</strong> ${totalAnswers - totalCorrect}
    </div>
  `;

  const events = Array.isArray(sessionLog.events) ? sessionLog.events : [];
  const eventsHtml = `
    <div class="recordPhase">
      <h3>Eventos de partida</h3>
      ${events.length
        ? events.map((event) => `
          <div class="recordItem">
            <strong>Partida ${escapeHtml(event.gameNumber || 1)} · ${escapeHtml(formatDateTime(event.happenedAt))}</strong><br>
            <span><strong>Fase:</strong> ${escapeHtml(phaseLabel(event.phase))}</span><br>
            <span><strong>Evento:</strong> ${escapeHtml(event.description)}</span>
          </div>
        `).join("")
        : "<p>Aún no hay reinicios registrados.</p>"}
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
        <strong>${index + 1}. ${entry.isCorrect ? "Correcta" : "Incorrecta"}${entry.resetExcluded ? " (fase reiniciada)" : ""}</strong><br>
        <span><strong>Partida:</strong> ${escapeHtml(entry.gameNumber || 1)}</span><br>
        <span><strong>Operación:</strong> ${escapeHtml(operationLabel(entry.operation))}</span><br>
        <span><strong>Problema:</strong> ${escapeHtml(entry.problem)}</span><br>
        <span><strong>Respuesta del estudiante:</strong> ${escapeHtml(entry.studentAnswer)}</span><br>
        <span><strong>Respuesta correcta:</strong> ${escapeHtml(entry.correctAnswer)}</span><br>
        <span><strong>Estrellas ganadas:</strong> ${escapeHtml(entry.starsEarned || 0)}</span><br>
        <span><strong>Retroalimentación:</strong> ${escapeHtml(entry.feedback)}</span>
      </div>
    `).join("");
    return `${header}${items}</div>`;
  }).join("");

  errorsList.innerHTML = summaryHtml + eventsHtml + phaseHtml;
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

function formatDateTime(value) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function buildLeaderboardRows() {
  const byStudent = new Map();
  Object.values(loadStoredSessions()).forEach((session) => {
    const key = session.studentName.toLowerCase();
    const entries = getSessionEntries(session);
    const currentGameNumber = Math.max(1, Number(session.gameNumber) || 1);
    const activeEntries = entries.filter((entry) => !entry.resetExcluded && (Number(entry.gameNumber) || 1) === currentGameNumber);
    const correctCount = activeEntries.filter((entry) => entry.isCorrect).length;
    const score = Number(session.starCount) || 0;
    const updatedAt = session.updatedAt || session.startedAt || "";
    const current = byStudent.get(key);
    const shouldReplace = !current
      || score > current.score
      || (score === current.score && new Date(updatedAt) > new Date(current.updatedAt));

    if (shouldReplace) {
      byStudent.set(key, {
        name: session.studentName,
        score,
        correctCount,
        gameNumber: currentGameNumber,
        updatedAt,
      });
    }
  });

  return Array.from(byStudent.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
}

function renderLeaderboards() {
  const rows = buildLeaderboardRows();
  if (leaderboardBodyEl) {
    leaderboardBodyEl.innerHTML = rows.length
      ? rows.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.score)}</td>
          <td>${escapeHtml(row.gameNumber)}</td>
        </tr>
      `).join("")
      : "<tr><td colspan=\"4\">Aún no hay puntajes guardados.</td></tr>";
  }
}

function openLeaderboard() {
  if (!leaderboardModalEl) return;
  renderLeaderboards();
  leaderboardModalEl.hidden = false;
  syncCloudSessions({ updateActiveSession: false }).then((ok) => {
    if (ok && !leaderboardModalEl.hidden) {
      renderLeaderboards();
    }
  });
}

function closeLeaderboard() {
  if (!leaderboardModalEl) return;
  leaderboardModalEl.hidden = true;
}

function getCurrentLeaderboardPosition() {
  const rows = buildLeaderboardRows();
  const key = String(studentName || "").toLowerCase();
  const index = rows.findIndex((row) => row.name.toLowerCase() === key);
  return {
    rank: index >= 0 ? index + 1 : (rows.length ? rows.length : 1),
    total: Math.max(1, rows.length),
  };
}

function openFinalCelebration() {
  if (!finalCelebrationModalEl) return;
  renderLeaderboards();
  const ranking = getCurrentLeaderboardPosition();
  if (finalScoreValueEl) {
    finalScoreValueEl.textContent = String(sessionLog ? Number(sessionLog.starCount) || 0 : 0);
  }
  if (finalRankValueEl) {
    finalRankValueEl.textContent = String(ranking.rank);
  }
  if (finalRankTotalEl) {
    finalRankTotalEl.textContent = String(ranking.total);
  }
  closeGameMenu();
  finalCelebrationModalEl.hidden = false;
}

function closeFinalCelebration() {
  if (!finalCelebrationModalEl) return;
  finalCelebrationModalEl.hidden = true;
}

function getSessionEntries(session) {
  return PHASES.flatMap((phaseKey) => session.phases[phaseKey] || []);
}

function getSessionEvents(session) {
  return Array.isArray(session.events) ? session.events : [];
}

function openTeacherLogin() {
  if (!teacherModalEl) return;
  teacherModalEl.classList.add("open");
  if (teacherPasswordInputEl) {
    teacherPasswordInputEl.value = "";
    setTimeout(() => teacherPasswordInputEl.focus(), 0);
  }
  if (teacherLoginErrorEl) {
    teacherLoginErrorEl.textContent = "";
  }
}

function closeTeacherLogin() {
  if (!teacherModalEl) return;
  teacherModalEl.classList.remove("open");
}

function handleTeacherLogin(event) {
  event.preventDefault();
  const password = teacherPasswordInputEl ? teacherPasswordInputEl.value.trim() : "";
  if (password !== TEACHER_PASSWORD) {
    if (teacherLoginErrorEl) {
      teacherLoginErrorEl.textContent = "Clave incorrecta. Intenta nuevamente.";
    }
    if (teacherPasswordInputEl) {
      teacherPasswordInputEl.select();
    }
    return;
  }

  closeTeacherLogin();
  openTeacherDashboard();
}

async function openTeacherDashboard() {
  if (!teacherDashboardEl) return;
  await syncCloudSessions();
  renderTeacherDashboard();
  teacherDashboardEl.hidden = false;
}

function closeTeacherDashboard() {
  if (!teacherDashboardEl) return;
  teacherDashboardEl.hidden = true;
}

function renderTeacherDashboard() {
  if (!teacherRecordsEl || !teacherSummaryEl) return;
  renderLeaderboards();
  const sessions = Object.values(loadStoredSessions())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (sessions.length === 0) {
    teacherSummaryEl.textContent = "Todavía no hay registros guardados.";
    teacherRecordsEl.innerHTML = "<p class=\"emptyTeacherState\">Cuando los estudiantes respondan, sus datos aparecerán aquí.</p>";
    return;
  }

  const allEntries = sessions.flatMap(getSessionEntries);
  const allEvents = sessions.flatMap(getSessionEvents);
  const totalCorrect = allEntries.filter((entry) => entry.isCorrect).length;
  const studentCount = new Set(sessions.map((session) => session.studentName.toLowerCase())).size;
  const totalStars = sessions.reduce((sum, session) => sum + (Number(session.starCount) || 0), 0);
  teacherSummaryEl.textContent = `${studentCount} estudiante(s), ${sessions.length} sesión(es), ${allEntries.length} respuesta(s), ${totalCorrect} correcta(s), ${allEntries.length - totalCorrect} incorrecta(s), ${allEvents.length} evento(s), ${totalStars} estrella(s).`;

  teacherRecordsEl.innerHTML = sessions.map(renderTeacherSession).join("");
}

function renderTeacherSession(session) {
  const entries = getSessionEntries(session);
  const events = getSessionEvents(session);
  const correctCount = entries.filter((entry) => entry.isCorrect).length;
  const eventBlock = renderTeacherEvents(session);
  const phaseBlocks = PHASES.map((phaseKey) => renderTeacherPhase(session, phaseKey)).join("");

  return `
    <details class="teacherSession">
      <summary class="teacherSessionHeader">
        <div>
          <h3>${escapeHtml(session.studentName)}</h3>
          <p>Inicio: ${formatDateTime(session.startedAt)} · Última actividad: ${formatDateTime(session.updatedAt)}</p>
          <span class="teacherToggleLabel">respuestas del estudiante</span>
        </div>
        <div class="teacherSessionStats">
          <span>Partida ${Number(session.gameNumber) || 1}</span>
          <span>${entries.length} respuestas</span>
          <span>${correctCount} correctas</span>
          <span>${entries.length - correctCount} incorrectas</span>
          <span>${events.length} eventos</span>
          <span>${Number(session.starCount) || 0} estrellas</span>
        </div>
      </summary>
      <div class="teacherSessionBody">
        <div class="teacherPhaseGrid">${eventBlock}${phaseBlocks}</div>
      </div>
    </details>
  `;
}

function renderTeacherEvents(session) {
  const events = getSessionEvents(session);
  const rows = events.map((event, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${formatDateTime(event.happenedAt)}</td>
      <td>${escapeHtml(event.gameNumber || 1)}</td>
      <td>${escapeHtml(phaseLabel(event.phase))}</td>
      <td>${escapeHtml(event.description)}</td>
    </tr>
  `).join("");

  return `
    <details class="teacherPhase" ${events.length ? "open" : ""}>
      <summary>
        <strong>Eventos de partida</strong>
        <span>${events.length} evento(s)</span>
      </summary>
      ${events.length ? `
        <div class="teacherTableWrap">
          <table class="teacherTable teacherEventsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Partida</th>
                <th>Fase</th>
                <th>Evento</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      ` : "<p class=\"emptyTeacherState\">Aún no hay reinicios registrados.</p>"}
    </details>
  `;
}

function renderTeacherPhase(session, phaseKey) {
  const entries = session.phases[phaseKey] || [];
  const correctCount = entries.filter((entry) => entry.isCorrect).length;
  const rows = entries.map((entry, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${formatDateTime(entry.answeredAt)}</td>
      <td>${escapeHtml(entry.gameNumber || 1)}</td>
      <td>${escapeHtml(operationLabel(entry.operation))}</td>
      <td>${escapeHtml(entry.problem)}</td>
      <td>${escapeHtml(entry.studentAnswer)}</td>
      <td>${escapeHtml(entry.correctAnswer)}</td>
      <td>${escapeHtml(entry.starsEarned || 0)}</td>
      <td><span class="answerStatus ${entry.isCorrect ? "ok" : "bad"}">${entry.isCorrect ? "Correcta" : "Incorrecta"}${entry.resetExcluded ? " (reiniciada)" : ""}</span></td>
    </tr>
  `).join("");

  return `
    <details class="teacherPhase" ${entries.length ? "open" : ""}>
      <summary>
        <strong>${phaseLabel(phaseKey)}</strong>
        <span>${entries.length} respuestas · ${correctCount} correctas · ${entries.length - correctCount} incorrectas</span>
      </summary>
      ${entries.length ? `
        <div class="teacherTableWrap">
          <table class="teacherTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Partida</th>
                <th>Operación</th>
                <th>Problema</th>
                <th>Respuesta</th>
                <th>Correcta</th>
                <th>Estrellas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      ` : "<p class=\"emptyTeacherState\">Aún no hay respuestas en esta fase.</p>"}
    </details>
  `;
}

async function exportAllRecords() {
  await syncCloudSessions();
  const sessions = loadStoredSessions();
  const data = {
    exportedAt: new Date().toISOString(),
    sessions: Object.values(sessions),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "registros-ruta-numerica.json";
  link.click();
  URL.revokeObjectURL(url);
}

function splitStudentName(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function openStudentModal(forceNewSession = false) {
  studentModalEl.classList.add("open");
  const storedName = studentName || localStorage.getItem(STORAGE_KEYS.currentStudent) || "";
  const parts = forceNewSession ? { firstName: "", lastName: "" } : splitStudentName(storedName);
  if (forceNewSession) {
    studentNameInputEl.value = "";
  } else {
    studentNameInputEl.value = parts.firstName;
  }
  if (studentLastNameInputEl) {
    studentLastNameInputEl.value = parts.lastName;
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
  addSessionEvent("session-start", "Registro de estudiante iniciado.", phase);
  setStudentNameUI();
  closeStudentModal();
  errorsPanel.style.display = "none";
  resetPhaseUI();
  updatePhaseButtons();
  startPhaseGame();
  showMainMenu("inicio");
}

function activateStoredSession(storedSession) {
  sessionLog = normalizeSessionLog(storedSession);
  studentName = sessionLog.studentName;
  phase = sessionLog.currentPhase;
  unlockedIndex = getUnlockedIndexFromSession(sessionLog);
  localStorage.setItem(STORAGE_KEYS.currentStudent, studentName);
  localStorage.setItem(STORAGE_KEYS.currentSession, sessionLog.id);
  addSessionEvent("session-resume", "Sesión del estudiante retomada.", phase);
  setStudentNameUI();
  return true;
}

function logoutStudent() {
  if (drawState.active) stopGraphicDraw();
  saveCurrentGameState(false);
  addSessionEvent("session-exit", "El estudiante salió de la sesión.", phase);
  closeFinalCelebration();
  studentName = "";
  sessionLog = null;
  phase = "concreta";
  unlockedIndex = 0;
  game.questions = [];
  game.current = 0;
  game.answer = 0;
  game.locked = false;
  localStorage.removeItem(STORAGE_KEYS.currentStudent);
  localStorage.removeItem(STORAGE_KEYS.currentSession);
  setStudentNameUI();
  closeTeacherLogin();
  closeTeacherDashboard();
  closeStudentModal();
  errorsPanel.style.display = "none";
  errorsList.innerHTML = "";
  resetPhaseUI();
  updatePhaseButtons();
  showMainMenu("inicio");
  openStudentModal(true);
}

async function handleStudentSubmit(event) {
  event.preventDefault();
  const firstName = studentNameInputEl.value.trim();
  const lastName = studentLastNameInputEl ? studentLastNameInputEl.value.trim() : "";
  if (!firstName) {
    studentNameInputEl.focus();
    return;
  }
  if (!lastName && studentLastNameInputEl) {
    studentLastNameInputEl.focus();
    return;
  }
  const name = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
  await syncCloudSessions();
  const existingSession = getSessionByStudent(name);
  if (existingSession) {
    activateStoredSession(existingSession);
    closeStudentModal();
    errorsPanel.style.display = "none";
    resetPhaseUI();
    updatePhaseButtons();
    restoreCurrentGame();
    showSavedView();
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
      return activateStoredSession(storedSession);
    }
  }

  const storedStudent = localStorage.getItem(STORAGE_KEYS.currentStudent) || "";
  const storedSessionId = localStorage.getItem(STORAGE_KEYS.currentSession) || "";
  const storedSession = storedSessionId ? getSessionById(storedSessionId) : null;

  if (studentParam) {
    const studentSession = getSessionByStudent(studentParam);
    if (studentSession) {
      return activateStoredSession(studentSession);
    }
  }

  if (storedStudent && storedSession && storedSession.studentName === storedStudent) {
    return activateStoredSession(storedSession);
  }

  setStudentNameUI();
  return false;
}

function createQuestionsForPhase(phaseKey = phase) {
  if (phaseKey === "simbolica") {
    return generateBalancedQuestions(makeQuestion, OPS);
  }
  if (phaseKey === "grafica") {
    return generateBalancedQuestions(makeQuestionGrafica, OPS_GRAFICA);
  }
  if (phaseKey === "concreta" || phaseKey === "complementaria") {
    return generateBalancedQuestions(makeQuestionConcrete, OPS_CONCRETE);
  }
  return Array.from({ length: TOTAL_QUESTIONS }, makeQuestionConcrete);
}

function recalculateStarCount() {
  if (!sessionLog) return;
  const currentGameNumber = getCurrentGameNumber();
  sessionLog.starCount = PHASES
    .flatMap((phaseKey) => sessionLog.phases[phaseKey] || [])
    .filter((entry) => entry.isCorrect && !entry.resetExcluded && (Number(entry.gameNumber) || 1) === currentGameNumber)
    .reduce((sum, entry) => sum + (Number(entry.starsEarned) || POINTS_PER_CORRECT_ANSWER), 0);
  updateStarCountUI();
}

function clearPhaseProgress(phaseKey) {
  if (!sessionLog) return;
  if (!sessionLog.phases) {
    sessionLog.phases = createEmptyPhaseBuckets();
  }
  const currentGameNumber = getCurrentGameNumber();
  const entries = sessionLog.phases[phaseKey] || [];
  entries.forEach((entry) => {
    if ((Number(entry.gameNumber) || 1) === currentGameNumber) {
      entry.resetExcluded = true;
    }
  });
  recalculateStarCount();
}

function startPhaseGame(options = {}) {
  const { clearCurrentPhase = false, saveState = true } = options;
  errores = [];
  errorsPanel.style.display = "none";
  errorsList.innerHTML = "";

  if (clearCurrentPhase) {
    clearPhaseProgress(phase);
  }

  game.questions = createQuestionsForPhase(phase);
  game.current = 0;
  game.answer = 0;
  game.locked = false;
  updateProgressBar(0);
  loadQuestion();
  if (saveState) {
    saveCurrentGameState(false);
    saveSessionLog();
  }
}

function restoreCurrentGame() {
  if (!sessionLog || !sessionLog.gameState || !Array.isArray(sessionLog.gameState.questions)) {
    startPhaseGame();
    return;
  }
  const savedState = sessionLog.gameState;
  phase = PHASES.includes(savedState.phase) ? savedState.phase : "concreta";
  game.questions = savedState.questions;
  game.current = Math.max(0, Math.min(Number(savedState.current) || 0, game.questions.length));
  game.answer = 0;
  game.locked = false;
  resetPhaseUI();
  updatePhaseButtons();
  if (savedState.completed || game.current >= game.questions.length) {
    game.current = game.questions.length;
    finishGame();
    return;
  }
  loadQuestion();
}

function startNewGame(askConfirmation = true) {
  if (!sessionLog) return;
  if (askConfirmation) {
    const ok = window.confirm("Nueva partida borrará el progreso visible del estudiante: estrellas, fases desbloqueadas y partida actual. El panel del profesor conservará el registro. ¿Deseas continuar?");
    if (!ok) return;
  }

  closeFinalCelebration();
  phase = "concreta";
  unlockedIndex = 0;
  sessionLog.gameNumber = getCurrentGameNumber() + 1;
  sessionLog.starCount = 0;
  sessionLog.currentPhase = phase;
  sessionLog.unlockedIndex = unlockedIndex;
  sessionLog.gameState = null;
  updateStarCountUI();
  resetPhaseUI();
  updatePhaseButtons();
  addSessionEvent("new-game", "Nueva partida iniciada: se borró todo el progreso anterior.", phase);
  startPhaseGame();
  showGameView("juegos");
}

function confirmNewGame() {
  startNewGame(true);
}

function confirmPhaseRestart() {
  if (!sessionLog) return;
  const ok = window.confirm(`Se reiniciará solo ${phaseLabel(phase)}. Las demás fases se conservarán y el panel del profesor mantendrá el registro. ¿Deseas continuar?`);
  if (!ok) return;

  addSessionEvent("phase-restart", `Reinicio de ${phaseLabel(phase)}: se reinició el progreso de esta fase.`, phase);
  startPhaseGame({ clearCurrentPhase: true });
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
    drawStatementBEl.textContent = "Toca una figura para restar.";
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
    updateCheckButtonState();
    return;
  }

  drawCountAEl.textContent = String(countA);
  drawCountBEl.textContent = String(countB);
  updateCheckButtonState();
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
    const zoneWidth = drawState.zone.clientWidth || GRAPHIC_TAP_SHAPE_SIZE;
    const zoneHeight = drawState.zone.clientHeight || GRAPHIC_TAP_SHAPE_SIZE;
    const size = Math.min(GRAPHIC_TAP_SHAPE_SIZE, zoneWidth, zoneHeight);
    const left = Math.max(0, Math.min(drawState.startX - size / 2, zoneWidth - size));
    const top = Math.max(0, Math.min(drawState.startY - size / 2, zoneHeight - size));

    drawState.preview.style.left = `${left}px`;
    drawState.preview.style.top = `${top}px`;
    drawState.preview.style.width = `${size}px`;
    drawState.preview.style.height = `${size}px`;
    drawState.preview.classList.remove("preview");
  } else {
    drawState.preview.classList.remove("preview");
  }

  const q = game.questions[game.current];
  if (phase === "grafica" && q && q.op.sym === "-" && drawState.zone === drawZoneAEl) {
    drawState.preview.addEventListener("click", handleGraphicSubtractionClick);
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
  if (typeof e.button === "number" && e.button !== 0) return;
  if (game.locked) return;
  if (e.cancelable) e.preventDefault();
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
    zone.addEventListener("pointerdown", (e) => {
      if (e.target !== zone) return;
      const q = game.questions[game.current];
      if (phase === "grafica" && q && q.op.sym === "-" && zone === drawZoneBEl) return;
      if (typeof zone.setPointerCapture === "function") {
        zone.setPointerCapture(e.pointerId);
      }
      startGraphicDraw(zone, e);
    });

    zone.addEventListener("pointermove", (e) => {
      updateGraphicPreview(e.clientX, e.clientY, e.shiftKey);
    });
    zone.addEventListener("pointerup", (e) => {
      if (typeof zone.hasPointerCapture === "function" && zone.hasPointerCapture(e.pointerId)) {
        zone.releasePointerCapture(e.pointerId);
      }
      stopGraphicDraw();
    });
    zone.addEventListener("pointercancel", stopGraphicDraw);
  });
}

function loadQuestion() {
  const q = game.questions[game.current];
  game.answer = 0;
  game.locked = false;
  setPhaseCompleteActions(false);
  answerBarEl.style.display = "";
  answerSummaryWrapEl.style.display = "";
  updateAnswerLabel();
  updateAnswerInputVisibility();

  qIndexEl.textContent = String(game.current + 1);
  updateProgressBar(game.current);
  saveCurrentGameState(false);
  saveSessionLog();

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
  updateCheckButtonState();
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
    if (tokensHintEl) {
      tokensHintEl.textContent = "Arrastra las fichas para responder.";
    }
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
    if (tokensHintEl) {
      tokensHintEl.textContent = "Arrastra una ficha a cada grupo para agregarla.";
    }
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
  updateCheckButtonState();
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
    mathOpEl.textContent = "Dibuja la cantidad inicial, resta tocando las figuras y escribe el resultado.";
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
  updateCheckButtonState();
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
  updateCheckButtonState();
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
    <div class="concrete-hint">Tacha tocando las fichas.</div>
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
  updateCheckButtonState();
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
    group.setAttribute("aria-label", `Grupo ${i + 1}. Arrastra una ficha aquí.`);
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
  updateCheckButtonState();
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
function canStartTokenDrag(token) {
  const q = game.questions[game.current];
  return Boolean(
    !game.locked
    && phase === "concreta"
    && q
    && token
    && token.key === q.token.key
    && q.op.sym !== "-"
  );
}

function positionTokenGhost(clientX, clientY) {
  if (!tokenDragState.ghost) return;
  tokenDragState.ghost.style.left = `${clientX}px`;
  tokenDragState.ghost.style.top = `${clientY}px`;
}

function getTokenDropTarget(clientX, clientY) {
  const q = game.questions[game.current];
  const el = document.elementFromPoint(clientX, clientY);
  if (!q || !el) return null;

  if (q.op.sym === "+") {
    const target = el.closest("#dropzone");
    return target === dropzoneEl ? dropzoneEl : null;
  }

  if (q.op.sym === "×" || q.op.sym === "÷") {
    const group = el.closest(".group");
    return group && groupEls.includes(group) ? group : null;
  }

  return null;
}

function setTokenDragTarget(target) {
  if (tokenDragState.currentTarget === target) return;
  if (tokenDragState.currentTarget) {
    tokenDragState.currentTarget.classList.remove("dragover");
  }
  tokenDragState.currentTarget = target;
  if (target) {
    target.classList.add("dragover");
  }
}

function moveTokenDrag(event) {
  if (!tokenDragState.active || event.pointerId !== tokenDragState.pointerId) return;
  if (event.cancelable) event.preventDefault();
  positionTokenGhost(event.clientX, event.clientY);
  setTokenDragTarget(getTokenDropTarget(event.clientX, event.clientY));
}

function cleanupTokenDrag() {
  if (tokenDragState.currentTarget) {
    tokenDragState.currentTarget.classList.remove("dragover");
  }
  if (tokenDragState.ghost) {
    tokenDragState.ghost.remove();
  }
  if (tokenDragState.sourceEl) {
    tokenDragState.sourceEl.classList.remove("dragSource");
  }
  window.removeEventListener("pointermove", moveTokenDrag);
  window.removeEventListener("pointerup", finishTokenDrag);
  window.removeEventListener("pointercancel", cancelTokenDrag);
  tokenDragState = {
    active: false,
    token: null,
    ghost: null,
    currentTarget: null,
    pointerId: null,
  };
}

function finishTokenDrag(event) {
  if (!tokenDragState.active || event.pointerId !== tokenDragState.pointerId) return;
  if (event.cancelable) event.preventDefault();
  moveTokenDrag(event);
  const target = tokenDragState.currentTarget;
  const token = tokenDragState.token;
  if (target && token) {
    if (target === dropzoneEl) {
      addTokenToAnswer(token);
    } else {
      addTokenToGroup(target, token);
    }
  }
  cleanupTokenDrag();
}

function cancelTokenDrag(event) {
  if (event && tokenDragState.active && event.pointerId !== tokenDragState.pointerId) return;
  cleanupTokenDrag();
}

function startTokenDrag(token, sourceEl, event) {
  if (typeof event.button === "number" && event.button !== 0) return;
  if (!canStartTokenDrag(token)) return;
  if (event.cancelable) event.preventDefault();

  const ghost = sourceEl.cloneNode(true);
  ghost.classList.add("tokenDragGhost");
  ghost.removeAttribute("id");
  document.body.appendChild(ghost);
  sourceEl.classList.add("dragSource");

  tokenDragState = {
    active: true,
    token,
    ghost,
    currentTarget: null,
    pointerId: event.pointerId,
    sourceEl,
  };

  positionTokenGhost(event.clientX, event.clientY);
  window.addEventListener("pointermove", moveTokenDrag, { passive: false });
  window.addEventListener("pointerup", finishTokenDrag, { passive: false });
  window.addEventListener("pointercancel", cancelTokenDrag);
}

function createDraggableToken(token) {
  const el = document.createElement("div");
  el.className = "token";
  el.draggable = false;
  el.dataset.tokenKey = token.key;
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", `Ficha de ${token.label}. Arrástrala a la respuesta.`);

  const img = document.createElement("img");
  img.src = token.img;
  img.alt = token.key;

  el.appendChild(img);

  el.addEventListener("pointerdown", (event) => startTokenDrag(token, el, event));

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
  updateCheckButtonState();
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
  updateCheckButtonState();
}

function checkAnswer() {
  if (game.locked || !canCheckCurrentAnswer()) {
    updateCheckButtonState();
    return;
  }
  game.locked = true;
  updateCheckButtonState();
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
  if (sessionLog) {
    const nextQuestionIndex = game.current + 1;
    updateProgressBar(nextQuestionIndex);
    sessionLog.gameState = {
      phase,
      questions: game.questions,
      current: nextQuestionIndex,
      completed: nextQuestionIndex >= TOTAL_QUESTIONS,
    };
    saveSessionLog();
  }

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

function getNextPhase() {
  const idx = PHASES.indexOf(phase);
  if (idx < 0 || idx >= PHASES.length - 1) return null;
  return PHASES[idx + 1];
}

function setPhaseCompleteActions(isVisible) {
  if (!phaseCompleteActionsEl) return;
  const nextPhase = getNextPhase();
  phaseCompleteActionsEl.hidden = !isVisible;
  if (nextPhaseBtnEl) {
    nextPhaseBtnEl.hidden = !nextPhase;
    nextPhaseBtnEl.disabled = !nextPhase;
  }
}

function goToNextPhase() {
  const nextPhase = getNextPhase();
  if (!nextPhase) return;
  setPhase(nextPhase);
}

function finishGame() {
  stopGraphicDraw();
  const completedAllPhases = phase === PHASES[PHASES.length - 1];
  const phaseEndTitle = completedAllPhases ? "¡Ruta completada!" : "¡Fase completada!";
  const phaseEndMessage = completedAllPhases
    ? "Terminaste todas las fases de Ruta Numérica."
    : "Puedes continuar con la siguiente fase desbloqueada o volver al inicio.";
  updateProgressBar(TOTAL_QUESTIONS);
  graphicWorkspaceEl.style.display = "none";
  inputAnswerWrapEl.style.display = "none";
  answerBarEl.style.display = "none";
  answerSummaryWrapEl.style.display = "none";
  clearBtnEl.style.display = "none";
  checkBtnEl.style.display = "none";
  dropzoneEl.style.display = "none";
  if (phase === "concreta") {
    optionsWrapEl.style.display = "none";
    visualConcreteEl.textContent = phaseEndTitle;
    visualConcreteEl.style.display = "flex";
    concreteSubEl.style.display = "none";
  } else {
    optionsWrapEl.style.display = "none";
    visualOpEl.textContent = phaseEndTitle;
    mathOpEl.textContent = phaseEndMessage;
  }
  tokenPoolEl.innerHTML = "";
  clearDropzoneVisuals();
  answerCountEl.textContent = "0";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  unlockNextPhase();
  setPhaseCompleteActions(!completedAllPhases);
  answerPanelEl.style.display = completedAllPhases ? "none" : "";
  saveCurrentGameState(true);
  addSessionEvent("phase-complete", `${phaseLabel(phase)} completada.`, phase);
  saveSessionLog();
  if (completedAllPhases) {
    openFinalCelebration();
  }
}

function resetPhaseUI() {
  setPhaseCompleteActions(false);
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
        if (target === phase) {
          closeGameMenu();
          return;
        }
        setPhase(target);
        closeGameMenu();
      }
    });
  });
}

function setPhase(nextPhase) {
  phase = nextPhase;
  resetPhaseUI();
  updatePhaseButtons();
  addSessionEvent("phase-start", `${phaseLabel(nextPhase)} iniciada.`, nextPhase);
  startPhaseGame();
}

function unlockNextPhase() {
  const idx = PHASES.indexOf(phase);
  if (idx >= unlockedIndex && idx < PHASES.length - 1) {
    unlockedIndex = idx + 1;
    updatePhaseButtons();
    saveSessionLog();
  }
}

function updatePhaseButtons() {
  phaseBtns.forEach((btn) => {
    const p = btn.dataset.phase;
    const idx = PHASES.indexOf(p);
    btn.disabled = idx > unlockedIndex;
    btn.classList.toggle("active", p === phase);
  });

  menuPhaseCards.forEach((card) => {
    const p = card.dataset.phaseCard;
    const idx = PHASES.indexOf(p);
    const isLocked = idx > unlockedIndex;
    card.classList.toggle("locked", isLocked);
    card.classList.toggle("active", p === phase);
  });

  playPhaseBtns.forEach((btn) => {
    const phaseKey = btn.dataset.phase;
    const idx = PHASES.indexOf(phaseKey);
    const isLocked = idx > unlockedIndex;
    btn.disabled = isLocked;
    btn.setAttribute("aria-label", isLocked ? `${phaseLabel(phaseKey)} bloqueada` : `Jugar ${phaseLabel(phaseKey)}`);
    if (!btn.classList.contains("phaseImageButton")) {
      btn.textContent = isLocked ? "Bloqueado" : "Jugar";
    }
  });

  adventureSteps.forEach((step, index) => {
    step.classList.toggle("active", index <= unlockedIndex);
  });
}

async function initApp() {
  setupBrowserNavigation();
  initGraphicTools();
  initPhaseBar();
  renderLeaderboards();
  if (hydrateStudentSession()) {
    renderSessionLog();
    restoreCurrentGame();
    showSavedView();
  } else {
    showMainMenu("inicio");
    openStudentModal();
  }
  syncCloudSessions({ updateActiveSession: Boolean(sessionLog) }).then((ok) => {
    if (!ok) return;
    renderLeaderboards();
    if (sessionLog) {
      renderSessionLog();
    }
  });
}

// ======= Start =======
initApp();

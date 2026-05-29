let userName = "";

function createQuizState(totalQuestions) {
  return {
    index: 0,
    totalQuestions,
    answers: Array(totalQuestions).fill(null),
    completed: false,
  };
}

function selectAnswer(state, answerId) {
  const answers = [...state.answers];
  answers[state.index] = answerId;
  return { ...state, answers };
}

function advanceQuiz(state) {
  if (!state.answers[state.index]) return state;
  if (state.index >= state.totalQuestions - 1) return { ...state, completed: true };
  return { ...state, index: state.index + 1 };
}

function createProposalState() {
  return {
    mood: "hopeful",
    showMaybe: true,
    acceptEmphasis: false,
    accepted: false,
  };
}

function softenProposal(state) {
  return {
    ...state,
    mood: "softened",
    showMaybe: false,
    acceptEmphasis: true,
  };
}

function acceptProposal(state) {
  return {
    ...state,
    mood: "accepted",
    showMaybe: false,
    acceptEmphasis: true,
    accepted: true,
  };
}

function getRunawayPosition({
  viewportWidth,
  viewportHeight,
  buttonWidth,
  buttonHeight,
  seed = Math.random(),
}) {
  const padding = 16;
  const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
  const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);
  const normalizedSeed = Math.abs(Math.sin(seed * 10000));
  const secondarySeed = Math.abs(Math.cos((seed + 0.37) * 10000));

  return {
    x: Math.round(padding + (maxX - padding) * normalizedSeed),
    y: Math.round(padding + (maxY - padding) * secondarySeed),
  };
}

const scenes = ["landing", "quiz", "result", "story", "gallery", "gift", "proposal", "final"];

const quizQuestions = [
  {
    season: "spring",
    label: "ใบไม้ผลิ",
    question: "วันนี้สนุกมั้ย",
    options: [
      { text: "สนุกกกก", score: 20 },
      { text: "อืมม.. ไม่รู้สิ นิด ๆ ละมั้ง", score: 10 },
      { text: "ม่าย น่าเบื่อมาก", score: 0 },
    ],
  },
  {
    season: "summer",
    label: "หน้าร้อน",
    question: "เจน่าอยู่กับเค้าแล้วมีความสุขมั้ย",
    options: [
      { text: "มากกกเลยล่ะ", score: 20 },
      { text: "ก็นะ", score: 10 },
      { text: "ทุกข์ยากเลยล่ะ", score: 0 },
    ],
  },
  {
    season: "rain",
    label: "หน้าฝน",
    question: "วันแรกที่เราคุยกันคืออออ",
    isDateQuestion: true,
    correctAnswer: 0,
    options: [
      { text: "14 feb", score: 0, daysOff: 0 },
      { text: "15 feb", score: 0, daysOff: 1 },
      { text: "16 feb", score: 0, daysOff: 2 },
    ],
  },
  {
    season: "winter",
    label: "ฤดูหนาว",
    question: "ตอนที่เจน่ารู้สึกเหนื่อยหรือเจอเรื่องแย่ๆ มา เค้าคือคนแรกที่เจน่าคิดถึงหรือเปล่า?",
    options: [
      { text: "คิดถึงเป็นคนแรกเลยย", score: 20 },
      { text: "มีบ้างง", score: 10 },
      { text: "ไม่รู้สิ", score: 0 },
    ],
  },
  {
    season: "autumn",
    label: "ใบไม้ร่วง",
    question: "เจน่ารู้สึกสบายใจที่จะใส่ชุดโทรมๆ หน้าสด หรือทำตัวบ้า ๆ บอ ๆ กับเค้า 100% หรือยัง?",
    options: [
      { text: "สบายใจหมดเลยย", score: 20 },
      { text: "ค่อนข้างมากเลยล่ะ", score: 15 },
      { text: "นิดนิด", score: 10 },
      { text: "ม่ายย", score: 0 },
    ],
  },
  {
    season: "stars",
    label: "ท้องฟ้าดาว",
    question: "เจน่าอยากมาเที่ยวกับเค้าแบบนี้อีกมั้ยย",
    options: [
      { text: "อยากกสุดสุดด", score: 20 },
      { text: "อาจจะยัง", score: 0 },
      { text: "แล้วแต่ใจฉัน ฮึ", score: 10 },
    ],
  },
];

const storyScenes = [
  {
    title: "วันที่เจน่าทักมาครั้งแรก",
    text: "วันที่เจน่าทักเค้ามาครั้งแรก เค้าไม่คิดอะไรจริงจังด้วยซ้ำ คุยไปขำ ๆ เล่น ๆ จนกระทั่งคุยไปเรื่อย ๆ เค้าเริ่มรู้สึกว่าเค้าเริ่มชอบคน ๆ นี้เข้าแล้วแบบไม่รู้ตัว",
  },
  {
    title: "ความรู้สึกที่เปลี่ยนไป จากที่อยู่คนเดียว",
    text: "ตั้งแต่เจน่าเข้ามาในชีวิตเค้าทำให้อะไรเปลี่ยนไปหลาย ๆ อย่าง จากที่เป็นคนที่ชอบอยู่คนเดียว ทำอะไรคนเดียว กลายเป็นคนที่คิดถึงเจน่าได้ถึงขนาดนี้ เวลาเค้าไม่ได้คุยกับเจน่าเค้าคิดถึงเจน่ามากมากเลยนะ",
  },
  {
    title: "เวลาที่อยู่ด้วยกัน",
    text: "เวลาที่เค้าได้ใช้เวลาร่วมกับเจน่า อย่างเล่นเกม คุยนั่นคุยนี่ เค้ามีความสุขมากเลยเค้าไม่ต้องฝืนอะไรเลยแล้วได้เป็นตัวของตัวเอง เหมือนเจน่ามาเปลี่ยนโลกที่เค้าไม่เคยพบเจอทำให้สดใสได้ขนาดนี้ เค้าชอบในความเป็นตัวเองของเจน่าที่สุดเลย",
  },
  {
    title: "ความในใจ",
    text: "เค้าอยากใช้เวลากับเจน่าให้มากกว่านี้ เค้าต้องการเจน่าในชีวิต ชีวิตที่มีเจน่าทำให้เค้าอบอุ่นหัวใจมากเลยล่ะ :D",
  },
];

let quizState = createQuizState(quizQuestions.length);
let proposalState = createProposalState();
let storyBgState = {
  initialized: false,
  currentTime: 0.0,
  targetTime: 0.0,
  stars: [],
  clouds: []
};
let storyIndex = 0;
let currentScene = "landing";
let currentSeason = "spring";
let resultPercent = 0;
let landingProgress = 0;
let celebrationUntil = 0;
let mobileNoPresses = 0;

let pixelTransition = {
  active: false,
  progress: 0,
  duration: 2500,
  startTime: 0,
  onMidpoint: null,
  onComplete: null
};

function startPixelTransition(onMidpoint, onComplete) {
  pixelTransition.active = true;
  pixelTransition.progress = 0;
  pixelTransition.startTime = performance.now();
  pixelTransition.onMidpoint = onMidpoint;
  pixelTransition.onComplete = onComplete;
}

const canvas = document.querySelector("#motion-canvas");
const ctx = canvas.getContext("2d");
const webglCanvas = document.querySelector("#webgl-scene");
const flash = document.querySelector("#flash");
const adminWarp = document.querySelector("#admin-warp");
const adminWarpToggle = document.querySelector("#admin-warp-toggle");
const adminWarpPanel = document.querySelector(".admin-warp-panel");
const quizCount = document.querySelector("#quiz-count");
const quizQuestion = document.querySelector("#quiz-question");
const quizOptions = document.querySelector("#quiz-options");
const quizNext = document.querySelector("#quiz-next");
const quizBack = document.querySelector("#quiz-back");
const storyCount = document.querySelector("#story-count");
const storyTitle = document.querySelector("#story-title");
const storyText = document.querySelector("#story-text");
const storyNext = document.querySelector("#story-next");
const galleryNext = document.querySelector("#gallery-next");
const proposalTitle = document.querySelector("#proposal-title");
const proposalNote = document.querySelector("#proposal-note");
const acceptBtn = document.querySelector("#accept-btn");
const maybeBtn = document.querySelector("#maybe-btn");
const proposalConfirm = document.querySelector("#proposal-confirm");
const confirmYes = document.querySelector("#confirm-yes");
const confirmNo = document.querySelector("#confirm-no");
const pixelBook = document.querySelector(".pixel-book");
const finalDate = document.querySelector("#final-date");
const finalShareBtn = document.querySelector("#final-share-btn");
const finalDownloadBtn = document.querySelector("#final-download-btn");
const openMemoryMail = document.querySelector("#open-memory-mail");
const photoLightbox = document.querySelector("#photo-lightbox");
const photoPreview = document.querySelector("#photo-preview");
const photoTitle = document.querySelector("#photo-title");
const photoClose = document.querySelector("#photo-close");
const photoFallback = document.querySelector("#photo-fallback");
const photoPrev = document.querySelector("#photo-prev");
const photoNext = document.querySelector("#photo-next");
const photoCounter = document.querySelector("#photo-counter");
const initialProposalTitle = proposalTitle.textContent;
const initialProposalNote = proposalNote.textContent;
const acceptBtnHome = acceptBtn.parentElement;
const acceptBtnNextSibling = acceptBtn.nextElementSibling;
const proposalNoMessages = [
  {
    title: "ไม่เป็นจริง ๆ เหรอ",
    note: "ปุ่มเป็นเริ่มโตขึ้นนิดนึงแล้วนะ ลองมองอีกทีได้มั้ย",
  },
  {
    title: "คิดใหม่อีกนิดได้มั้ย",
    note: "สมุดเล่มนี้แอบเชียร์คำตอบว่าเป็นอยู่เต็มหน้าเลย",
  },
  {
    title: "เจน่าอย่าทิ้งเค้า",
    note: "กดเป็นนะ นะ น้าาา",
  },
  {
    title: "เจน่าอย่าทิ้งเค้า",
    note: "แตะคำว่าเป็นได้เลย หน้านี้รอคำตอบนี้อยู่",
  },
];

const particles = [];
const bursts = [];
const twinkleStars = [];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let threeReady = false;
let threeWorld = null;
let finalPhotoIndex = 0;
const finalPhotos = [
  { source: "assets/jenaa.png", title: "Gallery" },
  { source: "assets/4uuuu.png", title: "Gallery" },
  { source: "assets/4444u.png", title: "Gallery" },
  { source: "assets/chosseu.png", title: "Gallery" },
  { source: "assets/jenaaa.jpg", title: "Gallery" },
  { source: "assets/oummm.jpg", title: "Gallery" },
];
const exportStickerImage = new Image();
exportStickerImage.src = window.OUMFLOWER_EXPORT_DATA_URL || "";

function showScene(sceneName) {
  currentScene = sceneName;
  document.body.dataset.scene = sceneName;
  scenes.forEach((scene) => {
    document.querySelector(`#${scene}`).classList.toggle("scene-active", scene === sceneName);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function detachAcceptButtonForFullscreen() {
  if (acceptBtn.parentElement !== document.body) {
    document.body.appendChild(acceptBtn);
  }
}

function restoreAcceptButtonHome() {
  if (acceptBtn.parentElement === acceptBtnHome) return;
  acceptBtnHome.insertBefore(acceptBtn, acceptBtnNextSibling);
}

function resetProposalForWarp() {
  proposalState = createProposalState();
  mobileNoPresses = 0;
  document.body.dataset.proposal = proposalState.mood;
  document.body.dataset.acceptGrow = "0";
  document.body.style.setProperty("--accept-grow", "0");
  proposalTitle.textContent = initialProposalTitle;
  proposalNote.textContent = initialProposalNote;
  maybeBtn.hidden = false;
  maybeBtn.classList.remove("is-floating");
  maybeBtn.style.removeProperty("left");
  maybeBtn.style.removeProperty("top");
  acceptBtn.classList.remove("is-emphasis", "is-mobile-growing", "is-fullscreen-choice");
  restoreAcceptButtonHome();
  pixelBook.classList.remove("is-closing");
  proposalConfirm.classList.remove("is-visible");
  proposalConfirm.setAttribute("aria-hidden", "true");
  updateProposal();
}

function adminWarpToScene(sceneName) {
  if (!scenes.includes(sceneName)) return;

  cleanGiftThreeWorld();
  flash.className = "flash";
  photoLightbox.classList.remove("is-visible");
  photoLightbox.setAttribute("aria-hidden", "true");
  photoPreview.removeAttribute("src");
  resetProposalForWarp();

  if (sceneName === "quiz") {
    quizState = createQuizState(quizQuestions.length);
    currentSeason = quizQuestions[0].season;
    renderQuiz();
  }

  if (sceneName === "result") {
    quizState = createQuizState(quizQuestions.length);
    quizState.answers = quizQuestions.map((_, index) => `${index}-0`);
    renderResult();
  }

  if (sceneName === "story") {
    storyIndex = 0;
    renderStory();
  }

  if (sceneName === "final") {
    resetProposalForWarp();
    finalDate.textContent = "โหมดทดสอบหน้า Final";
    celebrationUntil = Date.now() + 3500;
  }

  showScene(sceneName);
  if (sceneName === "gift") initGiftThreeWorld();
  if (sceneName === "landing") updateLandingProgress();
  if (adminWarp) adminWarp.classList.remove("is-open");
  if (adminWarpToggle) adminWarpToggle.setAttribute("aria-expanded", "false");
}

function updateLandingProgress() {
  if (currentScene !== "landing") return;
  const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
  landingProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  const skyProgress = smoothStep(0.28, 0.55, landingProgress);
  const cloudProgress = smoothStep(0.22, 0.56, landingProgress);
  const veilIn = smoothStep(0.24, 0.44, landingProgress);
  const veilOut = smoothStep(0.58, 0.78, landingProgress);
  const veilProgress = veilIn * (1 - veilOut);
  const forestProgress = smoothStep(0.6, 0.88, landingProgress);
  const textProgress = smoothStep(0.82, 0.98, landingProgress);

  document.documentElement.style.setProperty("--landing-progress", landingProgress.toFixed(3));
  document.documentElement.style.setProperty("--landing-space", (1 - skyProgress).toFixed(3));
  document.documentElement.style.setProperty("--landing-sky", skyProgress.toFixed(3));
  document.documentElement.style.setProperty("--landing-clouds", cloudProgress.toFixed(3));
  document.documentElement.style.setProperty("--landing-veil", veilProgress.toFixed(3));
  document.documentElement.style.setProperty("--landing-forest", forestProgress.toFixed(3));
  document.documentElement.style.setProperty("--landing-text", textProgress.toFixed(3));

  const brushTitle = document.querySelector(".brush-title");
  if (brushTitle) {
    const shouldShow = textProgress >= 0.6;
    brushTitle.classList.toggle("is-visible", shouldShow);
    brushTitle.classList.toggle("is-floating", textProgress >= 0.98);
  }
}

function smoothStep(start, end, value) {
  const x = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return x * x * (3 - 2 * x);
}

function initThreeWorld() {
  if (!window.THREE || !webglCanvas) return;

  try {
    const renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05071d, 9, 30);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
    camera.position.set(0, 1.1, 12);

    const ambient = new THREE.HemisphereLight(0xcceeff, 0x31235f, 2.2);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffdf8a, 2.4);
    sun.position.set(-4, 7, 5);
    scene.add(sun);

    const root = new THREE.Group();
    scene.add(root);

    const stars = createStarField();
    root.add(stars);

    const moon = createGlowSprite(256, ["rgba(255,248,190,1)", "rgba(255,210,96,0.25)", "rgba(255,210,96,0)"]);
    moon.scale.set(2.8, 2.8, 1);
    moon.position.set(-4.6, 3.15, -3.2);
    root.add(moon);

    const horizon = new THREE.Group();
    horizon.position.set(0, -2.15, -4);
    root.add(horizon);
    addHills(horizon);
    addWaterRibbons(horizon);
    const fireflies = createFireflies();
    root.add(fireflies);

    const storyLight = createGlowSprite(384, ["rgba(255,225,134,0.9)", "rgba(255,141,126,0.24)", "rgba(255,141,126,0)"]);
    storyLight.scale.set(8, 8, 1);
    storyLight.position.set(2.4, 0.65, -6);
    root.add(storyLight);

    threeWorld = {
      renderer,
      scene,
      camera,
      root,
      stars,
      moon,
      horizon,
      fireflies,
      storyLight,
      sun,
    };
    threeReady = true;
  } catch (error) {
    threeReady = false;
    threeWorld = null;
  }
}

function createStarField() {
  const starCount = 1400;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const color = new THREE.Color();

  for (let i = 0; i < starCount; i += 1) {
    const radius = 9 + Math.random() * 24;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.cos(phi) * radius * 0.7 + 1.8;
    positions[i * 3 + 2] = -Math.abs(Math.sin(phi) * Math.sin(theta) * radius) - 2;
    color.setHSL(0.58 + Math.random() * 0.04, 0.04, 0.86 + Math.random() * 0.14);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function addHills(group) {
  const hillColors = [0x5fd3c9, 0x5f90e8, 0x8e7af5, 0xffb38f];
  for (let i = 0; i < 5; i += 1) {
    const geometry = new THREE.PlaneGeometry(18 + i * 3, 4 + i * 0.9, 40, 1);
    const position = geometry.attributes.position;
    for (let point = 0; point < position.count; point += 1) {
      const x = position.getX(point);
      const y = position.getY(point);
      const wave = Math.sin(x * 0.72 + i * 1.7) * (0.35 + i * 0.05);
      position.setY(point, y + wave);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      color: hillColors[i % hillColors.length],
      transparent: true,
      opacity: 0.34 - i * 0.035,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const hill = new THREE.Mesh(geometry, material);
    hill.position.set(0, i * 0.52, -i * 2.5);
    hill.rotation.x = -0.36;
    group.add(hill);
  }
}

function addWaterRibbons(group) {
  for (let i = 0; i < 4; i += 1) {
    const geometry = new THREE.PlaneGeometry(16, 0.5 + i * 0.18, 32, 1);
    const material = new THREE.MeshBasicMaterial({
      color: i % 2 ? 0x9defff : 0xffffff,
      transparent: true,
      opacity: i % 2 ? 0.28 : 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ribbon = new THREE.Mesh(geometry, material);
    ribbon.position.set(0, -0.45 + i * 0.26, 1 - i * 0.75);
    ribbon.rotation.x = -1.1;
    ribbon.rotation.z = (i - 1.5) * 0.03;
    ribbon.userData.speed = 0.18 + i * 0.07;
    group.add(ribbon);
  }
}

function createFireflies() {
  const count = 60;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 13;
    positions[i * 3 + 1] = Math.random() * 5 - 1.6;
    positions[i * 3 + 2] = -2 - Math.random() * 10;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffdf74,
    size: 0.075,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

function createGlowSprite(size, stops) {
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = size;
  glowCanvas.height = size;
  const glowCtx = glowCanvas.getContext("2d");
  const center = size / 2;
  const gradient = glowCtx.createRadialGradient(center, center, 0, center, center, center);
  stops.forEach((color, index) => {
    gradient.addColorStop(index / (stops.length - 1), color);
  });
  glowCtx.fillStyle = gradient;
  glowCtx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(glowCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
}

let lastQuizIndex = -1;

function renderQuiz() {
  const item = quizQuestions[quizState.index];
  currentSeason = item.season;
  quizCount.textContent = `คำถามที่ ${quizState.index + 1} / ${quizQuestions.length} · ${item.label}`;
  let questionText = item.question;
  if (userName) {
    questionText = questionText.replace(/เธอ/g, userName);
  }
  quizQuestion.textContent = questionText;
  quizQuestion.classList.toggle("is-date-question", !!item.isDateQuestion);
  quizNext.disabled = !quizState.answers[quizState.index];
  quizOptions.replaceChildren(
    ...item.options.map((option, optionIndex) => {
      const answerId = `${item.season}-${optionIndex}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.textContent = option.text;
      button.classList.toggle("is-selected", quizState.answers[quizState.index] === answerId);
      button.addEventListener("click", () => {
        quizState = selectAnswer(quizState, answerId);
        renderQuiz();
      });
      return button;
    }),
  );

  if (quizBack) {
    quizBack.style.display = quizState.index > 0 ? "flex" : "none";
  }

  // Retrigger animation if question changed
  if (lastQuizIndex !== quizState.index) {
    const card = document.querySelector(".season-card");
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth; // force reflow
      card.style.animation = 'floatQuiz 6s ease-in-out infinite, fadeInDelayed 4.15s ease-out forwards';

      // Update theme classes for text colors
      card.classList.remove("season-theme-spring", "season-theme-summer", "season-theme-rain", "season-theme-winter", "season-theme-autumn", "season-theme-stars");
      card.classList.add(`season-theme-${currentSeason}`);
    }
    lastQuizIndex = quizState.index;
  }
}

function calculateQuizResult() {
  let totalScore = 0;
  let dateQuestionIndex = -1;
  let dateAnswerIndex = -1;

  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    const answerId = quizState.answers[i];
    if (!answerId) continue;
    const optIdx = parseInt(answerId.split("-")[1]);
    const option = q.options[optIdx];
    totalScore += option.score || 0;

    if (q.isDateQuestion) {
      dateQuestionIndex = i;
      dateAnswerIndex = optIdx;
    }
  }

  // Max possible = 20+20+0+20+20+20 = 100
  const percent = Math.min(100, Math.max(0, totalScore));

  let dateMsg = "";
  if (dateQuestionIndex >= 0) {
    const q = quizQuestions[dateQuestionIndex];
    const chosenOption = q.options[dateAnswerIndex];
    if (dateAnswerIndex === q.correctAnswer) {
      dateMsg = "เจน่า จำวันที่เราคุยกันครั้งแรกถูกด้วยย";
    } else {
      const daysOff = chosenOption.daysOff || 0;
      dateMsg = `คลาดเคลื่อนไป ${daysOff} วัน! วันจริงคือ 14 feb นะะ`;
    }
  }

  return { percent, dateMsg };
}

function renderResult() {
  const { percent, dateMsg } = calculateQuizResult();
  resultPercent = percent; // Store globally

  const resultBarFill = document.getElementById("result-bar-fill");
  const resultPercentText = document.getElementById("result-percent");
  const resultLevel = document.getElementById("result-level");
  const resultDateMsg = document.getElementById("result-date-msg");

  // Animate bar fill
  resultBarFill.style.width = "0%";
  resultPercentText.textContent = "0%";
  resultBarFill.classList.remove("is-glow-100");
  resultPercentText.classList.remove("is-glow-text-100");

  let level, barColor;
  if (percent <= 30) {
    level = "ยังต้องพัฒนาอีกเยอะเลยย";
    barColor = "#e74c3c";
  } else if (percent <= 75) {
    level = "กำลังไปได้ดีเลยนะ";
    barColor = "#f1c40f";
  } else {
    level = "ผูกพันแน่นมากกก";
    barColor = "#2ecc71";
  }

  resultBarFill.style.backgroundColor = barColor;
  resultLevel.textContent = level;
  resultDateMsg.textContent = dateMsg;

  // Toggle glow pulse animation on correct date message
  if (dateMsg.startsWith("เจน่า จำวันที่เราคุยกันครั้งแรกถูกด้วยย")) {
    resultDateMsg.classList.add("is-correct");
  } else {
    resultDateMsg.classList.remove("is-correct");
  }

  // Animate the bar filling up after fadeIn completes
  setTimeout(() => {
    const animDuration = 2000;
    const startTime = performance.now();

    function animateBar(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / animDuration);
      const currentPercent = Math.round(progress * percent);
      resultBarFill.style.width = currentPercent + "%";
      resultPercentText.textContent = currentPercent + "%";
      if (progress < 1) {
        requestAnimationFrame(animateBar);
      } else {
        if (percent === 100) {
          resultBarFill.classList.add("is-glow-100");
          resultPercentText.classList.add("is-glow-text-100");
        }
      }
    }
    requestAnimationFrame(animateBar);
  }, 4200);
}

function completeQuiz() {
  flash.className = "flash is-yellow is-active-final";
  void flash.offsetWidth;
  createBurst(window.innerWidth / 2, window.innerHeight / 2, 46, "star");

  setTimeout(() => {
    renderResult();
    showScene("result");
  }, 2500);
}

function renderStory() {
  const item = storyScenes[storyIndex];
  storyCount.textContent = `ฉากที่ ${storyIndex + 1} / ${storyScenes.length}`;
  storyTitle.textContent = item.title;
  storyText.textContent = item.text;
  storyNext.textContent = storyIndex === storyScenes.length - 1 ? "ไปดูความทรงจำ" : "ต่อไป";

  // Set target time for Terraria background (4 slides: 0.0, 0.25, 0.5, 0.75)
  storyBgState.targetTime = storyIndex * 0.25;
}

function updateProposal() {
  document.body.dataset.proposal = proposalState.mood;
  maybeBtn.hidden = !proposalState.showMaybe;
  acceptBtn.classList.toggle("is-emphasis", proposalState.acceptEmphasis);

  if (proposalState.mood === "softened") {
    proposalTitle.textContent = "จะไม่เป็นแฟนกันจริง ๆ เหรอ...";
    proposalNote.textContent = "หน้านี้ยังมีที่ว่างให้คำตอบน่ารักที่สุดของเธออยู่นะ";
  }

  if (proposalState.accepted) {
    proposalTitle.textContent = "เย้ เราเป็นแฟนกันแล้ว";
    proposalNote.textContent = "ขอบคุณที่เปิดสมุดหน้านี้ไปด้วยกัน";
    mobileNoPresses = 0;
    document.body.style.setProperty("--accept-grow", "0");
    document.body.dataset.acceptGrow = "0";
    acceptBtn.classList.remove("is-mobile-growing", "is-fullscreen-choice");
    restoreAcceptButtonHome();
  }
}

function growAcceptButtonOnMobileNo() {
  mobileNoPresses = Math.min(4, mobileNoPresses + 1);
  const message = proposalNoMessages[mobileNoPresses - 1];
  document.body.dataset.acceptGrow = String(mobileNoPresses);
  document.body.style.setProperty("--accept-grow", String(mobileNoPresses));
  acceptBtn.classList.add("is-mobile-growing");

  const rect = acceptBtn.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14 + mobileNoPresses * 4, "heart");

  if (mobileNoPresses >= 4) {
    acceptBtn.classList.add("is-fullscreen-choice");
    detachAcceptButtonForFullscreen();
    maybeBtn.hidden = true;
    proposalTitle.textContent = message.title;
    proposalNote.textContent = message.note;
    return;
  }

  proposalTitle.textContent = message.title;
  proposalNote.textContent = message.note;
}

function showProposalConfirm() {
  proposalConfirm.classList.add("is-visible");
  proposalConfirm.setAttribute("aria-hidden", "false");
  createBurst(window.innerWidth / 2, window.innerHeight / 2, 34, "heart");
}

function hideProposalConfirm() {
  proposalConfirm.classList.remove("is-visible");
  proposalConfirm.setAttribute("aria-hidden", "true");
}

function renderFinalPhoto() {
  const photo = finalPhotos[finalPhotoIndex];
  photoFallback.hidden = true;
  photoPreview.hidden = false;
  photoPreview.onerror = () => {
    photoPreview.hidden = true;
    photoFallback.hidden = false;
    photoFallback.textContent = `ยังไม่พบรูป ${photo.source}`;
  };
  photoPreview.src = photo.source;
  photoTitle.textContent = photo.title;
  photoCounter.textContent = `${finalPhotoIndex + 1} / ${finalPhotos.length}`;
}

function openFinalPhoto(index = 0) {
  finalPhotoIndex = index;
  renderFinalPhoto();
  photoLightbox.classList.add("is-visible");
  photoLightbox.setAttribute("aria-hidden", "false");
}

function moveFinalPhoto(step) {
  finalPhotoIndex = (finalPhotoIndex + step + finalPhotos.length) % finalPhotos.length;
  renderFinalPhoto();
}

function closeFinalPhoto() {
  photoLightbox.classList.remove("is-visible");
  photoLightbox.setAttribute("aria-hidden", "true");
  photoPreview.removeAttribute("src");
  photoPreview.onerror = null;
  photoPreview.hidden = false;
  photoFallback.hidden = true;
}

function startFinalSequence() {
  hideProposalConfirm();
  const coupleSince = new Date();
  finalDate.textContent = formatCoupleSince(coupleSince);
  proposalState = acceptProposal(proposalState);
  document.body.dataset.proposal = proposalState.mood;
  maybeBtn.hidden = true;
  acceptBtn.classList.remove("is-mobile-growing", "is-fullscreen-choice");
  restoreAcceptButtonHome();
  acceptBtn.classList.add("is-emphasis");
  pixelBook.classList.add("is-closing");
  createBurst(window.innerWidth / 2, window.innerHeight / 2, 82, "heart");

  setTimeout(() => {
    flash.className = "flash is-pink is-active-fast";
    void flash.offsetWidth;
  }, 520);

  setTimeout(() => {
    showScene("final");
    celebrationUntil = Date.now() + 6500;
    createBurst(window.innerWidth / 2, window.innerHeight * 0.28, 96, "star");
  }, 1180);
}

function formatCoupleSince(date) {
  return `เป็นแฟนกันเมื่อ ${new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(date)}`;
}

async function shareProposalLink(button) {
  const shareData = {
    title: "Proposal Animation",
    text: "เราเป็นแฟนกันแล้วนะ",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  button.textContent = "คัดลอกลิงก์แล้ว";
}

function downloadFinalImage(button = null) {
  const originalLabel = button ? button.textContent : "";
  if (button) {
    button.disabled = true;
    button.textContent = "กำลังทำรูป...";
  }

  try {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1600;
  exportCanvas.height = 2200;
  const exportCtx = exportCanvas.getContext("2d");
  const titleText = document.querySelector(".final-popup h1")?.textContent?.trim() || "เราเป็นแฟนกันแล้วนะ";
  const displayedFinalTime = finalDate.textContent?.trim() || "";
  const finalTimeText = displayedFinalTime.includes("เป็นแฟนกันเมื่อ")
    ? displayedFinalTime
    : formatCoupleSince(new Date());
  const coupleNamesText = "เจน่า กับ น้องอุ้มอิ้ม (˶˃ ᵕ ˂˶)";
  const bodyText = "ขอบคุณที่เจน่ามาเป็นส่วนหนึ่งของกันและกันนะ คุณแฟนคนแรกของเค้า เขาสัญญาจะดูแลเจน่าให้ดีที่สุดเหมือนวันแรกที่เค้าตกหลุมรักเจน่าเลยย";
  const titleFont = '"Mali", "K2D", "Chakra Petch", "Segoe UI", sans-serif';
  const bodyFont = '"K2D", "Mali", "Chakra Petch", "Segoe UI", sans-serif';

  const drawRoundedRect = (x, y, width, height, radius, fill, stroke = null, lineWidth = 0) => {
    exportCtx.beginPath();
    exportCtx.moveTo(x + radius, y);
    exportCtx.lineTo(x + width - radius, y);
    exportCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
    exportCtx.lineTo(x + width, y + height - radius);
    exportCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    exportCtx.lineTo(x + radius, y + height);
    exportCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
    exportCtx.lineTo(x, y + radius);
    exportCtx.quadraticCurveTo(x, y, x + radius, y);
    exportCtx.closePath();
    if (fill) {
      exportCtx.fillStyle = fill;
      exportCtx.fill();
    }
    if (stroke && lineWidth) {
      exportCtx.strokeStyle = stroke;
      exportCtx.lineWidth = lineWidth;
      exportCtx.stroke();
    }
  };

  const drawCenteredText = (text, x, y, maxWidth, lineHeight, maxLines = 3) => {
    const words = text.split(/(\s+)/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line + word;
      if (exportCtx.measureText(test).width <= maxWidth) {
        line = test;
        return;
      }

      if (line) lines.push(line.trim());

      if (exportCtx.measureText(word).width <= maxWidth) {
        line = word.trimStart();
        return;
      }

      let chunk = "";
      Array.from(word).forEach((char) => {
        const next = chunk + char;
        if (exportCtx.measureText(next).width > maxWidth && chunk) {
          lines.push(chunk);
          chunk = char;
        } else {
          chunk = next;
        }
      });
      line = chunk;
    });
    if (line) lines.push(line.trim());
    exportCtx.save();
    exportCtx.textAlign = "center";
    lines.slice(0, maxLines).forEach((textLine, index) => {
      exportCtx.fillText(textLine, x, y + index * lineHeight);
    });
    exportCtx.restore();
    return y + Math.min(lines.length, maxLines) * lineHeight;
  };

  const drawPixelHeart = (x, y, size) => {
    const p = size / 8;
    exportCtx.fillStyle = "#ff5aa1";
    exportCtx.fillRect(x + p, y + p, p * 2, p);
    exportCtx.fillRect(x + p * 5, y + p, p * 2, p);
    exportCtx.fillRect(x, y + p * 2, p * 8, p * 2);
    exportCtx.fillRect(x + p, y + p * 4, p * 6, p);
    exportCtx.fillRect(x + p * 2, y + p * 5, p * 4, p);
    exportCtx.fillRect(x + p * 3, y + p * 6, p * 2, p);
    exportCtx.fillStyle = "#ffa8c8";
    exportCtx.fillRect(x + p, y + p * 2, p * 6, p * 2);
    exportCtx.fillRect(x + p * 2, y + p * 4, p * 4, p);
    exportCtx.fillRect(x + p * 3, y + p * 5, p * 2, p);
    exportCtx.fillStyle = "#ffffff";
    exportCtx.fillRect(x + p * 5, y + p * 2, p, p);
  };

  const drawPixelStar = (x, y, size, color = "#ffffff") => {
    const p = size / 5;
    exportCtx.fillStyle = color;
    exportCtx.fillRect(x + p * 2, y, p, p * 5);
    exportCtx.fillRect(x, y + p * 2, p * 5, p);
  };

  const drawBgEmoji = (emoji, x, y, size, alpha = 0.2, rotate = 0) => {
    exportCtx.save();
    exportCtx.globalAlpha = alpha;
    exportCtx.translate(x, y);
    exportCtx.rotate(rotate);
    exportCtx.textAlign = "center";
    exportCtx.textBaseline = "middle";
    exportCtx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    exportCtx.fillText(emoji, 0, 0);
    exportCtx.restore();
  };

  const drawPixelEnvelope = (x, y, scale = 5) => {
    const px = (dx, dy, w, h, color) => {
      exportCtx.fillStyle = color;
      exportCtx.fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
    };
    px(1, 0, 14, 1, "#5f2d45");
    px(0, 1, 1, 10, "#5f2d45");
    px(15, 1, 1, 10, "#5f2d45");
    px(1, 11, 14, 1, "#5f2d45");
    px(1, 1, 14, 10, "#fff8df");
    px(2, 2, 12, 2, "#ffd7e7");
    px(2, 3, 2, 1, "#b75084");
    px(12, 3, 2, 1, "#b75084");
    px(4, 4, 1, 1, "#b75084");
    px(11, 4, 1, 1, "#b75084");
    px(5, 5, 1, 1, "#b75084");
    px(10, 5, 1, 1, "#b75084");
    px(6, 6, 4, 1, "#b75084");
    px(7, 4, 2, 1, "#ff4d86");
    px(6, 5, 4, 2, "#ff4d86");
    px(7, 7, 2, 1, "#ff4d86");
    px(12, 2, 1, 1, "#ffffff");
  };

  const drawPixelGift = (x, y, scale = 5) => {
    const px = (dx, dy, w, h, color) => {
      exportCtx.fillStyle = color;
      exportCtx.fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
    };
    px(4, 0, 3, 2, "#ff5aa1");
    px(9, 0, 3, 2, "#ff5aa1");
    px(5, 2, 6, 2, "#ff5aa1");
    px(1, 4, 14, 3, "#5f2d45");
    px(2, 5, 12, 2, "#ff8cc1");
    px(2, 7, 12, 9, "#ff6fb0");
    px(0, 6, 1, 10, "#5f2d45");
    px(15, 6, 1, 10, "#5f2d45");
    px(1, 16, 14, 1, "#5f2d45");
    px(7, 4, 2, 13, "#fff1a8");
    px(2, 8, 12, 2, "#b75084");
    px(11, 7, 2, 2, "#ffa8c8");
    px(3, 8, 2, 1, "#ffcfe0");
  };

  const drawPixelRing = (x, y, scale = 5) => {
    const px = (dx, dy, w, h, color) => {
      exportCtx.fillStyle = color;
      exportCtx.fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
    };
    px(6, 0, 5, 1, "#ff8cc1");
    px(5, 1, 7, 2, "#ffa8c8");
    px(4, 3, 9, 1, "#5f2d45");
    px(6, 4, 5, 1, "#fff8df");
    px(4, 5, 2, 2, "#ffd35e");
    px(11, 5, 2, 2, "#ffd35e");
    px(3, 7, 2, 6, "#d89935");
    px(12, 7, 2, 6, "#d89935");
    px(5, 13, 7, 2, "#d89935");
    px(6, 7, 5, 6, "#fff8df");
    px(8, 1, 2, 1, "#ffffff");
  };

  const drawPixelFlower = (x, y, scale = 5) => {
    const px = (dx, dy, w, h, color) => {
      exportCtx.fillStyle = color;
      exportCtx.fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
    };
    px(7, 7, 2, 10, "#4b9a62");
    px(5, 10, 2, 2, "#76c979");
    px(9, 12, 3, 2, "#76c979");
    px(7, 1, 2, 2, "#ff5aa1");
    px(4, 3, 3, 3, "#ff8cc1");
    px(9, 3, 3, 3, "#ff8cc1");
    px(6, 5, 4, 4, "#ff5aa1");
    px(7, 6, 2, 2, "#fff1a8");
    px(10, 4, 1, 1, "#ffd7e7");
  };

  const drawPixelSparkIcon = (x, y, scale = 5) => {
    const px = (dx, dy, w, h, color) => {
      exportCtx.fillStyle = color;
      exportCtx.fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
    };
    px(6, 0, 2, 5, "#fff8df");
    px(5, 5, 4, 2, "#fff8df");
    px(6, 7, 2, 5, "#fff8df");
    px(1, 5, 4, 2, "#ff8cc1");
    px(9, 5, 4, 2, "#ff8cc1");
    px(7, 4, 1, 1, "#ffffff");
  };

  exportCtx.imageSmoothingEnabled = false;
  const bg = exportCtx.createLinearGradient(0, 0, 0, 2200);
  bg.addColorStop(0, "#fff9fd");
  bg.addColorStop(0.46, "#ffc9de");
  bg.addColorStop(0.78, "#f08ac1");
  bg.addColorStop(1, "#a596d2");
  exportCtx.fillStyle = bg;
  exportCtx.fillRect(0, 0, 1600, 2200);

  [[120, 90, 132], [512, 48, 120], [1020, 110, 112], [1370, 42, 124], [260, 520, 108], [740, 430, 126], [1220, 520, 116], [170, 1040, 110], [555, 1200, 108], [1050, 1140, 128], [1340, 1380, 104], [310, 1660, 118], [870, 1760, 122]].forEach(([x, y, size]) => {
    drawPixelHeart(x, y, size);
  });

  [[190, 240, 48], [1260, 265, 64], [1410, 780, 54], [98, 825, 58], [715, 1540, 46], [1180, 1810, 62]].forEach(([x, y, size]) => {
    drawPixelStar(x, y, size);
  });

  [
    ["\u2661", 430, 188, 112, 0.2, -0.18],
    ["\u2726", 1188, 206, 92, 0.3, 0.12],
    ["\u{1F48C}", 1460, 392, 86, 0.18, 0.22],
    ["\u{1F380}", 118, 614, 82, 0.18, -0.2],
    ["\u273F", 1386, 1000, 90, 0.2, 0.16],
    ["\u2661", 86, 1298, 118, 0.22, 0.08],
    ["\u{1F497}", 1480, 1530, 96, 0.18, -0.14],
    ["\u2727", 220, 1884, 76, 0.28, 0.05],
    ["\u{1F48C}", 1290, 1900, 74, 0.16, 0.22],
    ["\u2661", 804, 2050, 88, 0.18, -0.08],
  ].forEach(([emoji, x, y, size, alpha, rotate]) => {
    drawBgEmoji(emoji, x, y, size, alpha, rotate);
  });

  exportCtx.fillStyle = "rgba(108, 45, 79, 0.38)";
  exportCtx.fillRect(192, 332, 1288, 1540);
  exportCtx.fillStyle = "#6c2d4f";
  exportCtx.fillRect(156, 294, 1288, 1540);
  exportCtx.fillStyle = "#fff8df";
  exportCtx.fillRect(190, 328, 1220, 1470);
  exportCtx.fillStyle = "#ffd997";
  exportCtx.fillRect(224, 362, 1152, 60);
  exportCtx.fillStyle = "#ffe6b8";
  exportCtx.fillRect(224, 462, 1152, 1160);
  exportCtx.fillStyle = "rgba(221, 135, 91, 0.12)";
  exportCtx.fillRect(224, 1425, 1152, 197);
  exportCtx.strokeStyle = "#6c2d4f";
  exportCtx.lineWidth = 18;
  exportCtx.strokeRect(190, 328, 1220, 1470);
  exportCtx.strokeStyle = "#ffd997";
  exportCtx.lineWidth = 10;
  exportCtx.strokeRect(224, 362, 1152, 1400);

  exportCtx.fillStyle = "#ff8cc1";
  [0, 1, 2, 3].forEach((i) => {
    exportCtx.fillRect(262 + i * 260, 384, 178, 28);
  });

  const sticker = exportStickerImage.complete && exportStickerImage.naturalWidth > 0
    ? exportStickerImage
    : null;
  if (sticker) {
    exportCtx.save();
    exportCtx.imageSmoothingEnabled = true;
    exportCtx.translate(336, 278);
    exportCtx.rotate(-0.12);
    exportCtx.drawImage(sticker, -170, -184, 340, 520);
    exportCtx.restore();
    exportCtx.imageSmoothingEnabled = false;
  }

  exportCtx.textAlign = "center";
  exportCtx.fillStyle = "#b75084";
  exportCtx.font = `700 34px ${bodyFont}`;
  exportCtx.fillText("Final Page", 800, 528);

  exportCtx.fillStyle = "#62364b";
  exportCtx.font = `800 88px ${titleFont}`;
  drawCenteredText(titleText, 800, 650, 1040, 104, 3);

  exportCtx.fillStyle = "#fff8df";
  drawRoundedRect(300, 858, 1000, 104, 0, "#fff8df", "#b75084", 12);
  exportCtx.fillStyle = "#7a3e5f";
  exportCtx.font = `700 38px ${bodyFont}`;
  drawCenteredText(finalTimeText, 800, 925, 900, 46, 2);

  exportCtx.textAlign = "center";
  exportCtx.fillStyle = "#744555";
  exportCtx.font = `700 38px ${bodyFont}`;
  drawCenteredText(bodyText, 800, 1085, 950, 60, 7);

  drawRoundedRect(350, 1418, 900, 126, 0, "#fff8df", "#b75084", 12);
  exportCtx.fillStyle = "#8f2b66";
  exportCtx.font = `800 48px ${titleFont}`;
  drawCenteredText(coupleNamesText, 800, 1496, 820, 56, 2);

  drawRoundedRect(278, 1588, 1044, 170, 0, "rgba(255, 248, 223, 0.62)", "#ffd997", 8);
  drawPixelEnvelope(360, 1638, 6);
  drawPixelHeart(542, 1632, 92);
  drawPixelGift(714, 1618, 6);
  drawPixelRing(908, 1624, 6);
  drawPixelFlower(1088, 1618, 6);
  drawPixelSparkIcon(1222, 1646, 6);
  [[468, 1610, 32], [660, 1710, 28], [1032, 1712, 30], [1190, 1608, 26]].forEach(([x, y, size]) => {
    drawPixelStar(x, y, size, "#ffffff");
  });

  exportCtx.fillStyle = "#7a3e5f";
  exportCtx.font = `700 30px ${bodyFont}`;
  exportCtx.fillText("Jena Lover • saved from the pixel heart book", 800, 1970);

  const link = document.createElement("a");
  link.download = `jena-love-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();

  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
}

function moveMaybeButton() {
  const rect = maybeBtn.getBoundingClientRect();
  maybeBtn.classList.add("is-floating");
  const position = getRunawayPosition({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    buttonWidth: rect.width,
    buttonHeight: rect.height,
    seed: Math.random(),
  });
  maybeBtn.style.left = `${position.x}px`;
  maybeBtn.style.top = `${position.y}px`;
}

function createBurst(x, y, count = 18, kind = "spark") {
  for (let i = 0; i < count; i += 1) {
    bursts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      life: 1,
      size: 3 + Math.random() * 8,
      kind,
      hue: Math.random() * 70 + 35,
    });
  }
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(520, Math.max(220, Math.round((window.innerWidth * window.innerHeight) / 3600)));
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random(),
      size: 1.1 + Math.random() * 3.4,
      speed: 0.2 + Math.random() * 1.1,
      drift: Math.random() * Math.PI * 2,
      hue: Math.random() * 360,
    });
  }
}

function seedTwinkleStars() {
  twinkleStars.length = 0;
  const count = Math.min(320, Math.max(140, Math.round((window.innerWidth * window.innerHeight) / 4000)));
  for (let i = 0; i < count; i += 1) {
    twinkleStars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.7,
      size: 0.8 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 3,
      baseAlpha: 0.3 + Math.random() * 0.7,
      colorPhase: Math.random() * Math.PI * 2,
      hasColor: Math.random() > 0.7,
    });
  }
}

function drawTwinkleStars(time) {
  if (currentScene !== "landing") return;
  const skyProgress = smoothStep(0.28, 0.55, landingProgress);
  if (skyProgress > 0.85) return;

  const fade = Math.max(0, 1 - skyProgress * 1.2);
  ctx.save();

  for (let i = 0; i < twinkleStars.length; i += 1) {
    const star = twinkleStars[i];
    const blink = Math.sin(time * 0.001 * star.speed + star.phase);
    const pulse = (blink + 1) * 0.5;
    const a = fade * (star.baseAlpha * 0.3 + pulse * 0.7);

    if (a < 0.04) continue;

    ctx.globalAlpha = a;

    if (star.hasColor && pulse > 0.75) {
      const colorCycle = Math.sin(time * 0.0004 + star.colorPhase);
      const hue = colorCycle > 0.3 ? 210 + colorCycle * 40 : colorCycle > -0.3 ? 45 + colorCycle * 30 : 320 + colorCycle * 20;
      ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
    } else {
      ctx.fillStyle = "#ffffff";
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * (0.6 + pulse * 0.4), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function resizeCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedParticles();
  seedTwinkleStars();

  if (threeWorld) {
    threeWorld.camera.aspect = window.innerWidth / window.innerHeight;
    threeWorld.camera.updateProjectionMatrix();
    threeWorld.renderer.setSize(window.innerWidth, window.innerHeight, false);
    threeWorld.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  }

  if (giftThree) {
    const canvasNode = document.getElementById("gift-canvas");
    if (canvasNode) {
      giftThree.camera.aspect = canvasNode.clientWidth / canvasNode.clientHeight;
      giftThree.camera.updateProjectionMatrix();
      giftThree.renderer.setSize(canvasNode.clientWidth, canvasNode.clientHeight, false);
    }
  }
}

function updateThreeWorld(time) {
  if (!threeWorld) return;

  if (currentScene === "gift") {
    webglCanvas.style.display = "none";
    return;
  } else {
    webglCanvas.style.display = "block";
  }

  const t = time * 0.001;
  const landingSky = smoothStep(0.28, 0.55, landingProgress);
  const cloudProgress = smoothStep(0.22, 0.56, landingProgress);
  const forestProgress = smoothStep(0.6, 0.88, landingProgress);
  const sceneLight = currentScene === "landing" ? landingSky : 1;
  const activeStorybook = currentScene === "story" || currentScene === "gallery" || currentScene === "proposal";
  const proposalIntensity = currentScene === "proposal" ? 1 : 0;

  const darkColor = new THREE.Color(0x111416);
  const skyColor = new THREE.Color(0x6ecbf3);
  const storyColor = new THREE.Color(activeStorybook ? 0xffb7d1 : 0x67d5ff);
  const bgColor = darkColor.clone().lerp(skyColor, sceneLight).lerp(storyColor, activeStorybook ? 0.34 : 0);
  threeWorld.scene.background = bgColor;
  threeWorld.scene.fog.color.copy(bgColor);
  threeWorld.scene.fog.near = currentScene === "landing" ? 8 : 6;
  threeWorld.scene.fog.far = currentScene === "proposal" ? 34 : 28;

  threeWorld.camera.position.x = Math.sin(t * 0.16) * 0.38;
  threeWorld.camera.position.y = 1.35 - cloudProgress * 1.05 + Math.sin(t * 0.2) * 0.06;
  threeWorld.camera.position.z = 12 - cloudProgress * 2.2 - proposalIntensity * 1.5;
  threeWorld.camera.lookAt(0, -0.15 + cloudProgress * 0.12, -5);

  threeWorld.root.rotation.y = Math.sin(t * 0.08) * 0.06;
  threeWorld.root.rotation.x = Math.sin(t * 0.06) * 0.018;
  threeWorld.stars.rotation.y += 0.00028 + proposalIntensity * 0.0015;
  threeWorld.stars.rotation.x = Math.sin(t * 0.04) * 0.04;
  threeWorld.stars.material.opacity = currentScene === "landing" ? Math.max(0.04, 0.9 - landingSky * 0.86) : currentScene === "proposal" ? 0.78 : 0.26;

  threeWorld.moon.visible = currentScene !== "landing";
  threeWorld.moon.material.opacity = currentScene === "landing" ? 0 : 0.1;
  threeWorld.moon.position.y = 3.15 + Math.sin(t * 0.35) * 0.12;

  threeWorld.horizon.visible = cloudProgress > 0.45 || currentScene !== "landing";
  threeWorld.horizon.position.y = -2.7 + cloudProgress * 0.42 + forestProgress * 0.3 + Math.sin(t * 0.22) * 0.05;
  threeWorld.horizon.children.forEach((child, index) => {
    child.position.x = Math.sin(t * (0.18 + index * 0.04) + index) * 0.14;
    if (child.material) {
      child.material.opacity = Math.min(child.material.opacity || 0.2, 0.42) * 0.98 + (0.12 + sceneLight * 0.26 + proposalIntensity * 0.1) * 0.02;
    }
  });

  threeWorld.fireflies.rotation.y += 0.0009 + proposalIntensity * 0.002;
  threeWorld.fireflies.material.opacity = currentScene === "landing" ? 0.04 + (1 - landingSky) * 0.22 : 0.72;
  threeWorld.fireflies.material.size = 0.075 + proposalIntensity * 0.05;

  threeWorld.storyLight.visible = currentScene !== "landing";
  threeWorld.storyLight.material.opacity = currentScene === "landing" ? 0 : 0.42 + proposalIntensity * 0.38;
  threeWorld.storyLight.position.x = 2.4 + Math.sin(t * 0.18) * 0.45;
  threeWorld.storyLight.position.y = 0.65 + Math.cos(t * 0.2) * 0.2;

  threeWorld.sun.intensity = 1.1 + sceneLight * 1.9 + proposalIntensity * 1.2;
  threeWorld.renderer.render(threeWorld.scene, threeWorld.camera);
}

function drawBackground(time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const landingSky = smoothStep(0.28, 0.55, landingProgress);
  const palettes = {
    landing: [
      blendColor("#171a1c", "#1b3446", landingSky),
      blendColor("#111416", "#4ea5dc", landingSky),
      blendColor("#080a0d", "#aee8ff", landingSky),
    ],
    quiz: ["#2436a9", "#6bdfff", "#ffb26d"],
    story: ["#ffca66", "#ff8fa5", "#6956e8"],
    gallery: ["#1a184d", "#7155d9", "#ffb86c"],
    gift: ["#ffffff", "#ffffff", "#ffffff"],
    proposal: ["#120d38", "#3e39c9", "#ff7f9f"],
  };
  const colors = palettes[currentScene] || palettes.landing;
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.54, colors[1]);
  gradient.addColorStop(1, colors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 7; i += 1) {
    const radius = width * (0.12 + i * 0.025);
    const x = width * (0.18 + i * 0.13) + Math.sin(time * 0.0004 + i) * 40;
    const y = height * (0.18 + (i % 3) * 0.24) + Math.cos(time * 0.00035 + i) * 34;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `hsla(${38 + i * 28}, 100%, 78%, 0.58)`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawAtmosphericMist(time) {
  if (currentScene !== "landing") return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cloudProgress = smoothStep(0.22, 0.56, landingProgress);
  const cloudFade = 1 - smoothStep(0.72, 0.9, landingProgress);
  const mist = cloudProgress * cloudFade;
  if (mist <= 0.02) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = mist;

  const vertical = ctx.createLinearGradient(0, 0, 0, height);
  vertical.addColorStop(0, "rgba(255, 255, 255, 0)");
  vertical.addColorStop(0.32, "rgba(255, 255, 255, 0.2)");
  vertical.addColorStop(0.54, "rgba(255, 255, 255, 0.72)");
  vertical.addColorStop(0.76, "rgba(255, 255, 255, 0.36)");
  vertical.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 9; i += 1) {
    const x = width * ((i * 0.17 + time * 0.000015) % 1.2 - 0.1);
    const y = height * (0.34 + (i % 4) * 0.12) + Math.sin(time * 0.0003 + i) * 24;
    const rx = width * (0.22 + (i % 3) * 0.08);
    const ry = height * (0.08 + (i % 2) * 0.035);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, rx);
    gradient.addColorStop(0, "rgba(255,255,255,0.46)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.18)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.sin(i) * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = mist * 0.18;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 46; i += 1) {
    const y = (height * 0.26 + i * height * 0.014 + Math.sin(time * 0.0004 + i) * 8) % height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(width * 0.28, y - 18, width * 0.58, y + 22, width, y - 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPixelForestScene(time) {
  if (currentScene !== "landing") return;
  const forestProgress = smoothStep(0.6, 0.88, landingProgress);
  if (forestProgress <= 0.02) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixel = Math.max(3, Math.round(Math.min(width, height) / 210));
  const snap = (value) => Math.round(value / pixel) * pixel;
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(snap(x), snap(y), snap(w), snap(h));
  };
  const poly = (points, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(snap(x), snap(y));
      else ctx.lineTo(snap(x), snap(y));
    });
    ctx.closePath();
    ctx.fill();
  };

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = forestProgress;

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#4b8ed0");
  sky.addColorStop(0.45, "#80bfed");
  sky.addColorStop(0.72, "#b9e7ff");
  sky.addColorStop(1, "#f1fff3");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  drawPixelCloudBank(rect, width, height, pixel, time);
  drawPixelMountains(rect, poly, width, height, pixel, time);
  drawPixelMeadow(rect, width, height, pixel, time);
  drawPixelTree(rect, width * 0.075, height * 0.88, pixel, 1.16, true, time);
  drawPixelTree(rect, width * 0.66, height * 0.74, pixel, 0.38, false, time);
  drawPixelWind(rect, width, height, pixel, time);
  drawPixelForeground(rect, width, height, pixel, time);

  ctx.restore();
}

function drawQuizPixelScene(time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixel = Math.max(3, Math.round(Math.min(width, height) / 210));
  const snap = (value) => Math.round(value / pixel) * pixel;
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(snap(x), snap(y), snap(w), snap(h));
  };
  const poly = (points, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(snap(x), snap(y));
      else ctx.lineTo(snap(x), snap(y));
    });
    ctx.closePath();
    ctx.fill();
  };

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  if (currentSeason === "spring") {
    drawPixelSpringScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "summer") {
    drawPixelSummerScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "rain") {
    drawPixelRainScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "winter") {
    drawPixelWinterScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "autumn") {
    drawPixelAutumnScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "stars") {
    drawPixelStarsScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "result") {
    drawPixelResultScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "story") {
    drawPixelStoryScene(rect, poly, width, height, pixel, time);
  } else if (currentSeason === "gallery") {
    drawPixelGalleryScene(rect, poly, width, height, pixel, time);
  } else {
    // Fallback for other seasons until implemented
    rect(0, 0, width, height, "#1a184d");
  }

  ctx.restore();
}

function drawPixelSpringScene(rect, poly, width, height, pixel, time) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  sky.addColorStop(0, "#7679e9");
  sky.addColorStop(1, "#c590dd");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Background Hills (Purple/Pink)
  poly([
    [0, height * 0.4],
    [width * 0.3, height * 0.25],
    [width * 0.6, height * 0.45],
    [width, height * 0.35],
    [width, height],
    [0, height]
  ], "#d7a9dd");

  poly([
    [0, height * 0.5],
    [width * 0.2, height * 0.45],
    [width * 0.5, height * 0.55],
    [width * 0.8, height * 0.48],
    [width, height * 0.52],
    [width, height],
    [0, height]
  ], "#eba7e2");

  // Yellow/Pink Clouds
  const clouds = [
    { x: width * 0.15, y: height * 0.2, w: width * 0.3, h: height * 0.15, c: "#fff1ba" },
    { x: width * 0.45, y: height * 0.18, w: width * 0.25, h: height * 0.12, c: "#fff1ba" },
    { x: width * 0.75, y: height * 0.22, w: width * 0.3, h: height * 0.18, c: "#fff1ba" },
    { x: width * 0.2, y: height * 0.28, w: width * 0.35, h: height * 0.1, c: "#f6ceea" },
    { x: width * 0.6, y: height * 0.3, w: width * 0.4, h: height * 0.12, c: "#f6ceea" },
  ];
  clouds.forEach(c => {
    rect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, c.c);
    rect(c.x - c.w / 2.5, c.y - c.h / 1.5, c.w * 0.8, c.h * 1.5, c.c);
  });

  // Lake / Sea
  poly([
    [width * 0.45, height * 0.55],
    [width, height * 0.48],
    [width, height],
    [width * 0.6, height],
  ], "#58a2d1");

  // Water ripples
  for (let i = 0; i < 6; i++) {
    const rx = width * (0.6 + i * 0.05 + Math.sin(time * 0.001 + i) * 0.02);
    const ry = height * (0.6 + i * 0.05);
    rect(rx, ry, width * 0.1, pixel * 2, "#7ab9df");
  }

  // Foreground Grassy Hill
  poly([
    [0, height * 0.45],
    [width * 0.45, height * 0.55],
    [width * 0.85, height],
    [0, height]
  ], "#a8e265");

  // Grass highlights and paths
  poly([
    [0, height * 0.5],
    [width * 0.4, height * 0.6],
    [width * 0.75, height],
    [0, height]
  ], "#77c251");

  poly([
    [0, height * 0.65],
    [width * 0.25, height * 0.75],
    [width * 0.55, height],
    [0, height]
  ], "#35943f");

  // Grass patches
  for (let i = 0; i < 40; i++) {
    const px = (Math.sin(i * 13) * 0.5 + 0.5) * width * 0.7;
    const py = (Math.cos(i * 17) * 0.5 + 0.5) * height * 0.4 + height * 0.55;
    if (px < width * 0.8 - (py - height * 0.5) * 1.5) {
      rect(px, py, pixel * 2, pixel * 4, "#50a944");
    }
  }

  // Sunflowers & small flowers
  const drawFlower = (fx, fy, scale, type) => {
    const p = pixel * scale;
    if (type === 'sunflower') {
      rect(fx - p * 2, fy - p * 2, p * 5, p * 5, "#ffce38"); // petals
      rect(fx - p * 3, fy - p, p * 7, p * 3, "#ffce38");
      rect(fx - p, fy - p * 3, p * 3, p * 7, "#ffce38");
      rect(fx - p, fy - p, p * 3, p * 3, "#705632"); // center
      rect(fx, fy + p * 3, p, p * 4, "#296e24"); // stem
      rect(fx - p * 2, fy + p * 4, p * 2, p, "#296e24"); // leaf
    } else if (type === 'blue') {
      rect(fx - p, fy - p, p * 3, p * 3, "#5d9df0");
      rect(fx, fy, p, p, "#ffd35c");
    } else if (type === 'purple') {
      rect(fx - p, fy - p, p * 3, p * 3, "#a57ed9");
      rect(fx, fy, p, p, "#ffd35c");
    }
  };

  drawFlower(width * 0.1, height * 0.75, 2, 'sunflower');
  drawFlower(width * 0.3, height * 0.9, 3, 'sunflower');
  drawFlower(width * 0.2, height * 0.85, 1.5, 'blue');
  drawFlower(width * 0.4, height * 0.8, 1.5, 'purple');
  drawFlower(width * 0.05, height * 0.65, 1, 'sunflower');
  drawFlower(width * 0.15, height * 0.55, 1, 'blue');

  // Small bees
  const drawBee = (bx, by) => {
    const yOff = Math.sin(time * 0.005 + bx) * pixel * 2;
    rect(bx, by + yOff, pixel * 4, pixel * 3, "#ffce38");
    rect(bx + pixel, by + yOff, pixel * 1, pixel * 3, "#333");
    rect(bx + pixel * 3, by + yOff, pixel * 1, pixel * 3, "#333");
    rect(bx + pixel * 1.5, by + yOff - pixel * 1.5, pixel * 2, pixel * 1.5, "#fff"); // wing
  };

  drawBee(width * 0.6, height * 0.65);
  drawBee(width * 0.75, height * 0.6);
  drawBee(width * 0.85, height * 0.75);
}

function drawPixelSummerScene(rect, poly, width, height, pixel, time) {
  // Desert sky
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  sky.addColorStop(0, "#19457a");     // deep blue
  sky.addColorStop(0.3, "#3d738f");   // lighter blue
  sky.addColorStop(0.6, "#7fb284");   // greenish
  sky.addColorStop(1, "#dfd38a");     // yellow horizon
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Cloud drawing helper
  const drawCloud = (cx, cy, scale) => {
    const p = pixel * scale;
    // Shade (bottom)
    rect(cx - p * 2, cy + p * 2, p * 8, p * 2, "#e6c374");
    // Main body
    rect(cx - p * 3, cy, p * 10, p * 3, "#ffeca3");
    // Top puffs
    rect(cx - p, cy - p * 2, p * 5, p * 2, "#ffeca3");
    rect(cx + p * 1.5, cy - p * 3, p * 2, p * 2, "#ffeca3");
  };

  // Flat clouds
  const flatCloud = (cx, cy, cw) => {
    rect(cx, cy, cw, pixel * 2, "#ffeca3");
    rect(cx + pixel * 4, cy + pixel * 2, cw * 0.8, pixel * 2, "#ffeca3");
  };

  // Drifting clouds
  const drift1 = (time * 0.005) % width;
  const drift2 = (time * 0.003 + width * 0.5) % width;
  const drift3 = (time * 0.004 + width * 0.2) % width;

  drawCloud(drift1, height * 0.15, 3);
  drawCloud(drift2, height * 0.3, 4);
  drawCloud(drift3, height * 0.2, 2.5);

  flatCloud((time * 0.002) % width, height * 0.05, pixel * 20);
  flatCloud((time * 0.001 + width * 0.7) % width, height * 0.4, pixel * 25);
  flatCloud((time * 0.0025 + width * 0.3) % width, height * 0.42, pixel * 15);

  // Distant blue mountains
  const drawSteppedMtn = (mx, my, mw, mh, color) => {
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const stepW = mw * (1 - (i / steps));
      const stepH = mh / steps;
      rect(mx - stepW / 2, my - mh + i * stepH, stepW, stepH + pixel, color);
    }
  };

  drawSteppedMtn(width * 0.1, height * 0.65, width * 0.15, height * 0.1, "#617d9e");
  drawSteppedMtn(width * 0.3, height * 0.66, width * 0.1, height * 0.06, "#617d9e");
  drawSteppedMtn(width * 0.6, height * 0.65, width * 0.2, height * 0.12, "#617d9e");

  // Midground red/orange buttes
  const drawButte = (bx, by, bw, bh, baseColor, highlight) => {
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const stepW = bw * (1 - (i / steps) * 0.6); // don't go to a sharp point
      const stepH = bh / steps;
      rect(bx - stepW / 2, by - bh + i * stepH, stepW, stepH + pixel, baseColor);
      // Highlights on the left
      rect(bx - stepW / 2, by - bh + i * stepH, stepW * 0.3, stepH + pixel, highlight);
    }
  };

  drawButte(width * 0.2, height * 0.72, width * 0.3, height * 0.25, "#934327", "#bd633d");
  drawButte(width * 0.45, height * 0.7, width * 0.15, height * 0.15, "#934327", "#bd633d");
  drawButte(width * 0.75, height * 0.71, width * 0.2, height * 0.18, "#934327", "#bd633d");
  drawButte(width * 0.9, height * 0.73, width * 0.25, height * 0.3, "#934327", "#bd633d");

  // Sandy Ground
  rect(0, height * 0.7, width, height * 0.3, "#ce8b4b");
  rect(0, height * 0.71, width, height * 0.02, "#e3a55f"); // edge light

  // Distant bushes
  const drawBush = (bx, by, scale) => {
    const p = pixel * scale;
    rect(bx - p * 2, by - p * 2, p * 4, p * 3, "#21641b"); // main body
    rect(bx - p, by - p * 3, p * 2, p, "#3ab031"); // top highlight
    rect(bx - p * 2, by - p * 2, p, p * 2, "#3ab031"); // left highlight
    rect(bx - p * 1.5, by + p, p * 3, p, "#0f330b"); // shadow bottom
  };

  drawBush(width * 0.35, height * 0.73, 1.5);
  drawBush(width * 0.55, height * 0.75, 1);
  drawBush(width * 0.58, height * 0.76, 0.8);
  drawBush(width * 0.72, height * 0.74, 1.2);
  drawBush(width * 0.85, height * 0.76, 1.5);

  // Dark foreground ledge
  rect(0, height * 0.85, width, height * 0.15, "#512c1b");
  rect(0, height * 0.85, width, pixel * 3, "#3d1e11"); // rim

  // Ledge detail blocks
  for (let i = 0; i < 15; i++) {
    rect(width * (0.05 + i * 0.07), height * 0.9 + (i % 3) * pixel * 4, pixel * 8, pixel * 4, "#693b26");
  }

  // Foreground Trees
  const drawTree = (tx, ty, scale) => {
    const p = pixel * scale;
    // Trunk
    rect(tx - p, ty, p * 2, p * 8, "#4a2412");
    rect(tx - p, ty, p, p * 8, "#5e321e"); // highlight
    // Leaves
    drawBush(tx, ty + p, 2 * scale);
  };

  drawTree(width * 0.1, height * 0.82, 3);
  drawTree(width * 0.45, height * 0.86, 2.5);
  drawTree(width * 0.95, height * 0.78, 2);
}

function drawPixelRainScene(rect, poly, width, height, pixel, time) {
  // Foggy/Misty background
  rect(0, 0, width, height, "#c8d6db");

  // Distant misty trees and gate
  const drawMistyTree = (tx, widthScale, heightScale) => {
    rect(tx, height * 0.1, pixel * widthScale, height * 0.5, "#b1c3c9"); // trunk
    // Leaves
    rect(tx - pixel * 10 * widthScale, height * 0.05, pixel * 20 * widthScale, pixel * 15 * heightScale, "#b1c3c9");
    rect(tx - pixel * 15 * widthScale, height * 0.15, pixel * 30 * widthScale, pixel * 20 * heightScale, "#a2b7bd");
  };

  drawMistyTree(width * 0.2, 1, 1);
  drawMistyTree(width * 0.8, 1.2, 1.5);
  drawMistyTree(width * 0.4, 0.8, 0.8);

  // Distant Shrine Gate
  const gateX = width * 0.5;
  const gateY = height * 0.45;
  const gateW = width * 0.2;
  rect(gateX - gateW / 2, gateY, gateW, pixel * 3, "#a2b7bd"); // top roof
  rect(gateX - gateW * 0.4, gateY + pixel * 3, gateW * 0.8, pixel * 2, "#a2b7bd");
  rect(gateX - gateW * 0.35, gateY + pixel * 5, pixel * 4, height * 0.15, "#a2b7bd"); // left pillar
  rect(gateX + gateW * 0.35 - pixel * 4, gateY + pixel * 5, pixel * 4, height * 0.15, "#a2b7bd"); // right pillar

  // Stone Stairway (Perspective)
  const steps = 15;
  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const nextProgress = (i + 1) / steps;

    // Width gets wider closer to bottom
    const stepW = gateW * (1 + progress * 4);
    const stepX = width * 0.5 - stepW / 2;

    // Height gets taller closer to bottom (exponential)
    const stepY = height * 0.55 + (progress * progress) * height * 0.45;
    const nextStepY = height * 0.55 + (nextProgress * nextProgress) * height * 0.45;
    const stepH = nextStepY - stepY;

    // Tread (top part of step)
    rect(stepX, stepY, stepW, stepH * 0.4, "#3a4f54");
    // Riser (front part of step)
    rect(stepX, stepY + stepH * 0.4, stepW, stepH * 0.6, "#223538");

    // Highlight reflection
    rect(stepX + stepW * 0.3, stepY, stepW * 0.4, pixel, "#5a747a");
  }

  // Bushes (Hydrangeas foliage)
  const drawBushCluster = (bx, by, size, isLeft) => {
    const s = pixel * size;
    // Dark base
    rect(bx - s * 3, by - s * 2, s * 6, s * 5, "#0b2622");
    // Mid green
    rect(bx - s * 2.5, by - s * 2.5, s * 5, s * 4, "#103c31");
    // Highlights
    rect(bx - s * 1.5, by - s * 3, s * 3, s * 2, "#1b5a45");
    rect(bx - s * 2, by - s * 1.5, s, s, "#267a5b");

    // Blue Hydrangea flowers
    const drawHydrangea = (hx, hy, scale) => {
      const hs = pixel * scale;
      rect(hx - hs * 2, hy - hs, hs * 4, hs * 3, "#0d4ab5");
      rect(hx - hs, hy - hs * 2, hs * 2, hs * 5, "#0d4ab5");
      rect(hx - hs, hy - hs, hs * 2, hs * 2, "#2b84f3"); // bright center
      rect(hx - hs * 1.5, hy, hs, hs, "#4a9bf7"); // highlights
      rect(hx + hs * 0.5, hy - hs * 1.5, hs, hs, "#4a9bf7");
    };

    if (isLeft) {
      drawHydrangea(bx - s * 1.5, by - s, size * 0.8);
      drawHydrangea(bx + s * 0.5, by - s * 1.5, size * 1.2);
      drawHydrangea(bx, by + s * 0.5, size);
    } else {
      drawHydrangea(bx + s * 1.5, by - s, size * 0.8);
      drawHydrangea(bx - s * 0.5, by - s * 1.5, size * 1.2);
      drawHydrangea(bx, by + s * 0.5, size);
    }
  };

  // Draw bushes down the sides
  for (let i = 0; i < 7; i++) {
    const progress = i / 6;
    const y = height * 0.45 + (progress * progress) * height * 0.55;
    const wSpread = width * 0.2 + (progress * progress) * width * 0.4;
    const size = 1.5 + progress * 4;

    // Left side
    drawBushCluster(width * 0.5 - wSpread, y, size, true);
    // Right side
    drawBushCluster(width * 0.5 + wSpread, y, size, false);
  }

  // Fence posts
  for (let i = 0; i < 5; i++) {
    const progress = i / 4;
    // Skip the very top
    if (progress < 0.2) continue;

    const y = height * 0.55 + (progress * progress) * height * 0.45;
    const wSpread = width * 0.15 + (progress * progress) * width * 0.25;
    const postH = height * 0.1 + progress * height * 0.2;
    const postW = pixel * (2 + progress * 3);

    // Left post
    rect(width * 0.5 - wSpread, y - postH, postW, postH, "#1a2c2e");
    // Right post
    rect(width * 0.5 + wSpread, y - postH, postW, postH, "#1a2c2e");
  }
}

function drawPixelWinterScene(rect, poly, width, height, pixel, time) {
  // Foggy winter sky (grayish blue/green)
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#8fa9aa");
  sky.addColorStop(1, "#c5d0d1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Distant misty pine mountains
  const drawMistyPineHills = (yBase, scale, opacity, colorBase) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    const count = Math.floor(width / (pixel * 15 * scale)) + 2;
    for (let i = -1; i < count; i++) {
      const hillHeight = Math.sin(i * 1.3) * height * 0.1;
      const x = i * pixel * 15 * scale;
      const y = yBase - hillHeight;
      // Draw a pine tree shape
      poly([
        [x, y - pixel * 40 * scale],
        [x - pixel * 15 * scale, y],
        [x + pixel * 15 * scale, y]
      ], colorBase);
      // Small trunk/base
      rect(x - pixel * scale, y, pixel * 2 * scale, height, colorBase);
    }
    // Fill the bottom
    rect(0, yBase, width, height, colorBase);
    ctx.restore();
  };

  // Layered forest in the fog
  drawMistyPineHills(height * 0.45, 1.2, 0.3, "#7a9c98");
  drawMistyPineHills(height * 0.55, 1.5, 0.4, "#5b807b");
  drawMistyPineHills(height * 0.7, 2, 0.6, "#40635e");

  // Snow-covered ground
  poly([
    [0, height * 0.65],
    [width * 0.4, height * 0.8],
    [width, height * 0.6],
    [width, height],
    [0, height]
  ], "#e8f2f2"); // base snow

  poly([
    [0, height * 0.7],
    [width * 0.5, height * 0.85],
    [width, height * 0.65],
    [width, height],
    [0, height]
  ], "#ffffff"); // bright snow highlight

  // Detailed foreground snowy pine trees
  const drawSnowyPine = (tx, ty, scale) => {
    const p = pixel * scale;
    // Trunk
    rect(tx - p * 1.5, ty - p * 5, p * 3, p * 15, "#3b2a22");

    // Tier drawing function
    const drawTier = (cy, w, h) => {
      // Dark green base
      poly([
        [tx, cy - h],
        [tx - w, cy],
        [tx + w, cy]
      ], "#1c4036");
      // Highlights (left side)
      poly([
        [tx, cy - h],
        [tx - w, cy],
        [tx - w * 0.2, cy]
      ], "#2a594b");
      // Snow on the branches
      poly([
        [tx, cy - h],
        [tx - w * 0.8, cy - h * 0.2],
        [tx + w * 0.8, cy - h * 0.2],
        [tx, cy - h - p * 2]
      ], "#ffffff");
      // Snow clumps on the edges
      rect(tx - w + p, cy - p * 2, p * 4, p * 2, "#ffffff");
      rect(tx + w - p * 5, cy - p * 2, p * 4, p * 2, "#ffffff");
      rect(tx - w * 0.5, cy - p * 3, p * 3, p * 3, "#ffffff");
      rect(tx + w * 0.3, cy - p * 3, p * 3, p * 3, "#ffffff");
    };

    // Draw tiers bottom to top
    drawTier(ty, p * 22, p * 25);
    drawTier(ty - p * 15, p * 18, p * 20);
    drawTier(ty - p * 28, p * 14, p * 16);
    drawTier(ty - p * 38, p * 10, p * 12);

    // Top spike
    rect(tx - p, ty - p * 50, p * 2, p * 6, "#2a594b");
  };

  drawSnowyPine(width * 0.15, height * 0.8, 0.8);
  drawSnowyPine(width * 0.35, height * 0.88, 1.2);
  drawSnowyPine(width * 0.7, height * 0.82, 0.9);
  drawSnowyPine(width * 0.85, height * 0.75, 0.6);

  // Animated falling snowflakes in the background
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const flakeX = (width * 0.05 * i + time * 0.02 * (i % 3)) % width;
    const flakeY = (time * 0.05 * (1 + i % 3) + i * 200) % height;
    rect(flakeX, flakeY, pixel * (1 + i % 2), pixel * (1 + i % 2), "#ffffff");
  }
  ctx.restore();
}

function drawPixelAutumnScene(rect, poly, width, height, pixel, time) {
  // Deep blue sky
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  sky.addColorStop(0, "#3f6b92");
  sky.addColorStop(1, "#5a8ba9");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Big fluffy white clouds at the top corners
  const drawCloud = (cx, cy, scale) => {
    const p = pixel * scale;
    // Shade
    rect(cx - p * 5, cy + p * 2, p * 10, p * 3, "#a5ccde");
    // Main body
    rect(cx - p * 6, cy, p * 12, p * 4, "#e3f0f7");
    rect(cx - p * 4, cy - p * 2, p * 8, p * 3, "#ffffff");
    rect(cx - p * 2, cy - p * 4, p * 5, p * 3, "#ffffff");
    rect(cx + p * 2, cy - p * 3, p * 4, p * 3, "#ffffff");
  };

  drawCloud(width * 0.1, height * 0.1, 4);
  drawCloud(width * 0.2, height * 0.25, 2.5);
  drawCloud(width * 0.9, height * 0.15, 5);
  drawCloud(width * 0.75, height * 0.3, 3);

  // Distant blue/purple mountain/trees silhouette
  poly([
    [0, height * 0.6],
    [width * 0.3, height * 0.52],
    [width * 0.5, height * 0.65],
    [width * 0.7, height * 0.55],
    [width, height * 0.48],
    [width, height * 0.65],
    [0, height * 0.65]
  ], "#4f5572");

  poly([
    [0, height * 0.65],
    [width * 0.4, height * 0.6],
    [width * 0.6, height * 0.7],
    [width * 0.8, height * 0.62],
    [width, height * 0.55],
    [width, height * 0.7],
    [0, height * 0.7]
  ], "#3a3d5e");

  // Ground (yellowish green field)
  rect(0, height * 0.65, width, height * 0.35, "#8da745");
  rect(0, height * 0.68, width, height * 0.1, "#c39e44"); // yellowish patch
  rect(width * 0.3, height * 0.7, width * 0.4, height * 0.15, "#d1b954");
  rect(0, height * 0.75, width * 0.3, height * 0.1, "#c35e39"); // orange/red ground patch

  // Foreground green bushes
  for (let i = 0; i < 15; i++) {
    const bx = (i * width * 0.08) % (width + 50) - 25;
    const by = height * 0.95 + (i % 3) * pixel * 4;
    const s = pixel * (4 + (i % 3) * 2);
    rect(bx - s, by - s, s * 2, s * 2, "#194a28");
    rect(bx - s * 0.8, by - s * 1.2, s * 1.6, s * 1.5, "#276b3b");
    rect(bx - s * 0.5, by - s * 1.5, s, s, "#429b4e"); // highlight
  }

  // Helper to draw an autumn tree
  const drawTree = (tx, ty, scale, leafColors) => {
    const p = pixel * scale;
    // Trunk
    rect(tx - p, ty - p * 15, p * 2, p * 15, "#2f2323");
    // Trunk highlight
    rect(tx, ty - p * 15, p, p * 15, "#4a3636");

    // Leaves clusters
    const drawLeaves = (cx, cy, radius, colorSet) => {
      // Base shadow
      rect(cx - radius, cy - radius * 0.8, radius * 2, radius * 1.6, colorSet[2]);
      // Mid color
      rect(cx - radius * 0.8, cy - radius, radius * 1.6, radius * 1.5, colorSet[1]);
      // Highlight
      rect(cx - radius * 0.5, cy - radius * 1.2, radius, radius, colorSet[0]);
    };

    // Draw multiple clusters around the top
    drawLeaves(tx, ty - p * 14, p * 8, leafColors);
    drawLeaves(tx - p * 5, ty - p * 12, p * 6, leafColors);
    drawLeaves(tx + p * 5, ty - p * 11, p * 6, leafColors);
    drawLeaves(tx, ty - p * 18, p * 6, leafColors);
    drawLeaves(tx - p * 3, ty - p * 16, p * 5, leafColors);
    drawLeaves(tx + p * 4, ty - p * 15, p * 5, leafColors);
  };

  // The 3 prominent trees
  const leftColors = ["#f29b27", "#dc6c1a", "#ba3520"]; // Orange/red
  const midColors = ["#ffe74a", "#eeb32a", "#db7214"]; // Bright yellow/orange
  const rightColors = ["#dc6c1a", "#c84524", "#9f2d1e"]; // Deep red

  // Left tree
  drawTree(width * 0.2, height * 0.85, 3.5, leftColors);
  // Middle tree
  drawTree(width * 0.45, height * 0.78, 2.5, midColors);
  // Right tree
  drawTree(width * 0.8, height * 0.88, 4, rightColors);

  // Fallen leaves drifting in the wind
  ctx.save();
  for (let i = 0; i < 20; i++) {
    const lx = (time * 0.1 * (1 + i % 3) + i * 100) % width;
    const ly = height * 0.7 + Math.sin(time * 0.002 + i) * height * 0.1 + (i * 20 % (height * 0.2));
    const c = (i % 2 === 0) ? "#dc6c1a" : "#f29b27";
    rect(lx, ly, pixel * 2, pixel * 1.5, c);
  }
  ctx.restore();
}

function drawPixelStarsScene(rect, poly, width, height, pixel, time) {
  // Deep dark blue/purple night sky
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#0a0a20");   // Very dark top
  sky.addColorStop(0.5, "#141538"); // Mid dark blue
  sky.addColorStop(1, "#262354");   // Lighter purple-blue at bottom
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Background pixel stars
  // Use a seeded or consistent pattern based on width/height so they don't flicker
  const drawStar = (sx, sy, size, type, glowColor) => {
    const p = pixel * size;
    if (type === 'cross') {
      rect(sx - p * 0.5, sy - p * 1.5, p, p * 3, glowColor);
      rect(sx - p * 1.5, sy - p * 0.5, p * 3, p, glowColor);
      rect(sx - p * 0.5, sy - p * 0.5, p, p, "#ffffff"); // center highlight
    } else if (type === 'dot') {
      rect(sx, sy, p, p, glowColor);
    } else if (type === 'big') {
      rect(sx - p, sy - p, p * 2, p * 2, glowColor);
      rect(sx - p * 0.5, sy - p * 0.5, p, p, "#ffffff");
      rect(sx - p * 0.5, sy - p * 2, p, p, glowColor);
      rect(sx - p * 0.5, sy + p, p, p, glowColor);
      rect(sx - p * 2, sy - p * 0.5, p, p, glowColor);
      rect(sx + p, sy - p * 0.5, p, p, glowColor);
    }
  };

  for (let i = 0; i < 80; i++) {
    const sx = (i * 137) % width;
    const sy = (i * 93) % (height * 0.8); // Mostly upper 80%
    // Twinkle effect
    const twinkle = Math.sin(time * 0.002 + i) > 0.8 ? "#ffffff" : (i % 3 === 0 ? "#ffde82" : "#9fbaf0");
    const type = i % 15 === 0 ? 'big' : (i % 7 === 0 ? 'cross' : 'dot');
    const size = i % 5 === 0 ? 1 : 0.5;

    // Only draw if it's shining or it's a solid star
    if (Math.sin(time * 0.001 + i * 10) > -0.5) {
      drawStar(sx, sy, size, type, twinkle);
    }
  }

  // Giant Glowing Moon
  const moonX = width * 0.5;
  const moonY = height * 0.3;
  const moonRadius = Math.min(width, height) * 0.12;
  const steps = 12;

  // Moon Glow (Subtle gradient rings)
  ctx.save();
  ctx.globalAlpha = 0.15;
  for (let g = 4; g > 0; g--) {
    const r = moonRadius + g * pixel * 4;
    poly([
      [moonX - r * 0.4, moonY - r], [moonX + r * 0.4, moonY - r],
      [moonX + r, moonY - r * 0.4], [moonX + r, moonY + r * 0.4],
      [moonX + r * 0.4, moonY + r], [moonX - r * 0.4, moonY + r],
      [moonX - r, moonY + r * 0.4], [moonX - r, moonY - r * 0.4]
    ], "#fff0b3");
  }
  ctx.restore();

  // Moon Body
  const drawCirclePixels = (cx, cy, radius, color) => {
    // A blocky circle approximation
    poly([
      [cx - radius * 0.4, cy - radius], [cx + radius * 0.4, cy - radius],
      [cx + radius * 0.8, cy - radius * 0.6], [cx + radius, cy - radius * 0.3],
      [cx + radius, cy + radius * 0.3], [cx + radius * 0.8, cy + radius * 0.6],
      [cx + radius * 0.4, cy + radius], [cx - radius * 0.4, cy + radius],
      [cx - radius * 0.8, cy + radius * 0.6], [cx - radius, cy + radius * 0.3],
      [cx - radius, cy - radius * 0.3], [cx - radius * 0.8, cy - radius * 0.6]
    ], color);
  };

  drawCirclePixels(moonX, moonY, moonRadius, "#fffdf0"); // Base bright moon

  // Moon Craters/Texture
  ctx.save();
  ctx.globalAlpha = 0.6;
  drawCirclePixels(moonX - moonRadius * 0.2, moonY + moonRadius * 0.2, moonRadius * 0.4, "#ffe2b8");
  drawCirclePixels(moonX + moonRadius * 0.3, moonY - moonRadius * 0.1, moonRadius * 0.3, "#ffe2b8");
  drawCirclePixels(moonX + moonRadius * 0.1, moonY + moonRadius * 0.4, moonRadius * 0.25, "#ffe2b8");
  drawCirclePixels(moonX - moonRadius * 0.4, moonY - moonRadius * 0.3, moonRadius * 0.15, "#ffe2b8");
  ctx.restore();

  // Glowing Nebula / Cloud Layer sweeping across
  // Layer 1
  ctx.save();
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 30; i++) {
    const cx = (width * i / 29);
    const cy = height * 0.75 + Math.sin(time * 0.0005 + i * 0.4) * height * 0.08;
    rect(cx, cy, width * 0.1, pixel * 20, "#3e327a");
    rect(cx - pixel * 5, cy - pixel * 8, width * 0.08, pixel * 8, "#2e245c");
  }
  ctx.restore();

  // Layer 2
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 40; i++) {
    const cx = (width * i / 39);
    const cy = height * 0.82 + Math.cos(time * 0.0006 + i * 0.3) * height * 0.06;
    rect(cx, cy, width * 0.08, pixel * 15, "#524499");
    rect(cx + pixel * 10, cy - pixel * 6, width * 0.05, pixel * 6, "#41357a");
  }
  ctx.restore();

  // Dark Silhouetted Mountains at the bottom
  const drawSilhouette = (yBase, scale, color) => {
    const steps = Math.floor(width / (pixel * 8 * scale)) + 1;
    for (let i = -1; i < steps; i++) {
      const h = Math.sin(i * 1.7) * height * 0.12 + Math.cos(i * 0.8) * height * 0.05;
      const x = i * pixel * 8 * scale;
      const y = yBase - h;
      poly([
        [x, y - pixel * 10 * scale],
        [x - pixel * 12 * scale, yBase],
        [x + pixel * 12 * scale, yBase]
      ], color);
      rect(x - pixel * 12 * scale, y, pixel * 24 * scale, height, color);
    }
  };

  drawSilhouette(height * 0.95, 2, "#13102b");
  drawSilhouette(height * 1.05, 3, "#080614");
}

function drawPixelResultScene(rect, poly, width, height, pixel, time) {
  // 1. Sky Gradient (Bright blue day)
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  sky.addColorStop(0, "#2993ed");
  sky.addColorStop(0.5, "#6bbdff");
  sky.addColorStop(1, "#bdeeff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Helper for drawing massive puffy clouds (white bodies with shaded bases)
  const drawResultClouds = (baseX, baseY, scale, wobbleAmt) => {
    const s = pixel * scale;
    const blocks = [
      // Deep Shadow (bottom-most layer)
      [-50, 40, 100, 15, "#a2bed4"],
      [-40, 25, 80, 20, "#a2bed4"],
      [-60, 35, 120, 12, "#a2bed4"],

      // Light Shadow (mid layer)
      [-46, 32, 92, 14, "#dbe6f5"],
      [-36, 18, 72, 18, "#dbe6f5"],
      [-22, 6, 44, 26, "#dbe6f5"],
      [6, 10, 36, 22, "#dbe6f5"],

      // Bright White Body (top-most layer)
      [-38, 20, 76, 15, "#ffffff"],
      [-28, 8, 56, 18, "#ffffff"],
      [-16, -4, 32, 24, "#ffffff"],
      [8, 2, 24, 20, "#ffffff"],
      [-46, 26, 92, 10, "#ffffff"],
    ];
    blocks.forEach(([bx, by, bw, bh, color], index) => {
      const wobble = Math.sin(time * 0.00035 + index + wobbleAmt) * pixel * 0.6;
      rect(baseX + bx * s + wobble, baseY + by * s, bw * s, bh * s, color);
    });
  };

  // 2. Render Puffy Clouds columns
  drawResultClouds(width * 0.22, height * 0.16, 1.8, 0);
  drawResultClouds(width * 0.65, height * 0.22, 1.3, 3.5);
  drawResultClouds(width * 0.95, height * 0.28, 1.0, 7.1);

  // 3. Far Mountains (soft teals)
  poly([
    [-pixel * 8, height * 0.58],
    [width * 0.22, height * 0.42],
    [width * 0.5, height * 0.54],
    [width * 0.72, height * 0.38],
    [width + pixel * 8, height * 0.56],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], "#82b5c7");

  poly([
    [-pixel * 8, height * 0.6],
    [width * 0.35, height * 0.48],
    [width * 0.68, height * 0.58],
    [width * 0.88, height * 0.44],
    [width + pixel * 8, height * 0.58],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], "#5e9cae");

  // Y calculator on the hills
  const getHillY = (x) => {
    if (x < width * 0.45) {
      return height * (0.62 - (x / (width * 0.45)) * 0.06);
    } else if (x < width * 0.8) {
      return height * (0.56 + ((x - width * 0.45) / (width * 0.35)) * 0.1);
    } else {
      return height * (0.66 - ((x - width * 0.8) / (width * 0.2)) * 0.06);
    }
  };

  // 4. Midground Hill Base
  poly([
    [-pixel * 8, height * 0.62],
    [width * 0.45, height * 0.56],
    [width * 0.8, height * 0.66],
    [width + pixel * 8, height * 0.6],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], "#8bc34a");

  // Midground Forest silhouette sits on the hill
  for (let i = 0; i < 35; i++) {
    const fx = (i * 47) % width;
    const fHeight = pixel * (5 + (i % 4) * 3);
    const fBaseY = getHillY(fx);
    poly([
      [fx - pixel * 3, fBaseY],
      [fx, fBaseY - fHeight],
      [fx + pixel * 3, fBaseY]
    ], "#3b7a57");
  }

  // 5. Cottage / Cabin on the left
  const drawCottage = (cx, cy, scale) => {
    const s = pixel * scale;
    const houseW = s * 18;
    const houseH = s * 12;

    // Roof (red-orange)
    poly([
      [cx - s * 2, cy - houseH],
      [cx + houseW / 2, cy - houseH - s * 6],
      [cx + houseW + s * 2, cy - houseH],
    ], "#c85c42");

    // Walls (warm beige)
    rect(cx, cy - houseH, houseW, houseH, "#dbccb4");
    rect(cx + houseW * 0.5, cy - houseH, houseW * 0.5, houseH, "#c2b29a"); // shadow side

    // Door
    rect(cx + houseW * 0.15, cy - s * 7, s * 3, s * 7, "#4e352b");

    // Window (glowing yellow light)
    rect(cx + houseW * 0.58, cy - s * 8, s * 4, s * 4, "#4e352b");
    rect(cx + houseW * 0.62, cy - s * 7.2, s * 2.5, s * 2.5, "#ffea00");
  };
  drawCottage(width * 0.18, getHillY(width * 0.18) + pixel * 2, 0.95);

  // 6. Utility Poles & Swaying Wires
  const drawUtilityPole = (px, cy, scale) => {
    const s = pixel * scale;
    const poleH = height * 0.42 * scale;
    const poleW = s * 1.5;

    // Pole
    rect(px - poleW / 2, cy - poleH, poleW, poleH, "#353032");
    rect(px, cy - poleH, poleW / 2, poleH, "#4f4548");

    // Crossbar 1
    const cb1Y = cy - poleH + poleH * 0.08;
    const cb1W = s * 16;
    const cb1H = s * 1.2;
    rect(px - cb1W / 2, cb1Y, cb1W, cb1H, "#353032");
    rect(px - cb1W / 2, cb1Y, cb1W, cb1H / 2, "#4f4548");

    // Crossbar 2
    const cb2Y = cy - poleH + poleH * 0.22;
    const cb2W = s * 12;
    const cb2H = s * 1.2;
    rect(px - cb2W / 2, cb2Y, cb2W, cb2H, "#353032");
    rect(px - cb2W / 2, cb2Y, cb2W, cb2H / 2, "#4f4548");

    // Insulators
    rect(px - cb1W * 0.4, cb1Y - s, s, s, "#eceff1");
    rect(px - cb1W * 0.15, cb1Y - s, s, s, "#eceff1");
    rect(px + cb1W * 0.15, cb1Y - s, s, s, "#eceff1");
    rect(px + cb1W * 0.4, cb1Y - s, s, s, "#eceff1");
    rect(px - cb2W * 0.35, cb2Y - s, s, s, "#eceff1");
    rect(px + cb2W * 0.35, cb2Y - s, s, s, "#eceff1");

    return {
      topL: [px - cb1W * 0.4, cb1Y],
      topR: [px + cb1W * 0.4, cb1Y],
      midL: [px - cb2W * 0.35, cb2Y],
      midR: [px + cb2W * 0.35, cb2Y],
    };
  };

  const drawSwayingWire = (p1, p2, sag, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, pixel * 0.25);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    const midX = (p1[0] + p2[0]) / 2;
    const midY = (p1[1] + p2[1]) / 2 + sag + Math.sin(time * 0.001 + p1[0] * 0.01) * pixel * 1.2;
    ctx.quadraticCurveTo(midX, midY, p2[0], p2[1]);
    ctx.stroke();
  };

  const pole1 = drawUtilityPole(width * 0.76, getHillY(width * 0.76) + pixel * 12, 1.1);
  const pole2 = drawUtilityPole(width * 0.42, getHillY(width * 0.42) + pixel * 6, 0.6);

  // Draw connected lines between pole 2 and pole 1
  drawSwayingWire(pole2.topL, pole1.topL, pixel * 5, "rgba(25, 30, 28, 0.75)");
  drawSwayingWire(pole2.topR, pole1.topR, pixel * 5, "rgba(25, 30, 28, 0.75)");
  drawSwayingWire(pole2.midL, pole1.midL, pixel * 6, "rgba(25, 30, 28, 0.75)");
  drawSwayingWire(pole2.midR, pole1.midR, pixel * 6, "rgba(25, 30, 28, 0.75)");

  // Draw lines going offscreen
  drawSwayingWire([-width * 0.1, height * 0.45], pole2.midL, pixel * 7, "rgba(25, 30, 28, 0.45)");
  drawSwayingWire(pole1.midR, [width * 1.1, height * 0.6], pixel * 8, "rgba(25, 30, 28, 0.45)");

  // 7. Large Swaying Tree on the right side
  drawPixelTree(rect, width * 0.88, getHillY(width * 0.88) + pixel * 18, pixel, 0.95, true, time);

  // 8. Foreground grass hills
  poly([
    [-pixel * 8, height * 0.74],
    [width * 0.35, height * 0.68],
    [width * 0.7, height * 0.78],
    [width + pixel * 8, height * 0.72],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], "#7cb342");

  poly([
    [-pixel * 8, height * 0.82],
    [width * 0.5, height * 0.78],
    [width + pixel * 8, height * 0.84],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], "#558b2f");

  // 9. Scatter Flowers
  for (let i = 0; i < 40; i++) {
    const fx = (i * 97) % width;
    const fy = height * 0.8 + ((i * 13) % Math.max(1, height * 0.18));
    const color = i % 3 === 0 ? "#ff8a80" : i % 2 === 0 ? "#ffe082" : "#ffffff";
    rect(fx, fy, pixel * 2, pixel * 2, color);
    rect(fx - pixel, fy + pixel, pixel * 4, pixel, "#33691e"); // base leaf
  }

  // 10. Swaying Grass Reeds in bottom foreground
  const grassCount = Math.min(60, Math.floor(width / 16));
  ctx.strokeStyle = "#2e5c12";
  ctx.lineWidth = pixel * 1.5;
  for (let i = 0; i < grassCount; i++) {
    const gx = (i * 27 + 13) % width;
    const gHeight = pixel * (10 + (i % 6) * 4);
    const gBaseY = height + pixel * 2;
    const windForce = Math.sin(time * 0.0028 + gx * 0.02) * pixel * (3 + (i % 3) * 2);
    ctx.beginPath();
    ctx.moveTo(gx, gBaseY);
    const lean = pixel * 5 + windForce;
    ctx.quadraticCurveTo(gx + lean * 0.5, gBaseY - gHeight * 0.5, gx + lean, gBaseY - gHeight);
    ctx.stroke();
  }

  // 11. Falling / drifting leaves particles
  for (let i = 0; i < 20; i++) {
    const seed = i * 117;
    const speedX = 0.00015 + (seed % 4) * 0.00003;
    const speedY = 0.00003 + (seed % 3) * 0.00001;
    const driftX = ((time * speedX + seed) % 1.5) - 0.25;
    const px = width * driftX;
    const wave = Math.sin(time * 0.002 + seed) * pixel * 6;
    const py = height * (0.35 + (seed % 7) * 0.08) + (time * speedY * height) % (height * 0.15) + wave;
    const colors = ["#8bc34a", "#ffeb3b", "#cddc39", "#4caf50"];
    const color = colors[seed % colors.length];
    rect(px, py, pixel * 2, pixel, color);
    rect(px + pixel, py + pixel, pixel, pixel, color);
  }

  // 12. Draw Wind Streaks (already custom functions)
  drawPixelWind(rect, width, height, pixel, time);
}

function lerpColor(c1, c2, t) {
  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);

  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

function drawPixelStoryScene(rect, poly, width, height, pixel, time) {
  // Initialize story bg state (stars & clouds) if not done
  if (!storyBgState.initialized) {
    storyBgState.initialized = true;
    storyBgState.currentTime = 0.0;
    storyBgState.targetTime = 0.0;
    // Generate stars
    storyBgState.stars = [];
    for (let i = 0; i < 60; i++) {
      storyBgState.stars.push({
        x: Math.random(),
        y: Math.random() * 0.65,
        size: Math.random() > 0.7 ? 2 : 1,
        phase: Math.random() * Math.PI * 2
      });
    }
    // Generate clouds
    storyBgState.clouds = [];
    for (let i = 0; i < 5; i++) {
      storyBgState.clouds.push({
        x: Math.random(),
        y: 0.12 + Math.random() * 0.28,
        width: 25 + Math.random() * 25,
        speed: 0.01 + Math.random() * 0.015
      });
    }
  }

  // Smoothly update currentTime towards targetTime
  storyBgState.currentTime += (storyBgState.targetTime - storyBgState.currentTime) * 0.02;

  // Let's ensure wrappedTime is safe
  const wrappedTime = ((storyBgState.currentTime % 1.0) + 1.0) % 1.0;

  // Calculate interpolation keyframes
  const idx = Math.floor(wrappedTime / 0.25);
  const nextIdx = (idx + 1) % 4;
  const progress = (wrappedTime % 0.25) / 0.25;

  const keyframes = [
    { // 0: Day
      skyTop: "#3a8bfd", skyMid: "#7ac5ff", skyBottom: "#bde0ff",
      hillsFar: "#5c92c5", hillsMid: "#529367", hillsNear: "#2e7d32"
    },
    { // 1: Sunset
      skyTop: "#2c1e5c", skyMid: "#e05d6f", skyBottom: "#ffb076",
      hillsFar: "#2b2647", hillsMid: "#3c383e", hillsNear: "#2a2224"
    },
    { // 2: Night
      skyTop: "#0a0b1c", skyMid: "#141736", skyBottom: "#1e2456",
      hillsFar: "#111222", hillsMid: "#181c2f", hillsNear: "#0e1220"
    },
    { // 3: Sunrise
      skyTop: "#182c61", skyMid: "#fc8c64", skyBottom: "#ffd384",
      hillsFar: "#21213f", hillsMid: "#352a36", hillsNear: "#201c24"
    }
  ];

  const k1 = keyframes[idx];
  const k2 = keyframes[nextIdx];

  const currentColors = {
    skyTop: lerpColor(k1.skyTop, k2.skyTop, progress),
    skyMid: lerpColor(k1.skyMid, k2.skyMid, progress),
    skyBottom: lerpColor(k1.skyBottom, k2.skyBottom, progress),
    hillsFar: lerpColor(k1.hillsFar, k2.hillsFar, progress),
    hillsMid: lerpColor(k1.hillsMid, k2.hillsMid, progress),
    hillsNear: lerpColor(k1.hillsNear, k2.hillsNear, progress)
  };

  // 1. Sky Gradient (Dithered Bands for retro feel)
  const bands = 15;
  const bandHeight = height / bands;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    let color;
    if (t < 0.5) {
      color = lerpColor(currentColors.skyTop, currentColors.skyMid, t * 2);
    } else {
      color = lerpColor(currentColors.skyMid, currentColors.skyBottom, (t - 0.5) * 2);
    }
    rect(0, i * bandHeight, width, bandHeight + 2, color);
  }

  // 2. Stars (Opacity based on time of day)
  let starsOpacity = 0.0;
  if (wrappedTime >= 0.0 && wrappedTime < 0.25) {
    starsOpacity = 0.0; // Day
  } else if (wrappedTime >= 0.25 && wrappedTime < 0.5) {
    starsOpacity = (wrappedTime - 0.25) / 0.25; // Fades in
  } else if (wrappedTime >= 0.5 && wrappedTime < 0.75) {
    starsOpacity = 1.0; // Full night
  } else {
    starsOpacity = 1.0 - (wrappedTime - 0.75) / 0.25; // Fades out
  }

  if (starsOpacity > 0.0) {
    storyBgState.stars.forEach(star => {
      const starOpacity = (Math.sin(time * 0.003 + star.phase) * 0.4 + 0.6) * starsOpacity;
      rect(
        star.x * width,
        star.y * height,
        pixel * star.size,
        pixel * star.size,
        "rgba(255, 255, 255, " + starOpacity.toFixed(2) + ")"
      );
    });
  }

  // 3. Sun and Moon Orbit Position
  const theta = -Math.PI / 2 + wrappedTime * 2 * Math.PI;
  const cx = width / 2;
  const cy = height * 1.1;
  const rx = width * 0.46;
  const ry = height * 0.78;

  // Sun
  const sunX = cx + Math.cos(theta) * rx;
  const sunY = cy + Math.sin(theta) * ry;
  // Moon
  const moonX = cx + Math.cos(theta + Math.PI) * rx;
  const moonY = cy + Math.sin(theta + Math.PI) * ry;

  // Draw Sun if above horizon
  if (sunY < height * 0.95) {
    rect(sunX - pixel * 10, sunY - pixel * 10, pixel * 20, pixel * 20, "rgba(255, 140, 0, 0.15)");
    rect(sunX - pixel * 7, sunY - pixel * 7, pixel * 14, pixel * 14, "rgba(255, 190, 40, 0.35)");
    rect(sunX - pixel * 5, sunY - pixel * 5, pixel * 10, pixel * 10, "#ffdf6d");
    rect(sunX - pixel * 3, sunY - pixel * 3, pixel * 6, pixel * 6, "#ffffff");
    rect(sunX - pixel * 12, sunY - pixel, pixel * 4, pixel * 2, "#ffdf6d");
    rect(sunX + pixel * 8, sunY - pixel, pixel * 4, pixel * 2, "#ffdf6d");
    rect(sunX - pixel, sunY - pixel * 12, pixel * 2, pixel * 4, "#ffdf6d");
    rect(sunX - pixel, sunY + pixel * 8, pixel * 2, pixel * 4, "#ffdf6d");
  }

  // Draw Moon if above horizon
  if (moonY < height * 0.95) {
    rect(moonX - pixel * 8, moonY - pixel * 8, pixel * 16, pixel * 16, "rgba(220, 235, 255, 0.12)");
    const moonPixels = [
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0]
    ];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (moonPixels[r][c] === 1) {
          rect(moonX + (c - 4) * pixel * 2, moonY + (r - 4) * pixel * 2, pixel * 2, pixel * 2, "#eef5ff");
        }
      }
    }
  }

  // 4. Clouds
  let cloudColor = "rgba(255, 255, 255, 0.28)";
  if (idx === 1) cloudColor = "rgba(255, 171, 145, 0.32)";
  else if (idx === 2) cloudColor = "rgba(90, 100, 150, 0.18)";
  else if (idx === 3) cloudColor = "rgba(255, 200, 170, 0.28)";

  storyBgState.clouds.forEach(cloud => {
    cloud.x = (cloud.x + cloud.speed * 0.01) % 1.2;
    const cx_pos = (cloud.x - 0.1) * width;
    const cy_pos = cloud.y * height;
    const cw = cloud.width * pixel;
    const ch = pixel * 5;
    rect(cx_pos - cw / 2, cy_pos - ch / 2, cw, ch, cloudColor);
    rect(cx_pos - cw * 0.7 / 2, cy_pos - ch * 1.5 / 2, cw * 0.7, ch * 1.5, cloudColor);
  });

  // 5. Far Mountains (Layer 3)
  poly([
    [-pixel * 8, height * 0.75],
    [width * 0.15, height * 0.58],
    [width * 0.35, height * 0.68],
    [width * 0.55, height * 0.52],
    [width * 0.72, height * 0.65],
    [width * 0.9, height * 0.54],
    [width + pixel * 8, height * 0.64],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], currentColors.hillsFar);

  // 6. Mid Hills (Layer 2)
  poly([
    [-pixel * 8, height * 0.8],
    [width * 0.25, height * 0.7],
    [width * 0.52, height * 0.76],
    [width * 0.78, height * 0.68],
    [width + pixel * 8, height * 0.78],
    [width + pixel * 8, height],
    [-pixel * 8, height]
  ], currentColors.hillsMid);

  // 7. Ground / Near Forest (Layer 1)
  const groundY = height * 0.83;
  rect(0, groundY, width, height - groundY + pixel * 2, currentColors.hillsNear);

  const numTrees = Math.ceil(width / (pixel * 18));
  for (let i = 0; i <= numTrees; i++) {
    const seedX = Math.sin(i * 12.3) * pixel * 4;
    const treeX = i * (pixel * 18) + seedX;
    const hScale = 0.8 + Math.abs(Math.sin(i * 4.5)) * 0.6;
    const trunkW = pixel * 2;
    const trunkH = pixel * 9 * hScale;
    const ty = groundY + pixel * 2;
    rect(treeX - trunkW / 2, ty - trunkH, trunkW, trunkH, "#402418");
    const leafY = ty - trunkH;
    rect(treeX - pixel * 7, leafY - pixel * 3, pixel * 14, pixel * 3, currentColors.hillsNear);
    rect(treeX - pixel * 5, leafY - pixel * 6, pixel * 10, pixel * 3, currentColors.hillsNear);
    rect(treeX - pixel * 3, leafY - pixel * 9, pixel * 6, pixel * 3, currentColors.hillsNear);
    rect(treeX - pixel * 1.5, leafY - pixel * 12, pixel * 3, pixel * 3, currentColors.hillsNear);
  }

  // 8. Falling pink cherry blossom petals
  for (let i = 0; i < 15; i++) {
    const seed = i * 223;
    const driftX = ((time * 0.00012 + seed) % 1.5) - 0.25;
    const px = width * driftX;
    const wave = Math.sin(time * 0.0024 + seed) * pixel * 5;
    const py = height * (0.3 + (seed % 6) * 0.09) + (time * 0.00002 * height) % (height * 0.12) + wave;
    rect(px, py, pixel * 2, pixel, "#ffb2c8");
  }

  // 9. Draw wind streaks
  drawPixelWind(rect, width, height, pixel, time);
}

function drawPixelGalleryScene(rect, poly, width, height, pixel, time) {
  // Helper to draw a pixel-art heart centered inside white squares
  const drawPixelHeart = (hx, hy, p) => {
    const drawRect = (rx, ry, rw, rh, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(hx + rx * p), Math.round(hy + ry * p), rw * p, rh * p);
    };
    const outline = "#e55b7c";
    const fill = "#fca5be";
    const highlight = "#ffffff";

    // Fills
    drawRect(3, 1, 1, 1, fill);
    drawRect(5, 1, 2, 1, fill);
    drawRect(2, 2, 6, 1, fill);
    drawRect(1, 3, 7, 1, fill);
    drawRect(2, 4, 5, 1, fill);
    drawRect(3, 5, 3, 1, fill);
    drawRect(4, 6, 1, 1, fill);

    // Highlight
    drawRect(2, 1, 1, 1, highlight);
    drawRect(1, 2, 1, 1, highlight);

    // Outline
    drawRect(2, 0, 2, 1, outline);
    drawRect(5, 0, 2, 1, outline);
    drawRect(1, 1, 1, 1, outline);
    drawRect(4, 1, 1, 1, outline);
    drawRect(7, 1, 1, 1, outline);
    drawRect(0, 2, 1, 2, outline);
    drawRect(8, 2, 1, 2, outline);
    drawRect(1, 4, 1, 1, outline);
    drawRect(7, 4, 1, 1, outline);
    drawRect(2, 5, 1, 1, outline);
    drawRect(6, 5, 1, 1, outline);
    drawRect(3, 6, 1, 1, outline);
    drawRect(5, 6, 1, 1, outline);
    drawRect(4, 7, 1, 1, outline);
  };

  // Checkered board sizes (alternate white and pink)
  const S = pixel * 24;
  const offset = (time * 0.012) % S; // diagonal scrolling

  // Draw background tiles
  for (let x = -S * 2; x < width + S * 2; x += S) {
    for (let y = -S * 2; y < height + S * 2; y += S) {
      const drawX = x + offset;
      const drawY = y + offset;

      const col = Math.floor(x / S);
      const row = Math.floor(y / S);
      const isPink = (col + row) % 2 === 0;

      if (isPink) {
        ctx.fillStyle = "#ffb2c8"; // Pastel Pink
        ctx.fillRect(Math.round(drawX), Math.round(drawY), S, S);
      } else {
        ctx.fillStyle = "#ffffff"; // White
        ctx.fillRect(Math.round(drawX), Math.round(drawY), S, S);

        // Draw centered pixel-art heart
        const heartX = drawX + (S - 9 * pixel) / 2;
        const heartY = drawY + (S - 8 * pixel) / 2;
        drawPixelHeart(heartX, heartY, pixel);
      }
    }
  }
}

function drawPixelWind(rect, width, height, pixel, time) {
  const winds = [
    { baseX: 0.12, baseY: 0.38, len: 5, speed: 0.00008, phase: 0 },
    { baseX: 0.55, baseY: 0.44, len: 4, speed: 0.00007, phase: 2.2 },
    { baseX: 0.78, baseY: 0.35, len: 3, speed: 0.00009, phase: 4.1 },
    { baseX: 0.35, baseY: 0.52, len: 4, speed: 0.00006, phase: 1.5 },
    { baseX: 0.88, baseY: 0.48, len: 3, speed: 0.00007, phase: 3.3 },
  ];

  for (const w of winds) {
    const drift = ((time * w.speed + w.phase) % 1.4) - 0.2;
    const x = width * drift;
    const y = height * w.baseY + Math.sin(time * 0.0006 + w.phase) * pixel * 4;
    const fadeIn = Math.min(1, drift * 5);
    const fadeOut = Math.min(1, (1.2 - drift) * 5);
    const alpha = Math.max(0, Math.min(0.45, fadeIn * fadeOut * 0.45));

    if (alpha < 0.02) continue;

    ctx.globalAlpha = alpha;

    for (let j = 0; j < w.len; j += 1) {
      const segW = pixel * (3 + ((j * 7) % 4));
      const gap = pixel * (2 + (j % 2));
      const segX = x + j * (segW + gap);
      const segY = y + Math.sin(j * 1.2 + time * 0.001) * pixel;
      rect(segX, segY, segW, pixel, "rgba(255, 255, 255, 0.9)");
    }
  }

  ctx.globalAlpha = 1;
}

function drawPixelCloudBank(rect, width, height, pixel, time) {
  const blockCloud = (baseX, baseY, scale, tone = 0) => {
    const s = pixel * scale;
    const blocks = [
      [-36, 18, 20, 8, "#f2f7ff"],
      [-28, 10, 18, 16, "#ffffff"],
      [-18, 2, 22, 22, "#ffffff"],
      [0, -8, 24, 30, "#f8fbff"],
      [18, 0, 22, 24, "#ffffff"],
      [38, 8, 24, 16, "#f2f7ff"],
      [-42, 24, 96, 10, "#ffffff"],
      [-34, 34, 86, 8, "#e0ebfa"],
      [-12, 42, 64, 6, "#cfdeef"],
    ];
    blocks.forEach(([x, y, w, h, color], index) => {
      const wobble = Math.sin(time * 0.00025 + index + tone) * pixel * 0.45;
      rect(baseX + x * s + wobble, baseY + y * s, w * s, h * s, color);
    });
  };

  for (let i = 0; i < 8; i += 1) {
    const x = width * (-0.06 + i * 0.16) + Math.sin(time * 0.00012 + i) * pixel * 2;
    const y = height * (0.26 + (i % 3) * 0.035);
    blockCloud(x, y, 0.82 + (i % 4) * 0.12, i);
  }

  blockCloud(width * 0.44, height * 0.16, 1.18, 8);
  blockCloud(width * 0.82, height * 0.13, 1.28, 9);
  rect(0, height * 0.42, width, pixel * 10, "rgba(230, 244, 255, 0.72)");
  rect(0, height * 0.45, width, pixel * 6, "rgba(198, 225, 246, 0.45)");
}

function drawPixelMountains(rect, poly, width, height, pixel, time) {
  const base = height * 0.58;
  const drift = Math.sin(time * 0.0001) * pixel * 3;

  poly([
    [-pixel * 8, base + pixel * 12],
    [width * 0.12 + drift, base - pixel * 34],
    [width * 0.28, base - pixel * 8],
    [width * 0.44, base - pixel * 52],
    [width * 0.62, base - pixel * 14],
    [width * 0.78, base - pixel * 64],
    [width + pixel * 8, base - pixel * 4],
    [width + pixel * 8, base + pixel * 16],
  ], "#86c9df");

  poly([
    [-pixel * 8, base + pixel * 20],
    [width * 0.2, base - pixel * 20],
    [width * 0.38, base - pixel * 6],
    [width * 0.55, base - pixel * 42],
    [width * 0.74, base - pixel * 12],
    [width * 0.94, base - pixel * 35],
    [width + pixel * 8, base + pixel * 8],
    [width + pixel * 8, base + pixel * 22],
  ], "#6fb7c2");

  for (let i = 0; i < 42; i += 1) {
    const x = i * pixel * 12 - pixel * 8;
    const y = base - pixel * (10 + (i % 8) * 4);
    rect(x, y, pixel * (8 + (i % 3) * 3), pixel * 3, i % 2 ? "#a6e5c9" : "#d8f1ff");
    if (i % 4 === 0) rect(x + pixel * 3, y + pixel * 8, pixel * 14, pixel * 4, "#4e94ab");
  }

  rect(0, base + pixel * 8, width, pixel * 16, "rgba(184, 223, 200, 0.78)");
  rect(0, base + pixel * 22, width, pixel * 10, "rgba(134, 198, 152, 0.62)");
}

function drawPixelMeadow(rect, width, height, pixel, time) {
  const top = height * 0.58;
  rect(0, top, width, height - top, "#d9ee7a");
  rect(0, top + pixel * 10, width, pixel * 16, "#bce55e");
  rect(0, top + pixel * 26, width, pixel * 18, "#8ed24d");
  rect(0, top + pixel * 45, width, pixel * 40, "#5fb447");

  for (let i = 0; i < 210; i += 1) {
    const x = (i * 37 + Math.sin(i) * 19) % width;
    const y = top + pixel * 8 + ((i * 23) % Math.max(1, height - top - pixel * 12));
    const color = i % 11 === 0 ? "#ff6b8e" : i % 7 === 0 ? "#fff8b5" : i % 5 === 0 ? "#ffffff" : "#2f9c42";
    const size = i % 9 === 0 ? pixel * 2 : pixel;
    rect(x, y + Math.sin(time * 0.001 + i) * pixel * 0.5, size, size, color);
  }
}

function drawPixelTree(rect, x, baseY, pixel, scale, large, time) {
  const trunkW = pixel * (large ? 13 : 5) * scale;
  const trunkH = pixel * (large ? 92 : 38) * scale;
  const trunkX = x;
  rect(trunkX, baseY - trunkH, trunkW, trunkH, "#3f2d2f");
  rect(trunkX + trunkW * 0.42, baseY - trunkH, trunkW * 0.42, trunkH, "#5b3c3e");
  rect(trunkX - trunkW * 0.16, baseY - trunkH * 0.72, trunkW * 1.2, pixel * 8 * scale, "#2e2529");
  rect(trunkX + trunkW * 0.42, baseY - trunkH * 0.52, trunkW * 1.6, pixel * 7 * scale, "#2f282b");
  rect(trunkX - trunkW * 0.5, baseY - trunkH * 0.42, trunkW * 1.9, pixel * 5 * scale, "#4f3536");
  rect(trunkX - trunkW * 0.25, baseY - trunkH * 0.18, trunkW * 1.35, pixel * 4 * scale, "#6b4742");

  const leafColors = ["#173f36", "#23683d", "#4caf45", "#8fd94f", "#c8f36a"];
  const clusters = large
    ? [
      [-74, -150, 46, 34, 1], [-42, -170, 50, 38, 2], [0, -162, 54, 34, 3], [42, -144, 42, 30, 4],
      [-96, -118, 58, 38, 0], [-58, -132, 64, 42, 1], [-8, -126, 70, 40, 2], [48, -112, 56, 34, 3],
      [-112, -82, 66, 40, 0], [-66, -92, 74, 42, 1], [-8, -88, 70, 38, 2], [48, -78, 60, 32, 3],
      [-100, -46, 58, 34, 0], [-52, -54, 70, 36, 1], [8, -50, 64, 32, 2],
    ]
    : [
      [-18, -54, 18, 14, 1], [-8, -66, 22, 18, 3], [10, -54, 20, 14, 4],
      [-22, -36, 28, 16, 1], [2, -34, 30, 18, 2],
    ];

  clusters.forEach(([cx, cy, cw, ch, colorIndex]) => {
    const sway = Math.sin(time * 0.0009 + cx * 0.08 + cy * 0.03) * pixel * (large ? 1.4 : 0.6);
    rect(x + cx * pixel * scale + sway, baseY + cy * pixel * scale, cw * pixel * scale, ch * pixel * scale, leafColors[colorIndex]);
    rect(x + (cx + 4) * pixel * scale + sway, baseY + (cy + 5) * pixel * scale, Math.max(pixel * scale * 3, cw * pixel * scale * 0.34), pixel * scale * 4, leafColors[Math.min(4, colorIndex + 1)]);
    rect(x + (cx + cw - 10) * pixel * scale + sway, baseY + (cy + 8) * pixel * scale, pixel * scale * 6, pixel * scale * 5, "#d4f66a");
  });
}

function drawPixelForeground(rect, width, height, pixel, time) {
  const y = height * 0.86;
  rect(0, y, width, height - y, "#163f38");
  for (let i = 0; i < 120; i += 1) {
    const x = (i * 53) % width;
    const color = i % 4 === 0 ? "#57b3e5" : i % 5 === 0 ? "#b34cc9" : i % 6 === 0 ? "#f5de4e" : "#6dd05a";
    rect(x, y + ((i * 17) % Math.max(pixel, height - y - pixel * 2)), pixel * 2, pixel * 2, color);
  }
  for (let i = 0; i < 24; i += 1) {
    const x = (i * 101) % width;
    rect(x, y - pixel * (2 + (i % 3)), pixel * (8 + (i % 4) * 2), pixel * 4, "rgba(30, 54, 61, 0.9)");
  }
}


function drawParticle(particle, time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const depth = 0.35 + particle.z * 1.7;

  if (currentScene === "gallery" || (currentScene === "quiz" && currentSeason === "stars")) {
    return; // No particles on memories page or night/stars quiz page!
  }

  // 1. Result scene particle configurations
  if (currentScene === "result") {
    if (resultPercent >= 31 && resultPercent <= 75) {
      // Middle bond level: NO particles!
      return;
    }
  }

  const isStorm = currentScene === "result" && resultPercent <= 30;
  const isConfetti = currentScene === "result" && resultPercent >= 75;
  const speedMultiplier = currentScene === "proposal" ? 2.2 : currentSeason === "stars" ? 1.8 : 1;
  const particleMode = currentScene === "landing" ? "space" : currentSeason;

  // 2. Particle movement physics
  if (isStorm) {
    // Storm particles blow hard diagonally
    particle.x += 11 * depth;
    particle.y += 6 * depth;
  } else if (isConfetti) {
    // Confetti falls and sways
    particle.drift += 0.03 * depth;
    particle.x += Math.sin(particle.drift) * 1.5 * particle.speed;
    particle.y += particle.speed * depth * 1.5;
  } else if (particleMode === "rain") {
    // Rain falls straight down
    particle.y += 6 * depth;
  } else {
    particle.drift += 0.006 * depth;
    particle.x += Math.cos(particle.drift) * particle.speed * speedMultiplier;
    particle.y += particle.speed * depth * speedMultiplier;
  }

  // 3. Coordinate bounds reset
  if (particle.y > height + 24) {
    particle.y = -24;
    particle.x = Math.random() * width;
  }
  if (particle.x < -28) particle.x = width + 28;
  if (particle.x > width + 28) {
    particle.x = -28;
    if (isStorm) {
      // For storm, randomize Y so they don't only cluster at the top
      particle.y = Math.random() * height;
    }
  }

  // 4. Render Storm Debris
  if (isStorm) {
    ctx.save();
    ctx.globalAlpha = 0.35 + particle.z * 0.45;
    ctx.strokeStyle = "rgba(100, 112, 125, 0.8)";
    ctx.lineWidth = Math.max(1, Math.round(depth * 1.5));
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particle.x + 12 * depth, particle.y + 7 * depth);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // 5. Render Confetti
  if (isConfetti) {
    const confettiColors = ["#ff1744", "#d500f9", "#2979ff", "#00e5ff", "#00e676", "#ffea00", "#ff9100"];
    const confettiColor = confettiColors[Math.floor(particle.hue) % confettiColors.length];
    ctx.save();
    ctx.globalAlpha = 0.8 + particle.z * 0.2;
    ctx.fillStyle = confettiColor;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(time * 0.003 + particle.drift);
    const cw = Math.max(3, Math.round(5 * depth));
    const ch = Math.max(2, Math.round(3 * depth));
    ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
    ctx.restore();
    return;
  }

  const seasonHue = {
    space: 212,
    spring: 330,
    summer: 46,
    rain: 194,
    winter: 205,
    autumn: 28,
    stars: 54,
    result: 345, // Soft pink/rose for high bond!
  }[currentSeason] || particle.hue;

  ctx.save();
  ctx.globalAlpha = 0.28 + particle.z * 0.55;
  ctx.translate(particle.x, particle.y);

  // Do not rotate rain particles so they stay perfectly vertical
  if (particleMode !== "rain") {
    ctx.rotate(Math.sin(time * 0.001 + particle.drift));
  }

  if (particleMode === "rain") {
    ctx.fillStyle = "rgba(190, 240, 255, 0.7)";
    if (currentScene !== "landing") {
      // Pixel rain
      ctx.fillRect(0, 0, Math.max(1, depth), 12 * depth);
    } else {
      ctx.strokeStyle = "rgba(190, 240, 255, 0.7)";
      ctx.lineWidth = 1 + particle.z * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6 * depth, 18 * depth);
      ctx.stroke();
    }
  } else if (particleMode === "space") {
    ctx.globalAlpha = 0.52 + particle.z * 0.46;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.55, particle.size * 0.34), 0, Math.PI * 2);
    ctx.fill();
  } else if (particleMode === "autumn" || particleMode === "spring") {
    ctx.fillStyle = `hsla(${seasonHue + Math.random() * 16}, 94%, 72%, 0.82)`;
    if (currentScene !== "landing") {
      // Pixel petal
      const size = Math.max(2, Math.round(particle.size * depth * 2.5));
      ctx.fillRect(-size / 2, -size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * depth * 1.8, particle.size * depth, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (particleMode === "winter" || particleMode === "stars") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    if (currentScene !== "landing") {
      const size = Math.max(2, Math.round(particle.size * depth * 3));
      ctx.fillRect(-size / 2, -size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * depth * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    if (currentScene !== "landing") {
      // Pixel orb / floaty
      ctx.fillStyle = `hsla(${seasonHue}, 100%, 84%, 0.85)`;
      const size = Math.max(2, Math.round(particle.size * depth * 3));
      ctx.fillRect(-size / 2, -size / 2, size, size);
    } else {
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * depth * 4);
      glow.addColorStop(0, `hsla(${seasonHue}, 100%, 84%, 0.95)`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * depth * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function blendColor(from, to, amount) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = (start, end) => Math.round(start + (end - start) * amount);
  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function drawBursts() {
  for (let i = bursts.length - 1; i >= 0; i -= 1) {
    const burst = bursts[i];
    burst.x += burst.vx;
    burst.y += burst.vy;
    burst.vy += 0.08;
    burst.life -= 0.018;

    ctx.save();
    ctx.globalAlpha = Math.max(0, burst.life);
    ctx.fillStyle = burst.kind === "heart" ? "#ffd36a" : `hsla(${burst.hue}, 100%, 72%, 0.95)`;
    ctx.translate(burst.x, burst.y);
    if (burst.kind === "heart") {
      ctx.scale(burst.size / 10, burst.size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-10, -4, -5, -12, 0, -5);
      ctx.bezierCurveTo(5, -12, 10, -4, 0, 5);
      ctx.fill();
    } else {
      ctx.beginPath();
      for (let point = 0; point < 5; point += 1) {
        const angle = -Math.PI / 2 + point * (Math.PI * 2) / 5;
        const x = Math.cos(angle) * burst.size;
        const y = Math.sin(angle) * burst.size;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    if (burst.life <= 0) bursts.splice(i, 1);
  }
}

function updateAndDrawPixelTransition(time) {
  const elapsed = performance.now() - pixelTransition.startTime;
  let rawProgress = elapsed / pixelTransition.duration;
  if (rawProgress > 1) rawProgress = 1;

  pixelTransition.progress = rawProgress * 2;
  const currentProgress = pixelTransition.progress;

  if (currentProgress >= 1.0 && pixelTransition.onMidpoint) {
    const callback = pixelTransition.onMidpoint;
    pixelTransition.onMidpoint = null;
    callback();
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const cellSize = 48;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  ctx.fillStyle = "#ffb2c8";

  if (currentProgress < 1.0) {
    const g = currentProgress;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellStart = ((c + r) / (cols + rows)) * 0.5;
        let p = 0;
        if (g > cellStart) {
          p = Math.min(1, (g - cellStart) / 0.5);
        }

        if (p > 0) {
          const cx = c * cellSize + cellSize / 2;
          const cy = r * cellSize + cellSize / 2;
          const size = (cellSize / 2) * p * 1.45;

          ctx.beginPath();
          ctx.moveTo(cx, cy - size);
          ctx.lineTo(cx + size, cy);
          ctx.lineTo(cx, cy + size);
          ctx.lineTo(cx - size, cy);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  } else {
    const g = currentProgress - 1.0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellStart = ((c + r) / (cols + rows)) * 0.5;
        let p = 1;
        if (g > cellStart) {
          p = Math.max(0, 1 - (g - cellStart) / 0.5);
        }

        if (p > 0) {
          const cx = c * cellSize + cellSize / 2;
          const cy = r * cellSize + cellSize / 2;
          const size = (cellSize / 2) * p * 1.45;

          ctx.beginPath();
          ctx.moveTo(cx, cy - size);
          ctx.lineTo(cx + size, cy);
          ctx.lineTo(cx, cy + size);
          ctx.lineTo(cx - size, cy);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  if (currentProgress >= 2.0) {
    pixelTransition.active = false;
    if (pixelTransition.onComplete) {
      const callback = pixelTransition.onComplete;
      pixelTransition.onComplete = null;
      callback();
    }
  }
}

function animate(time = 0) {
  updateThreeWorld(time);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (currentScene === "quiz") {
    drawQuizPixelScene(time);
  } else if (currentScene === "result") {
    currentSeason = "result";
    drawQuizPixelScene(time);
  } else if (currentScene === "story") {
    currentSeason = "story";
    drawQuizPixelScene(time);
  } else if (currentScene === "gallery") {
    currentSeason = "gallery";
    drawQuizPixelScene(time);
  } else if (currentScene === "gift") {
    updateGiftThreeWorld(time);
  } else if (!threeReady) {
    drawBackground(time);
  }
  drawTwinkleStars(time);
  drawAtmosphericMist(time);
  drawPixelForestScene(time);
  if (!prefersReducedMotion) {
    particles.forEach((particle) => drawParticle(particle, time));
  }

  if (Date.now() < celebrationUntil) {
    if (Math.random() < 0.3) {
      createBurst(Math.random() * window.innerWidth, -10, 1, Math.random() > 0.45 ? "heart" : "star");
    }
  }
  drawBursts();

  if (pixelTransition.active) {
    updateAndDrawPixelTransition(time);
  }

  requestAnimationFrame(animate);
}

function loadGalleryImages() {
  document.querySelectorAll(".memory-frame").forEach((frame) => {
    frame.classList.remove("is-revealed");
    frame.classList.remove("is-awake");
  });

  document.querySelectorAll(".memory-photo").forEach((image) => {
    const source = image.dataset.src;
    image.src = source;
    image.classList.add("is-loaded");
  });
}

const namePopup = document.getElementById("name-popup");
const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");
const nameConfirmBtn = document.getElementById("name-confirm-btn");
const nameCancelBtn = document.getElementById("name-cancel-btn");
const popupCloseIcons = document.querySelectorAll(".name-popup-icon");

const allowedNames = ["เจน่า", "jena", "เจเดน", "เจเด้น", "แฟนต้า", "fanta"];

function closeNamePopup() {
  namePopup.classList.remove("is-active");
  nameInput.value = "";
  nameError.classList.remove("is-visible");
}

function handleNameConfirm() {
  const inputVal = nameInput.value.trim().toLowerCase();

  if (!inputVal) {
    nameError.textContent = "ใส่ชื่อก่อนสิ 🥺";
    nameError.classList.add("is-visible");
    return;
  }

  if (allowedNames.includes(inputVal)) {
    userName = nameInput.value.trim();
    closeNamePopup();

    // Trigger slow white flash
    flash.className = "flash is-white is-active-slow";
    void flash.offsetWidth;

    // Wait for the white flash to fill the screen (35% of 3500ms) before rendering quiz
    setTimeout(() => {
      renderQuiz();
      showScene("quiz");
    }, 1250);
  } else {
    nameError.textContent = "หืมม... ไม่ใช่ชื่อที่เรากำลังรออยู่น้า 🤔";
    nameError.classList.add("is-visible");
  }
}

document.querySelector(".landing-trigger").addEventListener("click", () => {
  namePopup.classList.add("is-active");
  nameInput.focus();
});

nameConfirmBtn.addEventListener("click", handleNameConfirm);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleNameConfirm();
  }
});

nameCancelBtn.addEventListener("click", closeNamePopup);
popupCloseIcons.forEach(icon => icon.addEventListener("click", closeNamePopup));

nameInput.addEventListener("input", () => {
  if (nameError.classList.contains("is-visible")) {
    nameError.classList.remove("is-visible");
  }
});

quizNext.addEventListener("click", () => {
  const card = document.querySelector(".season-card");
  if (card) {
    card.style.animation = "fadeOutQuick 0.4s ease-out forwards";
    setTimeout(() => {
      quizState = advanceQuiz(quizState);
      if (quizState.completed) {
        completeQuiz();
      } else {
        renderQuiz();
      }
    }, 400);
  } else {
    quizState = advanceQuiz(quizState);
    if (quizState.completed) {
      completeQuiz();
    } else {
      renderQuiz();
    }
  }
});

if (quizBack) {
  quizBack.addEventListener("click", () => {
    if (quizState.index > 0) {
      const card = document.querySelector(".season-card");
      if (card) {
        card.style.animation = "fadeOutQuick 0.4s ease-out forwards";
        setTimeout(() => {
          quizState.index -= 1;
          renderQuiz();
        }, 400);
      } else {
        quizState.index -= 1;
        renderQuiz();
      }
    }
  });
}

document.getElementById("result-next").addEventListener("click", () => {
  flash.className = "flash is-white is-active-slow";
  void flash.offsetWidth;
  setTimeout(() => {
    storyIndex = 0;
    storyBgState.currentTime = 0.0;
    storyBgState.targetTime = 0.0;
    renderStory();
    const scroll = document.querySelector(".pixel-scroll");
    if (scroll) {
      scroll.classList.add("is-collapsed");
      scroll.style.cursor = "pointer";
    }
    const hint = document.getElementById("scroll-hint");
    if (hint) {
      hint.style.display = "block";
      hint.classList.add("is-blinking");
    }
    showScene("story");
  }, 1250);
});

let storyAnimating = false;

const scrollContainer = document.querySelector(".pixel-scroll");
if (scrollContainer) {
  scrollContainer.addEventListener("click", () => {
    if (scrollContainer.classList.contains("is-collapsed") && storyIndex === 0 && !storyAnimating) {
      storyAnimating = true;

      const hint = document.getElementById("scroll-hint");
      if (hint) {
        hint.style.display = "none";
      }

      scrollContainer.style.cursor = "default";
      scrollContainer.classList.remove("is-collapsed");

      setTimeout(() => {
        storyAnimating = false;
      }, 3000);
    }
  });
}

storyNext.addEventListener("click", (e) => {
  if (storyAnimating) return;
  e.stopPropagation();

  const scroll = document.querySelector(".pixel-scroll");

  if (storyIndex >= storyScenes.length - 1) {
    storyAnimating = true;
    if (scroll) scroll.classList.add("is-collapsed");

    // Wait for the scroll collapse to finish (1200ms)
    setTimeout(() => {
      // Start the pixel JRPG grid sweep transition
      startPixelTransition(
        // Midpoint: switch scene under the pink cover
        () => {
          showScene("gallery");
          loadGalleryImages();
        },
        // Completion
        () => {
          storyAnimating = false;
        }
      );
    }, 1200);
    return;
  }

  storyAnimating = true;
  // 1. Close scroll first
  if (scroll) scroll.classList.add("is-collapsed");

  // 2. Once fully closed (1200ms)
  setTimeout(() => {
    // Start background transition (sun moving down, sky colors changing)
    // We increment targetTime now, which starts the background lerping!
    storyBgState.targetTime = (storyIndex + 1) * 0.25;

    // 3. Wait for the background sun to transition slowly (1600ms)
    setTimeout(() => {
      // 4. Update the story texts to the next slide
      storyIndex += 1;
      renderStory();

      // 5. Unfold scroll with new text
      setTimeout(() => {
        if (scroll) scroll.classList.remove("is-collapsed");

        // 6. Wait for unfold to complete (3000ms) before unlocking click
        setTimeout(() => {
          storyAnimating = false;
        }, 3000);
      }, 100);
    }, 1600);
  }, 1200);
});

let giftThree = null;

function initGiftThreeWorld() {
  const canvasNode = document.getElementById("gift-canvas");
  if (!canvasNode) return;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasNode,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(canvasNode.clientWidth, canvasNode.clientHeight, false);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();

  const isMobile = window.innerWidth < 780;
  const camera = new THREE.PerspectiveCamera(40, canvasNode.clientWidth / canvasNode.clientHeight, 0.1, 100);
  const cameraDist = isMobile ? 11.5 : 8.5;
  camera.position.set(0, 0.3, cameraDist);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(5, 8, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffd6e8, 0.8);
  fillLight.position.set(-4, 3, -2);
  scene.add(fillLight);

  const pointLight = new THREE.PointLight(0xffb2c8, 1.4, 15);
  pointLight.position.set(0, 2, 2);
  scene.add(pointLight);

  const giftGroup = new THREE.Group();
  if (isMobile) {
    giftGroup.scale.setScalar(0.82);
  }
  scene.add(giftGroup);

  const boxGroup = new THREE.Group();
  giftGroup.add(boxGroup);

  // ============ GIFT BOX ============
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xff708a,
    roughness: 0.35,
    metalness: 0.05
  });
  const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 2.4), pinkMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  boxGroup.add(baseMesh);

  // Lavender Ribbons
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xd6cbf5,
    roughness: 0.35,
    metalness: 0.15
  });
  const ribBaseX = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.02, 2.42), ribbonMat);
  const ribBaseZ = new THREE.Mesh(new THREE.BoxGeometry(2.42, 2.02, 0.35), ribbonMat);
  boxGroup.add(ribBaseX, ribBaseZ);

  // ============ LID ============
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 1.05, 0);
  boxGroup.add(lidGroup);

  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xff5274,
    roughness: 0.35,
    metalness: 0.05
  });
  const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.5, 2.55), lidMat);
  lidMesh.castShadow = true;
  lidGroup.add(lidMesh);

  const ribLidX = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.52, 2.57), ribbonMat);
  const ribLidZ = new THREE.Mesh(new THREE.BoxGeometry(2.57, 0.52, 0.37), ribbonMat);
  lidGroup.add(ribLidX, ribLidZ);

  // ============ BEAUTIFUL BOW (6 loops + tails) ============
  const bowMat = new THREE.MeshStandardMaterial({
    color: 0xd6cbf5,
    roughness: 0.3,
    metalness: 0.15
  });

  const loopGeom = new THREE.TorusGeometry(0.32, 0.065, 16, 32);

  // Large front loops (left & right)
  const loopFL = new THREE.Mesh(loopGeom, bowMat);
  loopFL.position.set(-0.28, 0.30, 0.05);
  loopFL.rotation.set(Math.PI / 2, 0, Math.PI / 3.5);
  loopFL.scale.set(1.5, 0.6, 1.0);
  lidGroup.add(loopFL);

  const loopFR = new THREE.Mesh(loopGeom, bowMat);
  loopFR.position.set(0.28, 0.30, 0.05);
  loopFR.rotation.set(Math.PI / 2, 0, -Math.PI / 3.5);
  loopFR.scale.set(1.5, 0.6, 1.0);
  lidGroup.add(loopFR);

  // Upper side loops
  const loopUL = new THREE.Mesh(loopGeom, bowMat);
  loopUL.position.set(-0.18, 0.38, -0.06);
  loopUL.rotation.set(Math.PI / 2.3, 0.4, Math.PI / 4);
  loopUL.scale.set(1.2, 0.5, 0.8);
  lidGroup.add(loopUL);

  const loopUR = new THREE.Mesh(loopGeom, bowMat);
  loopUR.position.set(0.18, 0.38, -0.06);
  loopUR.rotation.set(Math.PI / 2.3, -0.4, -Math.PI / 4);
  loopUR.scale.set(1.2, 0.5, 0.8);
  lidGroup.add(loopUR);

  // Back loops (smaller)
  const loopBL = new THREE.Mesh(loopGeom, bowMat);
  loopBL.position.set(-0.12, 0.32, -0.12);
  loopBL.rotation.set(Math.PI / 1.8, 0.6, Math.PI / 5);
  loopBL.scale.set(1.0, 0.45, 0.7);
  lidGroup.add(loopBL);

  const loopBR = new THREE.Mesh(loopGeom, bowMat);
  loopBR.position.set(0.12, 0.32, -0.12);
  loopBR.rotation.set(Math.PI / 1.8, -0.6, -Math.PI / 5);
  loopBR.scale.set(1.0, 0.45, 0.7);
  lidGroup.add(loopBR);

  // Center knot (pearl)
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.85
  });
  const knotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), knotMat);
  knotMesh.position.set(0, 0.30, 0);
  lidGroup.add(knotMesh);

  // Ribbon tails (hanging down)
  const tailGeom = new THREE.BoxGeometry(0.22, 0.8, 0.04);
  const tailL = new THREE.Mesh(tailGeom, bowMat);
  tailL.position.set(-0.22, -0.1, 0.15);
  tailL.rotation.set(0.15, 0, 0.25);
  lidGroup.add(tailL);

  const tailR = new THREE.Mesh(tailGeom, bowMat);
  tailR.position.set(0.22, -0.1, 0.15);
  tailR.rotation.set(0.15, 0, -0.25);
  lidGroup.add(tailR);

  // ============ ENVELOPE ============
  const letterGroup = new THREE.Group();
  letterGroup.position.set(0, -0.2, 0);
  letterGroup.scale.set(0.01, 0.01, 0.01);
  letterGroup.visible = false;
  giftGroup.add(letterGroup);

  const envPinkMat = new THREE.MeshStandardMaterial({
    color: 0xffc5d8,
    roughness: 0.28,
    metalness: 0.02
  });
  const envDarkerMat = new THREE.MeshStandardMaterial({
    color: 0xffb0c8,
    roughness: 0.32,
    metalness: 0.02
  });

  // Main envelope body (rounded box feel)
  const envBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.25), envPinkMat);
  envBody.castShadow = true;
  letterGroup.add(envBody);

  // Bottom V-fold triangles (left, right, bottom)
  const triLeftShape = new THREE.Shape();
  triLeftShape.moveTo(0, -1.1);
  triLeftShape.lineTo(0, 1.1);
  triLeftShape.lineTo(1.0, 0);
  triLeftShape.closePath();
  const triLeftGeom = new THREE.ExtrudeGeometry(triLeftShape, { depth: 0.02, bevelEnabled: false });
  const triLeft = new THREE.Mesh(triLeftGeom, envDarkerMat);
  triLeft.position.set(-1.6, 0, 0.13);
  letterGroup.add(triLeft);

  const triRightShape = new THREE.Shape();
  triRightShape.moveTo(0, -1.1);
  triRightShape.lineTo(0, 1.1);
  triRightShape.lineTo(-1.0, 0);
  triRightShape.closePath();
  const triRightGeom = new THREE.ExtrudeGeometry(triRightShape, { depth: 0.02, bevelEnabled: false });
  const triRight = new THREE.Mesh(triRightGeom, envDarkerMat);
  triRight.position.set(1.6, 0, 0.13);
  letterGroup.add(triRight);

  const triBottomShape = new THREE.Shape();
  triBottomShape.moveTo(-1.6, 0);
  triBottomShape.lineTo(1.6, 0);
  triBottomShape.lineTo(0, 0.8);
  triBottomShape.closePath();
  const triBottomGeom = new THREE.ExtrudeGeometry(triBottomShape, { depth: 0.02, bevelEnabled: false });
  const triBottom = new THREE.Mesh(triBottomGeom, envDarkerMat);
  triBottom.position.set(0, -1.1, 0.14);
  letterGroup.add(triBottom);

  // ============ FLAP (top triangle) ============
  const flapGroup = new THREE.Group();
  flapGroup.position.set(0, 1.1, 0.12);
  letterGroup.add(flapGroup);

  const flapShape = new THREE.Shape();
  flapShape.moveTo(-1.6, 0);
  flapShape.lineTo(1.6, 0);
  flapShape.lineTo(0, -1.1);
  flapShape.closePath();
  const flapGeom = new THREE.ExtrudeGeometry(flapShape, { depth: 0.03, bevelEnabled: false });
  const flapMesh = new THREE.Mesh(flapGeom, envPinkMat);
  flapGroup.add(flapMesh);

  // ============ BIG 3D HEART SEAL (front center) ============
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0.18, 0.18, 0.38, 0.38, 0.38);
  heartShape.bezierCurveTo(0.62, 0.38, 0.62, 0.12, 0.62, 0);
  heartShape.bezierCurveTo(0.62, -0.24, 0.32, -0.52, 0, -0.72);
  heartShape.bezierCurveTo(-0.32, -0.52, -0.62, -0.24, -0.62, 0);
  heartShape.bezierCurveTo(-0.62, 0.12, -0.62, 0.38, -0.38, 0.38);
  heartShape.bezierCurveTo(-0.18, 0.38, 0, 0.18, 0, 0);

  const heartSealMat = new THREE.MeshStandardMaterial({
    color: 0xd4264e,
    roughness: 0.25,
    metalness: 0.3
  });
  const heartSealGeom = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 8
  });
  const heartSeal = new THREE.Mesh(heartSealGeom, heartSealMat);
  heartSeal.position.set(0, 0.1, 0.22);
  heartSeal.scale.set(0.7, 0.7, 0.7);
  letterGroup.add(heartSeal);

  // ============ LETTER PAPER (inside) ============
  const paperGroup = new THREE.Group();
  paperGroup.position.set(0, 0, -0.05);
  letterGroup.add(paperGroup);

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.0
  });
  const paperMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.02), paperMat);
  paperGroup.add(paperMesh);

  // Small pink heart on paper
  const smallHeartMat = new THREE.MeshStandardMaterial({
    color: 0xff708a,
    roughness: 0.3,
    metalness: 0.1
  });
  const smallHeartGeom = new THREE.ExtrudeGeometry(heartShape, { depth: 0.02, bevelEnabled: false });
  const smallHeart = new THREE.Mesh(smallHeartGeom, smallHeartMat);
  smallHeart.position.set(0, 0.15, 0.015);
  smallHeart.scale.set(0.5, 0.5, 0.5);
  paperGroup.add(smallHeart);

  // ============ CLICK HANDLER ============
  const onGiftCanvasClick = (event) => {
    if (!giftThree) return;
    const rect = canvasNode.getBoundingClientRect();
    giftThree.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    giftThree.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    giftThree.raycaster.setFromCamera(giftThree.pointer, giftThree.camera);

    if (giftThree.state === "spinning") {
      const intersects = giftThree.raycaster.intersectObjects(giftThree.boxGroup.children, true);
      if (intersects.length > 0) {
        giftThree.state = "opening";
        giftThree.stateTime = performance.now();
      }
    } else if (giftThree.state === "letterFocused") {
      const intersects = giftThree.raycaster.intersectObjects(giftThree.letterGroup.children, true);
      if (intersects.length > 0) {
        giftThree.state = "letterOpening";
        giftThree.stateTime = performance.now();
      }
    }
  };

  canvasNode.addEventListener("click", onGiftCanvasClick);

  giftThree = {
    renderer,
    scene,
    camera,
    giftGroup,
    boxGroup,
    lidGroup,
    letterGroup,
    flapGroup,
    paperGroup,
    state: "spinning",
    stateTime: 0,
    openProgress: 0.0,
    letterProgress: 0.0,
    flapProgress: 0.0,
    zoomProgress: 0.0,
    pointer: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    lastTime: performance.now(),
    canvasClickListener: onGiftCanvasClick
  };
}

function updateGiftThreeWorld(time) {
  if (!giftThree) return;

  const now = performance.now();
  const dt = (now - giftThree.lastTime) * 0.001;
  giftThree.lastTime = now;

  const isMobile = window.innerWidth < 780;
  const cameraDist = isMobile ? 11.5 : 8.5;

  if (giftThree.state === "spinning") {
    giftThree.giftGroup.rotation.y = time * 0.0006;
    giftThree.giftGroup.position.y = Math.sin(time * 0.0015) * 0.15;
    giftThree.camera.position.z = cameraDist;
  } else if (giftThree.state === "opening") {
    giftThree.openProgress = Math.min(1.0, giftThree.openProgress + dt * 1.15);

    giftThree.lidGroup.position.y = 1.05 + giftThree.openProgress * 3.5;
    giftThree.lidGroup.position.x = giftThree.openProgress * 1.5;
    giftThree.lidGroup.rotation.x = giftThree.openProgress * 1.2;
    giftThree.lidGroup.rotation.z = -giftThree.openProgress * 0.8;
    giftThree.lidGroup.scale.setScalar(1.0 - giftThree.openProgress);

    giftThree.giftGroup.rotation.y = THREE.MathUtils.lerp(giftThree.giftGroup.rotation.y, 0, 0.08);
    giftThree.giftGroup.rotation.x = THREE.MathUtils.lerp(giftThree.giftGroup.rotation.x, 0, 0.08);
    giftThree.giftGroup.position.y = THREE.MathUtils.lerp(giftThree.giftGroup.position.y, 0, 0.08);
    giftThree.camera.position.z = cameraDist;

    if (giftThree.openProgress >= 1.0) {
      giftThree.state = "letterFloating";
    }
  } else if (giftThree.state === "letterFloating") {
    giftThree.letterProgress = Math.min(1.0, giftThree.letterProgress + dt * 1.15);

    giftThree.letterGroup.visible = true;
    giftThree.letterGroup.scale.setScalar(giftThree.letterProgress);
    giftThree.letterGroup.position.y = -0.2 + giftThree.letterProgress * 1.2;

    const baseScale = 1.0 - giftThree.letterProgress;
    giftThree.boxGroup.scale.setScalar(baseScale);
    if (baseScale <= 0.01) {
      giftThree.boxGroup.visible = false;
    }

    giftThree.giftGroup.rotation.y = THREE.MathUtils.lerp(giftThree.giftGroup.rotation.y, 0, 0.1);
    giftThree.giftGroup.rotation.x = THREE.MathUtils.lerp(giftThree.giftGroup.rotation.x, 0, 0.1);
    giftThree.giftGroup.position.y = THREE.MathUtils.lerp(giftThree.giftGroup.position.y, 0, 0.1);
    giftThree.camera.position.z = cameraDist;

    if (giftThree.letterProgress >= 1.0) {
      giftThree.state = "letterFocused";
    }
  } else if (giftThree.state === "letterFocused") {
    giftThree.letterGroup.position.y = 1.0 + Math.sin(time * 0.002) * 0.08;
    giftThree.camera.position.z = cameraDist;
  } else if (giftThree.state === "letterOpening") {
    giftThree.flapProgress = Math.min(1.0, giftThree.flapProgress + dt * 0.8);
    giftThree.flapGroup.rotation.x = -giftThree.flapProgress * Math.PI * 0.95;
    giftThree.camera.position.z = cameraDist;

    if (giftThree.flapProgress >= 1.0) {
      giftThree.state = "zooming";
    }
  } else if (giftThree.state === "zooming") {
    giftThree.zoomProgress = Math.min(1.0, giftThree.zoomProgress + dt * 0.7);

    // Camera slowly pushes in
    giftThree.camera.position.z = cameraDist - giftThree.zoomProgress * (cameraDist - 2.5);
    giftThree.camera.position.y = 0.3 + giftThree.zoomProgress * 0.6;

    if (giftThree.zoomProgress >= 1.0 && !giftThree.transitionTriggered) {
      giftThree.transitionTriggered = true;

      // Pastel pink flash fullscreen
      flash.className = "flash is-pink is-active-gift-fade";
      void flash.offsetWidth;

      // Switch scene during pink flash (at 20% = 1000ms)
      setTimeout(() => {
        showScene("proposal");
        cleanGiftThreeWorld();
      }, 2500);
    }
  }

  giftThree.renderer.render(giftThree.scene, giftThree.camera);
}


function cleanGiftThreeWorld() {
  if (!giftThree) return;
  const canvasNode = document.getElementById("gift-canvas");
  if (canvasNode && giftThree.canvasClickListener) {
    canvasNode.removeEventListener("click", giftThree.canvasClickListener);
  }
  giftThree.renderer.dispose();
  giftThree = null;
}

galleryNext.addEventListener("click", () => {
  showScene("gift");
  initGiftThreeWorld();
});

document.querySelectorAll(".memory-frame").forEach((frame) => {
  const handleHover = () => {
    if (frame.classList.contains("is-revealed")) {
      frame.classList.add("is-awake");
      const rect = frame.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16, "star");
      setTimeout(() => frame.classList.remove("is-awake"), 900);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!frame.classList.contains("is-revealed")) {
      // Reveal the photo!
      frame.classList.add("is-revealed");
      frame.classList.add("is-awake");

      // Premium burst (mix of stars and hearts!)
      const rect = frame.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 32, "heart");
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16, "star");

      setTimeout(() => frame.classList.remove("is-awake"), 900);
    } else {
      // Normal click burst
      frame.classList.add("is-awake");
      const rect = frame.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24, "star");
      setTimeout(() => frame.classList.remove("is-awake"), 900);
    }
  };

  frame.addEventListener("pointerenter", handleHover);
  frame.addEventListener("click", handleClick);
});

if (adminWarp && adminWarpToggle && adminWarpPanel) {
  adminWarpToggle.addEventListener("click", () => {
    const isOpen = adminWarp.classList.toggle("is-open");
    adminWarpToggle.setAttribute("aria-expanded", String(isOpen));
  });

  adminWarpPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-scene]");
    if (!button) return;
    adminWarpToScene(button.dataset.adminScene);
  });

  document.addEventListener("click", (event) => {
    if (!adminWarp.classList.contains("is-open")) return;
    if (adminWarp.contains(event.target)) return;
    adminWarp.classList.remove("is-open");
    adminWarpToggle.setAttribute("aria-expanded", "false");
  });
}

maybeBtn.addEventListener("pointermove", (event) => {
  if (currentScene === "proposal") return;
  if (event.pointerType === "mouse") {
    const rect = maybeBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    if (distance < 150) moveMaybeButton();
  }
});

maybeBtn.addEventListener("pointerenter", (event) => {
  if (currentScene === "proposal") return;
  if (event.pointerType === "mouse") moveMaybeButton();
});

maybeBtn.addEventListener("click", (event) => {
  if (proposalState.showMaybe) {
    event.preventDefault();
    growAcceptButtonOnMobileNo();
    return;
  }
  proposalState = softenProposal(proposalState);
  updateProposal();
});

acceptBtn.addEventListener("click", () => {
  showProposalConfirm();
});

confirmYes.addEventListener("click", startFinalSequence);
confirmNo.addEventListener("click", hideProposalConfirm);
proposalConfirm.addEventListener("click", (event) => {
  if (event.target === proposalConfirm) hideProposalConfirm();
});

finalShareBtn.addEventListener("click", () => shareProposalLink(finalShareBtn));
finalDownloadBtn.addEventListener("click", () => downloadFinalImage(finalDownloadBtn));

openMemoryMail.addEventListener("click", () => openFinalPhoto(0));
photoPrev.addEventListener("click", () => moveFinalPhoto(-1));
photoNext.addEventListener("click", () => moveFinalPhoto(1));

photoClose.addEventListener("click", closeFinalPhoto);
photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) closeFinalPhoto();
});

window.addEventListener("scroll", updateLandingProgress, { passive: true });
window.addEventListener("resize", resizeCanvas);

initThreeWorld();
resizeCanvas();
updateLandingProgress();
loadGalleryImages();
animate();

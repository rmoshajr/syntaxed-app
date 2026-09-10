// ===== Syntaxed state management (localStorage-backed) =====

const STORAGE_KEY = 'syntaxed_state_v1';
const MEMORY_MAX = 5;
const MEMORY_REGEN_MS = 30 * 60 * 1000; // one RAM stick refills every 30 minutes
const AVATAR_ICONS = {
  beetle: ['Ladybug', 'Doodle Bug', 'Cyber Beetle', 'Roly Bug', 'Spike Bug'],
  robot: ['Classic Bot', 'Round Bot', 'Visor Bot', 'Antenna Bot', 'Heart Bot'],
};
// Interface accent swatches (Settings > Accent Color). Purely a UI theme color —
// mascots below have their own fixed identity colors and never read this.
const ACCENT_COLORS = ['#37f2ff', '#ff3fd8', '#3dffa0', '#ffcc4d', '#9d7bff'];
// Each mascot's color is part of its fixed identity, Duolingo-style (Duo is always
// green, Lily is always purple, etc.) — never user-customizable or accent-driven.
const BEETLE_COLORS = ['#e8483c', '#5bc85a', '#2fd0e8', '#ff7fb0', '#ff9433'];
const ROBOT_COLORS = ['#6fb8ff', '#3ddab0', '#a07bff', '#ffd23d', '#ff5c8a'];

// ---- Animated mascot characters (blinking eyes, talking mouth) ----
function renderCharacter(avatar, size) {
  size = size || 64;
  const isRobot = avatar && avatar.kind === 'robot';
  const variant = (avatar && avatar.variant) || 0;
  const bodyHtml = isRobot ? robotCharSvg(variant) : beetleCharSvg(variant);
  return `<div class="char char-${isRobot ? 'robot' : 'beetle'}" style="width:${size}px;height:${size}px;">${bodyHtml}</div>`;
}

// Shared eye helper: white-sclera cartoon eye with a pupil + glossy catchlight, wrapped for blink animation.
function beetleEye(cx, cy, r) {
  r = r || 12;
  return `<g class="char-eye" style="transform-origin:${cx}px ${cy}px;"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${cx}" cy="${cy + 1}" r="${Math.round(r * 0.5)}" fill="#0a0a12"/><circle cx="${cx - r * 0.32}" cy="${cy - r * 0.32}" r="${Math.max(1.4, r * 0.22)}" fill="#fff" opacity=".9"/></g>`;
}

function beetleCharSvg(variant) {
  const builders = [beetleLadybug, beetleDoodle, beetleCyber, beetleRoly, beetleSpike];
  const color = BEETLE_COLORS[variant] || BEETLE_COLORS[0];
  return (builders[variant] || beetleLadybug)(color);
}

// Variant 0 — Ladybug: classic round red shell, black spots + seam, rosy cheeks, gentle smile.
function beetleLadybug(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <line x1="38" y1="26" x2="26" y2="8" stroke="#0a0a12" stroke-width="4" stroke-linecap="round"/>
      <line x1="62" y1="26" x2="74" y2="8" stroke="#0a0a12" stroke-width="4" stroke-linecap="round"/>
      <circle cx="26" cy="8" r="4" fill="#0a0a12"/>
      <circle cx="74" cy="8" r="4" fill="#0a0a12"/>
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="${color}" stroke="#0a0a12" stroke-width="3"/>
      <path d="M50 25 L50 91" stroke="#0a0a12" stroke-width="3" opacity=".45"/>
      <path d="M12 58 A38 34 0 0 0 88 58 Z" fill="#000" opacity=".14"/>
      <circle cx="30" cy="42" r="5" fill="#0a0a12"/>
      <circle cx="70" cy="42" r="5" fill="#0a0a12"/>
      <circle cx="32" cy="72" r="5" fill="#0a0a12"/>
      <circle cx="68" cy="72" r="5" fill="#0a0a12"/>
      <ellipse cx="27" cy="66" rx="6" ry="4" fill="#ff9bc8" opacity=".65"/>
      <ellipse cx="73" cy="66" rx="6" ry="4" fill="#ff9bc8" opacity=".65"/>
      ${beetleEye(36, 50, 12)}
      ${beetleEye(64, 50, 12)}
      <path class="char-mouth" d="M40 76 Q50 84 60 76" stroke="#0a0a12" stroke-width="4" fill="none" stroke-linecap="round" style="transform-origin:50px 78px;"/>
    </svg>`;
}

// Variant 1 — Doodle Bug: big eyes, wide open grin, three spots, wavy antennae.
function beetleDoodle(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M38 26 Q28 18 24 6" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M62 26 Q72 18 76 6" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="24" cy="6" r="4" fill="${color}"/>
      <circle cx="76" cy="6" r="4" fill="${color}"/>
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="${color}" stroke="#0a0a12" stroke-width="3"/>
      <path d="M12 58 A38 34 0 0 0 88 58 Z" fill="#000" opacity=".14"/>
      <circle cx="38" cy="46" r="4" fill="#0a0a12" opacity=".3"/>
      <circle cx="62" cy="46" r="4" fill="#0a0a12" opacity=".3"/>
      <circle cx="50" cy="66" r="4" fill="#0a0a12" opacity=".3"/>
      ${beetleEye(35, 50, 14)}
      ${beetleEye(65, 50, 14)}
      <path class="char-mouth" d="M38 74 Q50 92 62 74 Z" fill="#0a0a12" style="transform-origin:50px 80px;"/>
    </svg>`;
}

// Variant 2 — Cyber Beetle: tech visor eyes, chevron shell panels, confident smirk.
function beetleCyber(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <line x1="38" y1="26" x2="30" y2="10" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <line x1="62" y1="26" x2="70" y2="10" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <rect x="27" y="7" width="6" height="6" fill="${color}"/>
      <rect x="67" y="7" width="6" height="6" fill="${color}"/>
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="${color}" stroke="#0a0a12" stroke-width="3"/>
      <path d="M12 58 A38 34 0 0 0 88 58 Z" fill="#000" opacity=".14"/>
      <path d="M24 44 Q50 36 76 44" stroke="#0a0a12" stroke-width="3" fill="none" opacity=".3"/>
      <path d="M20 56 Q50 47 80 56" stroke="#0a0a12" stroke-width="3" fill="none" opacity=".3"/>
      <rect x="26" y="44" width="48" height="16" rx="8" fill="#0a0a12"/>
      <g class="char-eye" style="transform-origin:38px 52px;"><circle cx="38" cy="52" r="5" fill="${color}"/><circle cx="36" cy="50" r="1.6" fill="#fff" opacity=".85"/></g>
      <g class="char-eye" style="transform-origin:62px 52px;"><circle cx="62" cy="52" r="5" fill="${color}"/><circle cx="60" cy="50" r="1.6" fill="#fff" opacity=".85"/></g>
      <path class="char-mouth" d="M42 78 Q52 83 61 76" stroke="#0a0a12" stroke-width="4" fill="none" stroke-linecap="round" style="transform-origin:50px 78px;"/>
    </svg>`;
}

// Variant 3 — Roly Bug: extra-plump body, big blush, wide happy laugh.
function beetleRoly(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M40 24 Q30 18 32 8" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M60 24 Q70 18 68 8" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="32" cy="8" r="5" fill="${color}"/>
      <circle cx="68" cy="8" r="5" fill="${color}"/>
      <ellipse cx="50" cy="60" rx="44" ry="36" fill="${color}" stroke="#0a0a12" stroke-width="3"/>
      <path d="M8 60 A44 36 0 0 0 92 60 Z" fill="#000" opacity=".12"/>
      <ellipse cx="24" cy="70" rx="8" ry="5" fill="#ff9bc8" opacity=".6"/>
      <ellipse cx="76" cy="70" rx="8" ry="5" fill="#ff9bc8" opacity=".6"/>
      ${beetleEye(37, 54, 11)}
      ${beetleEye(63, 54, 11)}
      <ellipse class="char-mouth" cx="50" cy="80" rx="14" ry="7" fill="#0a0a12" style="transform-origin:50px 80px;"/>
    </svg>`;
}

// Variant 4 — Spike Bug: head horn, determined brows, toothy grin, diamond spots.
function beetleSpike(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <line x1="38" y1="26" x2="26" y2="8" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <line x1="62" y1="26" x2="74" y2="8" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="26" cy="8" r="4" fill="${color}"/>
      <circle cx="74" cy="8" r="4" fill="${color}"/>
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="${color}" stroke="#0a0a12" stroke-width="3"/>
      <path d="M12 58 A38 34 0 0 0 88 58 Z" fill="#000" opacity=".14"/>
      <polygon points="50,20 44,34 56,34" fill="${color}"/>
      <circle cx="50" cy="40" r="3.5" fill="#0a0a12" opacity=".35"/>
      <circle cx="36" cy="60" r="3.5" fill="#0a0a12" opacity=".35"/>
      <circle cx="64" cy="60" r="3.5" fill="#0a0a12" opacity=".35"/>
      <circle cx="50" cy="70" r="3.5" fill="#0a0a12" opacity=".35"/>
      <line x1="29" y1="42" x2="41" y2="46" stroke="#0a0a12" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      <line x1="71" y1="42" x2="59" y2="46" stroke="#0a0a12" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      ${beetleEye(36, 54, 11)}
      ${beetleEye(64, 54, 11)}
      <path class="char-mouth" d="M39 76 Q50 88 61 76 Z" fill="#0a0a12" style="transform-origin:50px 80px;"/>
      <polygon points="47,77 53,77 50,83" fill="#fff"/>
    </svg>`;
}

// Shared stub arms + feet so every bot reads as the same cartoon "chassis" family.
function robotLimbs() {
  return `
    <g fill="#0a0a12" opacity=".5">
      <rect x="4" y="60" width="14" height="9" rx="4"/>
      <rect x="82" y="60" width="14" height="9" rx="4"/>
      <rect x="30" y="90" width="14" height="8" rx="3"/>
      <rect x="56" y="90" width="14" height="8" rx="3"/>
    </g>`;
}

function robotCharSvg(variant) {
  const builders = [robotClassic, robotRound, robotVisor, robotAntenna, robotHeart];
  const color = ROBOT_COLORS[variant] || ROBOT_COLORS[0];
  return (builders[variant] || robotClassic)(color);
}

// Variant 0 — Classic Bot: square head, block eyes, equalizer-bar mouth.
function robotClassic(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${robotLimbs()}
      <line x1="50" y1="4" x2="50" y2="16" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="4" r="5" fill="${color}"/>
      <rect x="16" y="16" width="68" height="64" rx="18" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <g class="char-eye" style="transform-origin:38px 46px;"><rect x="30" y="38" width="16" height="16" rx="4" fill="${color}"/></g>
      <g class="char-eye" style="transform-origin:62px 46px;"><rect x="54" y="38" width="16" height="16" rx="4" fill="${color}"/></g>
      <rect class="char-mouth-bar" x="34" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:37px 74px;"/>
      <rect class="char-mouth-bar" x="44" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:47px 74px;"/>
      <rect class="char-mouth-bar" x="54" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:57px 74px;"/>
      <rect class="char-mouth-bar" x="64" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:67px 74px;"/>
    </svg>`;
}

// Variant 1 — Round Bot: domed head, oval friendly eyes, soft smile curve.
function robotRound(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${robotLimbs()}
      <line x1="50" y1="6" x2="50" y2="18" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="6" r="5" fill="${color}"/>
      <circle cx="50" cy="52" r="36" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <g class="char-eye" style="transform-origin:38px 46px;"><ellipse cx="38" cy="46" rx="8" ry="10" fill="${color}"/><circle cx="36" cy="43" r="2" fill="#fff" opacity=".85"/></g>
      <g class="char-eye" style="transform-origin:62px 46px;"><ellipse cx="62" cy="46" rx="8" ry="10" fill="${color}"/><circle cx="60" cy="43" r="2" fill="#fff" opacity=".85"/></g>
      <path class="char-mouth" d="M36 68 Q50 80 64 68" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round" style="transform-origin:50px 72px;"/>
    </svg>`;
}

// Variant 2 — Visor Bot: full-width visor band, glowing pupil dots, speaker grille.
function robotVisor(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${robotLimbs()}
      <line x1="50" y1="4" x2="50" y2="16" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="4" r="5" fill="${color}"/>
      <rect x="16" y="16" width="68" height="64" rx="18" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <rect x="24" y="38" width="52" height="20" rx="10" fill="#0a0a12"/>
      <g class="char-eye" style="transform-origin:38px 48px;"><circle cx="38" cy="48" r="5" fill="${color}"/><circle cx="36" cy="46" r="1.6" fill="#fff" opacity=".85"/></g>
      <g class="char-eye" style="transform-origin:62px 48px;"><circle cx="62" cy="48" r="5" fill="${color}"/><circle cx="60" cy="46" r="1.6" fill="#fff" opacity=".85"/></g>
      <rect class="char-mouth-bar" x="38" y="68" width="6" height="10" rx="2" fill="${color}" style="transform-origin:41px 73px;"/>
      <rect class="char-mouth-bar" x="47" y="68" width="6" height="10" rx="2" fill="${color}" style="transform-origin:50px 73px;"/>
      <rect class="char-mouth-bar" x="56" y="68" width="6" height="10" rx="2" fill="${color}" style="transform-origin:59px 73px;"/>
    </svg>`;
}

// Variant 3 — Antenna Bot: twin antennae, diamond eyes, open smiling trapezoid mouth.
function robotAntenna(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${robotLimbs()}
      <line x1="28" y1="18" x2="20" y2="6" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <line x1="72" y1="18" x2="80" y2="6" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="20" cy="6" r="5" fill="${color}"/>
      <polygon points="80,1 85,6 80,11 75,6" fill="${color}"/>
      <rect x="18" y="18" width="64" height="60" rx="16" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <g class="char-eye" style="transform-origin:38px 46px;"><polygon points="38,35 48,46 38,57 28,46" fill="${color}"/></g>
      <g class="char-eye" style="transform-origin:62px 46px;"><polygon points="62,35 72,46 62,57 52,46" fill="${color}"/></g>
      <path class="char-mouth" d="M36 68 L64 68 L58 78 L42 78 Z" fill="${color}" style="transform-origin:50px 73px;"/>
    </svg>`;
}

// Variant 4 — Heart Bot: rounded friendly head, heart-shaped eyes, big warm smile.
function robotHeart(color) {
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${robotLimbs()}
      <line x1="50" y1="6" x2="50" y2="18" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="6" r="5" fill="${color}"/>
      <rect x="20" y="18" width="60" height="58" rx="22" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <g class="char-eye" style="transform-origin:38px 48px;">
        <circle cx="34" cy="45" r="6" fill="${color}"/><circle cx="42" cy="45" r="6" fill="${color}"/><polygon points="28,49 48,49 38,61" fill="${color}"/><circle cx="32" cy="42" r="1.6" fill="#fff" opacity=".85"/>
      </g>
      <g class="char-eye" style="transform-origin:62px 48px;">
        <circle cx="58" cy="45" r="6" fill="${color}"/><circle cx="66" cy="45" r="6" fill="${color}"/><polygon points="52,49 72,49 62,61" fill="${color}"/><circle cx="56" cy="42" r="1.6" fill="#fff" opacity=".85"/>
      </g>
      <path class="char-mouth" d="M35 68 Q50 82 65 68" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round" style="transform-origin:50px 72px;"/>
    </svg>`;
}

function defaultLangState() {
  return {
    xp: 0,
    uptime: { current: 0, longest: 0, lastActiveDate: null },
    memory: { current: MEMORY_MAX, max: MEMORY_MAX, nextRegenAt: null }, // nextRegenAt: ms timestamp the next RAM stick refills at, or null when full
    completed: {},        // lessonId -> { xp, testedOut, completedAt }
    testOutAttempts: {},  // targetLessonId -> { count, cooldownUntil }
    certNotified: {},     // certCheckpointId -> true, once we've announced readiness
  };
}

// The five launch languages — order drives every "More Languages" / marketing list in the UI.
const LANGUAGES = [
  { id: 'python', label: 'Python', badge: 'PY' },
  { id: 'javascript', label: 'JavaScript', badge: 'JS' },
  { id: 'java', label: 'Java', badge: 'JV' },
  { id: 'cpp', label: 'C++', badge: 'C++' },
  { id: 'c', label: 'C', badge: 'C' },
];
function languageMeta(lang) { return LANGUAGES.find(l => l.id === lang) || LANGUAGES[0]; }
// A language is playable in the UI once its curriculum has at least one real lesson.
function languageIsLive(lang) { return Object.keys(curriculum(lang).LESSONS || {}).length > 0; }

function defaultState() {
  return {
    onboarded: false,
    statsIntroSeen: false, // account-wide: has this person ever seen the XP/Uptime/Memory orientation?
    theme: 'dark',
    pathView: 'tree', // 'tree' | 'list'
    accent: ACCENT_COLORS[0],
    avatar: { kind: 'beetle', variant: 0 },
    currentLanguage: 'python',
    languages: { python: defaultLangState() },
  };
}

let STATE = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // shallow-merge to survive schema additions between sessions
    const base = defaultState();
    const merged = { ...base, ...parsed };
    merged.avatar = { ...base.avatar, ...(parsed.avatar || {}) };
    merged.languages = merged.languages || {};
    // Merge defaults into every language we've ever saved, not just the ones defaultState
    // seeds — otherwise progress in a language added after a user's first save would miss
    // newly-introduced fields (like certNotified).
    new Set([...Object.keys(base.languages), ...Object.keys(merged.languages)]).forEach(k => {
      merged.languages[k] = { ...defaultLangState(), ...(merged.languages[k] || {}) };
    });
    return merged;
  } catch (e) {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
}

function getState() { return STATE; }
function getLangState(lang) {
  lang = lang || STATE.currentLanguage;
  if (!STATE.languages[lang]) STATE.languages[lang] = defaultLangState();
  return STATE.languages[lang];
}

function setLanguage(lang) {
  STATE.currentLanguage = lang;
  save();
}

function markStatsIntroSeen() {
  STATE.statsIntroSeen = true;
  save();
}

function setTheme(theme) {
  STATE.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  save();
}

function setAvatar(kind, variant) {
  STATE.avatar = { kind, variant };
  save();
}

// Converts a swatch hex into matching glow rgba shadows for the chosen interface accent color.
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function applyAccent(color) {
  const rgb = hexToRgb(color);
  const root = document.documentElement.style;
  root.setProperty('--accent', color);
  root.setProperty('--glow-accent', `0 0 8px rgba(${rgb},.55), 0 0 22px rgba(${rgb},.25)`);
}

function setAccent(color) {
  STATE.accent = color;
  applyAccent(color);
  save();
}

function setPathView(mode) {
  STATE.pathView = mode;
  save();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function touchUptime(lang) {
  const ls = getLangState(lang);
  const today = todayStr();
  if (ls.uptime.lastActiveDate === today) return; // already counted today
  if (ls.uptime.lastActiveDate) {
    const last = new Date(ls.uptime.lastActiveDate);
    const diffDays = Math.round((new Date(today) - last) / 86400000);
    ls.uptime.current = diffDays === 1 ? ls.uptime.current + 1 : 1;
  } else {
    ls.uptime.current = 1;
  }
  ls.uptime.longest = Math.max(ls.uptime.longest, ls.uptime.current);
  ls.uptime.lastActiveDate = today;
  save();
}

function addXP(lang, amount) {
  const ls = getLangState(lang);
  ls.xp += amount;
  save();
}

function spendMemory(lang) {
  const ls = getLangState(lang);
  ls.memory.current = Math.max(0, ls.memory.current - 1);
  if (ls.memory.current < ls.memory.max && !ls.memory.nextRegenAt) {
    ls.memory.nextRegenAt = Date.now() + MEMORY_REGEN_MS;
  }
  save();
  return ls.memory.current;
}

function gainMemory(lang, amount) {
  const ls = getLangState(lang);
  ls.memory.current = Math.min(ls.memory.max, ls.memory.current + (amount || 1));
  if (ls.memory.current >= ls.memory.max) ls.memory.nextRegenAt = null;
  save();
  return ls.memory.current;
}

// Applies any RAM sticks that have finished regenerating since we last checked
// (looping so a long-away user gets caught up all at once, capped at max), and starts
// the clock if Memory is short but no timer is running yet. Returns true if the
// displayed Memory count changed, so callers know whether to re-render.
function processMemoryRegen(lang) {
  const ls = getLangState(lang);
  const mem = ls.memory;
  if (mem.current >= mem.max) {
    if (mem.nextRegenAt) { mem.nextRegenAt = null; save(); }
    return false;
  }
  if (!mem.nextRegenAt) { mem.nextRegenAt = Date.now() + MEMORY_REGEN_MS; save(); return false; }
  let changed = false;
  while (mem.nextRegenAt && mem.current < mem.max && Date.now() >= mem.nextRegenAt) {
    mem.current += 1;
    changed = true;
    mem.nextRegenAt = mem.current < mem.max ? mem.nextRegenAt + MEMORY_REGEN_MS : null;
  }
  if (changed) save();
  return changed;
}

// "⏳ 24:07" countdown text for the next RAM stick, or '' when Memory is full / no timer.
function memoryTimerText(mem) {
  if (!mem || mem.current >= mem.max || !mem.nextRegenAt) return '';
  const msLeft = mem.nextRegenAt - Date.now();
  if (msLeft <= 0) return '';
  const totalSec = Math.ceil(msLeft / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `⏳ ${mm}:${String(ss).padStart(2, '0')}`;
}

// Replaying an already-completed lesson (to refill Memory) doesn't touch XP/records.
function markLessonReviewed(lang, lessonId) {
  gainMemory(lang, 1);
  touchUptime(lang);
}

function markLessonComplete(lang, lessonId, opts) {
  const ls = getLangState(lang);
  opts = opts || {};
  const already = ls.completed[lessonId];
  const lesson = getLesson(lessonId, lang);
  const fullXp = lessonXpValue(lesson);
  // Completing a lesson previously earned via test-out only pays out the remaining half.
  const baseAward = opts.testedOut
    ? Math.round(fullXp / 2)
    : fullXp - (already ? already.xp : 0);
  // Perfect-run bonus only applies to a run that actually paid out XP — otherwise a
  // completed lesson could be replayed forever for free bonus XP.
  const bonus = (opts.perfect && baseAward > 0) ? perfectBonusXp(lesson) : 0;
  const awardedXp = baseAward + bonus;
  ls.completed[lessonId] = {
    xp: (already ? already.xp : 0) + awardedXp,
    testedOut: !!opts.testedOut,
    completedAt: new Date().toISOString(),
  };
  if (awardedXp > 0) addXP(lang, awardedXp);
  touchUptime(lang);
  save();
  return awardedXp;
}

function isLessonComplete(lang, lessonId) {
  return !!getLangState(lang).completed[lessonId];
}

// available | locked | complete
function lessonStatus(lang, lessonId) {
  if (isLessonComplete(lang, lessonId)) return 'complete';
  const prereqs = curriculum(lang).PREREQS[lessonId] || [];
  const allDone = prereqs.every(p => isLessonComplete(lang, p));
  return allDone ? 'available' : 'locked';
}

function recordTestOutAttempt(lang, targetLessonId, passed) {
  const ls = getLangState(lang);
  const rec = ls.testOutAttempts[targetLessonId] || { count: 0, cooldownUntil: null };
  rec.count += 1;
  if (!passed && rec.count >= 3) {
    rec.cooldownUntil = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    rec.count = 0;
  }
  if (passed) { rec.count = 0; rec.cooldownUntil = null; }
  ls.testOutAttempts[targetLessonId] = rec;
  save();
  return rec;
}

function testOutAvailability(lang, targetLessonId) {
  const ls = getLangState(lang);
  const rec = ls.testOutAttempts[targetLessonId];
  if (!rec || !rec.cooldownUntil) return { onCooldown: false, attemptsLeft: 3 - (rec ? rec.count : 0) };
  const onCooldown = new Date(rec.cooldownUntil) > new Date();
  return { onCooldown, cooldownUntil: rec.cooldownUntil, attemptsLeft: onCooldown ? 0 : 3 };
}

function resetProgress() {
  STATE = defaultState();
  document.documentElement.setAttribute('data-theme', STATE.theme);
  applyAccent(STATE.accent);
  save();
}

// init theme + accent on load
document.documentElement.setAttribute('data-theme', STATE.theme);
applyAccent(STATE.accent);

// ===== Syntaxed state management (localStorage-backed) =====

const STORAGE_KEY = 'syntaxed_state_v1';
const MEMORY_MAX = 5;
const AVATAR_ICONS = { beetle: ['🐞','🪲','🐛'], robot: ['🤖','🦾','👾'] };
const AVATAR_COLORS = ['#37f2ff', '#ff3fd8', '#3dffa0', '#ffcc4d', '#9d7bff'];

// ---- Animated mascot characters (blinking eyes, talking mouth) ----
function renderCharacter(avatar, size) {
  size = size || 64;
  const color = (avatar && avatar.color) || AVATAR_COLORS[0];
  const variant = (avatar && avatar.variant) || 0;
  const bodyHtml = (avatar && avatar.kind === 'robot') ? robotCharSvg(color, variant) : beetleCharSvg(color, variant);
  return `<div class="char char-${avatar && avatar.kind === 'robot' ? 'robot' : 'beetle'}" style="width:${size}px;height:${size}px;">${bodyHtml}</div>`;
}

function beetleCharSvg(color, variant) {
  const spotCount = variant + 1;
  const spotPositions = [[38, 46], [62, 46], [50, 66]].slice(0, spotCount);
  const spots = spotPositions.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#0a0a12" opacity=".35"/>`).join('');
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <line x1="38" y1="26" x2="26" y2="8" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <line x1="62" y1="26" x2="74" y2="8" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="26" cy="8" r="4" fill="${color}"/>
      <circle cx="74" cy="8" r="4" fill="${color}"/>
      <ellipse cx="50" cy="58" rx="38" ry="34" fill="${color}"/>
      <path d="M12 58 A38 34 0 0 0 88 58 Z" fill="#000" opacity=".14"/>
      ${spots}
      <g class="char-eye" style="transform-origin:36px 52px;"><circle cx="36" cy="52" r="12" fill="#fff"/><circle cx="36" cy="53" r="6" fill="#0a0a12"/></g>
      <g class="char-eye" style="transform-origin:64px 52px;"><circle cx="64" cy="52" r="12" fill="#fff"/><circle cx="64" cy="53" r="6" fill="#0a0a12"/></g>
      <ellipse class="char-mouth" cx="50" cy="78" rx="9" ry="3" fill="#0a0a12" style="transform-origin:50px 78px;"/>
    </svg>`;
}

function robotCharSvg(color, variant) {
  const eyeRx = [2, 6, 8][variant] ?? 4;
  return `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <line x1="50" y1="4" x2="50" y2="16" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="4" r="5" fill="${color}"/>
      <rect x="16" y="16" width="68" height="64" rx="18" fill="var(--panel-2)" stroke="${color}" stroke-width="4"/>
      <g class="char-eye" style="transform-origin:38px 46px;"><rect x="30" y="38" width="16" height="16" rx="${eyeRx}" fill="${color}"/></g>
      <g class="char-eye" style="transform-origin:62px 46px;"><rect x="54" y="38" width="16" height="16" rx="${eyeRx}" fill="${color}"/></g>
      <rect class="char-mouth-bar" x="34" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:37px 74px;"/>
      <rect class="char-mouth-bar" x="44" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:47px 74px;"/>
      <rect class="char-mouth-bar" x="54" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:57px 74px;"/>
      <rect class="char-mouth-bar" x="64" y="66" width="6" height="8" rx="2" fill="${color}" style="transform-origin:67px 74px;"/>
    </svg>`;
}

function defaultLangState() {
  return {
    xp: 0,
    uptime: { current: 0, longest: 0, lastActiveDate: null },
    memory: { current: MEMORY_MAX, max: MEMORY_MAX },
    completed: {},        // lessonId -> { xp, testedOut, completedAt }
    testOutAttempts: {},  // targetLessonId -> { count, cooldownUntil }
  };
}

function defaultState() {
  return {
    onboarded: false,
    theme: 'dark',
    pathView: 'tree', // 'tree' | 'list'
    avatar: { kind: 'beetle', variant: 0, color: AVATAR_COLORS[0] },
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
    Object.keys(base.languages).forEach(k => {
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

function setTheme(theme) {
  STATE.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  save();
}

function setAvatar(kind, variant, color) {
  STATE.avatar = { kind, variant, color };
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
  save();
  return ls.memory.current;
}

function gainMemory(lang, amount) {
  const ls = getLangState(lang);
  ls.memory.current = Math.min(ls.memory.max, ls.memory.current + (amount || 1));
  save();
  return ls.memory.current;
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
  const fullXp = getLesson(lessonId) ? getLesson(lessonId).xp : 0;
  // Completing a lesson previously earned via test-out only pays out the remaining half.
  const awardedXp = opts.testedOut
    ? Math.round(fullXp / 2)
    : fullXp - (already ? already.xp : 0);
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
  const prereqs = PREREQS[lessonId] || [];
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
  save();
}

// init theme on load
document.documentElement.setAttribute('data-theme', STATE.theme);

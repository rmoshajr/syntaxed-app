// ===== Syntaxed app shell: router + views =====

function navigate(hash) { location.hash = hash; }

function parseRoute() {
  const h = (location.hash || '#/').slice(1);
  return h.split('/').filter(Boolean);
}

const TABS = [
  { route: 'home', icon: '🏠', label: 'Home' },
  { route: 'path', icon: '🍎✏️', label: 'Learn' },
  { route: 'settings', icon: '⚙️', label: 'Profile' },
];

function render() {
  closeInfoBubble();
  processMemoryRegen(getState().currentLanguage);
  const parts = parseRoute();
  const route = parts[0] || 'home';
  const root = document.getElementById('app');

  if (route === 'lesson' || route === 'review' || route === 'testout') {
    root.innerHTML = '<div class="app-shell"><div class="app-content" id="lesson-root"></div></div>';
    const lessonRoot = document.getElementById('lesson-root');
    if (route === 'testout') startTestOutRoute(lessonRoot, parts[1]);
    else startLessonRoute(lessonRoot, parts[1], route === 'review');
    return;
  }

  root.innerHTML = `
    <div class="app-shell">
      ${renderTopBar()}
      <div class="app-content" id="main"></div>
      <nav class="bottom-tabs"><div class="bottom-tabs-inner">
        ${TABS.map(t => `<a href="#/${t.route}" class="tab ${route === t.route ? 'active' : ''}"><span class="tab-icon">${t.icon}</span>${t.label}</a>`).join('')}
      </div></nav>
    </div>`;
  const main = document.getElementById('main');
  if (route === 'path') renderPath(main);
  else if (route === 'settings') renderSettings(main);
  else if (route === 'about') renderAbout(main);
  else renderHome(main);
}
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

// Ticks the Memory-regen countdown once a second. When a RAM stick actually finishes
// refilling mid-session, re-render fully so every Memory display (topbar, home, lesson
// shell) picks up the new count; otherwise just update the countdown text in place.
setInterval(() => {
  const lang = getState().currentLanguage;
  if (processMemoryRegen(lang)) { render(); return; }
  const text = memoryTimerText(getLangState(lang).memory);
  document.querySelectorAll('.mem-timer').forEach(el => { el.textContent = text; el.style.display = text ? '' : 'none'; });
}, 1000);

// ---------------- Stat info bubbles (click an XP/Uptime/Memory pill, or the logo for all three) ----------------
const STAT_INFO = {
  xp: {
    icon: '⭐', title: 'XP — Experience Points',
    body: "Earned by finishing lessons and quizzes: 10-15 XP per lesson depending on how much it covers, 50 XP per quiz, plus a small bonus for a mistake-free run. Testing out of a lesson early earns half its XP up front — you can go back and finish it properly later for the other half. XP only ever goes up — it's a running total, not something you can lose.",
  },
  uptime: {
    icon: '🔥', title: 'Uptime — your streak',
    body: "Tracked separately for every language. Finish or review at least one lesson today and it climbs by 1. Miss a full day and it drops back down to 1 next time you're active.",
  },
  memory: {
    icon: '🔋', title: "Memory — this app's lives",
    body: "Five RAM sticks per language, standing in for hearts. A wrong answer spends 1; revealing the raw error on a code exercise spends 1 more. Each spent stick quietly refills on its own after 30 minutes — the countdown next to the icon shows when the next one lands. Hit zero and you're locked out of new lessons until a stick regenerates or you replay a finished lesson in Review Mode, which refills Memory instantly and for free.",
  },
};

let activeInfoBubble = null;
let activeInfoAnchor = null;

function closeInfoBubble() {
  if (activeInfoBubble) activeInfoBubble.remove();
  activeInfoBubble = null;
  activeInfoAnchor = null;
  document.removeEventListener('click', onDocClickCloseInfoBubble);
  window.removeEventListener('scroll', closeInfoBubble, true);
}

function onDocClickCloseInfoBubble(e) {
  if (activeInfoBubble && !activeInfoBubble.contains(e.target) && e.target !== activeInfoAnchor) closeInfoBubble();
}

function showInfoBubble(anchor, keys) {
  const reopeningSame = activeInfoAnchor === anchor;
  closeInfoBubble();
  if (reopeningSame) return; // treat a second click on the same pill as toggle-off

  const bubble = document.createElement('div');
  bubble.className = 'info-bubble';
  bubble.innerHTML = keys.map(k => {
    const info = STAT_INFO[k];
    return `<div class="info-bubble-item"><div class="info-bubble-title">${info.icon} ${escapeHtml(info.title)}</div><p>${escapeHtml(info.body)}</p></div>`;
  }).join('<hr class="info-bubble-sep">');
  document.body.appendChild(bubble);

  const r = anchor.getBoundingClientRect();
  const bw = Math.min(300, window.innerWidth - 24);
  bubble.style.width = bw + 'px';
  let left = r.left + r.width / 2 - bw / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - bw - 12));
  bubble.style.left = left + 'px';
  bubble.style.top = Math.min(r.bottom + 10, window.innerHeight - 20) + 'px';
  bubble.style.setProperty('--arrow-left', (r.left + r.width / 2 - left) + 'px');

  requestAnimationFrame(() => bubble.classList.add('open'));
  activeInfoBubble = bubble;
  activeInfoAnchor = anchor;
  setTimeout(() => {
    document.addEventListener('click', onDocClickCloseInfoBubble);
    window.addEventListener('scroll', closeInfoBubble, true);
  }, 0);
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-info]');
  if (!el) return;
  showInfoBubble(el, [el.dataset.info]);
});

function renderTopBar() {
  const lang = getState().currentLanguage;
  const ls = getLangState(lang);
  return `
    <div class="app-topbar"><div class="app-topbar-inner">
      <a class="topbar-brand" href="#/home">🐞 Syntaxed</a>
      <div class="topbar-stats">
        <button class="ts-pill uptime" type="button" data-info="uptime">🔥 ${ls.uptime.current}</button>
        <button class="ts-pill xp" type="button" data-info="xp">⭐ ${ls.xp}</button>
        <button class="ts-pill memory" type="button" data-info="memory">🔋 ${ls.memory.current}<span class="mem-timer">${escapeHtml(memoryTimerText(ls.memory))}</span></button>
      </div>
    </div></div>`;
}

// ---------------- About (the old marketing pitch — reachable from Profile, not the default) ----------------
function renderAbout(main) {
  main.innerHTML = `
    <div style="padding:14px 18px 0;"><a href="#/settings" class="btn btn-ghost btn-sm">← Back</a></div>
    <section class="hero">
      <div class="badge">🐛 Beta — 5-Language MVP</div>
      <h1>Learn to code by fixing what's broken.</h1>
      <p class="lead">Syntaxed teaches programming the way the best spoken-language apps teach language: general meaning first, precise rules second. Duolingo-style lessons, a cyberpunk debugging theme, and a beetle mascot who's just trying to help.</p>
      <div class="cta-row">
        <a href="#/home" class="btn btn-primary">Start Learning ▸</a>
        <a href="#/path" class="btn btn-ghost">View the Path</a>
      </div>
    </section>

    <section class="section">
      <h2>Meaning first. Precision second.</h2>
      <p class="sub">The teaching method, shown with the actual example from Lesson 3: Data Types.</p>
      <div class="compare">
        <div class="card bad">
          <h3>✕ Definitions-first</h3>
          <p>"An integer is a primitive data type representing whole numbers within a fixed range, stored in binary…"</p>
          <ul><li>Technically correct</li><li>Useless to a total beginner</li><li>Causes re-reads and drop-off</li></ul>
        </div>
        <div class="card good">
          <h3>✓ Meaning-first (Syntaxed)</h3>
          <p>"An integer is a whole number. A float has a decimal. A string is anything in quotes."</p>
          <ul><li>Usable immediately</li><li>Reinforced with matching + quizzes</li><li>Precision layered in later</li></ul>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Built like a skill tree</h2>
      <p class="sub">PCEP → PCAP → PCPP1 → PCPP2, gated like real certification prep — not a straight line.</p>
      <div class="grid-3">
        <div class="card"><div class="icon">🔓</div><h3>Non-linear unlocks</h3><p>Some lessons branch open in parallel once you're ready — but core basics are always a hard gate before you advance.</p></div>
        <div class="card"><div class="icon">⏩</div><h3>Test out</h3><p>Confident already? Pass a test built from the hardest questions in a locked lesson's prerequisites to skip ahead for half XP.</p></div>
        <div class="card"><div class="icon">🎓</div><h3>Cert-mapped tiers</h3><p>Each tier is designed to line up with real industry certification prep, with a nudge when you're ready to start studying.</p></div>
      </div>
    </section>

    <section class="section">
      <h2>Gamified, cyberpunk, debugging-themed</h2>
      <div class="grid-3">
        <div class="card"><div class="icon">🔋</div><h3>Memory, not hearts</h3><p>Lives are RAM sticks. Run out and you're locked out until you review earlier lessons to refill.</p></div>
        <div class="card"><div class="icon">📶</div><h3>Uptime, not streaks</h3><p>Tracked separately per language — keep every language you're learning online.</p></div>
        <div class="card"><div class="icon">🐞</div><h3>Debug your mistakes</h3><p>Wrong answers show a themed error, not a dry explanation. Reveal the raw error if you dare — it costs you.</p></div>
      </div>
    </section>

    <section class="section">
      <h2>Launch languages</h2>
      <p class="sub">Four of the five most-used languages, plus C for the classroom crowd.</p>
      <div class="langs">
        ${LANGUAGES.map(l => {
          const live = languageIsLive(l.id);
          const active = l.id === getState().currentLanguage;
          return `<div class="lang-pill ${live ? '' : 'soon'} ${active ? 'active-lang' : ''}" data-lang="${l.id}" ${live ? '' : 'title="Coming soon"'}>${escapeHtml(l.label)}</div>`;
        }).join('')}
      </div>
    </section>`;

  main.querySelectorAll('.lang-pill[data-lang]').forEach(pill => {
    const lang = pill.dataset.lang;
    if (!languageIsLive(lang)) return;
    pill.onclick = () => { setLanguage(lang); navigate('#/home'); };
  });
}

// ---------------- Home ----------------
function statsRowHtml(ls) {
  return `
    <div class="stat-row">
      <button class="stat-chip xp" type="button" data-info="xp">⭐ XP <span class="val">${ls.xp}</span></button>
      <button class="stat-chip uptime" type="button" data-info="uptime">🔥 Uptime <span class="val">${ls.uptime.current}d</span></button>
      <button class="stat-chip memory" type="button" data-info="memory">🔋 ${renderRam(ls.memory.current, ls.memory.max)}</button>
    </div>`;
}

function certTrackLabel(lang) {
  const checkpoints = CERT_CHECKPOINTS[lang] || [];
  return checkpoints.length ? checkpoints.map(c => c.name).join(' → ') : 'Full roadmap in progress';
}

function renderHome(main) {
  const lang = getState().currentLanguage;
  const ls = getLangState(lang);
  const meta = languageMeta(lang);
  const C = curriculum(lang);
  const completedCount = Object.keys(ls.completed).filter(id => isPlayable(id, lang)).length;
  const totalPlayable = Object.keys(C.LESSONS).length;
  const pct = totalPlayable ? Math.round((completedCount / totalPlayable) * 100) : 0;
  const showOnboard = !getState().onboarded && completedCount === 0 && totalPlayable > 0;
  const currentId = findCurrentLessonId(lang);
  const currentLesson = currentId ? getLesson(currentId, lang) : null;
  const ctaHref = currentLesson && isPlayable(currentId, lang) ? `#/lesson/${currentId}` : '#/path';
  const ctaLabel = !currentLesson || !isPlayable(currentId, lang)
    ? "🎉 All caught up — see what's next"
    : `${completedCount === 0 ? 'Start' : 'Continue'}: ${escapeHtml(currentLesson.title)} ▸`;
  const otherLanguages = LANGUAGES.filter(l => l.id !== lang);

  main.innerHTML = `
    <div class="home-wrap">
      <div class="home-header">
        <h1 style="margin:0">Home</h1>
        <p style="color:var(--text-dim); margin:4px 0 0;">Every language tracks its own XP, Uptime, and Memory.</p>
      </div>
      ${statsRowHtml(ls)}
      <div id="onboard-slot"></div>
      <div class="lang-card">
        <div class="l-left">
          <div class="lang-badge">${escapeHtml(meta.badge)}</div>
          <div>
            <h3 style="margin:0 0 4px">${escapeHtml(meta.label)}</h3>
            <div class="progress-bar"><span style="width:${pct}%"></span></div>
            <div style="font-size:12px;color:var(--text-dim);margin-top:6px">${completedCount} / ${totalPlayable} lessons complete · ${escapeHtml(certTrackLabel(lang))}</div>
          </div>
        </div>
        <a href="${ctaHref}" class="btn btn-primary btn-block" style="margin-top:14px;">${ctaLabel}</a>
      </div>
      <div class="home-section">
        <div class="section-title">More Languages</div>
        <div class="langs" style="justify-content:flex-start;">
          ${otherLanguages.map(l => {
            const live = languageIsLive(l.id);
            return `<div class="lang-pill ${live ? '' : 'soon'}" data-lang="${l.id}" ${live ? '' : 'title="Coming soon"'}>${escapeHtml(l.label)}</div>`;
          }).join('')}
        </div>
      </div>
    </div>`;

  main.querySelectorAll('.lang-pill[data-lang]').forEach(pill => {
    const target = pill.dataset.lang;
    if (!languageIsLive(target)) return;
    pill.onclick = () => { setLanguage(target); render(); };
  });

  if (showOnboard) {
    const slot = main.querySelector('#onboard-slot');
    const hasPlacement = (curriculum(lang).UNITS.length >= 2);
    slot.innerHTML = `
      <div class="card" style="margin:16px 0;">
        <h3 style="margin:0 0 4px">New here?</h3>
        <p style="margin:0 0 12px; color:var(--text-dim); font-size:14px;">${hasPlacement ? 'Take a placement test to skip ahead, or just start from Lesson 1.' : 'Start from Lesson 1 whenever you\'re ready.'}</p>
        <div class="small-btn-row">
          ${hasPlacement ? '<button class="btn btn-primary btn-sm" id="btn-placement">Take Placement Test</button>' : ''}
          <button class="btn btn-ghost btn-sm" id="btn-skip-onboard">Start from Lesson 1</button>
        </div>
      </div>`;
    const placementBtn = slot.querySelector('#btn-placement');
    if (placementBtn) placementBtn.onclick = () => startPlacementTest(main);
    slot.querySelector('#btn-skip-onboard').onclick = () => {
      const st = getState(); st.onboarded = true; save();
      navigate('#/path');
    };
  }
}

// First not-yet-complete, unlocked lesson in curriculum order — used to focus Home's CTA
// and the skill tree's default view on "where the user actually is."
function findCurrentLessonId(lang) {
  const C = curriculum(lang);
  const ids = Object.keys(C.LESSONS);
  const nextUp = ids.find(id => lessonStatus(lang, id) === 'available');
  if (nextUp) return nextUp;
  const allComplete = ids.length > 0 && ids.every(id => isLessonComplete(lang, id));
  if (allComplete) {
    const stubIds = Object.keys(C.STUB_LESSONS);
    if (stubIds.length) return stubIds[0];
  }
  return (C.UNITS[0] && C.UNITS[0].lessons[0]) || ids[0] || null;
}

// Placement scope is always "the first two units" of whichever language is active —
// generalizes automatically as new languages are added.
function placementScopeIds(lang) {
  const UNITS = curriculum(lang).UNITS;
  return UNITS.slice(0, 2).flatMap(u => u.lessons).filter(id => isPlayable(id, lang));
}

function startPlacementTest(main) {
  const lang = getState().currentLanguage;
  const ids = placementScopeIds(lang).filter(id => !isLessonComplete(lang, id));
  const pool = collectPlacementQuestions(ids, lang);
  const mcqs = shuffle(pool.filter(q => q.type === 'mcq'));
  const codes = shuffle(pool.filter(q => q.type === 'code'));
  const questions = shuffle([...mcqs.slice(0, 8), ...codes.slice(0, 3)]);
  const container = document.createElement('div');
  container.className = 'container';
  main.replaceChildren(container);
  const lesson = {
    id: 'placement', synthetic: true, title: 'Placement Test',
    intro: "Multiple-choice and code exercises only, pulled from Units 1–2. Score 80%+ to test out of both units; 50%+ tests out of Unit 1 only.",
    questions,
  };
  new LessonEngine({
    lesson, lang, container,
    onExit: () => navigate('#/home'),
    onComplete: (info) => applyPlacementResult(info.score, container),
  }).start();
}

function applyPlacementResult(score, container) {
  const lang = getState().currentLanguage;
  const st = getState(); st.onboarded = true; save();
  const UNITS = curriculum(lang).UNITS;
  const unit1Ids = ((UNITS[0] && UNITS[0].lessons) || []).filter(id => isPlayable(id, lang));
  const unit2Ids = ((UNITS[1] && UNITS[1].lessons) || []).filter(id => isPlayable(id, lang));
  let unlockedIds = [], text;
  if (score >= 0.8) {
    unlockedIds = [...unit1Ids, ...unit2Ids];
    text = `Strong score — you've tested out of Unit 1 and Unit 2, at half XP each.`;
  } else if (score >= 0.5) {
    unlockedIds = unit1Ids;
    text = `Solid start — you've tested out of Unit 1 at half XP. Unit 2 starts fresh.`;
  } else {
    text = `Let's build from the ground up — starting at Lesson 1.`;
  }
  unlockedIds.forEach(id => { if (!isLessonComplete(lang, id)) markLessonComplete(lang, id, { testedOut: true }); });
  const newCert = checkNewlyReadyCert(lang);
  renderResultScreen(container, {
    icon: score >= 0.5 ? '🎓' : '🌱', title: 'Placement Result',
    text: `${text} (Score: ${Math.round(score * 100)}%)`,
    cta: 'Go to Path', onCta: () => { navigate('#/path'); if (newCert) setTimeout(() => showCertReadyModal(newCert), 30); },
  });
}

function showCertReadyModal(cp) {
  openModal(`
    <div class="big-icon">${cp.icon}</div>
    <h2>Ready for ${escapeHtml(cp.name)}!</h2>
    <p style="color:var(--text-dim)">You've completed everything on the roadmap through this checkpoint. Consider practicing with exam-style questions and taking the <strong>${escapeHtml(cp.fullName)}</strong> exam.</p>
    <button class="btn btn-primary btn-block" data-close>Nice ▸</button>`);
}

function renderResultScreen(container, { icon, title, text, cta, onCta }) {
  container.innerHTML = `
    <div class="lesson-complete">
      <div class="big-icon">${icon}</div>
      <h2>${escapeHtml(title)}</h2>
      <p style="color:var(--text-dim); max-width:480px; margin:0 auto; line-height:1.6;">${escapeHtml(text)}</p>
      <button class="btn btn-primary" id="result-cta" style="margin-top:22px;">${escapeHtml(cta)}</button>
    </div>`;
  container.querySelector('#result-cta').onclick = onCta;
}

// ---------------- Path (Duolingo-style winding trail) ----------------
const DUO_TRAIL_WIDTH = 300;
const DUO_NODE_D = 72;
const DUO_ROW_H = 108;
const DUO_BANNER_H = 104;
const DUO_CHECKPOINT_H = 128;
const DUO_WAVE = [0, 45, 78, 45, 0, -45, -78, -45];
const DUO_UNIT_COLORS = ['--cyan', '--magenta', '--green', '--amber'];

// Gating is driven entirely by PREREQS now that the whole roadmap is built —
// a unit's own comingSoon flag is the only extra override (for future in-progress units).
function nodeStatus(lessonId, lang) {
  const unit = curriculum(lang).UNITS.find(u => u.lessons.includes(lessonId));
  if (unit && unit.comingSoon) return 'locked';
  return lessonStatus(lang, lessonId);
}

function renderPath(main) {
  const lang = getState().currentLanguage;
  const mode = getState().pathView || 'tree';

  main.innerHTML = `
    <div class="tree-wrap">
      <div class="tree-toolbar">
        <h1 style="margin:0">${escapeHtml(languageMeta(lang).label)} Path</h1>
        <div class="view-toggle">
          <button class="${mode === 'tree' ? 'active' : ''}" id="view-tree">🛤️ Path</button>
          <button class="${mode === 'list' ? 'active' : ''}" id="view-list">📋 List</button>
        </div>
      </div>
      <div class="tree-legend">
        <span>🔓 Available</span><span>✅ Complete</span><span>🔒 Locked</span>
      </div>
      <div id="path-body"></div>
    </div>`;

  main.querySelector('#view-tree').onclick = () => { setPathView('tree'); renderPath(main); };
  main.querySelector('#view-list').onclick = () => { setPathView('list'); renderPath(main); };

  const body = main.querySelector('#path-body');
  if (mode === 'list') renderPathList(body, lang);
  else renderDuoPath(body, lang);
}

function renderPathList(body, lang) {
  const C = curriculum(lang);
  body.innerHTML = `<div class="lv-list">${C.UNITS.map(unit => {
    const rows = unit.lessons.map(id => {
      const lesson = getLesson(id, lang);
      const status = nodeStatus(id, lang);
      const meta = unit.comingSoon ? 'Coming soon' : `${lessonXpValue(C.LESSONS[id])} XP${C.LESSONS[id].isQuiz ? ' · Quiz' : ''}`;
      return `
        <button class="lv-row ${status}" data-id="${id}" data-status="${status}">
          <span class="lv-icon">${status === 'complete' ? '✅' : lesson.icon}</span>
          <span class="lv-text"><span class="lv-title">${escapeHtml(lesson.title)}</span><span class="lv-meta">${escapeHtml(meta)}</span></span>
          <span class="lv-chevron">${status === 'locked' ? '🔒' : '›'}</span>
        </button>`;
    }).join('');
    return `
      <div class="lv-unit">
        <div class="lv-unit-head">${unit.icon} ${escapeHtml(unit.title)}${unit.comingSoon ? ' <span class="tag-soon">Roadmap</span>' : ''}</div>
        ${rows}
      </div>`;
  }).join('')}</div>`;

  body.querySelectorAll('.lv-row').forEach(row => {
    row.addEventListener('click', () => onNodeClick(row.dataset.id, row.dataset.status));
  });
}

function renderDuoPath(body, lang) {
  const C = curriculum(lang);
  const currentId = findCurrentLessonId(lang);
  const checkpointsByUnit = {};
  (CERT_CHECKPOINTS[lang] || []).forEach(cp => { checkpointsByUnit[cp.afterUnit] = cp; });

  // Lay out unit banners, lesson nodes, and checkpoint badges along one winding vertical
  // trail. Position is derived purely from unit/lesson order — no hand-placed coordinates
  // needed, so this works automatically for any curriculum shape.
  let y = 24;
  let waveIdx = 0;
  const banners = [];
  const nodes = [];       // every renderable node (lessons + checkpoints), in path order
  const lessonPoints = []; // just lesson centers, for the connecting line

  C.UNITS.forEach((unit, unitIdx) => {
    const colorVar = DUO_UNIT_COLORS[unitIdx % DUO_UNIT_COLORS.length];
    banners.push({ unit, y, colorVar });
    y += DUO_BANNER_H;
    unit.lessons.forEach(lessonId => {
      const cx = DUO_TRAIL_WIDTH / 2 + DUO_WAVE[waveIdx % DUO_WAVE.length];
      const node = { kind: 'lesson', id: lessonId, cx, y, colorVar };
      nodes.push(node);
      lessonPoints.push({ cx, cy: y + DUO_NODE_D / 2 });
      waveIdx++;
      y += DUO_ROW_H;
    });
    const cp = checkpointsByUnit[unit.id];
    if (cp) {
      nodes.push({ kind: 'checkpoint', cp, cx: DUO_TRAIL_WIDTH / 2, y });
      y += DUO_CHECKPOINT_H;
    }
  });
  const totalHeight = y + 20;

  let pathD = '';
  if (lessonPoints.length > 1) {
    pathD = `M ${lessonPoints[0].cx} ${lessonPoints[0].cy}`;
    for (let i = 1; i < lessonPoints.length; i++) {
      const prev = lessonPoints[i - 1], cur = lessonPoints[i];
      const midY = (prev.cy + cur.cy) / 2;
      pathD += ` C ${prev.cx} ${midY}, ${cur.cx} ${midY}, ${cur.cx} ${cur.cy}`;
    }
  }

  const bannersHtml = banners.map(b => `
    <div class="duo-banner" style="top:${b.y}px; --unit-color:var(${b.colorVar});">
      <span class="duo-banner-icon">${b.unit.icon}</span>
      <div class="duo-banner-text">
        <div class="duo-banner-title">${escapeHtml(b.unit.title)}${b.unit.comingSoon ? ' 🚧' : ''}</div>
        <div class="duo-banner-sub">${b.unit.lessons.length} lesson${b.unit.lessons.length === 1 ? '' : 's'}</div>
      </div>
    </div>`).join('');

  const nodesHtml = nodes.map(n => {
    if (n.kind === 'checkpoint') {
      const { ready, done, total } = certReadiness(lang, n.cp);
      return `
        <div class="duo-node duo-checkpoint ${ready ? 'complete' : 'locked'}" data-cp="${n.cp.id}" style="left:${n.cx}px; top:${n.y}px;">
          <div class="duo-node-circle"><span>${n.cp.icon}</span></div>
          <div class="duo-node-label">${escapeHtml(n.cp.name)}${ready ? ' ✓' : ` (${done}/${total})`}</div>
        </div>`;
    }
    const lesson = getLesson(n.id, lang);
    const status = nodeStatus(n.id, lang);
    const isQuiz = C.LESSONS[n.id] && C.LESSONS[n.id].isQuiz;
    const isCurrent = n.id === currentId;
    return `
      <div class="duo-node ${status} ${isQuiz ? 'quiz' : ''} ${isCurrent ? 'current' : ''}" data-id="${n.id}" data-status="${status}" style="left:${n.cx}px; top:${n.y}px; --unit-color:var(${n.colorVar});">
        ${isCurrent ? '<div class="duo-start-badge">START</div>' : ''}
        <div class="duo-node-circle">${status === 'complete' ? '✅' : lesson.icon}</div>
        <div class="duo-node-label">${escapeHtml(lesson.title)}</div>
      </div>`;
  }).join('');

  body.innerHTML = `
    <div class="duo-trail" id="duo-trail" style="height:${totalHeight}px;">
      <svg class="duo-line" width="${DUO_TRAIL_WIDTH}" height="${totalHeight}"><path class="duo-line-path" d="${pathD}" /></svg>
      ${bannersHtml}
      ${nodesHtml}
    </div>
    <p class="tree-note" style="text-align:center; margin-top:10px;">Scroll to see your path · tap a node to open it</p>`;

  body.querySelectorAll('.duo-checkpoint').forEach(node => {
    node.addEventListener('click', () => openCertCheckpointModal(node.dataset.cp, lang));
  });
  body.querySelectorAll('.duo-node:not(.duo-checkpoint)').forEach(node => {
    node.addEventListener('click', () => onNodeClick(node.dataset.id, node.dataset.status));
  });

  const currentEl = body.querySelector('.duo-node.current');
  if (currentEl) requestAnimationFrame(() => currentEl.scrollIntoView({ block: 'center' }));
}

function openCertCheckpointModal(cpId, lang) {
  const cp = (CERT_CHECKPOINTS[lang] || []).find(c => c.id === cpId);
  if (!cp) return;
  const { ready, done, total } = certReadiness(lang, cp);
  openModal(`
    <div class="big-icon">${cp.icon}</div>
    <h2>${escapeHtml(cp.name)} Checkpoint</h2>
    <p style="color:var(--text-dim)">${escapeHtml(cp.fullName)}</p>
    ${ready
      ? `<p style="color:var(--green); font-weight:700;">✅ You've covered everything on the roadmap through this point — consider practicing for and taking the exam!</p>`
      : `<p style="color:var(--text-dim)">${done} / ${total} lessons complete on the path to this checkpoint. Keep going!</p>
         <div class="progress-bar" style="margin:10px auto; max-width:260px;"><span style="width:${Math.round(done / total * 100)}%"></span></div>`}
    <button class="btn btn-primary btn-block" data-close style="margin-top:10px;">Close</button>`);
}

function onNodeClick(lessonId, status) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId, lang);
  if (!isPlayable(lessonId, lang)) {
    openComingSoonModal(lesson);
    return;
  }
  if (status === 'complete') { openCompleteLessonModal(lessonId); return; }
  if (status === 'available') { navigate('#/lesson/' + lessonId); return; }
  if (status === 'locked') { openLockedLessonModal(lessonId); return; }
}

function openComingSoonModal(lesson) {
  openModal(`
    <div class="big-icon">🚧</div>
    <h2>${escapeHtml(lesson.title)}</h2>
    <p style="color:var(--text-dim)">This lesson is on the roadmap but isn't built yet — check back soon.</p>
    <button class="btn btn-primary btn-block" data-close>Got it</button>`);
}

function openCompleteLessonModal(lessonId) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId, lang);
  const mem = getLangState(lang).memory;
  const record = getLangState(lang).completed[lessonId];
  const remainingXp = record && record.testedOut ? Math.max(0, lessonXpValue(lesson) - record.xp) : 0;
  openModal(`
    <div class="big-icon">✅</div>
    <h2>${escapeHtml(lesson.title)}</h2>
    <p style="color:var(--text-dim)">${remainingXp > 0
      ? `You tested out of this one for half credit. Complete it for real to earn the other ${remainingXp} XP.`
      : "Already complete. Replay it in Review Mode to refill Memory — reviews don't cost Memory and don't earn extra XP."}</p>
    <p style="font-size:13px;color:var(--text-dim)">Current Memory: ${mem.current}/${mem.max}</p>
    ${remainingXp > 0 ? `<button class="btn btn-magenta btn-block" data-nav="#/lesson/${lessonId}">Complete for +${remainingXp} XP</button>` : ''}
    <button class="btn btn-primary btn-block" data-nav="#/review/${lessonId}" style="margin-top:10px;">Review Lesson</button>
    <button class="btn btn-ghost btn-block" data-close style="margin-top:10px;">Close</button>`);
}

function openLockedLessonModal(lessonId) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId, lang);
  const prereqIds = collectPrereqs(lessonId, lang);
  const hardQs = collectHardQuestions(prereqIds.filter(id => !isLessonComplete(lang, id)), lang);
  const avail = testOutAvailability(lang, lessonId);
  const prereqNames = prereqIds.map(id => getLesson(id, lang).title).join(', ') || '—';
  openModal(`
    <div class="big-icon">🔒</div>
    <h2>${escapeHtml(lesson.title)}</h2>
    <p style="color:var(--text-dim)">Locked. Finish first: ${escapeHtml(prereqNames)}</p>
    ${hardQs.length ? `
      <p style="font-size:13px;color:var(--text-dim)">${avail.onCooldown ? `Test-out on cooldown until ${new Date(avail.cooldownUntil).toLocaleString()}` : `${avail.attemptsLeft} test-out attempt(s) left today`}</p>
      <button class="btn btn-magenta btn-block" data-nav="${avail.onCooldown ? '' : '#/testout/' + lessonId}" ${avail.onCooldown ? 'disabled' : ''}>⏩ Attempt Test-Out</button>
    ` : ''}
    <button class="btn btn-ghost btn-block" data-close style="margin-top:10px;">Close</button>`);
}

function openModal(innerHtml) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal">${innerHtml}</div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  backdrop.querySelectorAll('[data-close]').forEach(b => b.onclick = () => backdrop.remove());
  backdrop.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => {
    const target = b.dataset.nav;
    backdrop.remove();
    if (target) navigate(target);
  });
  return backdrop;
}

// ---------------- Lesson / Review / Test-out routes ----------------
function startLessonRoute(root, lessonId, reviewMode) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId, lang);
  if (!lesson || !isPlayable(lessonId, lang)) {
    root.innerHTML = `<div class="empty-note">This lesson isn't built yet — check back soon.<br><br><a href="#/path" class="btn btn-primary">Back to Path</a></div>`;
    return;
  }
  if (!reviewMode && lessonStatus(lang, lessonId) === 'locked') { navigate('#/path'); return; }
  if (!reviewMode && getLangState(lang).memory.current <= 0) {
    navigate('#/path');
    setTimeout(() => showOutOfMemoryModal(lang), 30);
    return;
  }
  if (!reviewMode && !getState().statsIntroSeen) {
    startStatsOrientation(root, () => startLessonRoute(root, lessonId, reviewMode));
    return;
  }
  new LessonEngine({
    lesson, lang, container: root, reviewMode,
    onExit: () => navigate('#/path'),
    onComplete: () => {
      const newCert = reviewMode ? null : checkNewlyReadyCert(lang);
      navigate('#/path');
      if (newCert) setTimeout(() => showCertReadyModal(newCert), 30);
    },
    onOutOfMemory: () => { navigate('#/path'); setTimeout(() => showOutOfMemoryModal(lang), 30); },
  }).start();
}

function startTestOutRoute(root, lessonId) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId, lang);
  const prereqIds = collectPrereqs(lessonId, lang);
  // Only quiz on prerequisites not already completed or passed — no point re-testing
  // something already locked in.
  const eligiblePrereqIds = prereqIds.filter(id => !isLessonComplete(lang, id));
  const hardQs = shuffle(collectHardQuestions(eligiblePrereqIds, lang));
  if (!lesson || !hardQs.length) { navigate('#/path'); return; }
  const container = document.createElement('div');
  container.className = 'container';
  root.replaceChildren(container);
  const synthetic = {
    id: 'testout_' + lessonId, synthetic: true, title: 'Test Out: ' + lesson.title,
    intro: "Answer using only the hardest questions from the prerequisite lessons. Score 80%+ to unlock instantly at half XP. Three attempts, then a 24-hour cooldown.",
    questions: hardQs,
  };
  new LessonEngine({
    lesson: synthetic, lang, container,
    onExit: () => navigate('#/path'),
    onComplete: (info) => {
      const passed = info.score >= 0.8;
      recordTestOutAttempt(lang, lessonId, passed);
      if (passed) prereqIds.forEach(id => { if (!isLessonComplete(lang, id)) markLessonComplete(lang, id, { testedOut: true }); });
      const newCert = passed ? checkNewlyReadyCert(lang) : null;
      const avail = testOutAvailability(lang, lessonId);
      renderResultScreen(container, {
        icon: passed ? '🎉' : '🔁', title: passed ? 'Tested Out!' : 'Not Quite',
        text: `${Math.round(info.score * 100)}% — ${passed ? 'prerequisite lessons unlocked at half XP.' : (avail.onCooldown ? 'Out of attempts for now — 24h cooldown.' : `${avail.attemptsLeft} attempt(s) left today.`)}`,
        cta: 'Back to Path', onCta: () => { navigate('#/path'); if (newCert) setTimeout(() => showCertReadyModal(newCert), 30); },
      });
    },
  }).start();
}

function showOutOfMemoryModal(lang) {
  const completedIds = Object.keys(getLangState(lang).completed).filter(id => isPlayable(id, lang));
  const options = completedIds.map(id => `<option value="${id}">${escapeHtml(getLesson(id, lang).title)}</option>`).join('');
  const backdrop = openModal(`
    <div class="big-icon">🔋</div>
    <h2>Out of Memory</h2>
    <p style="color:var(--text-dim)">You're out of RAM sticks. Review a completed lesson to refill Memory before continuing.</p>
    ${completedIds.length ? `
      <select id="review-pick" class="btn btn-block" style="text-align:left;">${options}</select>
      <button class="btn btn-primary btn-block" id="go-review" style="margin-top:10px;">Review &amp; Refill</button>
    ` : `<p style="color:var(--text-dim); font-size:13px;">Complete a lesson first, then come back to review it.</p>`}
    <button class="btn btn-ghost btn-block" data-close style="margin-top:10px;">Back to Path</button>`);
  const goBtn = backdrop.querySelector('#go-review');
  if (goBtn) goBtn.onclick = () => {
    const id = backdrop.querySelector('#review-pick').value;
    backdrop.remove();
    navigate('#/review/' + id);
  };
}

// ---------------- Settings ----------------
function renderSettings(main) {
  const st = getState();
  main.innerHTML = `
    <div class="container">
      <h1>Settings</h1>
      <div class="settings-grid">
        <div class="card">
          <div class="section-title">Avatar</div>
          <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
            <div class="avatar-preview" id="avatar-preview">${renderCharacter(st.avatar, 80)}</div>
            <div style="flex:1; min-width:220px;">
              <div style="display:flex; gap:8px; margin-bottom:10px;">
                <button class="btn btn-sm ${st.avatar.kind === 'beetle' ? 'btn-primary' : ''}" id="kind-beetle">Bug</button>
                <button class="btn btn-sm ${st.avatar.kind === 'robot' ? 'btn-primary' : ''}" id="kind-robot">Robot</button>
              </div>
              <div class="avatar-options" id="avatar-options"></div>
            </div>
          </div>
          <div class="section-title" style="margin-top:20px">Accent Color</div>
          <div class="swatches" id="swatches"></div>
        </div>

        <div class="card">
          <div class="toggle-row">
            <div><strong>Dark Mode</strong><div style="color:var(--text-dim); font-size:13px;">Cyberpunk default. Toggle off for light mode.</div></div>
            <label class="switch"><input type="checkbox" id="theme-toggle" ${st.theme === 'dark' ? 'checked' : ''}><span class="slider"></span></label>
          </div>
        </div>

        <div class="card">
          <div class="section-title">Progress</div>
          <p style="color:var(--text-dim); font-size:13px;">Everything is stored locally in this browser (localStorage). Resetting clears all XP, Uptime, Memory, and lesson progress.</p>
          <button class="btn btn-magenta" id="reset-btn">Reset All Progress</button>
        </div>

        <div class="card">
          <a href="#/about" class="btn btn-ghost btn-block">ℹ️ About Syntaxed</a>
        </div>
      </div>
    </div>`;

  const opts = AVATAR_ICONS[st.avatar.kind];
  main.querySelector('#avatar-options').innerHTML = opts.map((name, i) =>
    `<button class="avatar-opt ${i === st.avatar.variant ? 'selected' : ''}" data-i="${i}" title="${escapeHtml(name)}">
       ${renderCharacter({ kind: st.avatar.kind, variant: i }, 44)}
       <span class="avatar-opt-label">${escapeHtml(name)}</span>
     </button>`).join('');
  main.querySelector('#swatches').innerHTML = ACCENT_COLORS.map(c =>
    `<button class="swatch ${c === st.accent ? 'selected' : ''}" data-c="${c}" style="background:${c}"></button>`).join('');

  [...main.querySelectorAll('.avatar-opt')].forEach(b => b.onclick = () => { setAvatar(st.avatar.kind, Number(b.dataset.i)); renderSettings(main); });
  [...main.querySelectorAll('.swatch')].forEach(b => b.onclick = () => { setAccent(b.dataset.c); renderSettings(main); });
  main.querySelector('#kind-beetle').onclick = () => { setAvatar('beetle', 0); renderSettings(main); };
  main.querySelector('#kind-robot').onclick = () => { setAvatar('robot', 0); renderSettings(main); };
  main.querySelector('#theme-toggle').onchange = (e) => setTheme(e.target.checked ? 'dark' : 'light');
  main.querySelector('#reset-btn').onclick = () => {
    if (confirm('Reset all Syntaxed progress? This cannot be undone.')) { resetProgress(); navigate('#/home'); }
  };

  const previewChar = main.querySelector('#avatar-preview .char');
  if (previewChar) {
    previewChar.classList.add('talking');
    setTimeout(() => previewChar.classList.remove('talking'), 1300);
  }
}

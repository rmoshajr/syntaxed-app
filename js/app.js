// ===== Syntaxed app shell: router + views =====

function navigate(hash) { location.hash = hash; }

function parseRoute() {
  const h = (location.hash || '#/').slice(1);
  return h.split('/').filter(Boolean);
}

const TABS = [
  { route: 'home', icon: '🏠', label: 'Home' },
  { route: 'path', icon: '🌲', label: 'Path' },
  { route: 'settings', icon: '⚙️', label: 'Profile' },
];

function render() {
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

function renderTopBar() {
  const lang = getState().currentLanguage;
  const ls = getLangState(lang);
  return `
    <div class="app-topbar"><div class="app-topbar-inner">
      <span class="topbar-brand">🐞 Syntaxed</span>
      <div class="topbar-stats">
        <span class="ts-pill uptime">🔥 ${ls.uptime.current}</span>
        <span class="ts-pill xp">⭐ ${ls.xp}</span>
      </div>
    </div></div>`;
}

// ---------------- About (the old marketing pitch — reachable from Profile, not the default) ----------------
function renderAbout(main) {
  main.innerHTML = `
    <div style="padding:14px 18px 0;"><a href="#/settings" class="btn btn-ghost btn-sm">← Back</a></div>
    <section class="hero">
      <div class="badge">🐛 Beta — Python MVP</div>
      <h1>Learn to code by fixing what's broken.</h1>
      <p class="lead">Syntaxed teaches programming the way the best spoken-language apps teach language: general meaning first, precise rules second. Duolingo-style lessons, a cyberpunk debugging theme, and a beetle mascot who's just trying to help.</p>
      <div class="cta-row">
        <a href="#/home" class="btn btn-primary">Start Learning ▸</a>
        <a href="#/path" class="btn btn-ghost">View the Python Path</a>
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
      <p class="sub">Entry-Level → Associate → Advanced, gated like real certification prep — not a straight line.</p>
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
        <div class="lang-pill active-lang">Python</div>
        <div class="lang-pill soon">JavaScript</div>
        <div class="lang-pill soon">Java</div>
        <div class="lang-pill soon">C++</div>
        <div class="lang-pill soon">C</div>
      </div>
    </section>`;
}

// ---------------- Home ----------------
function statsRowHtml(ls) {
  return `
    <div class="stat-row">
      <div class="stat-chip xp">⭐ XP <span class="val">${ls.xp}</span></div>
      <div class="stat-chip uptime">🔥 Uptime <span class="val">${ls.uptime.current}d</span></div>
      <div class="stat-chip memory">🔋 ${renderRam(ls.memory.current, ls.memory.max)}</div>
    </div>`;
}

function renderHome(main) {
  const lang = getState().currentLanguage;
  const ls = getLangState(lang);
  const completedCount = Object.keys(ls.completed).filter(isPlayable).length;
  const totalPlayable = Object.keys(LESSONS).length;
  const pct = Math.round((completedCount / totalPlayable) * 100);
  const showOnboard = !getState().onboarded && completedCount === 0;
  const currentId = findCurrentLessonId(lang);
  const currentLesson = getLesson(currentId);
  const ctaHref = isPlayable(currentId) ? `#/lesson/${currentId}` : '#/path';
  const ctaLabel = !isPlayable(currentId)
    ? "🎉 All caught up — see what's next"
    : `${completedCount === 0 ? 'Start' : 'Continue'}: ${escapeHtml(currentLesson.title)} ▸`;

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
          <div class="lang-badge">PY</div>
          <div>
            <h3 style="margin:0 0 4px">Python</h3>
            <div class="progress-bar"><span style="width:${pct}%"></span></div>
            <div style="font-size:12px;color:var(--text-dim);margin-top:6px">${completedCount} / ${totalPlayable} lessons complete · Entry-Level → Associate</div>
          </div>
        </div>
        <a href="${ctaHref}" class="btn btn-primary btn-block" style="margin-top:14px;">${ctaLabel}</a>
      </div>
      <div class="home-section">
        <div class="section-title">More Languages</div>
        <div class="langs" style="justify-content:flex-start;">
          <div class="lang-pill soon">JavaScript</div><div class="lang-pill soon">Java</div><div class="lang-pill soon">C++</div><div class="lang-pill soon">C</div>
        </div>
      </div>
    </div>`;

  if (showOnboard) {
    const slot = main.querySelector('#onboard-slot');
    slot.innerHTML = `
      <div class="card" style="margin:16px 0;">
        <h3 style="margin:0 0 4px">New here?</h3>
        <p style="margin:0 0 12px; color:var(--text-dim); font-size:14px;">Take a placement test to skip ahead, or just start from Lesson 1.</p>
        <div class="small-btn-row">
          <button class="btn btn-primary btn-sm" id="btn-placement">Take Placement Test</button>
          <button class="btn btn-ghost btn-sm" id="btn-skip-onboard">Start from Lesson 1</button>
        </div>
      </div>`;
    slot.querySelector('#btn-placement').onclick = () => startPlacementTest(main);
    slot.querySelector('#btn-skip-onboard').onclick = () => {
      const st = getState(); st.onboarded = true; save();
      navigate('#/path');
    };
  }
}

// First not-yet-complete, unlocked lesson in curriculum order — used to focus Home's CTA
// and the skill tree's default view on "where the user actually is."
function findCurrentLessonId(lang) {
  const nextUp = Object.keys(LESSONS).find(id => lessonStatus(lang, id) === 'available');
  if (nextUp) return nextUp;
  const allComplete = Object.keys(LESSONS).every(id => isLessonComplete(lang, id));
  return allComplete ? 'u3l1' : 'u1l1';
}

function startPlacementTest(main) {
  const lang = getState().currentLanguage;
  const ids = ['u1l1','u1l2','u1l3','u1l4','u2l1','u2l2','u2l3','u2l4'];
  const pool = collectPlacementQuestions(ids);
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
  let unlockedIds = [], text;
  if (score >= 0.8) {
    unlockedIds = ['u1l1','u1l2','u1l3','u1l4','u1quiz','u2l1','u2l2','u2l3','u2l4','u2quiz'];
    text = `Strong score — you've tested out of Unit 1 and Unit 2, at half XP each.`;
  } else if (score >= 0.5) {
    unlockedIds = ['u1l1','u1l2','u1l3','u1l4','u1quiz'];
    text = `Solid start — you've tested out of Unit 1 at half XP. Unit 2 starts fresh.`;
  } else {
    text = `Let's build from the ground up — starting at Lesson 1.`;
  }
  unlockedIds.forEach(id => { if (!isLessonComplete(lang, id)) markLessonComplete(lang, id, { testedOut: true }); });
  renderResultScreen(container, {
    icon: score >= 0.5 ? '🎓' : '🌱', title: 'Placement Result',
    text: `${text} (Score: ${Math.round(score * 100)}%)`,
    cta: 'Go to Path', onCta: () => navigate('#/path'),
  });
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

// ---------------- Path (zoomable skill tree) ----------------
const TREE_NODE_D = 76;
const TREE_SPACING_X = 150;
const TREE_SPACING_Y = 165;
const TREE_PAD = 90;

function nodeStatus(lessonId, lang, associateUnlocked) {
  const unit = UNITS.find(u => u.lessons.includes(lessonId));
  if (unit.comingSoon) return 'locked';
  if (unit.tier === 'associate' && !associateUnlocked) return 'locked';
  return lessonStatus(lang, lessonId);
}

function renderPath(main) {
  const lang = getState().currentLanguage;
  const mode = getState().pathView || 'tree';
  const associateUnlocked = isLessonComplete(lang, 'u1quiz') && isLessonComplete(lang, 'u2quiz');

  main.innerHTML = `
    <div class="tree-wrap">
      <div class="tree-toolbar">
        <h1 style="margin:0">Python Path</h1>
        <div class="view-toggle">
          <button class="${mode === 'tree' ? 'active' : ''}" id="view-tree">🌲 Tree</button>
          <button class="${mode === 'list' ? 'active' : ''}" id="view-list">📋 List</button>
        </div>
      </div>
      <div class="tree-legend">
        <span>🔓 Available</span><span>✅ Complete</span><span>🔒 Locked</span><span>🚧 Roadmap (not built yet)</span>
      </div>
      <div id="path-body"></div>
    </div>`;

  main.querySelector('#view-tree').onclick = () => { setPathView('tree'); renderPath(main); };
  main.querySelector('#view-list').onclick = () => { setPathView('list'); renderPath(main); };

  const body = main.querySelector('#path-body');
  if (mode === 'list') renderPathList(body, lang, associateUnlocked);
  else renderPathTree(body, lang, associateUnlocked);
}

function renderPathList(body, lang, associateUnlocked) {
  body.innerHTML = `<div class="lv-list">${UNITS.map(unit => {
    const rows = unit.lessons.map(id => {
      const lesson = getLesson(id);
      const status = nodeStatus(id, lang, associateUnlocked);
      const meta = unit.comingSoon ? 'Coming soon' : `${LESSONS[id].xp} XP${LESSONS[id].isQuiz ? ' · Quiz' : ''}`;
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

function renderPathTree(body, lang, associateUnlocked) {
  body.innerHTML = `
    <div class="tree-controls" style="margin-bottom:10px;">
      <button class="btn btn-sm" id="zoom-out" title="Zoom out">−</button>
      <button class="btn btn-sm" id="zoom-recenter" title="Center on your current lesson">🎯 My Lesson</button>
      <button class="btn btn-sm" id="zoom-reset" title="Zoom out to see the whole tree">⛶ Fit All</button>
      <button class="btn btn-sm" id="zoom-in" title="Zoom in">+</button>
    </div>
    <div class="tree-viewport" id="tree-viewport">
      <div class="tree-canvas" id="tree-canvas">
        <svg class="tree-edges" id="tree-edges"></svg>
        <div class="tree-nodes-layer" id="tree-nodes"></div>
        <div class="tree-labels-layer" id="tree-labels"></div>
      </div>
    </div>
    <p class="tree-note" style="text-align:center; margin-top:10px;">Scroll or pinch to zoom · drag to pan · click a node to open it</p>`;

  const viewport = document.getElementById('tree-viewport');
  const canvas = document.getElementById('tree-canvas');
  const svg = document.getElementById('tree-edges');
  const nodesLayer = document.getElementById('tree-nodes');
  const labelsLayer = document.getElementById('tree-labels');

  const cols = Object.values(TREE_LAYOUT).map(p => p.col);
  const rows = Object.values(TREE_LAYOUT).map(p => p.row);
  const minCol = Math.min(...cols), maxCol = Math.max(...cols), maxRow = Math.max(...rows);
  const width = (maxCol - minCol) * TREE_SPACING_X + TREE_NODE_D + TREE_PAD * 2;
  const height = maxRow * TREE_SPACING_Y + TREE_NODE_D + TREE_PAD * 2;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  const posOf = (id) => {
    const p = TREE_LAYOUT[id];
    return { x: (p.col - minCol) * TREE_SPACING_X + TREE_PAD + TREE_NODE_D / 2, y: p.row * TREE_SPACING_Y + TREE_PAD + TREE_NODE_D / 2 };
  };

  svg.innerHTML = TREE_EDGES.map(([a, b]) => {
    const pa = posOf(a), pb = posOf(b);
    const openEdge = nodeStatus(b, lang, associateUnlocked) !== 'locked';
    return `<line x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" class="edge ${openEdge ? 'edge-open' : ''}" />`;
  }).join('');

  const currentId = findCurrentLessonId(lang);
  nodesLayer.innerHTML = Object.keys(TREE_LAYOUT).map(id => {
    const { x, y } = posOf(id);
    const lesson = getLesson(id);
    const status = nodeStatus(id, lang, associateUnlocked);
    const isQuiz = LESSONS[id] && LESSONS[id].isQuiz;
    return `
      <div class="tree-node ${status} ${isQuiz ? 'quiz' : ''} ${id === currentId ? 'current' : ''}" data-id="${id}" data-status="${status}" style="left:${x}px; top:${y}px;">
        <div class="tn-circle">${status === 'complete' ? '✅' : lesson.icon}</div>
        <div class="tn-label">${escapeHtml(lesson.title)}</div>
      </div>`;
  }).join('');

  labelsLayer.innerHTML = Object.entries(UNIT_LABEL_ANCHOR).map(([unitId, anchorLesson]) => {
    const unit = UNITS.find(u => u.id === unitId);
    const { x, y } = posOf(anchorLesson);
    return `<div class="tree-unit-label" style="left:${x}px; top:${y - TREE_NODE_D / 2 - 14}px;">${unit.icon} ${escapeHtml(unit.title)}${unit.comingSoon ? ' 🚧' : ''}</div>`;
  }).join('');

  nodesLayer.querySelectorAll('.tree-node').forEach(node => {
    node.addEventListener('click', () => onNodeClick(node.dataset.id, node.dataset.status));
  });

  setupTreePanZoom(viewport, canvas, width, height, posOf(currentId));
}

function setupTreePanZoom(viewport, canvas, contentWidth, contentHeight, focusPoint) {
  let scale = 1, tx = 0, ty = 0, dragging = false, moved = false, lastX = 0, lastY = 0;
  const MIN_SCALE = 0.25, MAX_SCALE = 1.8;

  function apply() { canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; }

  function fitAll() {
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(vw / contentWidth, vh / contentHeight) * 0.94));
    tx = (vw - contentWidth * scale) / 2;
    ty = 24;
    apply();
  }

  // Default view: centered on the user's current lesson, at readable (1x) zoom.
  function centerOnFocus() {
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    scale = 1;
    tx = vw / 2 - focusPoint.x * scale;
    ty = vh / 2 - focusPoint.y * scale;
    apply();
  }

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const prevScale = scale;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 - e.deltaY * 0.0015)));
    tx = cx - (cx - tx) * (scale / prevScale);
    ty = cy - (cy - ty) * (scale / prevScale);
    apply();
  }, { passive: false });

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; lastX = e.clientX; lastY = e.clientY;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    tx += e.clientX - lastX; ty += e.clientY - lastY;
    if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > 2) moved = true;
    lastX = e.clientX; lastY = e.clientY;
    apply();
  });
  // Suppress the click that follows a drag, so panning doesn't accidentally open a node.
  viewport.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); moved = false; } }, true);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => viewport.addEventListener(ev, () => { dragging = false; viewport.classList.remove('dragging'); }));

  document.getElementById('zoom-in').onclick = () => { scale = Math.min(MAX_SCALE, scale * 1.2); apply(); };
  document.getElementById('zoom-out').onclick = () => { scale = Math.max(MIN_SCALE, scale * 0.8); apply(); };
  document.getElementById('zoom-reset').onclick = fitAll; // "Fit All" — the previous default view, now an alternate option
  document.getElementById('zoom-recenter').onclick = centerOnFocus;

  centerOnFocus();
}

function onNodeClick(lessonId, status) {
  const lesson = getLesson(lessonId);
  if (!isPlayable(lessonId)) {
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
    <p style="color:var(--text-dim)">This lesson is on the roadmap but isn't built yet. Entry-Level's Decisions &amp; Loops units, and the whole Associate tier, are coming soon.</p>
    <button class="btn btn-primary btn-block" data-close>Got it</button>`);
}

function openCompleteLessonModal(lessonId) {
  const lesson = getLesson(lessonId);
  const lang = getState().currentLanguage;
  const mem = getLangState(lang).memory;
  openModal(`
    <div class="big-icon">✅</div>
    <h2>${escapeHtml(lesson.title)}</h2>
    <p style="color:var(--text-dim)">Already complete. Replay it in Review Mode to refill Memory — reviews don't cost Memory and don't earn extra XP.</p>
    <p style="font-size:13px;color:var(--text-dim)">Current Memory: ${mem.current}/${mem.max}</p>
    <button class="btn btn-primary btn-block" data-nav="#/review/${lessonId}">Review Lesson</button>
    <button class="btn btn-ghost btn-block" data-close style="margin-top:10px;">Close</button>`);
}

function openLockedLessonModal(lessonId) {
  const lesson = getLesson(lessonId);
  const lang = getState().currentLanguage;
  const prereqIds = collectPrereqs(lessonId);
  const hardQs = collectHardQuestions(prereqIds);
  const avail = testOutAvailability(lang, lessonId);
  const prereqNames = prereqIds.map(id => getLesson(id).title).join(', ') || '—';
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
  const lesson = getLesson(lessonId);
  if (!lesson || !isPlayable(lessonId)) {
    root.innerHTML = `<div class="empty-note">This lesson isn't built yet — check back soon.<br><br><a href="#/path" class="btn btn-primary">Back to Path</a></div>`;
    return;
  }
  if (!reviewMode && lessonStatus(lang, lessonId) === 'locked') { navigate('#/path'); return; }
  if (!reviewMode && getLangState(lang).memory.current <= 0) {
    navigate('#/path');
    setTimeout(() => showOutOfMemoryModal(lang), 30);
    return;
  }
  new LessonEngine({
    lesson, lang, container: root, reviewMode,
    onExit: () => navigate('#/path'),
    onComplete: () => navigate('#/path'),
    onOutOfMemory: () => { navigate('#/path'); setTimeout(() => showOutOfMemoryModal(lang), 30); },
  }).start();
}

function startTestOutRoute(root, lessonId) {
  const lang = getState().currentLanguage;
  const lesson = getLesson(lessonId);
  const prereqIds = collectPrereqs(lessonId);
  const hardQs = shuffle(collectHardQuestions(prereqIds));
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
      const avail = testOutAvailability(lang, lessonId);
      renderResultScreen(container, {
        icon: passed ? '🎉' : '🔁', title: passed ? 'Tested Out!' : 'Not Quite',
        text: `${Math.round(info.score * 100)}% — ${passed ? 'prerequisite lessons unlocked at half XP.' : (avail.onCooldown ? 'Out of attempts for now — 24h cooldown.' : `${avail.attemptsLeft} attempt(s) left today.`)}`,
        cta: 'Back to Path', onCta: () => navigate('#/path'),
      });
    },
  }).start();
}

function showOutOfMemoryModal(lang) {
  const completedIds = Object.keys(getLangState(lang).completed).filter(isPlayable);
  const options = completedIds.map(id => `<option value="${id}">${escapeHtml(getLesson(id).title)}</option>`).join('');
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
  main.querySelector('#avatar-options').innerHTML = opts.map((ic, i) =>
    `<button class="avatar-opt ${i === st.avatar.variant ? 'selected' : ''}" data-i="${i}">${ic}</button>`).join('');
  main.querySelector('#swatches').innerHTML = AVATAR_COLORS.map(c =>
    `<button class="swatch ${c === st.avatar.color ? 'selected' : ''}" data-c="${c}" style="background:${c}"></button>`).join('');

  [...main.querySelectorAll('.avatar-opt')].forEach(b => b.onclick = () => { setAvatar(st.avatar.kind, Number(b.dataset.i), st.avatar.color); renderSettings(main); });
  [...main.querySelectorAll('.swatch')].forEach(b => b.onclick = () => { setAvatar(st.avatar.kind, st.avatar.variant, b.dataset.c); renderSettings(main); });
  main.querySelector('#kind-beetle').onclick = () => { setAvatar('beetle', 0, st.avatar.color); renderSettings(main); };
  main.querySelector('#kind-robot').onclick = () => { setAvatar('robot', 0, st.avatar.color); renderSettings(main); };
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

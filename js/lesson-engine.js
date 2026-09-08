// ===== Syntaxed lesson engine: question flow + browser-side code execution =====

let pyodideReadyPromise = null;
function loadPyodideRuntime(onStatus) {
  if (pyodideReadyPromise) return pyodideReadyPromise;
  pyodideReadyPromise = new Promise((resolve, reject) => {
    if (onStatus) onStatus('Booting Python interpreter (loading Pyodide from CDN)…');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.onload = async () => {
      try {
        const pyodide = await loadPyodide();
        resolve(pyodide);
      } catch (e) { reject(e); }
    };
    script.onerror = () => reject(new Error('Could not reach the Pyodide CDN — check your internet connection.'));
    document.head.appendChild(script);
  });
  return pyodideReadyPromise;
}

async function runPythonCode(code, onStatus) {
  const pyodide = await loadPyodideRuntime(onStatus);
  let output = '';
  pyodide.setStdout({ batched: (s) => { output += s + '\n'; } });
  pyodide.setStderr({ batched: (s) => { output += s + '\n'; } });
  try {
    await pyodide.runPythonAsync(code);
    return { ok: true, output: output.trim() };
  } catch (e) {
    return { ok: false, output: output.trim(), error: String(e.message || e) };
  }
}

// JavaScript runs natively in the browser — no runtime to boot, just a sandboxed
// console.log capture. Formatting is JSON.stringify-based (no added spaces) so it stays
// predictable; lesson `expected` strings are authored to match this exact format.
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
function formatJsValue(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
async function runJsCode(code) {
  let output = '';
  const log = (...args) => { output += args.map(formatJsValue).join(' ') + '\n'; };
  const fakeConsole = { log, error: log, warn: log, info: log };
  try {
    const fn = new AsyncFunction('console', code);
    await fn(fakeConsole);
    return { ok: true, output: output.trim() };
  } catch (e) {
    return { ok: false, output: output.trim(), error: String((e && e.message) || e) };
  }
}

// Java/C++/C have no in-browser runtime — they compile & run via Judge0's public demo API
// (ce.judge0.com, no key required). This is an unofficial demo instance with no uptime
// SLA, unlike Pyodide/native-JS; network or service failures surface as a normal run error.
const JUDGE0_BASE = 'https://ce.judge0.com';
const JUDGE0_LANGUAGE_IDS = { java: 91, cpp: 105, c: 103 };
async function runViaJudge0(lang, code, onStatus) {
  if (onStatus) onStatus('Compiling & running via Judge0…');
  try {
    const res = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: code, language_id: JUDGE0_LANGUAGE_IDS[lang] }),
    });
    if (!res.ok) throw new Error(`Judge0 returned ${res.status}`);
    const data = await res.json();
    const statusId = data.status && data.status.id;
    if (statusId === 6) {
      return { ok: false, output: '', error: data.compile_output || 'Compilation failed' };
    }
    const ok = statusId === 3;
    return { ok, output: (data.stdout || '').trim(), error: ok ? undefined : (data.stderr || data.message || 'Runtime error') };
  } catch (e) {
    return { ok: false, output: '', error: 'Could not reach the code execution service — check your internet connection. (' + (e.message || e) + ')' };
  }
}
const runJavaCode = (code, onStatus) => runViaJudge0('java', code, onStatus);
const runCppCode = (code, onStatus) => runViaJudge0('cpp', code, onStatus);
const runCCode = (code, onStatus) => runViaJudge0('c', code, onStatus);

// Per-language code-exercise runtime: editor chrome + which sandbox executes the code.
const CODE_RUNTIME = {
  python: { filename: 'main.py', label: 'PYTHON (Pyodide)', run: runPythonCode, commentPrefix: '#' },
  javascript: { filename: 'main.js', label: 'JAVASCRIPT (native)', run: (code) => runJsCode(code), commentPrefix: '//' },
  java: { filename: 'Main.java', label: 'JAVA (Judge0)', run: runJavaCode, commentPrefix: '//' },
  cpp: { filename: 'main.cpp', label: 'C++ (Judge0)', run: runCppCode, commentPrefix: '//' },
  c: { filename: 'main.c', label: 'C (Judge0)', run: runCCode, commentPrefix: '//' },
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Randomly samples a lesson's question pool each run: any `required` questions
// (e.g. explaining a function before code that uses it) always appear, in order,
// followed by a shuffled mix of the rest, with at most one code exercise LAST —
// so nothing a code exercise depends on can get shuffled to after it.
function pickQuestions(lesson, count) {
  const codeQs = lesson.questions.filter(q => q.type === 'code');
  const requiredQs = lesson.questions.filter(q => q.required && q.type !== 'code');
  const otherQs = shuffle(lesson.questions.filter(q => !q.required && q.type !== 'code'));
  const codeCount = codeQs.length ? 1 : 0;
  const remainingSlots = Math.max(0, count - requiredQs.length - codeCount);
  const pickedOthers = otherQs.slice(0, remainingSlots);
  const pickedCode = codeQs.length ? [codeQs[Math.floor(Math.random() * codeQs.length)]] : [];
  return [...requiredQs, ...pickedOthers, ...pickedCode];
}

function stripLineComments(code, lang) {
  const prefix = (CODE_RUNTIME[lang] && CODE_RUNTIME[lang].commentPrefix) || '#';
  return code.split('\n').map(line => {
    const idx = line.indexOf(prefix);
    return idx === -1 ? line : line.slice(0, idx);
  }).join('\n');
}

// Guards against typing the literal expected output instead of computing it
// (e.g. `print(12)` instead of `print(4 * 3)`).
function hasRequiredTokens(code, mustContain, lang) {
  if (!mustContain || !mustContain.length) return true;
  const stripped = stripLineComments(code, lang);
  return mustContain.every(tok => stripped.includes(tok));
}

class LessonEngine {
  constructor({ lesson, lang, container, reviewMode, onExit, onComplete, onOutOfMemory }) {
    this.lesson = lesson;
    this.lang = lang;
    this.container = container;
    this.reviewMode = !!reviewMode;
    this.onExit = onExit;
    this.onComplete = onComplete;
    this.onOutOfMemory = onOutOfMemory;
    this.index = -1; // -1 = intro card
    this.mistakes = 0;
    this.introIndex = 0;   // which dialogue line is showing
    this.introCheck = false; // showing the "does this make sense?" checkpoint
    // Synthetic quizzes (placement/test-out) already receive an exact, pre-built question list.
    this.questions = lesson.synthetic ? lesson.questions : pickQuestions(lesson, lesson.sampleSize || (lesson.isQuiz ? 7 : 5));
  }

  start() { this.renderShell(); }

  currentMemory() { return getLangState(this.lang).memory.current; }

  renderShell() {
    const total = this.questions.length;
    const progressPct = this.index < 0 ? 0 : Math.round(((this.index) / total) * 100);
    const mem = getLangState(this.lang).memory;
    this.container.innerHTML = `
      <div class="lesson-shell">
        <div class="lesson-top">
          <button class="btn btn-ghost btn-sm" id="lesson-exit">✕ Exit</button>
          <div class="lesson-progress"><span style="width:${progressPct}%"></span></div>
          <div class="memory-inline" title="Memory">${renderRam(mem.current, mem.max)}</div>
        </div>
        <div id="lesson-body"></div>
      </div>`;
    this.container.querySelector('#lesson-exit').onclick = () => this.onExit && this.onExit();
    if (this.index < 0) this.renderIntro();
    else if (this.index >= total) this.renderComplete();
    else this.renderQuestion(this.questions[this.index]);
  }

  introKicker() {
    return this.reviewMode ? 'Review Mode — refilling Memory' : (this.lesson.isQuiz ? 'Compiled Quiz' : 'Lesson');
  }

  renderIntro() {
    // Synthetic quizzes (placement/test-out) skip the teaching dialogue — straight to a Start card.
    if (this.lesson.synthetic || !this.lesson.introLines) return this.renderSimpleIntro();
    if (this.introCheck) return this.renderIntroCheck();

    const body = this.container.querySelector('#lesson-body');
    const lines = this.lesson.introLines;
    const line = lines[this.introIndex];
    const isLast = this.introIndex >= lines.length - 1;
    body.innerHTML = `
      <div class="q-card">
        <div class="q-kicker">${this.introKicker()} · ${escapeHtml(this.lesson.title)}</div>
        <div class="character-row">
          ${renderCharacter(getState().avatar, 62)}
          <div class="speech-bubble">${escapeHtml(line)}</div>
        </div>
        <div class="dialogue-dots">${lines.map((_, i) => `<span class="dot ${i === this.introIndex ? 'active' : ''}"></span>`).join('')}</div>
        <button class="btn btn-primary btn-block" id="intro-next">${isLast ? "Got it ▸" : 'Continue ▸'}</button>
      </div>`;
    this.animateTalk(body);
    body.querySelector('#intro-next').onclick = () => {
      if (isLast) this.introCheck = true;
      else this.introIndex += 1;
      this.renderShell();
    };
  }

  renderIntroCheck() {
    const body = this.container.querySelector('#lesson-body');
    body.innerHTML = `
      <div class="q-card">
        <div class="q-kicker">${this.introKicker()} · ${escapeHtml(this.lesson.title)}</div>
        <div class="character-row">
          ${renderCharacter(getState().avatar, 62)}
          <div class="speech-bubble">Does that make sense so far?</div>
        </div>
        <div class="opt-list">
          <button class="opt" id="intro-yes">✅ Yes, let's go</button>
          <button class="opt" id="intro-again">🔁 Run it back</button>
        </div>
      </div>`;
    this.animateTalk(body);
    body.querySelector('#intro-yes').onclick = () => { this.index = 0; this.renderShell(); };
    body.querySelector('#intro-again').onclick = () => { this.introIndex = 0; this.introCheck = false; this.renderShell(); };
  }

  renderSimpleIntro() {
    const body = this.container.querySelector('#lesson-body');
    body.innerHTML = `
      <div class="q-card">
        <div class="q-kicker">${this.introKicker()}</div>
        <h2 style="margin-top:0">${escapeHtml(this.lesson.title)}</h2>
        <p style="color:var(--text-dim); line-height:1.6; font-size:15px;">${escapeHtml(this.lesson.intro || '')}</p>
        <button class="btn btn-primary btn-block" id="lesson-begin" style="margin-top:18px;">Start ▸</button>
      </div>`;
    body.querySelector('#lesson-begin').onclick = () => { this.index = 0; this.renderShell(); };
  }

  renderComplete() {
    const body = this.container.querySelector('#lesson-body');
    if (this.lesson.synthetic) {
      const total = this.questions.length;
      const score = (total - this.mistakes) / total;
      this.onComplete && this.onComplete({ score, mistakes: this.mistakes, total });
      return;
    }
    if (this.reviewMode) {
      markLessonReviewed(this.lang, this.lesson.id);
      body.innerHTML = `
        <div class="lesson-complete">
          <div class="big-icon">🔋</div>
          <h2>Memory Refilled</h2>
          <p style="color:var(--text-dim)">Reviewing "${escapeHtml(this.lesson.title)}" topped up your Memory.</p>
          <div class="reward-row"><div class="reward-chip">+1 🔋 Memory</div></div>
          <button class="btn btn-primary" id="lesson-done">Back to Path</button>
        </div>`;
      body.querySelector('#lesson-done').onclick = () => this.onComplete && this.onComplete({ reviewOnly: true });
      return;
    }
    const awarded = markLessonComplete(this.lang, this.lesson.id, {});
    body.innerHTML = `
      <div class="lesson-complete">
        <div class="big-icon">✅</div>
        <h2>${this.lesson.isQuiz ? 'Quiz Complete' : 'Lesson Complete'}</h2>
        <p style="color:var(--text-dim)">${escapeHtml(this.lesson.title)} — nice work.</p>
        <div class="reward-row">
          <div class="reward-chip" style="color:var(--amber)">+${awarded} XP</div>
          <div class="reward-chip">${this.mistakes === 0 ? '💯 Perfect run' : `${this.mistakes} mistake${this.mistakes === 1 ? '' : 's'}`}</div>
        </div>
        <button class="btn btn-primary" id="lesson-done">Continue</button>
      </div>`;
    body.querySelector('#lesson-done').onclick = () => this.onComplete && this.onComplete({});
  }

  advance() { this.index += 1; this.renderShell(); }

  registerMistake() {
    this.mistakes += 1;
    if (this.reviewMode || this.lesson.synthetic) return true; // reviews & test-out/placement quizzes don't cost Memory
    const remaining = spendMemory(this.lang);
    this.container.querySelector('.memory-inline').innerHTML = renderRam(remaining, getLangState(this.lang).memory.max);
    if (remaining <= 0) {
      setTimeout(() => this.onOutOfMemory && this.onOutOfMemory(), 700);
      return false;
    }
    return true;
  }

  renderQuestion(q) {
    const body = this.container.querySelector('#lesson-body');
    if (q.type === 'mcq') return this.renderMcq(body, q);
    if (q.type === 'truefalse') return this.renderTrueFalse(body, q);
    if (q.type === 'match') return this.renderMatch(body, q);
    if (q.type === 'code') return this.renderCode(body, q);
  }

  // Kicker label + the mascot "speaking" the prompt in a speech bubble, à la Duolingo.
  questionHeader(label, promptHtml) {
    return `
      <div class="q-kicker">${label}</div>
      <div class="character-row">
        ${renderCharacter(getState().avatar, 62)}
        <div class="speech-bubble">${promptHtml}</div>
      </div>`;
  }

  // Briefly animates the mascot's mouth, as if it just spoke the question aloud.
  animateTalk(body) { animateCharTalk(body); }

  renderMcq(body, q) {
    const opts = q.options.map((opt, i) => `<button class="opt" data-i="${i}">${escapeHtml(opt)}</button>`).join('');
    body.innerHTML = `
      <div class="q-card">
        ${this.questionHeader('Multiple Choice', q.prompt)}
        <div class="opt-list">${opts}</div>
        <div class="feedback-box" id="fb"></div>
        <div class="lesson-footer"><button class="btn btn-primary" id="next-btn" style="display:none">Continue</button></div>
      </div>`;
    this.animateTalk(body);
    const buttons = [...body.querySelectorAll('.opt')];
    buttons.forEach(btn => btn.onclick = () => {
      buttons.forEach(b => b.disabled = true);
      const i = Number(btn.dataset.i);
      const correct = i === q.answer;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct) buttons[q.answer].classList.add('correct');
      this.showFeedback(body, correct, q);
    });
  }

  renderTrueFalse(body, q) {
    body.innerHTML = `
      <div class="q-card">
        ${this.questionHeader('True or False', q.prompt)}
        <div class="opt-list">
          <button class="opt" data-v="true">True</button>
          <button class="opt" data-v="false">False</button>
        </div>
        <div class="feedback-box" id="fb"></div>
        <div class="lesson-footer"><button class="btn btn-primary" id="next-btn" style="display:none">Continue</button></div>
      </div>`;
    this.animateTalk(body);
    const buttons = [...body.querySelectorAll('.opt')];
    buttons.forEach(btn => btn.onclick = () => {
      buttons.forEach(b => b.disabled = true);
      const v = btn.dataset.v === 'true';
      const correct = v === q.answer;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct) buttons.find(b => b.dataset.v === String(q.answer)).classList.add('correct');
      this.showFeedback(body, correct, q);
    });
  }

  renderMatch(body, q) {
    const left = q.pairs.map(p => p[0]);
    const right = shuffle(q.pairs.map(p => p[1]));
    body.innerHTML = `
      <div class="q-card">
        ${this.questionHeader('Matching', q.prompt)}
        <div class="match-grid">
          <div class="match-col" id="col-left">${left.map((t, i) => `<button class="match-item" data-side="l" data-v="${i}">${escapeHtml(t)}</button>`).join('')}</div>
          <div class="match-col" id="col-right">${right.map((t, i) => `<button class="match-item" data-side="r" data-v="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}</div>
        </div>
        <div class="feedback-box" id="fb"></div>
        <div class="lesson-footer"><button class="btn btn-primary" id="next-btn" style="display:none">Continue</button></div>
      </div>`;
    this.animateTalk(body);
    let pickedLeft = null;
    let linked = 0;
    let erroredOnce = false;
    const leftBtns = [...body.querySelectorAll('[data-side="l"]')];
    const rightBtns = [...body.querySelectorAll('[data-side="r"]')];
    leftBtns.forEach(btn => btn.onclick = () => {
      if (btn.classList.contains('linked-correct')) return;
      leftBtns.forEach(b => b.classList.remove('picked'));
      btn.classList.add('picked');
      pickedLeft = btn;
    });
    rightBtns.forEach(btn => btn.onclick = () => {
      if (!pickedLeft || btn.classList.contains('linked-correct')) return;
      const leftIdx = Number(pickedLeft.dataset.v);
      const correctRight = q.pairs[leftIdx][1];
      if (btn.dataset.v === correctRight) {
        pickedLeft.classList.remove('picked'); pickedLeft.classList.add('linked-correct');
        btn.classList.add('linked-correct');
        linked += 1;
        pickedLeft = null;
        if (linked === q.pairs.length) this.showFeedback(body, true, q);
      } else {
        btn.classList.add('linked-wrong');
        setTimeout(() => btn.classList.remove('linked-wrong'), 350);
        if (!erroredOnce) { erroredOnce = true; this.registerMistake(); }
      }
    });
  }

  renderCode(body, q) {
    const rt = CODE_RUNTIME[this.lang] || CODE_RUNTIME.python;
    body.innerHTML = `
      <div class="q-card">
        ${this.questionHeader('Code Exercise', q.prompt)}
        <div class="code-editor">
          <div class="ce-head"><span>${rt.filename}</span><span>${rt.label}</span></div>
          <textarea class="code-input" id="code-in" spellcheck="false">${escapeHtml(q.starter || '')}</textarea>
        </div>
        <div class="run-row">
          <button class="btn btn-primary" id="run-btn">▶ Run</button>
          <span id="run-status" style="color:var(--text-dim); font-size:12px;"></span>
        </div>
        <div class="output-box" id="output" style="display:none"></div>
        <div class="feedback-box" id="fb"></div>
        <div class="lesson-footer"><button class="btn btn-primary" id="next-btn" style="display:none">Continue</button></div>
      </div>`;
    this.animateTalk(body);
    const runBtn = body.querySelector('#run-btn');
    const statusEl = body.querySelector('#run-status');
    const outputEl = body.querySelector('#output');
    let solved = false;
    let erroredOnce = false;
    const mistakeOnce = () => { if (!erroredOnce) { erroredOnce = true; this.registerMistake(); } };
    runBtn.onclick = async () => {
      if (solved) return;
      runBtn.disabled = true;
      statusEl.textContent = 'Running…';
      outputEl.style.display = 'none';
      const code = body.querySelector('#code-in').value;
      const result = await rt.run(code, (msg) => { statusEl.textContent = msg; });
      runBtn.disabled = false;
      statusEl.textContent = '';
      const outputMatches = result.ok && result.output.trim() === q.expected.trim();
      const usesRequiredLogic = hasRequiredTokens(code, q.mustContain, this.lang);
      if (outputMatches && usesRequiredLogic) {
        solved = true;
        outputEl.style.display = 'block';
        outputEl.textContent = result.output;
        outputEl.style.color = 'var(--green)';
        this.showFeedback(body, true, q);
      } else if (outputMatches && !usesRequiredLogic) {
        outputEl.style.display = 'block';
        outputEl.textContent = result.output;
        outputEl.style.color = 'var(--amber)';
        mistakeOnce();
        this.showHardcodeFeedback(body, q);
      } else {
        outputEl.style.display = 'block';
        outputEl.textContent = result.ok ? (result.output || '(no output)') : 'An error stopped your code from finishing.';
        outputEl.style.color = 'var(--red)';
        mistakeOnce();
        this.showCodeFeedback(body, q, result);
      }
    };
  }

  showHardcodeFeedback(body, q) {
    const fb = body.querySelector('#fb');
    fb.className = 'feedback-box show err';
    fb.innerHTML = `⚠ OUTPUT MATCHES, BUT THAT LOOKS HARDCODED — this exercise is testing <code>${escapeHtml(q.mustContain.join(' '))}</code>, and your code doesn't actually use it. Compute the result instead of typing the literal answer.`;
  }

  showCodeFeedback(body, q, result) {
    const fb = body.querySelector('#fb');
    const rawText = result.ok ? `Program output was: ${JSON.stringify(result.output)}\nExpected: ${JSON.stringify(q.expected)}` : result.error;
    fb.className = 'feedback-box show err';
    fb.innerHTML = `⚠ ${escapeHtml(randomThemedError())}<br><span class="reveal-link" id="reveal-link">Reveal raw ${result.ok ? 'output diff' : 'error'} (costs 1 extra Memory)</span><div id="raw-area" style="display:none; margin-top:8px; font-family:'JetBrains Mono',monospace; font-size:12px; white-space:pre-wrap;"></div>`;
    fb.querySelector('#reveal-link').onclick = () => {
      const skipsMemoryCost = this.reviewMode || this.lesson.synthetic;
      if (!skipsMemoryCost) {
        spendMemory(this.lang);
        this.container.querySelector('.memory-inline').innerHTML = renderRam(getLangState(this.lang).memory.current, getLangState(this.lang).memory.max);
      }
      const area = fb.querySelector('#raw-area');
      area.style.display = 'block';
      area.textContent = rawText;
      fb.querySelector('#reveal-link').replaceWith(document.createTextNode('Raw details revealed — this attempt was forfeited. Fix your code and run again.'));
      if (!skipsMemoryCost && getLangState(this.lang).memory.current <= 0) setTimeout(() => this.onOutOfMemory && this.onOutOfMemory(), 700);
    };
  }

  showFeedback(body, correct, q) {
    const fb = body.querySelector('#fb');
    const nextBtn = body.querySelector('#next-btn');
    if (correct) {
      fb.className = 'feedback-box show ok';
      fb.innerHTML = '✔ Correct.';
      nextBtn.style.display = 'inline-flex';
      nextBtn.onclick = () => this.advance();
    } else {
      const ok = this.registerMistake();
      fb.className = 'feedback-box show err';
      fb.innerHTML = `✕ ${escapeHtml(randomThemedError())}`;
      if (ok) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = 'Continue';
        nextBtn.onclick = () => this.advance();
      }
    }
  }
}

function renderRam(current, max) {
  let out = '<div class="ram-sticks">';
  for (let i = 0; i < max; i++) out += `<div class="ram-stick ${i < current ? 'filled' : ''}"></div>`;
  out += '</div>';
  return out;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// Briefly animates the mascot's mouth, as if it just spoke aloud.
function animateCharTalk(body) {
  const char = body.querySelector('.char');
  if (!char) return;
  char.classList.add('talking');
  setTimeout(() => char.classList.remove('talking'), 1300);
}

// ---- One-time, account-wide orientation on XP/Uptime/Memory, shown before a person's
// very first lesson ever (never again, and never just for switching languages). Built
// from the same visual pieces as a real lesson (q-card, speech bubble, opt-list) so it
// reads as part of the lesson flow rather than a bolted-on interstitial.
const STATS_ORIENTATION_SLIDES = [
  { type: 'say', text: "Before your first lesson — three things you'll see everywhere in Syntaxed." },
  { type: 'say', text: '⭐ XP is your score. Finish a lesson or quiz and you earn XP. It only ever goes up.' },
  { type: 'say', text: "🔥 Uptime is your streak for this language. Finish or review one lesson today and it climbs by 1 — skip a full day and it falls back to 1." },
  { type: 'say', text: "🔋 Memory is this app's spin on lives. You start with 5 RAM sticks, and a wrong answer spends one." },
  { type: 'say', text: "Run out of Memory and you're locked out of new lessons until you review one you've already finished — that refills it for free." },
  {
    type: 'check',
    prompt: 'Quick check — does getting an answer wrong cost you XP?',
    options: ['Yes, it does', 'No, it costs Memory instead'],
    answer: 1,
    explain: 'Right — a wrong answer spends Memory, not XP. XP only ever goes up.',
  },
  {
    type: 'check',
    prompt: "Quick check — is Uptime shared across every language you're learning?",
    options: ['Yes, one shared streak', 'No, each language has its own'],
    answer: 1,
    explain: 'Exactly — XP, Uptime, and Memory are all tracked separately per language.',
  },
];

function startStatsOrientation(root, onDone) {
  let i = 0;

  function renderStep() {
    if (i >= STATS_ORIENTATION_SLIDES.length) {
      markStatsIntroSeen();
      onDone();
      return;
    }
    const slide = STATS_ORIENTATION_SLIDES[i];
    const pct = Math.round((i / STATS_ORIENTATION_SLIDES.length) * 100);
    root.innerHTML = `
      <div class="lesson-shell">
        <div class="lesson-top">
          <button class="btn btn-ghost btn-sm" id="orient-exit">✕ Exit</button>
          <div class="lesson-progress"><span style="width:${pct}%"></span></div>
        </div>
        <div id="lesson-body"></div>
      </div>`;
    root.querySelector('#orient-exit').onclick = () => navigate('#/home');
    const body = root.querySelector('#lesson-body');

    if (slide.type === 'say') {
      const next = STATS_ORIENTATION_SLIDES[i + 1];
      const isLastSay = !next || next.type !== 'say';
      body.innerHTML = `
        <div class="q-card">
          <div class="q-kicker">Getting Started</div>
          <div class="character-row">
            ${renderCharacter(getState().avatar, 62)}
            <div class="speech-bubble">${escapeHtml(slide.text)}</div>
          </div>
          <div class="dialogue-dots">${STATS_ORIENTATION_SLIDES.map((_, k) => `<span class="dot ${k === i ? 'active' : ''}"></span>`).join('')}</div>
          <button class="btn btn-primary btn-block" id="orient-next">${isLastSay ? 'One sec, quick check ▸' : 'Continue ▸'}</button>
        </div>`;
      animateCharTalk(body);
      body.querySelector('#orient-next').onclick = () => { i += 1; renderStep(); };
    } else {
      body.innerHTML = `
        <div class="q-card">
          <div class="q-kicker">Quick Check</div>
          <div class="character-row">
            ${renderCharacter(getState().avatar, 62)}
            <div class="speech-bubble">${escapeHtml(slide.prompt)}</div>
          </div>
          <div class="opt-list">${slide.options.map((opt, idx) => `<button class="opt" data-i="${idx}">${escapeHtml(opt)}</button>`).join('')}</div>
          <div class="feedback-box" id="fb"></div>
          <div class="lesson-footer"><button class="btn btn-primary" id="next-btn" style="display:none">Continue ▸</button></div>
        </div>`;
      animateCharTalk(body);
      const buttons = [...body.querySelectorAll('.opt')];
      buttons.forEach(btn => btn.onclick = () => {
        buttons.forEach(b => b.disabled = true);
        const idx = Number(btn.dataset.i);
        const correct = idx === slide.answer;
        btn.classList.add(correct ? 'correct' : 'incorrect');
        if (!correct) buttons[slide.answer].classList.add('correct');
        const fb = body.querySelector('#fb');
        fb.className = `feedback-box show ${correct ? 'ok' : 'err'}`;
        fb.innerHTML = `${correct ? '✔' : '✕'} ${escapeHtml(slide.explain)}`;
        const nextBtn = body.querySelector('#next-btn');
        nextBtn.style.display = 'inline-flex';
        nextBtn.onclick = () => { i += 1; renderStep(); };
      });
    }
  }

  renderStep();
}

import story from './story.json';
import gsap from 'gsap';
import type { AmbientScene } from './ambient';
import { setupScrollMotion } from './motion';
import './style.css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Presentation root was not found');

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>',
};

const chapter = (id: string, content: string, className = '') => {
  const item = story.find((scene) => scene.id === id);
  if (!item) throw new Error(`Unknown chapter: ${id}`);
  return `<section class="scene ${className}" id="${id}" data-chapter="${item.number}" aria-labelledby="title-${id}">
    <div class="scene__index" aria-hidden="true"><span>${item.number}</span><span class="scene__index-line"></span><span>${item.label}</span></div>
    ${content}
  </section>`;
};

app.innerHTML = `
  <canvas class="ambient-canvas" id="ambient" aria-hidden="true"></canvas>
  <div class="grain" aria-hidden="true"></div>
  <div class="spotlight" aria-hidden="true"></div>
  <header class="topbar">
    <a class="brand" href="#opening" aria-label="LumaPath AI, back to opening">
      <span class="brand__mark"><span></span><span></span><span></span></span>
      <span>LumaPath<span class="brand__ai"> AI</span></span>
    </a>
    <div class="topbar__right"><span class="topbar__tag">AN INTERACTIVE STORY</span><span class="topbar__divider"></span><span id="chapter-counter">01 / 07</span></div>
  </header>
  <nav class="chapter-nav" aria-label="Presentation chapters">
    ${story.map((scene) => `<a class="chapter-nav__item" href="#${scene.id}" aria-label="Chapter ${scene.number}: ${scene.label}" title="${scene.label}"><span class="chapter-nav__dot"></span><span class="chapter-nav__label">${scene.label}</span></a>`).join('')}
  </nav>
  <div class="progress-track" role="progressbar" aria-label="Presentation progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="progress-fill"></span></div>
  <div class="transition-slate" id="transition-slate" aria-hidden="true"><span id="transition-number">02</span><span class="transition-slate__rule"></span><strong id="transition-label">THE PROBLEM</strong></div>
  <main>
  ${chapter('opening', `
    <div class="hero__orbit hero__orbit--one" aria-hidden="true"></div><div class="hero__orbit hero__orbit--two" aria-hidden="true"></div>
    <div class="scene__content hero__content">
      <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> THE STUDENT SUCCESS OS</p>
      <h1 id="title-opening" class="hero__title" data-reveal>Your future has<br />a <em>next step.</em></h1>
      <p class="hero__copy" data-reveal>LumaPath turns academic pressure and career ambition into one clear, achievable path.</p>
      <div class="hero__actions" data-reveal><a class="button button--primary" href="#overload">Explore the story ${icon.arrow}</a><span class="hero__duration">07 CHAPTERS <span>·</span> SCROLL TO EXPLORE</span></div>
    </div>
    <div class="hero__corner" aria-hidden="true"><span class="hero__corner-ring"></span><span>CLARITY<br />IN MOTION</span></div>
    <a class="scroll-cue" href="#overload"><span>SCROLL TO BEGIN</span>${icon.down}</a>
  `, 'scene--hero')}

  ${chapter('overload', `
    <div class="scene__content split split--problem">
      <div class="split__text">
        <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> THE PROBLEM</p>
        <h2 id="title-overload" class="display" data-reveal>One student.<br /><em>Too many</em><br />moving parts.</h2>
        <p class="body-copy" data-reveal>Deadlines, skill gaps, career goals, and real life compete for the same hours. When everything is separate, the student carries the burden of connecting it all.</p>
        <aside class="research-card research-card--peach" aria-label="Sri Lankan youth employment research" data-reveal>
          <span class="research-card__label">THE LOCAL CHALLENGE</span>
          <div class="research-card__finding"><strong class="research-card__value">15.8<span>%</span></strong><p>unemployment rate among Sri Lankans aged <strong>20–24</strong>.</p></div>
          <a class="research-card__source" href="https://www.statistics.gov.lk/Resource/en/LabourForce/Quarterly_Reports/1stQuarter2026.pdf" target="_blank" rel="noopener noreferrer">Sri Lanka Labour Force Survey, Q1 2026 <span aria-hidden="true">↗</span></a>
          <span class="research-card__rule" aria-hidden="true"></span>
        </aside>
      </div>
      <div class="chaos-board" aria-label="Disconnected student priorities">
        <div class="chaos-card chaos-card--one" data-float><span class="chaos-card__icon icon--peach">!</span><span><small>ACADEMICS</small><strong>Assignment due Friday</strong><span class="microcopy">2 days remaining</span></span></div>
        <div class="chaos-card chaos-card--two" data-float><span class="chaos-card__icon icon--blue">↗</span><span><small>CAREER</small><strong>DevOps engineer</strong><span class="microcopy">Build the right skills</span></span></div>
        <div class="chaos-card chaos-card--three" data-float><span class="chaos-card__icon icon--purple">◈</span><span><small>CAPACITY</small><strong>Only 2 hours free</strong><span class="microcopy">A full day already</span></span></div>
        <div class="chaos-card chaos-card--four" data-float><span class="chaos-card__icon icon--green">◎</span><span><small>LEARNING</small><strong>What should I study?</strong><span class="microcopy">The path is unclear</span></span></div>
        <div class="chaos-board__question"><span>?</span><small>WHAT COMES FIRST</small></div>
      </div>
    </div>
    <div class="scene__footer-note">THE COST OF DISCONNECTED DECISIONS <span>→</span></div>
  `, 'scene--problem')}

  ${chapter('intelligence', `
    <div class="scene__content intelligence-layout">
      <div class="intelligence-layout__intro">
        <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> THE LUMAPATH IDEA</p>
        <h2 id="title-intelligence" class="display" data-reveal>One connected<br /><em>decision.</em></h2>
        <p class="body-copy" data-reveal>Bring the whole picture together, then make the next step understandable.</p>
      </div>
      <div class="decision-system" aria-label="LumaPath decision flow">
        <div class="decision-system__inputs">
          <span class="signal" data-reveal><i class="signal__dot signal__dot--blue"></i> Deadlines</span>
          <span class="signal" data-reveal><i class="signal__dot signal__dot--peach"></i> Capacity</span>
          <span class="signal" data-reveal><i class="signal__dot signal__dot--purple"></i> Skills</span>
          <span class="signal" data-reveal><i class="signal__dot signal__dot--green"></i> Career goals</span>
        </div>
        <div class="decision-system__lines" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <div class="decision-system__core" data-reveal><div class="decision-system__core-ring"></div><div class="brand__mark brand__mark--large"><span></span><span></span><span></span></div><small>LUMAPATH ENGINE</small></div>
        <div class="decision-system__outcomes" data-reveal><span>01 <b>Prioritize</b></span><span>02 <b>Schedule</b></span><span>03 <b>Explain</b></span></div>
      </div>
    </div>
    <div class="principle" data-reveal>Rules decide. <span>Planning schedules.</span> Guidance explains.</div>
  `, 'scene--intelligence')}

  ${chapter('action', `
    <div class="scene__content action-layout">
      <div class="action-layout__intro">
        <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> THE MOMENT THAT MATTERS</p>
        <h2 id="title-action" class="display" data-reveal>The next best<br />action, <em>made obvious.</em></h2>
        <p class="body-copy" data-reveal>One clear recommendation. A reason it matters. A plan that fits the day.</p>
      </div>
      <div class="app-frame" aria-label="Illustrative LumaPath dashboard concept">
        <div class="app-frame__top"><span class="app-frame__mini-brand"><span class="brand__mark"><span></span><span></span><span></span></span> lumapath</span><span>Wednesday, 30 Sep</span><span class="app-frame__avatar">A</span></div>
        <div class="app-frame__body">
          <div class="app-frame__greeting"><small>YOUR DAY, IN FOCUS</small><strong>Good morning, Alex.</strong><span>Let's make today count.</span></div>
          <div class="next-action-card"><div class="next-action-card__top"><span><i></i> NEXT BEST ACTION</span><span>HIGH PRIORITY ↗</span></div><h3>Start your database assignment</h3><p>Your deadline is close, and this 45-minute block fits your available time.</p><div class="next-action-card__bottom"><span>◷ &nbsp; 45 min focus block</span><span class="fake-button">Begin focus ${icon.arrow}</span></div></div>
          <div class="app-frame__bottom"><div><small>THIS WEEK</small><strong>3 priorities in motion</strong><div class="mini-bars"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div><div><small>YOUR CAPACITY</small><strong>Balanced pace</strong><div class="mini-meter"><span></span></div><span class="microcopy">Room to make progress</span></div></div>
        </div>
        <span class="app-frame__caption">ILLUSTRATIVE STUDENT VIEW</span>
      </div>
    </div>
  `, 'scene--action')}

  ${chapter('replanning', `
    <div class="scene__content replan-layout">
      <div class="replan-layout__intro">
        <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> BUILT FOR REAL LIFE</p>
        <h2 id="title-replanning" class="display" data-reveal>Life changes.<br /><em>The plan adapts.</em></h2>
        <p class="body-copy" data-reveal>When the day gets harder, LumaPath protects urgent work and moves flexible learning to a better time.</p>
        <div class="change-pill" data-reveal><span class="change-pill__pulse"></span> Capacity changed: 4 hours → 2 hours</div>
      </div>
      <div class="plan-comparison" aria-label="Illustrative plan before and after a capacity change">
        <div class="plan-panel plan-panel--before" data-reveal><div class="plan-panel__header"><small>BEFORE</small><span>WEDNESDAY</span></div><div class="plan-row"><time>09:00</time><span class="plan-task plan-task--blue">Database assignment <b>90 min</b></span></div><div class="plan-row"><time>11:00</time><span class="plan-task plan-task--purple">Docker practice <b>60 min</b></span></div><div class="plan-row"><time>14:00</time><span class="plan-task plan-task--green">Portfolio update <b>60 min</b></span></div></div>
        <div class="plan-arrow" aria-hidden="true">${icon.arrow}</div>
        <div class="plan-panel plan-panel--after" data-reveal><div class="plan-panel__header"><small>AFTER REPLAN</small><span>WEDNESDAY</span></div><div class="plan-row"><time>09:00</time><span class="plan-task plan-task--blue">Database assignment <b>90 min</b></span></div><div class="plan-row"><time>11:00</time><span class="plan-task plan-task--peach">Rest & reset <b>30 min</b></span></div><div class="rescheduled"><span>↗</span><div><strong>Flexible learning moved</strong><small>Docker practice → tomorrow</small></div></div></div>
      </div>
    </div>
  `, 'scene--replanning')}

  ${chapter('readiness', `
    <div class="scene__content readiness-layout">
      <div class="readiness-layout__intro">
        <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> BEYOND THE NEXT DEADLINE</p>
        <h2 id="title-readiness" class="display" data-reveal>Progress you can see.<br /><em>Skills you can show.</em></h2>
        <p class="body-copy" data-reveal>A career roadmap connects learning to practice and evidence, so each small step builds toward something bigger.</p>
        <aside class="research-card" aria-label="Research on changing skill needs" data-reveal>
          <span class="research-card__label">WHY CONTINUOUS LEARNING MATTERS</span>
          <div class="research-card__finding"><strong class="research-card__value">39<span>%</span></strong><p>of workers’ core skills are expected to change by <strong>2030</strong>.</p></div>
          <a class="research-card__source" href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/" target="_blank" rel="noopener noreferrer">World Economic Forum, Future of Jobs 2025 <span aria-hidden="true">↗</span></a>
          <span class="research-card__rule" aria-hidden="true"></span>
        </aside>
      </div>
      <div class="roadmap" aria-label="Illustrative DevOps learning roadmap">
        <div class="roadmap__line" aria-hidden="true"></div>
        <div class="roadmap__step roadmap__step--done" data-reveal><span class="roadmap__node">✓</span><div><small>FOUNDATION COMPLETE</small><strong>Linux & command line</strong><span>Knowledge assessed</span></div></div>
        <div class="roadmap__step roadmap__step--active" data-reveal><span class="roadmap__node">02</span><div><small>UP NEXT</small><strong>Containers with Docker</strong><span>Learn → build → verify</span></div></div>
        <div class="roadmap__step" data-reveal><span class="roadmap__node">03</span><div><small>ON THE HORIZON</small><strong>CI / CD pipelines</strong><span>Unlock your next capability</span></div></div>
        <div class="evidence-card" data-reveal><span class="evidence-card__icon">✦</span><span><small>EVIDENCE PASSPORT</small><strong>Show the work behind the skill.</strong></span>${icon.arrow}</div>
      </div>
    </div>
  `, 'scene--readiness')}

  ${chapter('closing', `
    <div class="closing__halo" aria-hidden="true"></div>
    <div class="scene__content closing__content">
      <p class="eyebrow" data-reveal><span class="eyebrow__line"></span> THE PATH FORWARD</p>
      <h2 id="title-closing" class="closing__title" data-reveal>Know what to do <em>next.</em></h2>
      <p class="closing__copy" data-reveal>Stay on track. Build your future.</p>
      <div class="closing__actions" data-reveal><a class="button button--primary" href="https://lumapath-kappa.vercel.app/" target="_blank" rel="noopener noreferrer">Explore LumaPath ${icon.arrow}</a><a class="button button--text" href="#opening">Watch again ↗</a></div>
    </div>
    <div class="closing__foot"><span>LUMAPATH AI</span><span>STUDENT SUCCESS × CAREER READINESS</span><span>© 2026</span></div>
  `, 'scene--closing')}
  </main>
  <div class="transport" aria-label="Presentation controls"><button id="play-button" class="transport__play" type="button" aria-label="Play automatic presentation">${icon.play}<span>PLAY FILM</span></button><span class="transport__divider"></span><span id="time-display" class="transport__time">00:00</span><button id="fullscreen-button" class="transport__fullscreen" type="button" aria-label="Enter fullscreen">${icon.expand}</button></div>
`;

const sections = [...document.querySelectorAll<HTMLElement>('.scene')];
const navItems = [...document.querySelectorAll<HTMLAnchorElement>('.chapter-nav__item')];
const progressTrack = document.querySelector<HTMLElement>('.progress-track')!;
const progressFill = document.querySelector<HTMLElement>('#progress-fill')!;
const transitionSlate = document.querySelector<HTMLElement>('#transition-slate')!;
const transitionNumber = document.querySelector<HTMLElement>('#transition-number')!;
const transitionLabel = document.querySelector<HTMLElement>('#transition-label')!;
const chapterCounter = document.querySelector<HTMLElement>('#chapter-counter')!;
const playButton = document.querySelector<HTMLButtonElement>('#play-button')!;
const timeDisplay = document.querySelector<HTMLElement>('#time-display')!;
const fullscreenButton = document.querySelector<HTMLButtonElement>('#fullscreen-button')!;
const ambientCanvas = document.querySelector<HTMLCanvasElement>('#ambient')!;
let ambient: AmbientScene | null = null;
let pageActive = true;
requestAnimationFrame(() => {
  void import('./ambient').then(({ createAmbientScene }) => {
    if (!pageActive) return;
    ambient = createAmbientScene(ambientCanvas, reducedMotion);
    ambient?.setProgress(window.scrollY / maxScroll());
  }).catch(() => { ambientCanvas.hidden = true; });
});
let activeIndex = -1;
let transitionIndex = -1;
let filmFrame = 0;
let filmPlaying = false;
let lastFilmTime = 0;
const filmSpeed = 52;
let chapterTransition: gsap.core.Tween | null = null;
let targetChapter: number | null = null;

function stopChapterTransition() {
  chapterTransition?.kill();
  chapterTransition = null;
  targetChapter = null;
}

function goToChapter(index: number) {
  stopFilm();
  stopChapterTransition();
  const section = sections[index];
  const top = Math.min(section.offsetTop, maxScroll());
  if (reducedMotion) {
    window.scrollTo({ top, behavior: 'instant' });
    return;
  }
  targetChapter = index;
  const position = { top: window.scrollY };
  chapterTransition = gsap.to(position, {
    top,
    duration: Math.min(2.8, 1.8 + Math.abs(top - position.top) / window.innerHeight * 0.12),
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo({ top: position.top, behavior: 'instant' }),
    onComplete: () => { chapterTransition = null; targetChapter = null; },
  });
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = sections.findIndex((section) => `#${section.id}` === link.getAttribute('href'));
    if (index === -1) return;
    event.preventDefault();
    goToChapter(index);
  });
});

function maxScroll() { return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
function formatTime(seconds: number) { const value = Math.floor(seconds); return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`; }

function updateProgress() {
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
  const nextIndex = Math.max(0, sections.findIndex((section) => section.getBoundingClientRect().bottom > window.innerHeight * 0.55));
  let slateIndex = -1;
  let slateStrength = 0;
  if (!reducedMotion && window.innerWidth > 760) {
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let index = 1; index < sections.length; index++) {
      const distance = Math.abs(window.scrollY - (sections[index].offsetTop - window.innerHeight * 0.5));
      if (distance < nearestDistance) { nearestDistance = distance; slateIndex = index; }
    }
    slateStrength = Math.max(0, 1 - nearestDistance / (window.innerHeight * 0.21));
  }
  progressFill.style.transform = `scaleX(${progress})`;
  progressTrack.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  timeDisplay.textContent = formatTime(window.scrollY / filmSpeed);
  ambient?.setProgress(progress);
  if (slateIndex !== -1) {
    if (slateIndex !== transitionIndex) {
      transitionIndex = slateIndex;
      transitionNumber.textContent = story[slateIndex].number;
      transitionLabel.textContent = story[slateIndex].label.toUpperCase();
    }
    transitionSlate.style.opacity = String(slateStrength);
    transitionSlate.style.transform = `translate(-50%, -50%) scale(${0.82 + slateStrength * 0.18})`;
  }
  if (nextIndex !== activeIndex) {
    activeIndex = nextIndex;
    chapterCounter.textContent = `${story[activeIndex].number} / ${String(story.length).padStart(2, '0')}`;
    navItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
      if (index === activeIndex) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    document.body.dataset.chapter = story[activeIndex].id;
  }
}

function stopFilm() {
  filmPlaying = false;
  cancelAnimationFrame(filmFrame);
  playButton.innerHTML = `${icon.play}<span>PLAY FILM</span>`;
  playButton.setAttribute('aria-label', 'Play automatic presentation');
  playButton.setAttribute('aria-pressed', 'false');
}

function filmTick(time: number) {
  if (!filmPlaying) return;
  const delta = Math.min((time - lastFilmTime) / 1000, 0.08);
  lastFilmTime = time;
  const next = Math.min(maxScroll(), window.scrollY + filmSpeed * delta);
  window.scrollTo({ top: next, behavior: 'instant' });
  if (next >= maxScroll() - 1) stopFilm();
  else filmFrame = requestAnimationFrame(filmTick);
}

playButton.addEventListener('click', () => {
  stopChapterTransition();
  if (filmPlaying) { stopFilm(); return; }
  if (window.scrollY >= maxScroll() - 2) window.scrollTo({ top: 0, behavior: 'instant' });
  filmPlaying = true;
  playButton.innerHTML = `${icon.pause}<span>PAUSE FILM</span>`;
  playButton.setAttribute('aria-label', 'Pause automatic presentation');
  playButton.setAttribute('aria-pressed', 'true');
  lastFilmTime = performance.now();
  filmFrame = requestAnimationFrame(filmTick);
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { /* The browser may decline fullscreen. */ }
});
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
});

for (const eventName of ['wheel', 'touchstart', 'pointerdown'] as const) {
  window.addEventListener(eventName, (event) => {
    if (eventName !== 'wheel' && event.target instanceof Node && playButton.contains(event.target)) return;
    stopChapterTransition();
    if (filmPlaying) stopFilm();
  }, { passive: true });
}
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { stopFilm(); stopChapterTransition(); return; }
  if (event.target instanceof HTMLElement && event.target.closest('button, input, textarea, select, [contenteditable="true"]')) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault(); goToChapter(Math.min((targetChapter ?? activeIndex) + 1, sections.length - 1));
  }
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault(); goToChapter(Math.max((targetChapter ?? activeIndex) - 1, 0));
  }
  if (['Home', 'End'].includes(event.key)) { stopFilm(); stopChapterTransition(); }
});

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', () => { stopChapterTransition(); updateProgress(); });
updateProgress();

const destroyMotion = reducedMotion ? () => {} : setupScrollMotion();

window.addEventListener('pagehide', (event) => {
  stopFilm();
  stopChapterTransition();
  if (event.persisted) return;
  pageActive = false;
  ambient?.destroy();
  destroyMotion();
});
window.addEventListener('pageshow', (event) => { if (event.persisted) updateProgress(); });

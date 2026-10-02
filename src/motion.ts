import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const travel = (distance: number) => () => distance * (window.innerWidth <= 760 ? 0.3 : 0.5);

function sceneTimeline(id: string) {
  const playhead = { progress: 0 };
  const timeline = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: `#${id}`,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.25,
      invalidateOnRefresh: true,
    },
  });
  // A full-length track keeps every scene on the same entry / hold / exit clock.
  timeline.to(playhead, { progress: 1, duration: 1, ease: 'none' }, 0);
  return timeline;
}

function animateCopy(timeline: gsap.core.Timeline, selector: string) {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  timeline.fromTo(targets,
    { autoAlpha: 0, y: travel(45), scale: 0.99 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.31, stagger: 0.035 },
    0.08,
  );
  timeline.to(targets,
    { autoAlpha: 0.08, y: travel(-45), scale: 0.99, duration: 0.2, stagger: 0.015, ease: 'power2.in' },
    0.76,
  );
}

export function setupScrollMotion(): () => void {
  const context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.research-card__rule').forEach((rule) => {
      gsap.from(rule, {
        scaleX: 0,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
      });
    });
    const heroEntrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroEntrance.fromTo('.hero__content [data-reveal]',
      { autoAlpha: 0, y: 55, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, stagger: 0.14, delay: 0.12 },
    );
    gsap.to('.hero__content', {
      y: travel(-130), x: travel(-55), scale: 0.9, ease: 'none',
      scrollTrigger: { trigger: '#opening', start: 'top 12%', end: 'bottom top', scrub: 0.9, invalidateOnRefresh: true },
    });
    gsap.to('.hero__content', {
      autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '#opening', start: 'top top', end: 'bottom 50%', scrub: 0.5 },
    });
    gsap.to('.scroll-cue, .hero__corner', {
      autoAlpha: 0, y: -28, ease: 'none',
      scrollTrigger: { trigger: '#opening', start: 'top top', end: 'bottom 70%', scrub: 0.5 },
    });
    gsap.to('.hero__orbit--one', {
      scale: 1.65, rotation: 25, autoAlpha: 0.2, ease: 'none',
      scrollTrigger: { trigger: '#opening', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.hero__orbit--two', {
      scale: 0.65, rotation: -35, autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '#opening', start: 'top top', end: 'bottom top', scrub: 1 },
    });

    const overload = sceneTimeline('overload');
    animateCopy(overload, '#overload .split__text [data-reveal]');
    const cardPositions = [
      { x: 155, y: 95, rotation: -8, exitX: -130, exitY: -95, exitRotation: -22 },
      { x: -150, y: 105, rotation: 7, exitX: 155, exitY: -110, exitRotation: 21 },
      { x: 145, y: -105, rotation: 5, exitX: -160, exitY: 80, exitRotation: -18 },
      { x: -145, y: -95, rotation: -5, exitX: 145, exitY: 90, exitRotation: 18 },
    ];
    gsap.utils.toArray<HTMLElement>('#overload .chaos-card').forEach((card, index) => {
      const position = cardPositions[index];
      overload.fromTo(card,
        { autoAlpha: 0, x: travel(position.x), y: travel(position.y), scale: 0.94, rotation: position.rotation },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: position.rotation, duration: 0.35 },
        0.1 + index * 0.035,
      );
      overload.to(card,
        { autoAlpha: 0, x: travel(position.exitX), y: travel(position.exitY), scale: 0.94, rotation: position.exitRotation * 0.4, duration: 0.22, ease: 'power2.in' },
        0.75 + index * 0.012,
      );
    });
    overload.fromTo('#overload .chaos-board__question',
      { autoAlpha: 0, scale: 1.08, rotation: 0 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.3 }, 0.24,
    ).to('#overload .chaos-board__question',
      { autoAlpha: 0, scale: 0.96, rotation: 0, duration: 0.2 }, 0.76,
    );

    const intelligence = sceneTimeline('intelligence');
    animateCopy(intelligence, '#intelligence .intelligence-layout__intro [data-reveal]');
    const signalOffsets = [
      { x: 120, y: 115 }, { x: -140, y: 65 },
      { x: 145, y: -65 }, { x: -120, y: -115 },
    ];
    gsap.utils.toArray<HTMLElement>('#intelligence .signal').forEach((signal, index) => {
      const offset = signalOffsets[index];
      intelligence.fromTo(signal,
        { autoAlpha: 0, x: travel(offset.x), y: travel(offset.y), scale: 0.94 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.34 },
        0.14 + index * 0.035,
      );
      intelligence.to(signal,
        { autoAlpha: 0, x: travel(offset.x), y: travel(offset.y), scale: 0.94, duration: 0.22, ease: 'power2.in' },
        0.72 + index * 0.018,
      );
    });
    intelligence.fromTo('#intelligence .decision-system__core',
      { autoAlpha: 0, scale: 0.94, rotation: -6 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.39 }, 0.1,
    ).to('#intelligence .decision-system__core',
      { scale: 1.04, autoAlpha: 0.13, rotation: 6, duration: 0.24 }, 0.74,
    );
    intelligence.fromTo('#intelligence .decision-system__lines',
      { autoAlpha: 0, scale: 0.35 },
      { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.19,
    ).to('#intelligence .decision-system__lines',
      { autoAlpha: 0, scale: 0.25, duration: 0.22 }, 0.75,
    );
    intelligence.fromTo('#intelligence .decision-system__outcomes',
      { autoAlpha: 0, y: 45, scale: 0.8 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.28 }, 0.31,
    ).to('#intelligence .decision-system__outcomes',
      { autoAlpha: 0, y: -35, duration: 0.18 }, 0.78,
    );
    intelligence.fromTo('#intelligence .principle',
      { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.34,
    ).to('#intelligence .principle',
      { autoAlpha: 0, y: -20, duration: 0.18 }, 0.76,
    );

    const action = sceneTimeline('action');
    animateCopy(action, '#action .action-layout__intro [data-reveal]');
    action.fromTo('#action .app-frame',
      { autoAlpha: 0, x: travel(180), y: travel(70), scale: 0.78, rotationY: -18, rotationZ: 4 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, rotationY: 0, rotationZ: 0, duration: 0.42 }, 0.11,
    ).to('#action .app-frame',
      { autoAlpha: 0, x: travel(-155), y: travel(-55), scale: 1.1, rotationY: 8, duration: 0.22, ease: 'power2.in' }, 0.76,
    );
    action.fromTo('#action .next-action-card',
      { autoAlpha: 0, y: 65, scale: 0.83 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.28 }, 0.25,
    );
    action.fromTo('#action .mini-bars span',
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: 'bottom center', duration: 0.2, stagger: 0.025 }, 0.37,
    );
    action.fromTo('#action .mini-meter span',
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: 'left center', duration: 0.3 }, 0.38,
    );

    const replanning = sceneTimeline('replanning');
    animateCopy(replanning, '#replanning .replan-layout__intro [data-reveal]');
    replanning.fromTo('#replanning .plan-panel--before',
      { autoAlpha: 0, x: travel(-140), rotation: -7, scale: 0.83 },
      { autoAlpha: 1, x: 0, rotation: 0, scale: 1, duration: 0.3 }, 0.1,
    ).to('#replanning .plan-panel--before',
      { autoAlpha: 0.4, x: travel(-35), scale: 0.95, duration: 0.24 }, 0.68,
    );
    replanning.fromTo('#replanning .plan-panel--after',
      { autoAlpha: 0, x: travel(160), rotation: 7, scale: 0.78 },
      { autoAlpha: 1, x: 0, rotation: 0, scale: 1, duration: 0.25 }, 0.18,
    ).to('#replanning .plan-panel--after',
      { autoAlpha: 0, x: travel(80), scale: 1.08, duration: 0.18 }, 0.81,
    );
    replanning.fromTo('#replanning .plan-arrow',
      { autoAlpha: 0, scale: 0.2, rotation: -90 },
      { autoAlpha: 1, scale: 1, rotation: () => window.innerWidth <= 460 ? 90 : 0, duration: 0.2 }, 0.24,
    );
    replanning.fromTo('#replanning .rescheduled',
      { autoAlpha: 0, y: 25, scale: 0.86 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.17 }, 0.27,
    );

    const readiness = sceneTimeline('readiness');
    animateCopy(readiness, '#readiness .readiness-layout__intro [data-reveal]');
    readiness.fromTo('#readiness .roadmap__line',
      { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top center', duration: 0.51, ease: 'none' }, 0.15,
    );
    gsap.utils.toArray<HTMLElement>('#readiness .roadmap__step').forEach((step, index) => {
      readiness.fromTo(step,
        { autoAlpha: 0, x: travel(85), y: 25, scale: 0.83 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.2 }, 0.1 + index * 0.07,
      );
      readiness.fromTo(step.querySelector('.roadmap__node'),
        { scale: 0.1, rotation: -90 },
        { scale: 1, rotation: 0, duration: 0.17, ease: 'power2.out' }, 0.13 + index * 0.07,
      );
    });
    readiness.fromTo('#readiness .evidence-card',
      { autoAlpha: 0, x: travel(100), y: 35, scale: 0.75 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.18 }, 0.26,
    );
    readiness.to('#readiness .roadmap',
      { autoAlpha: 0.12, x: travel(-100), scale: 1.07, duration: 0.22 }, 0.77,
    );

    const closing = sceneTimeline('closing');
    closing.fromTo('#closing .closing__halo',
      { autoAlpha: 0, scale: 0.35, rotation: -40 },
      { autoAlpha: 1, scale: 1.3, rotation: 20, duration: 0.76, ease: 'power2.out' }, 0.02,
    );
    closing.fromTo('#closing .closing__content [data-reveal]',
      { autoAlpha: 0, y: 65, scale: 0.83 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, stagger: 0.04 }, 0.1,
    );
  }, document.querySelector('main')!);

  return () => context.revert();
}

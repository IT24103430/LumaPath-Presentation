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
      scrub: 0.6,
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
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, stagger: 0.025 },
    0.02,
  );
  timeline.to(targets,
    { autoAlpha: 0.08, y: travel(-45), scale: 0.99, duration: 0.08, stagger: 0.005, ease: 'power2.in' },
    0.9,
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
      scrollTrigger: { trigger: '#opening', start: 'bottom 85%', end: 'bottom 15%', scrub: 0.5 },
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

    // The explanatory flow remains readable at every scroll position. Only its
    // accents animate once, so an examiner can read at their own pace.
    const intelligence = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: '#intelligence .idea-flow', start: 'top 65%', once: true },
    });
    intelligence.fromTo('#intelligence .idea-input__dot',
      { scale: 0.7, opacity: 0.45 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08 },
    );
    intelligence.from('#intelligence .idea-connector--in span', {
      scaleY: 0, transformOrigin: 'top', duration: 0.35,
    });
    intelligence.fromTo('#intelligence .idea-engine',
      { borderColor: 'rgba(141, 229, 237, 0.22)' },
      { borderColor: 'rgba(141, 229, 237, 0.85)', duration: 0.45 },
    );
    intelligence.fromTo('#intelligence .idea-engine__steps span',
      { backgroundColor: 'rgba(141, 229, 237, 0.03)' },
      { backgroundColor: 'rgba(141, 229, 237, 0.16)', duration: 0.35, stagger: 0.08 },
      '<0.1',
    );
    intelligence.from('#intelligence .idea-connector--out span', {
      scaleY: 0, transformOrigin: 'top', duration: 0.35,
    });
    intelligence.fromTo('#intelligence .idea-result',
      { borderColor: 'rgba(141, 229, 237, 0.22)' },
      { borderColor: 'rgba(141, 229, 237, 0.75)', duration: 0.45 },
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

// Experience trace: scroll-linked drawing for browsers without CSS view timelines.
// Where `animation-timeline: view()` is supported, CSS does all the work.

import { prefersReducedMotion } from '../core/motion.js';

const PEN = 0.6; // The pen sits 60% down the viewport, matching --xp-pen-offset in CSS.

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

const segmentHeight = (el) => (el instanceof HTMLElement ? el.offsetHeight : el.getBoundingClientRect().height);

// Hidden variants (the other breakpoint's wave) have no height and are skipped.
function measure(segments) {
  return segments
    .map((el) => ({
      el,
      top: el.getBoundingClientRect().top + window.scrollY,
      height: segmentHeight(el),
    }))
    .filter(({ height }) => height > 0);
}

function draw(layout, pen) {
  const line = window.scrollY + pen;
  layout.forEach(({ el, top, height }) => {
    el.style.setProperty('--xp-progress', clamp01((line - top) / height).toFixed(4));
  });
}

function scrub(section) {
  const segments = [...section.querySelectorAll('[data-xp-draw]')];
  let layout = [];
  let pen = 0;
  let frame = 0;

  const render = () => {
    frame = 0;
    draw(layout, pen);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const remeasure = () => {
    layout = measure(segments);
    pen = window.innerHeight * PEN;
    schedule();
  };

  const visibility = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      window.addEventListener('scroll', schedule, { passive: true });
      schedule();
    } else {
      window.removeEventListener('scroll', schedule);
      draw(layout, pen);
    }
  });

  section.classList.add('is-scrubbed');
  // Anything above the section (fonts, expanding rows) can move it, so watch the whole page.
  new ResizeObserver(remeasure).observe(document.body);
  window.addEventListener('resize', remeasure);
  visibility.observe(section);
}

const section = document.getElementById('experience');
const hasTrace = section?.querySelector('[data-xp-draw]');
const supportsViewTimeline = CSS.supports('animation-timeline: view()');

if (hasTrace && !supportsViewTimeline && !prefersReducedMotion()) scrub(section);

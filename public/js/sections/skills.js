// Skills section: inline evidence toggles everywhere, connector tracing on wide fine-pointer screens.

import { hasFinePointer, prefersReducedMotion } from '../core/motion.js';
import { initDisclosure } from '../skills/disclosure.js';
import { measure, panelOffset, sourcePoint, connectorPath } from '../skills/geometry.js';
import { readLinks, linksFor, highlight, watchTarget } from '../skills/trace.js';
import { createWires } from '../skills/wires.js';

const WIDE = matchMedia('(min-width: 64rem)');
const FINE = matchMedia('(hover: hover) and (pointer: fine)');

function startTracing(field) {
  const panel = field.querySelector('[data-skills-panel]');
  const wires = createWires(field.querySelector('[data-skills-wires]'));
  const links = readLinks(field);
  let cache = null;
  let fieldDocTop = 0;
  let active = [];
  let frame = 0;
  let alive = true;

  const layout = () =>
    active.map(({ skill, source }) => {
      const end = sourcePoint(cache, source, panelOffset(cache, fieldDocTop - scrollY));
      return { d: connectorPath(cache.skills.get(skill), end), end };
    });

  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      wires.move(layout());
    });
  };

  const refresh = () => {
    if (!alive) return;
    cache = measure(field, panel);
    fieldDocTop = field.getBoundingClientRect().top + scrollY;
    if (active.length) wires.move(layout());
  };

  const render = (target) => {
    if (target && !cache) refresh();
    if (target) fieldDocTop = field.getBoundingClientRect().top + scrollY;
    active = linksFor(links, target);
    highlight(field, active);
    if (active.length) {
      wires.show(layout(), !prefersReducedMotion());
      addEventListener('scroll', onScroll, { passive: true });
    } else {
      wires.clear();
      removeEventListener('scroll', onScroll);
    }
  };

  const resizeObserver = new ResizeObserver(refresh);
  const viewObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) refresh();
  });
  resizeObserver.observe(field);
  viewObserver.observe(field);
  document.fonts.ready.then(refresh);
  const stopWatching = watchTarget(field, render);

  return () => {
    alive = false;
    stopWatching();
    resizeObserver.disconnect();
    viewObserver.disconnect();
    cancelAnimationFrame(frame);
  };
}

function init() {
  const field = document.querySelector('[data-skills-field]');
  if (!field) return;
  initDisclosure(field);

  let stop = null;
  const sync = () => {
    stop?.();
    stop = WIDE.matches && hasFinePointer() ? startTracing(field) : null;
  };
  WIDE.addEventListener('change', sync);
  FINE.addEventListener('change', sync);
  sync();
}

init();

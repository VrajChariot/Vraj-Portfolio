// Decides when each row's packet loop runs: open, on screen, tab visible, motion allowed.
import { prefersReducedMotion } from '../core/motion.js';
import { createPacketLoop } from './packet.js';

export function createFlowMotion(rows) {
  const loops = new Map();
  rows.forEach((row) => {
    const flow = row.querySelector('[data-flow]');
    if (flow) loops.set(row, { flow, loop: createPacketLoop(flow), visible: false });
  });

  function sync(row) {
    const entry = loops.get(row);
    if (!entry) return;
    const run = row.classList.contains('is-open') && entry.visible && !document.hidden && !prefersReducedMotion();
    if (run) entry.loop.start();
    else entry.loop.stop();
  }

  const syncAll = () => loops.forEach((_, row) => sync(row));

  // Visibility alone is not enough: `sync` also requires the row to be open.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const row = target.closest('[data-work-row]');
      loops.get(row).visible = isIntersecting;
      sync(row);
    });
  });
  loops.forEach(({ flow }) => observer.observe(flow));
  document.addEventListener('visibilitychange', syncAll);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', syncAll);

  return { sync };
}

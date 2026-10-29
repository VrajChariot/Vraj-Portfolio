// Custom cursor: an exact dot plus a lagging ring that reacts to what it is over.
import { hasFinePointer, prefersReducedMotion } from './core/motion.js';
import { describeTarget, magneticOf } from './shell/cursor-target.js';
import { pull, release } from './shell/magnetic.js';

const LERP = 0.2;
const SETTLE = 0.1;
const HOVER_PAD = 12;
const MIN_RING = 24;

function init() {
  const root = document.querySelector('.cursor');
  if (!root || !hasFinePointer()) {
    root?.remove();
    return;
  }
  const ring = root.querySelector('.cursor-ring');
  const dot = root.querySelector('.cursor-dot');
  const label = root.querySelector('.cursor-label');
  const html = document.documentElement;

  const pointer = { x: 0, y: 0 };
  const ringPos = { x: 0, y: 0 };
  let state = { mode: 'idle' };
  let magnet = null;
  let frame = 0;
  let hoverCenter = null;

  const ringTarget = () => hoverCenter ?? pointer;

  // Measured in event handlers only, so the animation loop never reads layout.
  const measureHover = () => {
    if (state.mode !== 'hover') {
      hoverCenter = null;
      ring.style.width = ring.style.height = '';
      return;
    }
    const rect = state.element.getBoundingClientRect();
    hoverCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    ring.style.width = `${Math.max(rect.width + HOVER_PAD, MIN_RING)}px`;
    ring.style.height = `${Math.max(rect.height + HOVER_PAD, MIN_RING)}px`;
  };

  const tick = () => {
    const target = ringTarget();
    const ease = prefersReducedMotion() ? 1 : LERP;
    ringPos.x += (target.x - ringPos.x) * ease;
    ringPos.y += (target.y - ringPos.y) * ease;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    const settled = Math.abs(target.x - ringPos.x) < SETTLE && Math.abs(target.y - ringPos.y) < SETTLE;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const setState = (next) => {
    const changed = next.mode !== state.mode || next.element !== state.element;
    state = next;
    root.dataset.deep = String(Boolean(next.deep));
    if (!changed) return;
    root.dataset.mode = next.mode;
    label.textContent = next.mode === 'label' ? next.label : '';
  };

  const setMagnet = (element) => {
    if (element === magnet) return;
    if (magnet) release(magnet);
    magnet = element;
  };

  const onMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const first = !html.classList.contains('has-cursor');
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (first) {
      ringPos.x = pointer.x;
      ringPos.y = pointer.y;
      html.classList.add('has-cursor');
    }
    root.dataset.visible = 'true';
    dot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
    setState(describeTarget(event.target));
    setMagnet(prefersReducedMotion() ? null : magneticOf(event.target));
    if (magnet) pull(magnet, pointer.x, pointer.y);
    measureHover();
    wake();
  };

  const onLeave = () => {
    root.dataset.visible = 'false';
    setMagnet(null);
  };

  const onDown = () => root.classList.add('is-pressed');
  const onUp = () => root.classList.remove('is-pressed');
  const onScroll = () => {
    if (root.dataset.visible !== 'true') return;
    const under = document.elementFromPoint(pointer.x, pointer.y);
    setState(describeTarget(under));
    setMagnet(null);
    measureHover();
    wake();
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
}

init();

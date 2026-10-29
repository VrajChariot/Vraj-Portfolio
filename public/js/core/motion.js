// Shared motion contract used by every section script.

const INTRO_EVENT = 'intro:done';
const INTRO_FALLBACK_MS = 3500;

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// Called once by the hero when its load sequence has finished.
export function signalIntroDone() {
  const root = document.documentElement;
  if (root.classList.contains('is-ready')) return;
  root.classList.add('is-ready');
  window.dispatchEvent(new Event(INTRO_EVENT));
}

// Run `callback` once the intro is done. Falls back to a timeout so a failed
// hero script can never leave the rest of the page hidden.
export function onIntroDone(callback) {
  if (document.documentElement.classList.contains('is-ready')) {
    callback();
    return;
  }
  window.addEventListener(INTRO_EVENT, callback, { once: true });
  setTimeout(signalIntroDone, INTRO_FALLBACK_MS);
}

// Pulls [data-magnetic] elements a few pixels toward the pointer and lets them spring back.

const STRENGTH = 0.25;
const MAX_PULL = 8;

const clamp = (value) => Math.max(-MAX_PULL, Math.min(MAX_PULL, value));

export function pull(element, x, y) {
  const rect = element.getBoundingClientRect();
  const dx = clamp((x - (rect.left + rect.width / 2)) * STRENGTH);
  const dy = clamp((y - (rect.top + rect.height / 2)) * STRENGTH);
  element.style.transform = `translate(${dx}px, ${dy}px)`;
}

export function release(element) {
  element.style.transform = '';
}

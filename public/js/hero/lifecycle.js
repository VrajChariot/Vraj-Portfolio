// Runs a rAF loop only while `element` is on screen and the tab is visible.

export function runWhileVisible(element, tick) {
  let frame = 0;
  let last = 0;
  let onScreen = false;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    tick(now, dt);
    frame = requestAnimationFrame(step);
  }

  function update() {
    const shouldRun = onScreen && document.visibilityState === 'visible';
    if (shouldRun && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(step);
    } else if (!shouldRun && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(element);
  document.addEventListener('visibilitychange', update);
}

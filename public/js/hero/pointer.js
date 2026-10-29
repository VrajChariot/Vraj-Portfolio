// Pointer input over the hero: position relative to the hero plus the
// distance travelled since the last read. Mouse, pen and touch alike.

const TAP_TRAVEL = 220;

export function createPointerInput(surface) {
  const state = { x: 0, y: 0, inside: false, travel: 0 };

  function locate(event) {
    const rect = surface.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onMove(event) {
    const point = locate(event);
    if (state.inside) state.travel += Math.hypot(point.x - state.x, point.y - state.y);
    state.x = point.x;
    state.y = point.y;
    state.inside = true;
  }

  // A tap has no travel of its own, so it counts as a short stroke.
  function onDown(event) {
    onMove(event);
    if (event.pointerType !== 'mouse') state.travel += TAP_TRAVEL;
  }

  function onLeave(event) {
    if (event.pointerType === 'mouse') state.inside = false;
  }

  surface.addEventListener('pointermove', onMove, { passive: true });
  surface.addEventListener('pointerdown', onDown, { passive: true });
  surface.addEventListener('pointerleave', onLeave, { passive: true });

  // Snapshot for one animation step; travel is consumed by the read.
  return function read() {
    const snapshot = { ...state };
    state.travel = 0;
    return snapshot;
  };
}

// Runs the packet loop for one flow diagram with the Web Animations API.
// Geometry is read only when the track resizes, never per frame.
import { buildTimeline } from './timeline.js';

const START_DELAY = 500;

// Entry/exit ports of a hop, in track coordinates. Horizontal flows enter on the left
// edge and leave on the right at mid-height; vertical flows use the top and bottom
// edges on the connector axis.
function portsOf(node, vertical, axis) {
  const { offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height } = node;
  if (vertical) {
    const x = left + axis;
    return { entry: { x, y: top }, exit: { x, y: top + height } };
  }
  const y = top + height / 2;
  return { entry: { x: left, y }, exit: { x: left + width, y } };
}

export function createPacketLoop(flow) {
  const track = flow.querySelector('[data-flow-track]');
  const hops = flow.querySelector('[data-flow-hops]');
  const packet = flow.querySelector('[data-flow-packet]');
  const nodes = [...flow.querySelectorAll('[data-flow-node]')];
  const rings = nodes.map((node) => node.querySelector('[data-flow-ring]'));
  let animations = [];
  let resizeObserver = null;

  const cancel = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };

  function build() {
    cancel();
    const style = getComputedStyle(flow);
    const vertical = getComputedStyle(hops).flexDirection === 'column';
    const axis = parseFloat(style.getPropertyValue('--flow-axis'));
    const timeline = buildTimeline(
      nodes.map((node) => portsOf(node, vertical, axis)),
      packet.offsetWidth,
    );
    const timing = { duration: timeline.duration, iterations: Infinity, delay: START_DELAY };
    animations = [
      packet.animate(timeline.packet, timing),
      ...rings.map((ring, i) => ring.animate(timeline.rings[i], timing)),
    ];
  }

  // Observing fires once immediately, which performs the first build.
  function start() {
    if (resizeObserver) return;
    resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(track);
  }

  function stop() {
    if (!resizeObserver) return;
    resizeObserver.disconnect();
    resizeObserver = null;
    cancel();
  }

  return { start, stop };
}

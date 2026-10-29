// Keyframes for one loop of the packet through a flow. Pure: ports in, keyframes out.
// Each hop has an `entry` and an `exit` port ({ x, y }, packet centre, track coordinates).

const ARRIVE = 280; // packet sits on the hop's entry port
const FADE = 140; // packet sinks into / rises out of the hop
const PROCESS = 420; // hop works with the packet hidden inside it
const TRAVEL = 560; // packet rides the connector to the next hop
const REST = 900; // pause after the last hop before looping
const RING_FADE = 160;
const TRAVEL_EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

const at = (port, size) => `translate(${port.x - size / 2}px, ${port.y - size / 2}px)`;

export function buildTimeline(hops, size) {
  const packet = [];
  const holds = [];
  let t = 0;
  const mark = (port, opacity, easing = 'linear') => packet.push({ time: t, transform: at(port, size), opacity, easing });

  hops.forEach((hop, i) => {
    const arrive = t;
    mark(hop.entry, 0);
    t += FADE;
    mark(hop.entry, 1);
    t += ARRIVE;
    mark(hop.entry, 1);
    t += FADE;
    mark(hop.entry, 0);
    t += PROCESS;
    const next = hops[i + 1];
    if (next) {
      mark(hop.exit, 0);
      t += FADE;
      mark(hop.exit, 1, TRAVEL_EASING);
      t += TRAVEL;
    }
    holds.push({ from: arrive, to: next ? t - TRAVEL : t });
  });
  mark(hops.at(-1).entry, 0);
  t += REST;
  mark(hops.at(-1).entry, 0);

  const duration = t;
  const offset = (time) => time / duration;
  const rings = holds.map(({ from, to }) =>
    [
      { offset: 0, opacity: 0 },
      { offset: offset(from), opacity: 0 },
      { offset: offset(from + RING_FADE), opacity: 1 },
      { offset: offset(to), opacity: 1 },
      { offset: offset(Math.min(to + RING_FADE, duration)), opacity: 0 },
      { offset: 1, opacity: 0 },
    ],
  );

  return {
    duration,
    packet: packet.map(({ time, ...frame }) => ({ ...frame, offset: offset(time) })),
    rings,
  };
}

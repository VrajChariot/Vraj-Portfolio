// Draws connector curves into the decorative SVG layer.

const SVG_NS = 'http://www.w3.org/2000/svg';
const DRAW_MS = 520;
const DRAW_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DOT_RADIUS = 2.5;

const make = (name, attrs) => {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
};

export function createWires(svg) {
  let drawn = [];

  function clear() {
    drawn.forEach(({ path }) => path.getAnimations().forEach((animation) => animation.cancel()));
    svg.replaceChildren();
    drawn = [];
  }

  // `wires` is a list of { d, end } where `end` is the source-side point.
  function show(wires, animate) {
    clear();
    drawn = wires.map(({ d, end }) => {
      const path = make('path', { d, pathLength: 1 });
      const dot = make('circle', { cx: end.x, cy: end.y, r: DOT_RADIUS });
      svg.append(path, dot);
      if (animate) {
        path.animate(
          { strokeDasharray: ['1 1', '1 1'], strokeDashoffset: [1, 0] },
          { duration: DRAW_MS, easing: DRAW_EASING },
        );
        dot.animate({ opacity: [0, 1] }, { duration: DRAW_MS, easing: DRAW_EASING });
      }
      return { path, dot };
    });
  }

  // Move existing wires without replaying the draw.
  function move(wires) {
    wires.forEach(({ d, end }, index) => {
      const { path, dot } = drawn[index];
      path.setAttribute('d', d);
      dot.setAttribute('cx', end.x);
      dot.setAttribute('cy', end.y);
    });
  }

  return { show, move, clear };
}

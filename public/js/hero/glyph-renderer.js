// A line of source code riding just above the primary wave: each glyph sits
// on the curve, turned to its tangent, and the text scrolls left to right.
// Layout runs once per frame; the harmonics are knocked out behind the glyphs
// so the code stays legible, then the glyphs are filled.

import { bumpAt, clamp } from './signal.js';

const FONT_SIZE = 11;
const LIFT = 6;
const TRACKING = 1.15;
const BASE_ALPHA = 0.55;
const LOOSEN = 0.45;
const EDGE_FADE = 96;
// Band cleared behind the glyphs, relative to their baseline.
const KNOCKOUT_TOP = -LIFT - FONT_SIZE * 0.8;
const KNOCKOUT_HEIGHT = FONT_SIZE * 1.05;
const SLOT = 8;
const TANGENT_REACH = 2;
const HULL_REACH = 6;
const SMOOTH_REACH = 10;
const BUMP_SMOOTH_REACH = 16;

const smoothstep = (p) => {
  const c = clamp(p, 0, 1);
  return c * c * (3 - 2 * c);
};

export function createGlyphRenderer(ctx, colors, fontFamily) {
  const font = `${FONT_SIZE}px ${fontFamily}`;
  let glyphs = [];
  let starts = new Float64Array(0);
  let length = 0;
  let narrowest = FONT_SIZE;
  let tape = new Float32Array(0);
  let path = new Float32Array(0);
  let sums = new Float64Array(0);
  // Per-frame layout, reused between frames: [glyph, x, y, cos, sin, alpha, glow, advance] per slot.
  let layout = new Float32Array(0);
  let placed = 0;

  // Advances are measured once per text or font load, never per frame.
  function measure() {
    if (!glyphs.length) return;
    ctx.font = font;
    const widths = new Map();
    starts = new Float64Array(glyphs.length);
    length = 0;
    glyphs.forEach((glyph, index) => {
      if (!widths.has(glyph)) widths.set(glyph, ctx.measureText(glyph).width * TRACKING);
      starts[index] = length;
      length += widths.get(glyph);
    });
    narrowest = Math.max(1, Math.min(...widths.values()));
  }

  // Resolves once advances are measured with the loaded font. The trailing
  // space keeps the end of the source apart from its start when it wraps.
  function setText(text) {
    glyphs = Array.from(`${text} `);
    measure();
    return document.fonts.load(font, text).then(measure);
  }

  function resize(points) {
    tape = new Float32Array(points);
    path = new Float32Array(points);
    sums = new Float64Array(points + 1);
  }

  // The glyph path: first the local crest (the highest point within a glyph's
  // reach, so troughs never pull the code into the line), then a moving average
  // of that. The average widens inside the bump, where the wave chirps, so the
  // code floats calmly over the disturbance instead of crumpling.
  function smooth(wave, count, step, field) {
    sums[0] = 0;
    for (let i = 0; i < count; i++) {
      let crest = wave[i];
      const low = Math.max(0, i - HULL_REACH);
      const high = Math.min(count - 1, i + HULL_REACH);
      for (let j = low; j <= high; j++) crest = Math.min(crest, wave[j]);
      sums[i + 1] = sums[i] + crest;
    }
    for (let i = 0; i < count; i++) {
      const reach = SMOOTH_REACH + Math.round(BUMP_SMOOTH_REACH * clamp(bumpAt(i * step, field), 0, 1));
      const low = Math.max(0, i - reach);
      const high = Math.min(count - 1, i + reach);
      path[i] = (sums[high + 1] - sums[low]) / (high - low + 1);
    }
    return path;
  }

  // Index of the last glyph starting at or before tape position `q`.
  function glyphAt(q) {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (starts[mid] <= q) low = mid;
      else high = mid - 1;
    }
    return low;
  }

  function ensureCapacity(slots) {
    if (layout.length < slots * SLOT) layout = new Float32Array(Math.ceil(slots * 1.25) * SLOT);
  }

  // wave: primary heights sampled every `step` px up to `end`; `count` of them.
  function place(wave, count, step, end, frame) {
    placed = 0;
    const visibility = frame.stream * BASE_ALPHA;
    if (!length || visibility <= 0 || count < 2) return;
    const ys = smooth(wave, count, step, frame.field);

    // Tape coordinate along the curve; it runs slower inside the bump so the
    // glyphs there spread apart.
    tape[0] = 0;
    for (let i = 1; i < count; i++) {
      const x0 = (i - 1) * step;
      const x1 = Math.min(i * step, end);
      const ds = Math.hypot(x1 - x0, ys[i] - ys[i - 1]);
      tape[i] = tape[i - 1] + ds / (1 + LOOSEN * bumpAt((x0 + x1) / 2, frame.field));
    }
    const total = tape[count - 1];
    ensureCapacity(Math.ceil(total / narrowest) + 1);

    const q = ((-frame.scroll % length) + length) % length;
    let index = glyphAt(q);
    let s = starts[index] - q;
    let segment = 0;

    while (s < total) {
      const advance = (index + 1 < glyphs.length ? starts[index + 1] : length) - starts[index];
      const centre = s + advance / 2;
      if (centre >= 0 && centre <= total && glyphs[index] !== ' ') {
        while (segment < count - 2 && tape[segment + 1] < centre) segment++;
        const along = (centre - tape[segment]) / (tape[segment + 1] - tape[segment] || 1);
        const xa = segment * step;
        const dx = Math.min((segment + 1) * step, end) - xa;
        const dy = ys[segment + 1] - ys[segment];
        const x = xa + dx * along;
        // Tangent over a few samples so glyph angles do not jitter.
        const from = Math.max(0, segment - TANGENT_REACH);
        const to = Math.min(count - 1, segment + 1 + TANGENT_REACH);
        const tx = Math.min(to * step, end) - from * step;
        const ty = ys[to] - ys[from];
        const run = Math.hypot(tx, ty) || 1;
        const slot = placed++ * SLOT;
        layout[slot] = index;
        layout[slot + 1] = x;
        layout[slot + 2] = ys[segment] + dy * along;
        layout[slot + 3] = tx / run;
        layout[slot + 4] = ty / run;
        layout[slot + 5] = visibility * smoothstep(x / EDGE_FADE) * smoothstep((frame.width - x) / EDGE_FADE);
        layout[slot + 6] = clamp(bumpAt(x, frame.field), 0, 1);
        layout[slot + 7] = advance;
      }
      s += advance;
      index = index + 1 < glyphs.length ? index + 1 : 0;
    }
  }

  function each(dpr, paint) {
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    for (let slot = 0; slot < placed * SLOT; slot += SLOT) {
      const cos = layout[slot + 3];
      const sin = layout[slot + 4];
      ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin, dpr * cos, dpr * layout[slot + 1], dpr * layout[slot + 2]);
      paint(glyphs[layout[slot]], layout[slot + 5], layout[slot + 6], layout[slot + 7]);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  }

  // Clears the harmonics behind the glyphs so the code stays legible.
  function knockout(dpr) {
    if (!placed) return;
    ctx.globalCompositeOperation = 'destination-out';
    each(dpr, (glyph, alpha, glow, advance) => {
      ctx.globalAlpha = Math.min(1, alpha / BASE_ALPHA);
      ctx.fillRect(-advance / 2, KNOCKOUT_TOP, advance, KNOCKOUT_HEIGHT);
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  // Steel at rest; inside the bump the glyphs brighten toward ultra.
  function fill(dpr) {
    if (!placed) return;
    each(dpr, (glyph, alpha, glow) => {
      ctx.globalAlpha = alpha * (1 - glow);
      ctx.fillStyle = colors.glyph;
      ctx.fillText(glyph, 0, -LIFT);
      if (glow > 0.02) {
        ctx.globalAlpha = Math.min(1, alpha * 2.4) * glow;
        ctx.fillStyle = colors.primary;
        ctx.fillText(glyph, 0, -LIFT);
      }
    });
  }

  return { setText, resize, place, knockout, fill };
}

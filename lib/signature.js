// Deterministic "signature" waveform for a piece of text. Same text, same shape.

const TAU = Math.PI * 2;

// FNV-1a 32-bit hash.
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Mulberry32 PRNG: returns a function yielding floats in [0, 1).
function prng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rand, min, max) => min + rand() * (max - min);

// 3–5 harmonics with rising frequency and falling amplitude; spacing and decay vary per seed.
function harmonics(rand) {
  const count = 3 + Math.floor(rand() * 3);
  const base = between(rand, 1, 6);
  const spread = between(rand, 0.5, 3);
  const decay = between(rand, 0.3, 1.5);
  return Array.from({ length: count }, (_, i) => ({
    frequency: base * (1 + i * spread * between(rand, 0.7, 1.3)),
    amplitude: between(rand, 0.4, 1) / (1 + i * decay),
    phase: rand() * TAU,
  }));
}

// A burst that rises from and returns to silence; peak position, sharpness, a resting
// level and an optional second burst vary per seed.
function envelope(rand) {
  const peak = between(rand, 0.25, 0.75);
  const sharpness = between(rand, 0.5, 3);
  const floor = between(rand, 0, 0.3);
  const secondary = { at: between(rand, 0.1, 0.9), weight: between(rand, 0, 0.9), width: between(rand, 0.04, 0.14) };
  return (t) => {
    const skewed = t < peak ? (t / peak) * 0.5 : 0.5 + ((t - peak) / (1 - peak)) * 0.5;
    const window = floor + (1 - floor) * Math.sin(Math.PI * skewed) ** sharpness;
    const bump = secondary.weight * Math.exp(-(((t - secondary.at) / secondary.width) ** 2));
    const edges = Math.sin(Math.PI * t) ** 0.35;
    return Math.min(1, window + bump) * edges;
  };
}

// Samples in [0, 1] × [-1, 1], scaled so the loudest point reaches full height.
function sample(rand, samples) {
  const waves = harmonics(rand);
  const shape = envelope(rand);
  const raw = Array.from({ length: samples }, (_, i) => {
    const t = i / (samples - 1);
    const value = waves.reduce((sum, w) => sum + w.amplitude * Math.sin(TAU * w.frequency * t + w.phase), 0);
    return { t, y: value * shape(t) };
  });
  const peak = Math.max(...raw.map(({ y }) => Math.abs(y))) || 1;
  return raw.map(({ t, y }) => ({ t, y: y / peak }));
}

const round = (n) => Math.round(n * 10) / 10;

// Catmull-Rom spline through the points, emitted as cubic Bézier segments.
function smoothPath(points) {
  const [first] = points;
  let d = `M${round(first.x)} ${round(first.y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`;
  }
  return d;
}

export function signaturePath(seedText, { width = 640, height = 160, samples = 160 } = {}) {
  const rand = prng(hash(seedText));
  const mid = height / 2;
  const reach = mid * 0.92;
  const points = sample(rand, samples).map(({ t, y }) => ({ x: t * width, y: mid - y * reach }));
  return smoothPath(points);
}

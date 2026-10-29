// Canvas drawing for the hero waveform. Knows nothing about time or input:
// it draws whatever frame it is given.

import { createGlyphRenderer } from './glyph-renderer.js';
import { sampleWave } from './signal.js';

const MAX_DPR = 2;
const PRIMARY_STEP = 2;
const HARMONIC_STEP = 4;

// Faint steel echoes trailing the primary line.
const HARMONICS = [
  { lag: 0.9, scale: 0.62, alpha: 0.32 },
  { lag: 1.8, scale: 0.34, alpha: 0.18 },
];

const cssValue = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = { primary: cssValue('--color-ultra'), harmonic: cssValue('--color-steel'), glyph: cssValue('--color-steel') };
  const glyphs = createGlyphRenderer(ctx, colors, cssValue('--font-mono'));
  let width = 0;
  let height = 0;
  let dpr = 1;
  let primary = new Float32Array(0);

  function resize(nextWidth, nextHeight) {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const points = Math.ceil(width / PRIMARY_STEP) + 2;
    primary = new Float32Array(points);
    glyphs.resize(points);
  }

  function trace(frame, step, t, scale) {
    const end = width * frame.draw;
    const amplitude = frame.amplitude * frame.wake * scale;
    ctx.beginPath();
    ctx.moveTo(0, frame.baseline + amplitude * sampleWave(0, t, frame.wavelength, frame.field));
    for (let x = step; x < end + step; x += step) {
      const px = Math.min(x, end);
      ctx.lineTo(px, frame.baseline + amplitude * sampleWave(px, t, frame.wavelength, frame.field));
    }
    ctx.stroke();
  }

  // Samples the primary line into `primary`, shared by the stroke and the glyphs.
  function samplePrimary(frame, end) {
    const amplitude = frame.amplitude * frame.wake;
    let count = 0;
    for (let x = 0; x < end + PRIMARY_STEP; x += PRIMARY_STEP) {
      primary[count++] = frame.baseline + amplitude * sampleWave(Math.min(x, end), frame.t, frame.wavelength, frame.field);
    }
    return count;
  }

  function strokePrimary(count, end) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, primary[0]);
    for (let i = 1; i < count; i++) ctx.lineTo(Math.min(i * PRIMARY_STEP, end), primary[i]);
    ctx.stroke();
  }

  // frame: { t, width, baseline, amplitude, wavelength, draw 0..1, wake 0..1, stream 0..1, scroll, field }
  function draw(frame) {
    ctx.clearRect(0, 0, width, height);
    if (frame.draw <= 0) return;

    const end = width * frame.draw;
    const count = samplePrimary(frame, end);
    glyphs.place(primary, count, PRIMARY_STEP, end, frame);

    ctx.strokeStyle = colors.harmonic;
    ctx.lineWidth = 1;
    for (const harmonic of HARMONICS) {
      ctx.globalAlpha = harmonic.alpha;
      trace(frame, HARMONIC_STEP, frame.t - harmonic.lag, harmonic.scale);
    }

    glyphs.knockout(dpr);
    strokePrimary(count, end);
    glyphs.fill(dpr);
  }

  return { resize, draw, setText: glyphs.setText };
}

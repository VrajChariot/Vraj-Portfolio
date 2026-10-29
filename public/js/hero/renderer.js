// Canvas drawing for the hero waveform. Knows nothing about time or input:
// it draws whatever frame it is given.

import { sampleWave } from './signal.js';

const MAX_DPR = 2;
const PRIMARY_STEP = 2;
const HARMONIC_STEP = 4;

// Faint steel echoes trailing the primary line.
const HARMONICS = [
  { lag: 0.9, scale: 0.62, alpha: 0.32 },
  { lag: 1.8, scale: 0.34, alpha: 0.18 },
];

const cssColor = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = { primary: cssColor('--color-ultra'), harmonic: cssColor('--color-steel') };
  let width = 0;
  let height = 0;

  function resize(nextWidth, nextHeight) {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
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

  // frame: { t, baseline, amplitude, wavelength, draw 0..1, wake 0..1, field }
  function draw(frame) {
    ctx.clearRect(0, 0, width, height);
    if (frame.draw <= 0) return;

    ctx.strokeStyle = colors.harmonic;
    ctx.lineWidth = 1;
    for (const harmonic of HARMONICS) {
      ctx.globalAlpha = harmonic.alpha;
      trace(frame, HARMONIC_STEP, frame.t - harmonic.lag, harmonic.scale);
    }

    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    trace(frame, PRIMARY_STEP, frame.t, 1);
  }

  return { resize, draw };
}

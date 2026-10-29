// The hero waveform: keeps its geometry in sync with the layout, advances the
// pointer disturbance and hands finished frames to the renderer.

import { createRenderer } from './renderer.js';
import { fieldShape, restingField, stepField, waveScale } from './signal.js';

// Calm left-to-right drift of the code stream, px per second.
const STREAM_SPEED = 26;

export function createWave({ hero, canvas, band }) {
  const renderer = createRenderer(canvas);
  let geometry = { width: 0, height: 0, baseline: 0, amplitude: 0, wavelength: 1, spread: 1 };
  let field = restingField();

  // Layout reads happen here only, on resize, never per frame.
  function measure() {
    const heroRect = hero.getBoundingClientRect();
    const bandRect = band.getBoundingClientRect();
    const width = heroRect.width;
    geometry = {
      width,
      height: heroRect.height,
      baseline: bandRect.top - heroRect.top + bandRect.height / 2,
      ...waveScale(width, bandRect.height),
    };
    renderer.resize(geometry.width, geometry.height);
    if (!field.drive) field = restingField(width / 2);
  }

  function advance(input, dt) {
    field = stepField(field, input, dt, geometry.baseline);
    return fieldShape(field, geometry.spread).energy;
  }

  // progress: { draw, wake, stream } each 0..1 from the intro (all 1 once settled).
  function render(t, progress) {
    renderer.draw({
      t,
      width: geometry.width,
      baseline: geometry.baseline,
      amplitude: geometry.amplitude,
      wavelength: geometry.wavelength,
      draw: progress.draw,
      wake: progress.wake,
      stream: progress.stream,
      scroll: t * STREAM_SPEED,
      field: fieldShape(field, geometry.spread),
    });
  }

  return { measure, advance, render, setText: renderer.setText };
}

// Pure signal maths for the hero waveform: carrier, speech-like envelope,
// pointer disturbance, spring easing and the grid-frequency readout.

const TAU = Math.PI * 2;
const NOMINAL_HZ = 50;

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const gaussian = (distance, sigma) => Math.exp(-(distance * distance) / (2 * sigma * sigma));

export const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p));

export const easeInOutQuart = (p) => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2);

// Progress of a segment [start, start + duration] at `elapsed`, clamped to 0..1.
export const segment = (elapsed, start, duration) => clamp((elapsed - start) / duration, 0, 1);

// Loudness over space and time: slow phrases that contain quicker syllables,
// drifting along the line so the wave breathes without an obvious loop.
export function envelope(u, t) {
  const s = u * 0.45 - t * 0.18;
  const phrase = 0.5 + 0.5 * Math.sin(s * 2.1 + 1.6 * Math.sin(t * 0.11));
  const syllable = 0.5 + 0.5 * Math.sin(s * 7.3 + 1.9 * Math.sin(s * 2.7 + t * 0.37));
  return 0.22 + 0.78 * phrase * (0.35 + 0.65 * syllable * syllable);
}

// Sum of a few incommensurate sines, roughly within -1..1.
export function carrier(u, t) {
  return (
    0.62 * Math.sin(TAU * u - t * 1.7) +
    0.26 * Math.sin(TAU * u * 2.37 - t * 2.9 + 1.3) +
    0.12 * Math.sin(TAU * u * 0.41 + t * 0.53 + 0.4)
  );
}

// Vertical offset of the line at `x` px, in multiples of the base amplitude.
// `wavelength` maps px to carrier cycles; `field` is the pointer disturbance.
export function sampleWave(x, t, wavelength, field) {
  const u = x / wavelength;
  const bump = field.energy * gaussian(x - field.x, field.spread);
  const voiced = carrier(u, t) * envelope(u, t) * (1 + 1.8 * bump);
  const chirp = bump * 0.7 * Math.sin(TAU * u * 3.1 - t * 11);
  return voiced + chirp;
}

// One semi-implicit Euler step of a damped spring towards `target`.
export function stepSpring(spring, target, dt, stiffness, damping) {
  const velocity = spring.velocity + ((target - spring.value) * stiffness - spring.velocity * damping) * dt;
  return { value: spring.value + velocity * dt, velocity };
}

export const restingField = (x = 0) => ({
  x: { value: x, velocity: 0 },
  energy: { value: 0, velocity: 0 },
  drive: 0,
});

// Advance the disturbance. `input.travel` is pointer distance (px) since the
// previous step, `input.y` the pointer height; motion near the line drives it,
// stillness lets it settle back to rest.
export function stepField(field, input, dt, baseline) {
  const proximity = input.inside ? gaussian(input.y - baseline, 170) : 0;
  const drive = clamp(field.drive * Math.exp(-dt * 3.2) + (input.travel / 260) * proximity, 0, 1.3);
  return {
    x: stepSpring(field.x, input.x, dt, 60, 13),
    energy: stepSpring(field.energy, drive, dt, 46, 11),
    drive,
  };
}

// Size the wave to its band: calm amplitude, a wavelength that keeps a few
// cycles on screen at any width, and a pointer bump proportional to both.
export const waveScale = (width, bandHeight) => ({
  amplitude: clamp(bandHeight * 0.16, 14, 44),
  wavelength: clamp(width / 6.5, 120, 230),
  spread: clamp(width * 0.07, 60, 130),
});

// Shape the spring state into what sampleWave reads.
export const fieldShape = (field, spread) => ({
  x: field.x.value,
  energy: Math.max(0, field.energy.value),
  spread,
});

// Grid frequency that wanders a few hundredths while disturbed.
export const readoutHz = (energy, t) => NOMINAL_HZ + clamp(energy, 0, 1.3) * 0.06 * Math.sin(t * 1.3 + 0.8);

export const formatHz = (hz) => (Math.round(hz * 100) / 100).toFixed(2);

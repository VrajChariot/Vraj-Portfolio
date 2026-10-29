// Hero entry: wires the waveform, pointer input, readout, intro and lifecycle.

import { prefersReducedMotion, signalIntroDone } from '../core/motion.js';
import { introProgress, playIntro } from './intro.js';
import { restoreKerning } from './kerning.js';
import { runWhileVisible } from './lifecycle.js';
import { createPointerInput } from './pointer.js';
import { createReadout } from './readout.js';
import { readoutHz } from './signal.js';
import { createWave } from './wave.js';

const SETTLED = { draw: 1, wake: 1 };
// A moment in the signal that reads well as a single still frame.
const STILL_TIME = 4.2;

function init(hero) {
  const band = hero.querySelector('[data-hero-band]');
  const wave = createWave({ hero, band, canvas: hero.querySelector('[data-hero-canvas]') });
  const reduced = prefersReducedMotion();

  hero.querySelectorAll('.hero-word').forEach(restoreKerning);

  const resizer = new ResizeObserver(() => {
    wave.measure();
    if (reduced) wave.render(STILL_TIME, SETTLED);
  });
  resizer.observe(hero);
  resizer.observe(band);

  if (reduced) {
    signalIntroDone();
    return;
  }

  const readPointer = createPointerInput(hero);
  const showHz = createReadout(hero.querySelector('[data-hero-readout]'));
  const started = performance.now();
  playIntro(hero);

  runWhileVisible(hero, (now, dt) => {
    const t = now / 1000;
    const energy = wave.advance(readPointer(), dt);
    wave.render(t, introProgress(now - started));
    showHz(readoutHz(energy, t));
  });
}

const hero = document.querySelector('[data-hero]');
if (hero) init(hero);

// The one page-load moment: the line draws, the wave wakes, the name rises,
// then the intro and actions arrive. Signals the rest of the page when done.

import { signalIntroDone } from '../core/motion.js';
import { easeInOutQuart, easeOutExpo, segment } from './signal.js';

const LINE = { start: 0, duration: 700 };
const WAKE = { start: 450, duration: 850 };
// The code stream joins once the wave is awake, well before the intro ends.
const STREAM = { start: WAKE.start + WAKE.duration, duration: 400 };
const LETTERS = { start: 250, stagger: 55, duration: 950 };
const REVEALS = { start: 950, stagger: 80, duration: 600 };
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Waveform state `elapsed` ms into the intro.
export const introProgress = (elapsed) => ({
  draw: easeOutExpo(segment(elapsed, LINE.start, LINE.duration)),
  wake: easeInOutQuart(segment(elapsed, WAKE.start, WAKE.duration)),
  stream: easeInOutQuart(segment(elapsed, STREAM.start, STREAM.duration)),
});

const rise = (letter, index) =>
  letter.animate([{ transform: 'translateY(1.25em)' }, { transform: 'none' }], {
    duration: LETTERS.duration,
    delay: LETTERS.start + index * LETTERS.stagger,
    easing: EASE_OUT_EXPO,
    fill: 'both',
  });

const arrive = (element, index) =>
  element.animate(
    [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'none' },
    ],
    {
      duration: REVEALS.duration,
      delay: REVEALS.start + index * REVEALS.stagger,
      easing: EASE_OUT_EXPO,
      fill: 'both',
    },
  );

// Plays the DOM half of the intro. Once `is-ready` lands the pre-intro CSS no
// longer applies, so releasing the fills afterwards changes nothing on screen.
export async function playIntro(hero) {
  const animations = [
    ...[...hero.querySelectorAll('.hero-letter')].map(rise),
    ...[...hero.querySelectorAll('[data-hero-reveal]')].map(arrive),
  ];
  await Promise.allSettled(animations.map((animation) => animation.finished));
  signalIntroDone();
  animations.forEach((animation) => animation.cancel());
}

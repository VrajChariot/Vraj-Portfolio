// The decorative grid-frequency readout next to the waveform.

import { formatHz } from './signal.js';

export function createReadout(element) {
  let shown = element.textContent;

  return function show(hz) {
    const text = formatHz(hz);
    if (text === shown) return;
    shown = text;
    element.textContent = text;
  };
}

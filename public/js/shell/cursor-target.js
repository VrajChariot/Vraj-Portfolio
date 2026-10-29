// Classifies whatever sits under the pointer into one cursor state.

const TEXT_INPUT = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]';
const INTERACTIVE = 'a[href], button, [role="button"], label[for], summary';

export function describeTarget(node) {
  const element = node instanceof Element ? node : null;
  const deep = Boolean(element?.closest('[data-theme="deep"]'));
  if (!element) return { mode: 'idle', deep };
  if (element.closest(TEXT_INPUT)) return { mode: 'text', deep };
  const labelled = element.closest('[data-cursor]');
  if (labelled) return { mode: 'label', label: labelled.dataset.cursor, element: labelled, deep };
  const interactive = element.closest(INTERACTIVE);
  if (interactive) return { mode: 'hover', element: interactive, deep };
  return { mode: 'idle', deep };
}

export const magneticOf = (node) => (node instanceof Element ? node.closest('[data-magnetic]') : null);

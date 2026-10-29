// Cross-links each panel's stack key with the marked terms in its description.
// Mouse: hover lights a term. Keyboard: focus lights it. Touch: tap toggles, tap elsewhere clears.

const SCOPE = '[data-work-annotations]';
const TERM = '[data-term]';

function light(scope, term) {
  scope.classList.toggle('has-active', term !== null);
  scope.querySelectorAll(TERM).forEach((el) => el.classList.toggle('is-lit', el.dataset.term === term));
}

const clear = (scope) => light(scope, null);

const termAt = (target) => {
  const el = target.closest(TERM);
  return el ? { el, scope: el.closest(SCOPE), term: el.dataset.term } : null;
};

export function bindHighlight(index) {
  let pinned = null; // { scope, term } set by a tap
  let lastPointer = 'mouse';

  const clearAll = () => index.querySelectorAll(`${SCOPE}.has-active`).forEach(clear);

  index.addEventListener('pointerdown', (event) => {
    lastPointer = event.pointerType;
  });

  index.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const hit = termAt(event.target);
    if (hit) light(hit.scope, hit.term);
  });

  index.addEventListener('pointerout', (event) => {
    if (event.pointerType !== 'mouse') return;
    const hit = termAt(event.target);
    if (hit && !hit.el.contains(event.relatedTarget)) clear(hit.scope);
  });

  index.addEventListener('focusin', (event) => {
    const hit = termAt(event.target);
    if (hit) light(hit.scope, hit.term);
  });

  index.addEventListener('focusout', (event) => {
    const hit = termAt(event.target);
    if (hit && lastPointer !== 'touch') clear(hit.scope);
  });

  // Taps pin a term until the same key or anything else is tapped.
  document.addEventListener('click', (event) => {
    if (lastPointer !== 'touch') return;
    const hit = termAt(event.target);
    const key = hit && hit.el.matches('button') ? hit : null;
    const repeat = key && pinned && pinned.scope === key.scope && pinned.term === key.term;
    clearAll();
    pinned = key && !repeat ? { scope: key.scope, term: key.term } : null;
    if (pinned) light(pinned.scope, pinned.term);
  });

  return {
    clear(scope) {
      clear(scope);
      if (pinned?.scope === scope) pinned = null;
    },
  };
}

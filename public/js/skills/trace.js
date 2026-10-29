// Which skill or source the visitor is pointing at, and what it connects to.

const TARGET = '[data-skill], [data-source]';

const toTarget = (el) => {
  if (!el) return null;
  return el.hasAttribute('data-skill') ? { kind: 'skill', id: el.id } : { kind: 'source', id: el.dataset.source };
};

// Skill → source pairs read once from the markup.
export function readLinks(field) {
  return [...field.querySelectorAll('[data-skill]')].flatMap((el) =>
    el.dataset.evidence.split(' ').map((source) => ({ skill: el.id, source })),
  );
}

export const linksFor = (links, target) =>
  target ? links.filter((link) => link[target.kind] === target.id) : [];

// Light every skill and source taking part in `active` links; dim the rest.
export function highlight(field, active) {
  const skills = new Set(active.map((link) => link.skill));
  const sources = new Set(active.map((link) => link.source));
  field.classList.toggle('is-tracing', active.length > 0);
  field.querySelectorAll('[data-skill]').forEach((el) => el.classList.toggle('is-lit', skills.has(el.id)));
  field.querySelectorAll('[data-source]').forEach((el) => el.classList.toggle('is-lit', sources.has(el.dataset.source)));
}

// Report the hovered target, falling back to the focused one. Returns a cleanup function.
export function watchTarget(field, onChange) {
  let hovered = null;
  let focused = null;
  let current = null;

  const emit = () => {
    const next = hovered ?? focused;
    if (next?.kind === current?.kind && next?.id === current?.id) return;
    current = next;
    onChange(current);
  };

  const listeners = {
    pointerover: (event) => {
      hovered = toTarget(event.target.closest(TARGET));
      emit();
    },
    pointerleave: () => {
      hovered = null;
      emit();
    },
    focusin: (event) => {
      focused = toTarget(event.target.closest(TARGET));
      emit();
    },
    focusout: (event) => {
      if (!field.contains(event.relatedTarget)) focused = null;
      emit();
    },
  };

  Object.entries(listeners).forEach(([type, listener]) => field.addEventListener(type, listener));
  return () => {
    Object.entries(listeners).forEach(([type, listener]) => field.removeEventListener(type, listener));
    onChange(null);
  };
}

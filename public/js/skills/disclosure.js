// Tapping or clicking a skill toggles its inline "Used in …" line.

export function initDisclosure(field) {
  field.addEventListener('click', (event) => {
    const button = event.target.closest('[data-skill]');
    if (!button) return;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
  });
}

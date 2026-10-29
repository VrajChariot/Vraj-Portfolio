// Work index: toggles rows from their buttons, opens the row named in the URL hash, and
// cross-links each open panel's stack key with the terms marked in its description.
import { prefersReducedMotion } from '../core/motion.js';
import { createAccordion } from '../work/accordion.js';
import { bindHighlight } from '../work/highlight.js';

const index = document.querySelector('[data-work-index]');

if (index) {
  const rows = [...index.querySelectorAll('[data-work-row]')];
  const highlight = bindHighlight(index);
  const accordion = createAccordion(rows, {
    onChange: (row) => {
      if (!row.classList.contains('is-open')) highlight.clear(row.querySelector('[data-work-annotations]'));
    },
  });
  const rowFor = (hash) => rows.find((row) => `#${row.id}` === hash);

  function reveal(hash) {
    const row = rowFor(hash);
    if (!row) return;
    accordion.open(row, { instant: true });
    row.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  index.addEventListener('click', (event) => {
    const toggle = event.target.closest('[aria-controls]');
    if (toggle) accordion.toggle(toggle.closest('[data-work-row]'));
  });

  // Same-hash links elsewhere on the page do not fire `hashchange`, so catch them on click too.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#work-"]');
    if (link && link.hash === location.hash) reveal(link.hash);
  });

  window.addEventListener('hashchange', () => reveal(location.hash));
  reveal(location.hash);
}

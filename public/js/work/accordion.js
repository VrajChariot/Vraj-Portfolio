// Open/close state for the project index. One row open at a time.

const toggleOf = (row) => row.querySelector('[aria-controls]');

function setOpen(row, open, { instant = false } = {}) {
  const toggle = toggleOf(row);
  if (instant) row.classList.add('is-instant');
  row.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.dataset.cursor = open ? 'Close' : 'Open';
  if (instant) {
    void row.offsetHeight; // commit the new state before transitions come back
    row.classList.remove('is-instant');
  }
}

// `onChange(row)` runs after a row opens or closes.
export function createAccordion(rows, { onChange = () => {} } = {}) {
  const isOpen = (row) => row.classList.contains('is-open');

  const set = (row, open, options) => {
    setOpen(row, open, options);
    onChange(row);
  };

  // `instant` skips the collapse animation of the other rows so the opened row stays put.
  function open(row, { instant = false } = {}) {
    rows.filter((other) => other !== row && isOpen(other)).forEach((other) => set(other, false, { instant }));
    if (!isOpen(row)) set(row, true);
  }

  function toggle(row) {
    if (isOpen(row)) set(row, false);
    else open(row);
  }

  return { open, toggle };
}

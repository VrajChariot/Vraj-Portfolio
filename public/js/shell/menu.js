// Full-screen mobile menu: open/close, focus trap, Escape, scroll lock.

const FOCUSABLE = 'a[href], button:not([disabled])';

export function initMenu({ toggle, menu, close }) {
  let opener = null;

  const focusables = () => [...menu.querySelectorAll(FOCUSABLE)];

  const onKey = (event) => {
    if (event.key === 'Escape') {
      hide();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function show() {
    opener = document.activeElement;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    focusables()[0]?.focus();
  }

  function hide({ restoreFocus = true } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (restoreFocus) opener?.focus();
  }

  toggle.addEventListener('click', show);
  close.addEventListener('click', () => hide());
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) hide({ restoreFocus: false });
  });
  matchMedia('(min-width: 48rem)').addEventListener('change', (event) => {
    if (event.matches) hide({ restoreFocus: false });
  });
}

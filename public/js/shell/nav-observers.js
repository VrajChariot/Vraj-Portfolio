// Scroll-linked nav state: current section, deep-theme overlap, scrolled/hidden.

const SCROLL_DELTA = 6;

export function observeCurrentSection(links) {
  const byId = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute('aria-current'));
        links
          .filter((link) => link.getAttribute('href') === `#${entry.target.id}`)
          .forEach((link) => link.setAttribute('aria-current', 'true'));
      });
      if (window.scrollY < 10) links.forEach((link) => link.removeAttribute('aria-current'));
    },
    { rootMargin: '-45% 0px -54% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
  return observer;
}

// Flags the nav as deep while any [data-theme="deep"] area sits under its bar.
export function observeDeepOverlap(nav) {
  const areas = [...document.querySelectorAll('[data-theme="deep"]')];
  const under = new Set();
  let observer = null;

  const build = () => {
    observer?.disconnect();
    under.clear();
    const barHeight = nav.offsetHeight;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? under.add(entry.target) : under.delete(entry.target)));
        nav.classList.toggle('is-deep', under.size > 0);
      },
      { rootMargin: `0px 0px ${barHeight - window.innerHeight}px 0px` },
    );
    areas.forEach((area) => observer.observe(area));
  };

  build();
  window.addEventListener('resize', build, { passive: true });
}

export function trackScrollDirection(nav, isLocked) {
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (isLocked()) return;
    if (Math.abs(y - lastY) < SCROLL_DELTA) return;
    nav.classList.toggle('is-hidden', y > lastY && y > nav.offsetHeight && !nav.contains(document.activeElement));
    lastY = y;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  update();
}

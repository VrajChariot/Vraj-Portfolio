// Navigation bar: reveal after intro, scroll states, current section, mobile menu.
import { onIntroDone } from './core/motion.js';
import { initMenu } from './shell/menu.js';
import { observeCurrentSection, observeDeepOverlap, trackScrollDirection } from './shell/nav-observers.js';

const nav = document.querySelector('[data-nav]');
const menu = document.querySelector('[data-nav-menu]');

onIntroDone(() => nav.classList.add('is-visible'));
observeCurrentSection([...document.querySelectorAll('[data-nav-link]')]);
observeDeepOverlap(nav);
trackScrollDirection(nav, () => !menu.hidden);
initMenu({
  toggle: nav.querySelector('[data-nav-toggle]'),
  menu,
  close: menu.querySelector('[data-nav-close]'),
});

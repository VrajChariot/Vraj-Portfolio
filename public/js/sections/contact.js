// Contact section: copy-email button and the message form.
import { initCopyEmail } from '../shell/copy-email.js';
import { initContactForm } from '../shell/contact-form.js';

document.querySelectorAll('[data-copy-email]').forEach(initCopyEmail);
document.querySelectorAll('[data-contact-form]').forEach(initContactForm);

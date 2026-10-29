// Contact form: posts JSON to web3forms and reports progress in an aria-live region.

const ENDPOINT = 'https://api.web3forms.com/submit';

function payload(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    access_key: form.dataset.key,
    subject: `Portfolio message from ${data.name}`,
    from_name: data.name,
    name: data.name,
    email: data.email,
    message: data.message,
    botcheck: Boolean(data.botcheck),
  };
}

async function send(form) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload(form)),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || `The server answered ${response.status}.`);
}

const failureReason = (error) =>
  error instanceof TypeError ? 'The message could not reach the server.' : error.message;

export function initContactForm(form) {
  const status = form.querySelector('[data-contact-status]');
  const button = form.querySelector('[type="submit"]');

  const report = (state, text) => {
    status.dataset.state = state;
    status.textContent = text;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    report('sending', 'Sending…');
    try {
      await send(form);
      form.reset();
      report('sent', 'Message sent.');
    } catch (error) {
      report('error', `${failureReason(error)} Please email ${form.dataset.email} instead.`);
    } finally {
      button.disabled = false;
    }
  });
}

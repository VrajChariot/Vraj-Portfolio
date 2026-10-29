// "Copy email" button that confirms with "Copied" and then resets.

const RESET_MS = 2000;

export function initCopyEmail(button) {
  const idle = button.textContent;
  let timer = 0;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Copy failed';
    }
    clearTimeout(timer);
    timer = setTimeout(() => (button.textContent = idle), RESET_MS);
  });
}

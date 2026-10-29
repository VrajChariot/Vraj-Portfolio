// The text that streams along the wave: the hero's own signal source,
// fetched at runtime and flattened into one line of code.

const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;
// A `//` not preceded by `:` so URLs in strings survive.
const LINE_COMMENT = /(^|[^:])\/\/.*$/gm;

export const normaliseSource = (source) =>
  source.replace(BLOCK_COMMENT, ' ').replace(LINE_COMMENT, '$1').replace(/\s+/g, ' ').trim();

// Resolves to the flattened source, or null when it cannot be fetched.
export async function loadSource(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return normaliseSource(await response.text()) || null;
  } catch {
    return null;
  }
}

// Find each stack item in a project's description and split the text into marked segments.

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ACRONYM = /^[A-Z0-9]{2,}$/;

// The spellings an item may appear as in prose.
function variantsOf(item) {
  const forms = new Set([item]);
  if (/s$/i.test(item)) forms.add(item.slice(0, -1));
  for (const form of [...forms]) {
    forms.add(form.replace(/ /g, '-'));
    forms.add(form.replace(/-/g, ' '));
  }
  const words = item.split(/\s+/);
  if (words.length > 1 && ACRONYM.test(words[0])) forms.add(words[0]);
  return [...forms];
}

// One case-insensitive pattern of every variant, longest first so the longest match
// wins at any position; matches are whole words and never overlap.
function matcherFor(stack) {
  const termOf = new Map();
  stack.forEach((item, term) => {
    variantsOf(item).forEach((variant) => {
      const key = variant.toLowerCase();
      if (!termOf.has(key)) termOf.set(key, term);
    });
  });
  const alternatives = [...termOf.keys()].sort((a, b) => b.length - a.length).map(escape);
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  return { pattern, termOf };
}

function segmentsOf(line, { pattern, termOf }, mentions) {
  const segments = [];
  let cursor = 0;
  for (const match of line.matchAll(pattern)) {
    const term = termOf.get(match[0].toLowerCase());
    if (match.index > cursor) segments.push({ text: line.slice(cursor, match.index), term: null });
    segments.push({ text: match[0], term });
    mentions[term] += 1;
    cursor = match.index + match[0].length;
  }
  if (cursor < line.length) segments.push({ text: line.slice(cursor), term: null });
  return segments;
}

// `lines`: description paragraphs; `stack`: item names.
// Returns `{ lines: segments[][], mentions: number[] }` with `mentions` indexed like `stack`.
export function annotate(lines, stack) {
  const mentions = stack.map(() => 0);
  if (stack.length === 0) return { lines: lines.map((text) => [{ text, term: null }]), mentions };
  const matcher = matcherFor(stack);
  return { lines: lines.map((line) => segmentsOf(line, matcher, mentions)), mentions };
}

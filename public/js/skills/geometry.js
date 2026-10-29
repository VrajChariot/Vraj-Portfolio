// Cached positions for skill and source anchors, plus the connector curve.
// Skills are stored relative to the field, sources relative to the sticky panel,
// so scrolling only moves the panel and never needs a fresh layout read.

const UNDERLINE_DROP = 4;
const SOURCE_GAP = 12;

const midY = (rect, origin) => rect.top - origin.top + rect.height / 2;

export function measure(field, panel) {
  const fieldRect = field.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const aside = panel.parentElement.getBoundingClientRect();
  const style = getComputedStyle(panel);

  const skills = new Map();
  field.querySelectorAll('[data-skill]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    skills.set(el.id, {
      left: rect.left - fieldRect.left,
      x: rect.right - fieldRect.left,
      y: rect.bottom - fieldRect.top - UNDERLINE_DROP,
    });
  });

  const sources = new Map();
  panel.querySelectorAll('[data-source]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    sources.set(el.dataset.source, { x: rect.left - panelRect.left - SOURCE_GAP, y: midY(rect, panelRect) });
  });

  return {
    skills,
    sources,
    panelLeft: panelRect.left - fieldRect.left,
    asideTop: aside.top - fieldRect.top,
    travel: Math.max(0, aside.height - panelRect.height),
    stickyTop: style.position === 'sticky' ? parseFloat(style.top) || 0 : null,
  };
}

// Where the sticky panel sits inside its column for a given field position in the viewport.
export function panelOffset(cache, fieldViewportTop) {
  if (cache.stickyTop === null) return 0;
  const offset = cache.stickyTop - (fieldViewportTop + cache.asideTop);
  return Math.min(Math.max(offset, 0), cache.travel);
}

export function sourcePoint(cache, sourceId, offset) {
  const point = cache.sources.get(sourceId);
  return { x: cache.panelLeft + point.x, y: cache.asideTop + offset + point.y };
}

// Underline the skill, then leave it on a horizontal-tangent cubic towards the source.
export function connectorPath(from, to) {
  const pull = Math.max(Math.abs(to.x - from.x) * 0.5, 48);
  return `M${from.left},${from.y} H${from.x} C${from.x + pull},${from.y} ${to.x - pull},${to.y} ${to.x},${to.y}`;
}

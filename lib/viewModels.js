// Map raw Mongo documents to the shapes the templates render.

const TITLE_SEPARATOR = /\s+[–—-]\s+/;
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toLines = (text = '') =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export function toProjectView(doc) {
  const [name, kind = ''] = doc.title.split(TITLE_SEPARATOR);
  return {
    id: `work-${slugify(name)}`,
    title: doc.title,
    name,
    kind,
    summary: toLines(doc.ProjectDesc),
    stack: doc.techStack ?? [],
    github: doc.Github || null,
    demo: doc.LiveDemo || null,
  };
}

export function toExperienceView(doc) {
  const start = new Date(doc.startDate);
  const end = doc.endDate ? new Date(doc.endDate) : null;
  // Fractional months since year 0 (UTC), so the timeline can be drawn to true scale.
  const toMonth = (date) => date.getUTCFullYear() * 12 + date.getUTCMonth() + (date.getUTCDate() - 1) / 31;
  // Split each line after its leading clause (up to the first colon or semicolon) so it scans.
  const toPoint = (line) => {
    const [, lead, rest = ''] = line.match(/^(.*?[:;])\s+(.*)$/) ?? [, line];
    return { lead, rest };
  };
  const summary = toLines(doc.expDesc);
  return {
    id: `exp-${slugify(doc.company)}`,
    role: doc.expTitle,
    company: doc.company,
    companyShort: doc.company.replace(/\s*\(.*\)\s*/, ''),
    start,
    end,
    current: end === null,
    period: `${monthYear.format(start)} – ${end ? monthYear.format(end) : 'present'}`,
    summary,
    points: summary.map(toPoint),
    startMonth: toMonth(start),
    endMonth: toMonth(end ?? new Date()),
  };
}

// Everything a skill can be evidenced by: projects, roles, and this site itself.
export function toEvidenceSources(projects, experience, colophon) {
  return [
    ...projects.map((p) => ({ id: p.id, label: p.name, text: [p.title, ...p.summary, ...p.stack].join(' ') })),
    ...experience.map((e) => ({ id: e.id, label: e.companyShort, text: [e.role, ...e.summary].join(' ') })),
    { id: 'colophon', label: 'This site', text: colophon },
  ];
}

// Attach to each skill the sources whose text mentions it.
export function withSkillEvidence(skillGroups, sources) {
  return skillGroups.map((group) => ({
    ...group,
    skills: group.skills.map(({ name, match }) => {
      const patterns = match.map((m) => new RegExp(m, 'i'));
      const evidence = sources
        .filter((s) => patterns.some((re) => re.test(s.text)))
        .map(({ id, label }) => ({ id, label }));
      return { name, id: `skill-${slugify(name)}`, evidence };
    }),
  }));
}

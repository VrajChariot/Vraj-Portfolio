// Map raw Mongo documents to the shapes the templates render.

import { annotate } from './annotate.js';

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

// `annotated` holds each description line as segments, with stack items marked by index.
export function toProjectView(doc) {
  const [name, kind = ''] = doc.title.split(TITLE_SEPARATOR);
  const summary = toLines(doc.ProjectDesc);
  const stack = doc.techStack ?? [];
  const { lines, mentions } = annotate(summary, stack);
  return {
    id: `work-${slugify(name)}`,
    title: doc.title,
    name,
    kind,
    summary,
    annotated: lines,
    stack: stack.map((item, i) => ({ name: item, mentions: mentions[i] })),
    github: doc.Github || null,
    demo: doc.LiveDemo || null,
  };
}

// Fractional months since year 0 (UTC), so timelines can be drawn to true scale.
const toMonth = (date) => date.getUTCFullYear() * 12 + date.getUTCMonth() + (date.getUTCDate() - 1) / 31;

// Split a line after its leading clause (up to the first colon or semicolon) so it scans.
const toPoint = (line) => {
  const [, lead, rest = ''] = line.match(/^(.*?[:;])\s+(.*)$/) ?? [, line];
  return { lead, rest };
};

export function toExperienceView(doc) {
  const start = new Date(doc.startDate);
  const end = doc.endDate ? new Date(doc.endDate) : null;
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

export function toEducationView(doc) {
  const now = new Date();
  const start = new Date(doc.startDate);
  const end = doc.endDate ? new Date(doc.endDate) : null;
  const expected = end !== null && end > now;
  const endLabel = end ? monthYear.format(end) : 'present';
  const summary = toLines(doc.eduDesc);
  return {
    id: `edu-${slugify(doc.institution)}`,
    degree: doc.degree,
    institution: doc.institution,
    location: doc.location || '',
    start,
    end,
    current: end === null || expected,
    expected,
    period: `${monthYear.format(start)} – ${expected ? 'expected ' : ''}${endLabel}`,
    summary,
    points: summary.map(toPoint),
    endLabel,
    startMonth: toMonth(start),
    // Planned end; may lie in the future.
    endMonth: toMonth(end ?? now),
    // How far the degree has actually run.
    progressMonth: toMonth(expected || !end ? now : end),
  };
}

// Everything a skill can be evidenced by: projects, roles, and this site itself.
export function toEvidenceSources(projects, experience, colophon) {
  return [
    ...projects.map((p) => ({ id: p.id, label: p.name, text: [p.title, ...p.summary, ...p.stack.map((s) => s.name)].join(' ') })),
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

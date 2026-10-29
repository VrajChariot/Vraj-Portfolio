# Vraj Shah, portfolio

Personal site of Vraj Shah, AI engineer and full-stack developer. Live at [vrajdev.vercel.app](https://vrajdev.vercel.app/).

Projects and experience are stored in MongoDB and rendered server-side with EJS. Styling is Tailwind CSS v4; client behaviour is plain ES modules with no bundler and no front-end dependencies.

## Stack

- Node.js, Express 5, EJS
- MongoDB via Mongoose
- Tailwind CSS v4 (CSS-first config)
- Vercel (hosting and analytics)

## Structure

```text
main.js                  Express server: loads data, maps it to view models, renders the page
models/                  Mongoose models for projects and experience
data/profile.js          Name, intro, links, contact form key
data/skills.js           Skill groups and the patterns used to find evidence for each skill
lib/viewModels.js        Maps Mongo documents to template data; links skills to projects and roles
lib/signature.js         Deterministic waveform path for each project, derived from its title
views/index.ejs          Page layout
views/partials/          head, nav, footer, cursor
views/sections/          hero, about, work, experience, skills, contact
styles/input.css         Tailwind entry; imports tokens, base, and one file per section/component
styles/tokens.css        Design tokens (colour, type, easing); the default palette is disabled
public/js/core/          Shared motion helpers and the intro contract
public/js/               Section and component scripts, one module per responsibility
public/output.css        Compiled CSS (committed, Vercel serves it as-is)
```

## Setup

```bash
npm install
```

Create `.env`:

```bash
MONGODB_URI=<your MongoDB connection string>
PORT=8000
```

## Develop

```bash
npm run watch:css   # rebuild public/output.css on change
npm run dev         # server with reload on http://localhost:8000
```

Run `npm run build` before committing so `public/output.css` matches the templates.

## Deploy

Vercel builds `main.js` with `@vercel/node` (see `vercel.json`). Set `MONGODB_URI` in the project settings, then:

```bash
vercel
```

## Contact

- Email: [vraj0410shah@gmail.com](mailto:vraj0410shah@gmail.com)
- LinkedIn: [linkedin.com/in/vrajshah04](https://www.linkedin.com/in/vrajshah04)
- GitHub: [github.com/VrajChariot](https://github.com/VrajChariot)

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PorfoliolData } from './models/ProjectData.js';
import { ExpData } from './models/ExpData.js';
import { profile } from './data/profile.js';
import { skillGroups } from './data/skills.js';
import { projectFlows } from './data/projectFlows.js';
import { toProjectView, toExperienceView, toEvidenceSources, withSkillEvidence } from './lib/viewModels.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

try {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB:', conn.connection.name);
} catch (error) {
  console.error('MongoDB connection error:', error);
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const [projectDocs, experienceDocs] = await Promise.all([
    PorfoliolData.find({}).sort({ _id: -1 }).lean(),
    ExpData.find({}).sort({ _id: -1 }).lean(),
  ]);
  const projects = projectDocs.map((doc) => toProjectView(doc, projectFlows));
  const experience = experienceDocs.map(toExperienceView);

  res.render('index', {
    profile,
    projects,
    experience,
    skillGroups: withSkillEvidence(skillGroups, toEvidenceSources(projects, experience, profile.colophon)),
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Portfolio listening on http://localhost:${port}`);
  });
}

export default app;

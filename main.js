import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PorfoliolData } from './models/ProjectData.js';
import {ExpData} from './models/ExpData.js';


import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// === SECTION 2: Define __filename and __dirname for ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express()
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

try {
  let connDB = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB:', connDB.connection.name);
} catch (error) {
  console.error('MongoDB connection error:', error);
}


// === SECTION 3: Use path.join for serving static files from 'public' ===
app.use(express.static(path.join(__dirname, 'public')));

// === SECTION 4: Explicitly set the 'views' directory and 'view engine' ===
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  console.log('express is ready!');
  const projects = await PorfoliolData.find({}).sort({ _id: -1 });
  console.log('Projects fetched:', projects);
  const experience = await ExpData.find({}).sort({ _id: -1 });
  console.log('Experience fetched:', experience);
  res.render('index', {
    title: "Vraj shah",
    projects: projects,
    experience: experience
});
})

if (!process.env.VERCEL) { // Or process.env.NODE_ENV !== 'production'
  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
}

export default app; 
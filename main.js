import express from 'express'
import mongoose from 'mongoose';
import { PorfoliolData } from './models/ProjectData.js';
import {ExpData} from './models/ExpData.js';

const app = express()
const port = 3000

let connDB = await mongoose.connect('mongodb://localhost:27017/VrajPortfolio');
console.log('Connected to MongoDB:', connDB.connection.name);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  console.log('express is ready!');
  const projects = await PorfoliolData.find({}).sort({ _id: -1 });
  console.log('Projects fetched:', projects);
  res.render('index', {
    title: "Vraj shah",
    projects: projects,
});
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

import mongoose from "mongoose";

const PortfolioDataSchema = new mongoose.Schema({
    title: String,
    ProjectDesc: String,
    Github: String,
    LiveDemo: String,
    techStack: [String]
  });

export const PorfoliolData = mongoose.model('Project-Detail', PortfolioDataSchema);
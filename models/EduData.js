import mongoose from "mongoose";

const EduDataSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    location: String,
    startDate: Date,
    endDate: Date,
    eduDesc: String
  });

export const EduData = mongoose.model('Edu-Detail', EduDataSchema);

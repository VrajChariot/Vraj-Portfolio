import mongoose from "mongoose";

const ExpDataSchema = new mongoose.Schema({
    expTitle: String,
    company: String,
    startDate: Date,
    endDate: Date,
    expDesc: String
  });

export const ExpData = mongoose.model('Exp-Detail', ExpDataSchema);
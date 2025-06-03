import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  roll: { type: String, unique: true },
  gender: String,
  mobile: String,
  stream: String,
  dob: String,
  avgMarks: Number
});

export default mongoose.model("Student", studentSchema);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Student from "./models/Student.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/students/:roll", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate({ roll: req.params.roll }, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/students/:roll", async (req, res) => {
  await Student.findOneAndDelete({ roll: req.params.roll });
  res.json({ message: "Student deleted" });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

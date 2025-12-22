import express from "express";
import cors from "cors";
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getStudentFees,
  updateFeeStatus,
} from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- STUDENTS ---------- */

// READ
app.get("/students", async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
    console.log(students);
  } catch {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// CREATE
app.post("/students", async (req, res) => {
  try {
    console.log("receied");
    await addStudent(req.body);
    res.json({ message: "Student added successfully" });
    console.log(req.body);
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try {
    await updateStudent(req.params.id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    await deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

/* ---------- FEES ---------- */

// READ
app.get("/fees/:studentId", async (req, res) => {
  try {
    const fees = await getStudentFees(req.params.studentId);
    res.json(fees);
  } catch {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

// UPDATE (Mark Paid / Unpaid)
app.put("/fees/:id", async (req, res) => {
  try {
    await updateFeeStatus(req.params.id, req.body.status);
    res.json({ message: "Fee status updated" });
  } catch {
    res.status(500).json({ error: "Failed to update fee status" });
  }
});

app.listen(8081, () => {
  console.log("🚀 Server running on port 8081");
});

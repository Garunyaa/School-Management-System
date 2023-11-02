import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  submitted_work: [{ data: Buffer, content_type: String }],
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);

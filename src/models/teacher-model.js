import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  auth_token: { type: String },
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Teacher = mongoose.model("Teacher", teacherSchema);

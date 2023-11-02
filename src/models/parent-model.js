import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  auth_token: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  messages: [{ type: String }],
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Parent = mongoose.model("Parent", parentSchema);

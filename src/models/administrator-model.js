import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Administrator = mongoose.model("Administrator", adminSchema);

import express from "express";
import { connectDB } from "./configs/db";
import dotenv from "dotenv";
import adminRoutes from "./routes/administrator-routes";
import teacherRoutes from "./routes/teacher-routes";
import studentRoutes from "./routes/student-routes";
import parentRoutes from "./routes/parent-routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(express.static('uploads'))

app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/parent", parentRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

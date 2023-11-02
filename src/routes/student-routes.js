import express from "express";
import {
  studentLogin,
  getClassInformation,
  viewAssignments,
  submitWork,
  viewGrades,
  viewAttendance,
  getDaySchedule,
  // viewStudents,
  // viewClassDetails,
} from "../controllers/student/student-controller";
import { authTokenForStudent } from "../middlewares/auth-middleware";
import { loginValidator } from "../middlewares/validations/login-validation";
import { studentIdValidator } from "../middlewares/validations/student-validation";
import { paramsIdValidator } from "../middlewares/validations/parent-validation";

const router = express.Router();

router.post("/student-login", loginValidator, studentLogin);
router.get(
  "/view-class/:id",
  authTokenForStudent,
  studentIdValidator,
  getClassInformation
);
router.get(
  "/assignments/:id",
  authTokenForStudent,
  studentIdValidator,
  viewAssignments
);
router.post(
  "/submit-work/:id",
  authTokenForStudent,
  studentIdValidator,
  submitWork
);
router.post(
  "/get-schedule/:id",
  authTokenForStudent,
  paramsIdValidator,
  getDaySchedule
);
router.get("/grades/:id", authTokenForStudent, studentIdValidator, viewGrades);
router.get(
  "/attendance/:id",
  authTokenForStudent,
  studentIdValidator,
  viewAttendance
);
// router.get("/view-students", viewStudents);
// router.get("/view-class/:id", viewClassDetails);

export default router;

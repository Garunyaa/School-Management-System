import express from "express";
import {
  teacherLogin,
  giveAssignments,
  scheduleExam,
  sendMessageToParent,
} from "../controllers/teacher/teacher-controller";
import {
  viewClasses,
  addStudentToClass,
  removeStudentFromClass,
} from "../controllers/teacher/class-controller";
import {
  defineSubject,
  updateSubject,
  removeSubject,
  listAllSubjects,
  uploadMaterial,
} from "../controllers/teacher/subject-controller";
import {
  inputGrades,
  updateGrade,
  listGrades,
} from "../controllers/teacher/grade-controller";
import {
  markAttendance,
  updateAttendance,
  listAttendance,
  listAttendanceByClass,
} from "../controllers/teacher/attendance-controller";
import { authTokenForTeacher } from "../middlewares/auth-middleware";
import { loginValidator } from "../middlewares/validations/login-validation";
import { paramsIdValidator } from "../middlewares/validations/parent-validation";
import { studentClassValidator } from "../middlewares/validations/teacher-validation";
import {
  subjectIdValidator,
  editSubjectIdValidator,
} from "../middlewares/validations/subject-validation";
import { editSubjectValidator } from "../middlewares/validations/update-validation";
import { assignmentValidator } from "../middlewares/validations/assignment-validation";
import { examValidator } from "../middlewares/validations/exam-validation";
import { gradeValidator } from "../middlewares/validations/grade-validation";
import { updateGradeValidator } from "../middlewares/validations/grade-validation";
import {
  attendanceValidator,
  attendanceIdValidator,
} from "../middlewares/validations/attendance-validation";

const router = express.Router();

// Teacher
router.post("/teacher-login", loginValidator, teacherLogin);

// Classes
router.get(
  "/view-class/:id",
  authTokenForTeacher,
  paramsIdValidator,
  viewClasses
);

router.patch(
  "/add-student/:id",
  authTokenForTeacher,
  studentClassValidator,
  addStudentToClass
);
router.delete(
  "/remove-student/:id",
  authTokenForTeacher,
  studentClassValidator,
  removeStudentFromClass
);

// Subjects
router.post(
  "/define-subject/:id",
  authTokenForTeacher,
  editSubjectValidator,
  defineSubject
);
router.patch(
  "/update-subject/:id",
  authTokenForTeacher,
  editSubjectIdValidator,
  updateSubject
);
router.delete(
  "/remove-subject/:id",
  authTokenForTeacher,
  editSubjectIdValidator,
  removeSubject
);
router.get("/list-subjects/:id", authTokenForTeacher, listAllSubjects);
router.post(
  "/upload-material/:id",
  authTokenForTeacher,
  subjectIdValidator,
  uploadMaterial
);

// Assignments and exams
router.post(
  "/assignments/:id",
  authTokenForTeacher,
  assignmentValidator,
  giveAssignments
);
router.post("/exams/:id", authTokenForTeacher, examValidator, scheduleExam);

// Grades
router.post(
  "/input-grades/:id",
  authTokenForTeacher,
  gradeValidator,
  inputGrades
);
router.patch(
  "/update-grade/:id",
  authTokenForTeacher,
  updateGradeValidator,
  updateGrade
);
router.get("/list-grades/:id", authTokenForTeacher, listGrades);

// Attendance
router.patch(
  "/mark-attendance/:id",
  authTokenForTeacher,
  attendanceValidator,
  markAttendance
);
router.patch(
  "/update-attendance/:id",
  authTokenForTeacher,
  attendanceIdValidator,
  updateAttendance
);
router.get("/list-attendance/:id", authTokenForTeacher, listAttendance);
router.post(
  "/list-class-attendance/:id",
  authTokenForTeacher,
  listAttendanceByClass
);

// Communicate with parent
router.post(
  "/send-message/:id",
  authTokenForTeacher,
  paramsIdValidator,
  sendMessageToParent
);

export default router;

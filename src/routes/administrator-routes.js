import express from "express";
import {
  createAdmin,
  adminLogin,
  defineSubject,
  listAllUsers,
  blockUser,
  unblockUser,
  getUserDetails,
} from "../controllers/admin/administrator-controller";
import {
  addTeacher,
  editTeacher,
  removeTeacher,
  assignClassToTeacher,
  assignSubjectToTeacher,
} from "../controllers/admin/teacher-controller";
import {
  addStudent,
  editStudent,
  removeStudent,
} from "../controllers/admin/student-controller";
import {
  addParent,
  editParent,
  removeParent,
  associateWithChildren,
} from "../controllers/admin/parent-controller";
import {
  addClass,
  updateClass,
  removeClass,
  addSubjectToClass,
  assignStudentToClass,
  listAllClasses,
  listClass,
} from "../controllers/admin/class-controller";
import { authTokenForAdmin } from "../middlewares/auth-middleware";
import {
  adminValidator,
  blockUnblockValidator,
} from "../middlewares/validations/admin-validation";
import { loginValidator } from "../middlewares/validations/login-validation";
import { subjectValidator } from "../middlewares/validations/subject-validation";
import {
  teacherValidator,
  teacherIdValidator,
  assignClassValidator,
  assignSubjectValidator,
} from "../middlewares/validations/teacher-validation";
import {
  studentValidator,
  studentIdValidator,
} from "../middlewares/validations/student-validation";
import {
  parentValidator,
  parentIdValidator,
  associateChildValidator,
  paramsIdValidator,
} from "../middlewares/validations/parent-validation";
import {
  classValidator,
  classIdValidator,
  updateClassValidator,
  addSubjectValidator,
  addStudentValidator,
} from "../middlewares/validations/class-validation";
import {
  editParentValidator,
  editStudentValidator,
  editTeacherValidator,
} from "../middlewares/validations/update-validation";

const router = express.Router();

//  Admin
router.post("/create-admin", adminValidator, createAdmin);
router.post("/admin-login", loginValidator, adminLogin);

// Teachers
router.post("/add-teacher", authTokenForAdmin, teacherValidator, addTeacher);
router.patch(
  "/edit-teacher/:id",
  authTokenForAdmin,
  editTeacherValidator,
  editTeacher
);
router.delete(
  "/remove-teacher/:id",
  authTokenForAdmin,
  teacherIdValidator,
  removeTeacher
);
router.patch(
  "/assign-class",
  authTokenForAdmin,
  assignClassValidator,
  assignClassToTeacher
);
router.patch(
  "/assign-subject",
  authTokenForAdmin,
  assignSubjectValidator,
  assignSubjectToTeacher
);

// Students
router.post("/add-student", authTokenForAdmin, studentValidator, addStudent);
router.patch(
  "/edit-student/:id",
  authTokenForAdmin,
  editStudentValidator,
  editStudent
);
router.delete(
  "/remove-student/:id",
  authTokenForAdmin,
  studentIdValidator,
  removeStudent
);

// Parents
router.post("/add-parent", authTokenForAdmin, parentValidator, addParent);
router.patch(
  "/edit-parent/:id",
  authTokenForAdmin,
  editParentValidator,
  editParent
);
router.delete(
  "/remove-parent/:id",
  authTokenForAdmin,
  parentIdValidator,
  removeParent
);
router.patch(
  "/associate-children",
  authTokenForAdmin,
  associateChildValidator,
  associateWithChildren
);

// Class
router.post("/add-class", authTokenForAdmin, classValidator, addClass);
router.patch(
  "/update-class/:id",
  authTokenForAdmin,
  updateClassValidator,
  updateClass
);
router.delete(
  "/remove-class/:id",
  authTokenForAdmin,
  classIdValidator,
  removeClass
);
router.patch(
  "/subject-to-class",
  authTokenForAdmin,
  addSubjectValidator,
  addSubjectToClass
);
router.patch(
  "/assign-student",
  authTokenForAdmin,
  addStudentValidator,
  assignStudentToClass
);
router.get("/list-classes", authTokenForAdmin, listAllClasses);
router.get("/list-class", authTokenForAdmin, listClass);

// Subjects
router.post("/add-subject", authTokenForAdmin, subjectValidator, defineSubject);

// Users
router.get("/list-users", authTokenForAdmin, listAllUsers);
router.post("/block-user", authTokenForAdmin, blockUnblockValidator, blockUser);
router.post(
  "/unblock-user",
  authTokenForAdmin,
  blockUnblockValidator,
  unblockUser
);
router.get(
  "/get-user/:id",
  authTokenForAdmin,
  paramsIdValidator,
  getUserDetails
);

export default router;

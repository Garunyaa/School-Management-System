import { Student } from "../../models/student-model";
import { Class } from "../../models/class-model";
import { Grade } from "../../models/grade-model";
import { Assignment } from "../../models/assignment-model";
import { Attendance } from "../../models/attendance-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

// Student Login

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const student = await Student.findOne({ email: email });
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const authToken = jwt.sign(
      { name: student.name, email: student.email, id: student._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    student.auth_token = authToken;
    await student.save();
    const passwordMatch = await bcrypt.compare(password, student.password);
    if (passwordMatch) {
      student.password = undefined;
      return successResponse(res, 200, "Login Successful", student);
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Students accessing information about their class

export const getClassInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const classInfo = await Class.findById(student.class._id)
      .select({ files: 0 })
      .exec();
    if (!classInfo) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Got Class information", classInfo);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// View Assignments

export const viewAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const findClass = await Class.findById(class_id);
    if (!findClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const assignments = await Assignment.find({ class_id: class_id });
    successResponse(res, 200, "Viewing assignments", assignments);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing assignments");
  }
};

// Students submit their work

export const submitWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignment_id } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return errorResponse(res, 404, "Assignment not found");
    }
    const filePath = "C:/Users/chand/Downloads/English - Assignment 1.pdf";

    fs.readFile(filePath, async (error, data) => {
      if (error) {
        return errorResponse(res, 500, "Error reading the file");
      } else {
        const mimeType = "application/pdf";
        if (assignment.class_id.toString() !== student.class.toString()) {
          return errorResponse(
            res,
            400,
            "Assignment doesn't belongs to the student's class"
          );
        }
        assignment.submitted_work = [{ data, content_type: mimeType }];
        assignment.submitted_by = id;
        await assignment.save();
      }
    });
    successResponse(res, 200, "Work submitted successfully", assignment);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error submitting work");
  }
};

// Get particular day schedule

export const getDaySchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const { class_id, day } = req.body;
    const findClass = await Class.findById(class_id).populate(
      "schedule.periods"
    );
    if (!findClass) {
      return errorResponse(res, 400, "Class not found");
    }
    const daySchedule = findClass.schedule.periods.filter(
      (period) => period.day === day
    );
    console.log(daySchedule);
    successResponse(res, 200, "Day Schedule", daySchedule);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// View grades for assignments and exams

export const viewGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const grades = await Grade.findOne({ student_id: id }).select("grade");
    successResponse(res, 200, "Viewing grades", {
      student: student.name,
      grades,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing grades");
  }
};

// Students view their attendance records

export const viewAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const attendanceRecords = await Attendance.findOne({ student_id: id });
    successResponse(res, 200, "Viewing attendance records", {
      student: student.name,
      attendanceRecords,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing attendance records");
  }
};

// export const viewStudents = async (req, res) => {
//   try {
//     const students = await Student.find({
//       section: "A",
//       role: "Student",
//     }).exec();
//     if (!students) {
//       return errorResponse(res, 404, "Not found");
//     }
//     successResponse(res, 200, "Student details", students);
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };

// export const viewClassDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const student = await Student.findById(id).populate("class");
//     successResponse(res, 200, "Student details", student);
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };

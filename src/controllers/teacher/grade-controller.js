import { Student } from "../../models/student-model";
import { Assignment } from "../../models/assignment-model";
import { Exam } from "../../models/exam-model";
import { Grade } from "../../models/grade-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import { Teacher } from "../../models/teacher-model";

// Input Grades for Exams and Assignments

export const inputGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { student_id, assignment_id, exam_id, grade } = req.body;
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return errorResponse(res, 404, "Assignment not found");
    }
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return errorResponse(res, 404, "Exam not found");
    }
    const gradeEntry = new Grade({
      student_id,
      assignment_id,
      exam_id,
      grade,
    });
    student.grades.push(gradeEntry);
    await student.save();
    await gradeEntry.save();
    successResponse(res, 200, "Grade added", gradeEntry);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error inputting grades");
  }
};

// Manage Grades

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { grade_id, student_id, grade } = req.body;
    const student = Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const updatedGrade = await Grade.findByIdAndUpdate(
      grade_id,
      { grade },
      { new: true }
    );
    if (!updatedGrade) {
      return errorResponse(res, 404, "Grade not found");
    }
    successResponse(res, 200, "Grade updated", { grade: updatedGrade });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating grade");
  }
};

export const listGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const grades = await Grade.find();
    successResponse(res, 200, "Listing grades", { grades });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing grades");
  }
};

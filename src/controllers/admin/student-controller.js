import { Student } from "../../models/student-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";

// Add Students

export const addStudent = async (req, res) => {
  try {
    const { student_id, name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      student_id,
      name,
      email,
      password: hashedPassword,
      class: req.body.class,
      section: req.body.section,
    });
    await student.save();
    successResponse(res, 201, "Student added", student);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding student");
  }
};

// Manage Students

export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedStudent) {
      return errorResponse(res, 404, "Student not found");
    }
    successResponse(res, 200, "Student edited", updatedStudent);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error editing Student");
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const removedStudent = await Student.findByIdAndRemove(id);
    if (!removedStudent) {
      return errorResponse(res, 404, "Student not found");
    }
    successResponse(res, 200, "Student removed", removedStudent);
  } catch (error) {
    errorResponse(res, 500, "Error removing Student");
  }
};

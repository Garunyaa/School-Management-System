import { Teacher } from "../../models/teacher-model";
import { Class } from "../../models/class-model";
import { Student } from "../../models/student-model";
import { successResponse, errorResponse } from "../../middlewares/response";

// View assigned Classes

export const viewClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate({
      path: "class",
      select: "standard students",
    });
    successResponse(res, 200, "Viewing classes", teacher.class);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error fetching classes");
  }
};

// Add Student to Class

export const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, student_id } = req.body;

    const teacher = await Teacher.findById(id);
    const findClass = await Class.findById(class_id);
    const student = await Student.findById(student_id);

    if (!teacher || !student || !findClass) {
      return errorResponse(res, 404, "Data not found");
    }
    findClass.students.push(student_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: findClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(res, 200, "Student added to class", {
        addedStudent: student_id,
      });
    } else {
      return errorResponse(res, 400, "Error adding student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Remove Student from Class

export const removeStudentFromClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, student_id } = req.body;

    const teacher = await Teacher.findById(id);
    const findClass = await Class.findById(class_id);

    if (!teacher || !findClass) {
      return errorResponse(res, 404, "Data not found");
    }
    const studentIndex = await findClass.students.indexOf(student_id);
    console.log(studentIndex);
    if (studentIndex === -1) {
      return errorResponse(res, 404, "Student not found");
    }
    findClass.students.splice(studentIndex, 1);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: findClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(res, 200, "Student removed from class", {
        removedStudent: student_id,
      });
    } else {
      return errorResponse(res, 400, "Error adding student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing Student");
  }
};

import { Class } from "../../models/class-model";
import { Student } from "../../models/student-model";
import { Subject } from "../../models/subject-model";
import { successResponse, errorResponse } from "../../middlewares/response";

// Add class

export const addClass = async (req, res) => {
  try {
    const { standard } = req.body;
    const newClass = new Class({ standard });
    await newClass.save();
    successResponse(res, 201, "Class added", newClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding class");
  }
};

// Manage Classes

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedClass = await Class.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedClass) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Class updated", updatedClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating class");
  }
};

export const removeClass = async (req, res) => {
  try {
    const { id } = req.params;
    const removedClass = await Class.findByIdAndRemove(id);
    if (!removedClass) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Class removed", removedClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing class");
  }
};

// List Classes
export const listAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    successResponse(res, 200, "Classes listed", classes);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing Classes");
  }
};

export const listClass = async (req, res) => {
  try {
    const findClass = await Class.find({ standard: "Class 3" }).exec();
    if (!findClass) {
      return errorResponse(res, 404, "Class Not found");
    }
    successResponse(res, 200, "Class details", findClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Add Subjects to Class

export const addSubjectToClass = async (req, res) => {
  try {
    const { class_id, subject_id } = req.body;
    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    const findClass = await Class.findById(class_id);
    if (!findClass) {
      return errorResponse(res, 404, "Class not found");
    }
    if (findClass.subjects.includes(subject_id)) {
      return errorResponse(res, 400, "Subject already assigned");
    }
    findClass.subjects.push(subject_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { subjects: findClass.subjects },
      { new: true }
    );
    if (updateClass) {
      return successResponse(
        res,
        200,
        `Subject ${subject.name} added to ${findClass.standard}`,
        findClass.subjects
      );
    } else {
      return errorResponse(res, 400, "Error adding subject to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Assigning Students to Class

export const assignStudentToClass = async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    const findClass = await Class.findById(class_id);
    if (!findClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    if (findClass.students.includes(student_id)) {
      return errorResponse(res, 400, "Student already assigned");
    }
    findClass.students.push(student_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: findClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(
        res,
        200,
        `Student ${student.name} assigned to ${findClass.standard}`,
        findClass.students
      );
    } else {
      return errorResponse(res, 400, "Error assigning student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

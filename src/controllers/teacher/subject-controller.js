import { Subject } from "../../models/subject-model";
import { Teacher } from "../../models/teacher-model";
import { Class } from "../../models/class-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import multer from "multer";

// Define Subjects

export const defineSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { name, teacher_id } = req.body;
    const subject = new Subject({ name });
    const findTeacher = await Teacher.findById(teacher_id);
    if (!findTeacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    findTeacher.subjects.push(subject._id);
    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacher,
      { subjects: findTeacher.subjects },
      { new: true }
    );
    await subject.save();
    if (updateTeacher) {
      return successResponse(res, 201, "Subject defined", {
        subjects: findTeacher.subjects,
      });
    } else {
      return errorResponse(res, 400, "Error defining Subject");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Manage Subjects

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { subject_id } = req.body;
    const subject = await Subject.findByIdAndUpdate(subject_id, req.body, {
      new: true,
    });
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    successResponse(res, 200, "Subject updated", subject);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating subject");
  }
};

export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { subject_id } = req.body;
    const subject = await Subject.findByIdAndRemove(subject_id);
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    successResponse(res, 200, "Subject removed", { removedSubject: id });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing subject");
  }
};

export const listAllSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const subjects = await Subject.find();
    successResponse(res, 200, "Listing all subjects", subjects);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing subjects");
  }
};

// Upload study materials

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  },
});

const upload = multer({
  storage: storage,
}).single("material");

export const uploadMaterial = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        return errorResponse(res, 400, error.message);
      }
      if (!req.file) {
        return errorResponse(res, 400, "No file uploaded");
      }
      const { id } = req.params;
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return errorResponse(res, 400, "Teacher not found");
      }
      const { class_id } = req.body;
      const findClass = await Class.findById(class_id);
      if (!findClass) {
        return errorResponse(res, 404, "Class not found");
      }
      const newFile = {
        data: req.file.filename,
        content_type: req.file.mimetype,
      };
      findClass.files.push(newFile);
      await findClass.save();
      return successResponse(res, 201, "File uploaded", {
        files: findClass.files,
      });
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error uploading material");
  }
};

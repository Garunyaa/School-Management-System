import Joi from "joi";
import { errorResponse } from "../../middlewares/response";
import { idValidator } from "../../helpers/id-validator";

const studentUpdateValidation = Joi.object({
  student_id: Joi.string(),
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  class: Joi.string(),
  section: Joi.string().valid("A", "B"),
  attendance: { date: Joi.date(), is_present: Joi.boolean().default(false) },
  grades: Joi.string(),
});

const parentUpdateValidation = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  children: Joi.array().items(Joi.string()),
  messages: Joi.array().items(Joi.string()),
});

const teacherUpdateValidation = Joi.object({
  employee_id: Joi.string(),
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  class: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
});

const subjectUpdateValidation = Joi.object({
  name: Joi.string(),
  teacher_id: Joi.string(),
});

export const editStudentValidator = async (req, res, next) => {
  try {
    const { error } = studentUpdateValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const editParentValidator = async (req, res, next) => {
  try {
    const { error } = parentUpdateValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const editTeacherValidator = async (req, res, next) => {
  try {
    const { error } = teacherUpdateValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const editSubjectValidator = async (req, res, next) => {
  try {
    const { error } = subjectUpdateValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

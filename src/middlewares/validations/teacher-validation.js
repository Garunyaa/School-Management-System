import Joi from "joi";
import { idValidator } from "../../helpers/id-validator";
import { errorResponse } from "../../middlewares/response";

const teacherValidation = Joi.object({
  employee_id: Joi.string().required(),
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  auth_token: Joi.string(),
  class: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const teacherValidator = (req, res, next) => {
  try {
    const { error } = teacherValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const teacherIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, "Invalid Teacher ID");
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const assignClassValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.body.class_id && req.body.teacher_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const assignSubjectValidator = async (req, res, next) => {
  try {
    if (
      (await idValidator(req.body.subject_id && req.body.teacher_id)) == true
    ) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const studentClassValidator = async (req, res, next) => {
  try {
    if (
      (await idValidator(
        req.params.id && req.body.class_id && req.body.student_id
      )) == true
    ) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

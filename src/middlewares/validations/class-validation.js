import Joi from "joi";
import { idValidator } from "../../helpers/id-validator";
import { errorResponse } from "../response";

const classValidation = Joi.object({
  standard: Joi.string().required(),
  teachers: Joi.array().items(Joi.string()),
  students: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  schedule: Joi.object({
    days: Joi.array().items(Joi.string()),
    periods: Joi.array().items(
      Joi.object({
        day: Joi.string(),
        start_time: Joi.string(),
        end_time: Joi.string(),
        subject: Joi.string(),
        teacher: Joi.string(),
      })
    ),
  }),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const classValidator = (req, res, next) => {
  try {
    const { error } = classValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const classIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const updateClassValidator = async (req, res, next) => {
  try {
    const { error } = classValidation.validate(req.body);
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

export const addSubjectValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.body.class_id && req.body.subject_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const addStudentValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.body.student_id && req.body.class_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

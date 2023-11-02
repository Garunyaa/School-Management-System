import Joi from "joi";
import { idValidator } from "../../helpers/id-validator";
import { errorResponse } from "../response";

const parentValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  auth_token: Joi.string(),
  children: Joi.array().items(Joi.string()),
  messages: Joi.array().items(Joi.string()),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const parentValidator = (req, res, next) => {
  try {
    const { error } = parentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const parentIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const associateChildValidator = async (req, res, next) => {
  try {
    if (
      (await idValidator(req.body.student_id && req.body.parent_id)) == true
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

export const paramsIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

import Joi from "joi";
import { errorResponse } from "../response";

const assignmentValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  due_date: Joi.date().required(),
  class_id: Joi.string(),
  submitted_work: Joi.string(),
  submitted_by: Joi.string(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const assignmentValidator = (req, res, next) => {
  try {
    const { error } = assignmentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

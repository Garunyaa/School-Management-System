import Joi from "joi";
import { errorResponse } from "../response";

export const examValidation = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  class: Joi.string().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const examValidator = (req, res, next) => {
  try {
    const { error } = examValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

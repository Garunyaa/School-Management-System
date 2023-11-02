import Joi from "joi";
import { errorResponse } from "../../middlewares/response";
import { idValidator } from "../../helpers/id-validator";

const studentValidation = Joi.object({
  student_id: Joi.string().required(),
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  class: Joi.string(),
  section: Joi.string().valid("A", "B").required(),
  auth_token: Joi.string(),
  grades: Joi.string(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const studentValidator = (req, res, next) => {
  try {
    const { error } = studentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const studentIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, "Invalid Student ID");
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

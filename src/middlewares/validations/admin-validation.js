import Joi from "joi";
import { errorResponse } from "../../middlewares/response";
import { idValidator } from "../../helpers/id-validator";

const adminValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const adminValidator = (req, res, next) => {
  try {
    const { error } = adminValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const blockUnblockValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.body.user_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

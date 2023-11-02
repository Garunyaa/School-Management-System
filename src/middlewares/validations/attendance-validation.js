import Joi from "joi";
import { errorResponse } from "../response";
import { idValidator } from "../../helpers/id-validator";

const attendanceValidation = Joi.object({
  student_id: Joi.string().required(),
  date: Joi.date().required(),
  is_present: Joi.boolean().default(true),
});

export const attendanceValidator = (req, res, next) => {
  try {
    const { error } = attendanceValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const attendanceIdValidator = async (req, res, next) => {
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

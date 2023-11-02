import Joi from "joi";
import { errorResponse } from "../response";
import { idValidator } from "../../helpers/id-validator";

export const gradeValidation = Joi.object({
  student_id: Joi.string().required(),
  assignment_id: Joi.string().required(),
  exam_id: Joi.string().required(),
  grade: Joi.number().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const gradeValidator = async (req, res, next) => {
  try {
    if (
      (await idValidator(
        req.body.student_id && req.body.assignment_id && req.body.exam_id
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

export const updateGradeValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id && req.body.student_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

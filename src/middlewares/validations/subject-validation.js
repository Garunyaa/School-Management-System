import Joi from "joi";
import { errorResponse } from "../response";
import { idValidator } from "../../helpers/id-validator";

const subjectValidation = Joi.object({
  name: Joi.string().required(),
  teacher: Joi.array().items(Joi.string()),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const subjectValidator = (req, res, next) => {
  try {
    const { error } = subjectValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const subjectIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

export const editSubjectIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id && req.body.subject_id)) == true) {
      next();
    } else {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

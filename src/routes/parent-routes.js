import express from "express";
import {
  parentLogin,
  getChildInformation,
  communicateWithTeacher,
} from "../controllers/parent/parent-controller";
import { authTokenForParent } from "../middlewares/auth-middleware";
import { loginValidator } from "../middlewares/validations/login-validation";
import { paramsIdValidator } from "../middlewares/validations/parent-validation";

const router = express.Router();

router.post("/parent-login", loginValidator, parentLogin);
router.get(
  "/child-info/:id",
  authTokenForParent,
  paramsIdValidator,
  getChildInformation
);
router.post(
  "/communicate-teacher/:id",
  authTokenForParent,
  paramsIdValidator,
  communicateWithTeacher
);

export default router;

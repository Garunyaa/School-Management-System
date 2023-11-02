import { Administrator } from "../models/administrator-model";
import { Teacher } from "../models/teacher-model";
import { Student } from "../models/student-model";
import { Parent } from "../models/parent-model";
import jwt from "jsonwebtoken";
import { errorResponse } from "./response";

export const authTokenForAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Administrator.findById(decoded.id);
    if (admin == null) {
      return errorResponse(res, 404, "Admin not found");
    }
    if (!decoded) {
      return errorResponse(res, 403, "Forbidden.");
    }
    next();
  } catch (error) {
    console.error(error);
    errorResponse(res, 401, "Invalid Token");
  }
};

export const authTokenForTeacher = async (req, res, next) => {
  const { id } = req.params;
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const teacher = await Teacher.findById(id);
    if (teacher == null) {
      return errorResponse(res, 404, "Teacher not found");
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden.");
    } else if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    next();
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

export const authTokenForStudent = async (req, res, next) => {
  const { id } = req.params;
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const student = await Student.findById(id);
    if (student == null) {
      return errorResponse(res, 404, "Student not found");
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden.");
    } else if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    next();
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

export const authTokenForParent = async (req, res, next) => {
  const { id } = req.params;
  const token = req.header("Authorization");
  try {
    if (!token) {
      return errorResponse(res, 401, "Access Denied. No token provided");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const parent = await Parent.findById(id);
    if (parent == null) {
      return errorResponse(res, 404, "Parent not found");
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden.");
    } else if (parent.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    next();
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

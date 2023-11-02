import { Administrator } from "../../models/administrator-model";
import { Teacher } from "../../models/teacher-model";
import { Student } from "../../models/student-model";
import { Parent } from "../../models/parent-model";
import { Subject } from "../../models/subject-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Create Admin

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Administrator({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();
    successResponse(res, 201, "Admin created", admin);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error creating Admin");
  }
};

// Admin Login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const admin = await Administrator.findOne({ email: email });
    if (!admin) {
      return errorResponse(res, 404, "Admin not found");
    }
    const authToken = jwt.sign(
      { name: admin.name, email: admin.email, id: admin._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
      admin.password = undefined;
      return successResponse(res, 200, "Login Successful", {
        admin,
        auth_token: authToken,
      });
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Define Subjects

export const defineSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const subject = new Subject({ name });
    await subject.save();
    successResponse(res, 201, "Subject defined", subject);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error defining subject");
  }
};

// Listing all users

export const listAllUsers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    const students = await Student.find();
    const parents = await Parent.find();
    const allUsers = [...teachers, ...students, ...parents];
    successResponse(res, 201, "All users listed", allUsers);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing all users");
  }
};

// Block / Unblock user

export const blockUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    const user =
      (await Parent.findById(user_id)) ||
      (await Student.findById(user_id)) ||
      (await Teacher.findById(user_id));
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    if (user.status == 1) {
      user.status = 0;
      await user.save();
    } else {
      return errorResponse(res, 400, "User already blocked");
    }
    successResponse(res, 200, "User blocked", user);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error blocking user");
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user =
      (await Parent.findById(user_id)) ||
      (await Student.findById(user_id)) ||
      (await Teacher.findById(user_id));
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    if (user.status != 1) {
      user.status = 1;
      await user.save();
    } else {
      errorResponse(res, 400, "User not blocked");
    }
    return successResponse(res, 200, "User unblocked", user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Error unblocking user");
  }
};

// Access a specific user details

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).select({ password: 0 }).exec();
    const student = await Student.findById(id).select({ password: 0 }).exec();
    const parent = await Parent.findById(id).select({ password: 0 }).exec();

    if (teacher) {
      console.log(teacher);
      return successResponse(res, 200, "Teacher details listed", teacher);
    } else if (student) {
      return successResponse(res, 200, "Student details listed", student);
    } else if (parent) {
      return successResponse(res, 200, "Parent details listed", parent);
    } else {
      return errorResponse(res, 404, "User not found");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error getting user details");
  }
};

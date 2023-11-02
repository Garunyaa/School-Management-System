import { Parent } from "../../models/parent-model";
import { Teacher } from "../../models/teacher-model";
import { Message } from "../../models/message-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Parent Login

export const parentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const parent = await Parent.findOne({ email: email });
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    const authToken = jwt.sign(
      { name: parent.name, email: parent.email, id: parent._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    parent.auth_token = authToken;
    await parent.save();
    const passwordMatch = await bcrypt.compare(password, parent.password);
    if (passwordMatch) {
      parent.password = undefined;
      return successResponse(res, 200, "Login Successful", parent);
    } else {
      return errorResponse(res, 404, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Parents view their child's informations

export const getChildInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findById(id).populate({
      path: "children",
      select: "-_id student_id name class section attendance grades",
      populate: {
        path: "class",
        select: "standard teachers subjects schedule -_id",
      },
    });
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    const children = parent.children;
    if (children.length === 0) {
      return errorResponse(res, 404, "No children found for this parent");
    }
    successResponse(res, 200, "Child information listed", {
      children,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error fetching child information");
  }
};

// Parents communicate with teachers to discuss their child's progress

export const communicateWithTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { to, content } = req.body;
    const parent = await Parent.findById(id);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    const teacher = await Teacher.findById(to);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const message = new Message({
      from: id,
      to: to,
      content,
    });
    await message.save();
    await successResponse(res, 201, "Message sent", message);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error sending the message");
  }
};

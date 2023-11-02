import { Teacher } from "../../models/teacher-model";
import { Parent } from "../../models/parent-model";
import { Assignment } from "../../models/assignment-model";
import { Exam } from "../../models/exam-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Teacher Login

export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const authToken = jwt.sign(
      { name: teacher.name, email: teacher.email, id: teacher._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    teacher.auth_token = authToken;
    await teacher.save();
    const passwordMatch = await bcrypt.compare(password, teacher.password);
    if (passwordMatch) {
      teacher.password = undefined;
      return successResponse(res, 200, "Login Successful", teacher);
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Give Assignments and Schedule Exams

export const giveAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { title, description, due_date, class_id } = req.body;
    const assignment = new Assignment({
      title,
      description,
      due_date,
      class_id,
    });
    await assignment.save();
    successResponse(res, 201, "Assignment created", assignment);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error creating Assignment");
  }
};

export const scheduleExam = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { title, date, student } = req.body;
    const exam = new Exam({
      title,
      date,
      student,
    });
    await exam.save();
    successResponse(res, 201, "Exam scheduled", exam);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error scheduling Exam");
  }
};

// Communicate with Parents about their children's progress

// Send messages to parent

export const sendMessageToParent = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { to, content } = req.body;
    const parent = await Parent.findById(to);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    parent.messages.push(content);
    const updateParent = await Parent.findByIdAndUpdate(
      to,
      {
        messages: content,
      },
      { new: true }
    );
    if (updateParent) {
      return successResponse(
        res,
        200,
        "Message sent to parent",
        parent.messages
      );
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error sending message to parent");
  }
};

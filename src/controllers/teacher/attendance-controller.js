import { successResponse, errorResponse } from "../../middlewares/response";
import { Student } from "../../models/student-model";
import { Attendance } from "../../models/attendance-model";
import { Class } from "../../models/class-model";
import { Teacher } from "../../models/teacher-model";

// Mark Student Attendance

export const markAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { student_id, date, is_present } = req.body;
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const attendanceEntry = await Attendance.create({
      student_id,
      date,
      is_present,
    });
    successResponse(res, 200, "Attendance marked", attendanceEntry);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error marking attendance");
  }
};

// Manage Attendance records

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { attendance_id, is_present } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      attendance_id,
      { is_present },
      { new: true }
    );
    if (!attendance) {
      return errorResponse(res, 404, "Attendance record not found");
    }
    successResponse(res, 200, "Attendance record updated", attendance);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating attendance record");
  }
};

export const listAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const attendanceRecords = await Attendance.find();
    successResponse(res, 200, "Listing attendance records", attendanceRecords);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing attendance records");
  }
};

export const listAttendanceByClass = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const { class_id } = req.body;
    const response = [];
    const findClass = await Class.findById(class_id);
    const students = findClass.students;
    for (let i = 0; i < students.length; i++) {
      response.push(await Attendance.find({ student_id: students[i] }));
      console.log(response);
    }
    successResponse(res, 200, "Attendance list by Class", response);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

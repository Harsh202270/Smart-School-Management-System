/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

export type UserRole = 'student' | 'teacher' | 'management';

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  affiliation: string;
  schoolCode: string;
  establishedYear: number;
  principalName: string;
  principalDesignation: string;
  principalMessage: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  altPhone: string;
  email: string;
  website: string;
  academicYear: string;
  primaryColor: string;
  accentColor: string;
}

export interface Student {
  id: string; // STU-2026-1001
  admissionNumber: string;
  rollNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  aadharNumber: string;
  photoUrl: string;
  classId: string; // e.g., '10'
  section: string; // e.g., 'A'
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Transferred' | 'Alumni';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  
  // Parent details
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  permanentAddress: string;
  currentAddress: string;

  // Transport & Library
  transportOpted: boolean;
  busRouteId?: string;
  busStopName?: string;
  libraryCardNo?: string;
}

export interface Teacher {
  id: string; // EMP-T-101
  employeeCode: string;
  fullName: string;
  designation: string; // e.g. "Senior PGT Physics", "TGT Mathematics"
  department: 'Science' | 'Mathematics' | 'Languages' | 'Social Studies' | 'Computers' | 'Arts & Sports';
  qualification: string;
  experienceYears: number;
  joiningDate: string;
  email: string;
  phone: string;
  photoUrl: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedClasses: { classId: string; section: string; subject: string }[];
  isClassTeacherOf?: { classId: string; section: string };
  salary: {
    basic: number;
    hra: number;
    da: number;
    allowances: number;
    deductions: number;
  };
}

export interface ClassSection {
  id: string; // '10-A'
  classNumber: string; // '10'
  section: string; // 'A'
  roomNumber: string;
  classTeacherId: string;
  classTeacherName: string;
  capacity: number;
  studentCount: number;
  subjects: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  classNumber: string;
  maxTheoryMarks: number;
  maxPracticalMarks: number;
  passingMarks: number;
  teacherId: string;
  teacherName: string;
  type: 'Theory' | 'Practical' | 'Composite';
}

export interface TimetablePeriod {
  id: string;
  periodNumber: number; // 1 to 6
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  section: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  markedBy: string; // Teacher or Admin ID
  remarks?: string;
}

export interface Question {
  id: string;
  type: 'MCQ' | 'True/False' | 'Fill in the Blank' | 'Short Answer' | 'Long Answer' | 'Numerical';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  questionText: string;
  options?: string[]; // for MCQ
  correctAnswer?: string;
  markingGuide?: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  examId: string;
  examName: string;
  classNumber: string;
  subject: string;
  subjectCode: string;
  durationMinutes: number;
  maxMarks: number;
  generalInstructions: string[];
  sections: {
    sectionTitle: string; // e.g. "Section A - Multiple Choice Questions (1 Mark Each)"
    instructions: string;
    questions: Question[];
  }[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  status: 'Draft' | 'Published';
}

export interface Exam {
  id: string;
  name: string; // e.g. "Mid-Term Examination 2026"
  type: 'Unit Test' | 'Mid Term' | 'Half Yearly' | 'Final' | 'Pre-Board' | 'Practical';
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Published';
  schedule: {
    date: string;
    day: string;
    time: string;
    classNumber: string;
    subject: string;
    room: string;
  }[];
}

export interface MarksEntry {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  classNumber: string;
  section: string;
  subject: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string; // A1, A2, B1, B2, C1, C2, D, E
  status: 'Pass' | 'Fail';
  remarks?: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  classNumber: string;
  section: string;
  rollNumber: number;
  academicYear: string;
  examName: string;
  subjectMarks: {
    subject: string;
    maxTheory: number;
    theoryObtained: number;
    maxPractical: number;
    practicalObtained: number;
    totalMax: number;
    totalObtained: number;
    grade: string;
  }[];
  grandTotal: number;
  maxPossible: number;
  percentage: number;
  overallGrade: string;
  attendancePercentage: number;
  rankInClass?: number;
  classTeacherRemarks: string;
  principalRemarks: string;
  issueDate: string;
}

export interface FeeStructure {
  id: string;
  classNumber: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  labFee: number;
  computerFee: number;
  annualCharges: number;
  totalAnnual: number;
}

export interface FeeInvoice {
  id: string; // INV-2026-0042
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  classNumber: string;
  section: string;
  quarter: 'Q1 (Apr-Jun)' | 'Q2 (Jul-Sep)' | 'Q3 (Oct-Dec)' | 'Q4 (Jan-Mar)';
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  breakdown: { title: string; amount: number }[];
}

export interface FeePayment {
  id: string;
  receiptNumber: string; // REC-2026-8812
  invoiceId: string;
  studentId: string;
  studentName: string;
  classNumber: string;
  section: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Cheque';
  transactionId?: string;
  receivedBy: string;
}

export interface PayrollRecord {
  id: string;
  teacherId: string;
  employeeName: string;
  designation: string;
  month: string; // "September 2026"
  basic: number;
  hra: number;
  da: number;
  allowances: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  leaveDeductions: number;
  netSalary: number;
  status: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
  slipNumber: string;
}

export interface Homework {
  id: string;
  title: string;
  classNumber: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachments?: string[];
  submissionsCount: number;
  totalStudents: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'Submitted' | 'Late' | 'Reviewed';
  content: string;
  attachmentName?: string;
  grade?: string;
  feedback?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'Science' | 'Mathematics' | 'Literature' | 'History' | 'Computer Science' | 'Fiction' | 'Reference';
  totalCopies: number;
  availableCopies: number;
  locationRack: string;
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string; // Student or Teacher
  userName: string;
  userType: 'Student' | 'Teacher';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export interface TransportVehicle {
  id: string;
  vehicleNumber: string; // DL-01-EA-4482
  busNumber: string; // Bus 04
  capacity: number;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  routeName: string;
  status: 'Active' | 'Maintenance';
}

export interface TransportRoute {
  dropTime: ReactNode;
  pickupTime: ReactNode;
  id: string;
  routeCode: string; // R-01
  routeName: string;
  stops: { stopName: string; morningPickupTime: string; afternoonDropTime: string; monthlyFare: number }[];
  busNumber: string;
  driverName: string;
  driverPhone: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Sports' | 'Holiday' | 'Administrative' | 'Admission';
  date: string;
  publishDate: string;
  targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents';
  content: string;
  isImportant: boolean;
  issuedBy: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Exhibition' | 'Celebration' | 'Meeting';
  description: string;
  coordinator: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'Student' | 'Teacher';
  classOrDesignation: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  reviewedBy?: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string; // RPS/CERT/2026/089
  studentId: string;
  studentName: string;
  admissionNumber: string;
  classNumber: string;
  section: string;
  type: 'Bonafide' | 'Transfer Certificate' | 'Character Certificate' | 'Sports Achievement' | 'Academic Excellence';
  issueDate: string;
  reasonOrAchievement: string;
  signedBy: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  details: string;
}

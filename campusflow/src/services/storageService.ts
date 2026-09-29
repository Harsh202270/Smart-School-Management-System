/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SchoolSettings,
  Student,
  Teacher,
  ClassSection,
  Subject,
  TimetablePeriod,
  DayTimetable,
  AttendanceRecord,
  Question,
  QuestionPaper,
  Exam,
  MarksEntry,
  ReportCard,
  FeeStructure,
  FeeInvoice,
  FeePayment,
  PayrollRecord,
  Homework,
  HomeworkSubmission,
  LibraryBook,
  LibraryTransaction,
  TransportVehicle,
  TransportRoute,
  Notice,
  SchoolEvent,
  LeaveRequest,
  CertificateRecord,
  AuditLog
} from '../types/school';

import {
  initialSchoolSettings,
  initialStudents,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialClass10ATimetable,
  initialAttendance,
  initialQuestionBank,
  initialQuestionPapers,
  initialExams,
  initialMarksEntries,
  initialReportCard,
  initialFeeStructures,
  initialInvoices,
  initialPayments,
  initialPayrolls,
  initialHomeworks,
  initialHomeworkSubmissions,
  initialBooks,
  initialTransactions,
  initialVehicles,
  initialRoutes,
  initialNotices,
  initialEvents,
  initialLeaveRequests,
  initialCertificates,
  initialAuditLogs
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'campusflow_settings',
  STUDENTS: 'campusflow_students',
  TEACHERS: 'campusflow_teachers',
  CLASSES: 'campusflow_classes',
  SUBJECTS: 'campusflow_subjects',
  TIMETABLES: 'campusflow_timetables',
  ATTENDANCE: 'campusflow_attendance',
  QUESTION_BANK: 'campusflow_question_bank',
  QUESTION_PAPERS: 'campusflow_question_papers',
  EXAMS: 'campusflow_exams',
  MARKS: 'campusflow_marks',
  REPORT_CARDS: 'campusflow_report_cards',
  FEE_STRUCTURES: 'campusflow_fee_structures',
  INVOICES: 'campusflow_invoices',
  PAYMENTS: 'campusflow_payments',
  PAYROLLS: 'campusflow_payrolls',
  HOMEWORKS: 'campusflow_homeworks',
  HOMEWORK_SUBMISSIONS: 'campusflow_hw_submissions',
  BOOKS: 'campusflow_books',
  BOOK_TRANSACTIONS: 'campusflow_book_transactions',
  VEHICLES: 'campusflow_vehicles',
  ROUTES: 'campusflow_routes',
  NOTICES: 'campusflow_notices',
  EVENTS: 'campusflow_events',
  LEAVES: 'campusflow_leaves',
  CERTIFICATES: 'campusflow_certificates',
  AUDIT_LOGS: 'campusflow_audit_logs'
};

class StorageService {
  private listeners: Map<string, Set<() => void>> = new Map();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSchoolSettings));
    }

    const currentStudents = this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS) || currentStudents.length === 0) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
    } else if (!currentStudents.some(s => s.classId === 'Nursery' || s.classId === '1')) {
      // Merge all new grade levels into existing data
      const merged = [
        ...currentStudents,
        ...initialStudents.filter(init => !currentStudents.some(curr => curr.id === init.id))
      ];
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(merged));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(initialTeachers));
    }

    const currentClasses = this.getItem<ClassSection[]>(STORAGE_KEYS.CLASSES, []);
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES) || currentClasses.length === 0) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(initialClasses));
    } else if (!currentClasses.some(c => c.classNumber === 'Nursery')) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(initialClasses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMETABLES)) {
      localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(initialClass10ATimetable));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTION_BANK)) {
      localStorage.setItem(STORAGE_KEYS.QUESTION_BANK, JSON.stringify(initialQuestionBank));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUESTION_PAPERS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTION_PAPERS, JSON.stringify(initialQuestionPapers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(initialExams));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MARKS)) {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(initialMarksEntries));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORT_CARDS)) {
      localStorage.setItem(STORAGE_KEYS.REPORT_CARDS, JSON.stringify([initialReportCard]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURES)) {
      localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(initialFeeStructures));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initialInvoices));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initialPayments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYROLLS)) {
      localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify(initialPayrolls));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOMEWORKS)) {
      localStorage.setItem(STORAGE_KEYS.HOMEWORKS, JSON.stringify(initialHomeworks));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, JSON.stringify(initialHomeworkSubmissions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(initialBooks));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOK_TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.BOOK_TRANSACTIONS, JSON.stringify(initialTransactions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(initialVehicles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(initialRoutes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(initialNotices));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(initialLeaveRequests));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(initialCertificates));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialAuditLogs));
    }
  }

  public subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach(cb => cb());
  }

  private getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify(key);
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage:`, e);
    }
  }

  // Settings
  getSettings(): SchoolSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, initialSchoolSettings);
  }
  updateSettings(settings: Partial<SchoolSettings>): SchoolSettings {
    const updated = { ...this.getSettings(), ...settings };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    this.logAction('Dr. Ananya Sharma', 'Management', 'UPDATE_SETTINGS', 'Settings', 'Updated school profile and visual identity');
    return updated;
  }

  // Students
  getStudents(): Student[] {
    return this.getItem(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }
  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newId = `STU-2026-${1000 + students.length + 1}`;
    const newStudent: Student = { ...student, id: newId };
    this.setItem(STORAGE_KEYS.STUDENTS, [newStudent, ...students]);
    this.logAction('Admin', 'Management', 'ADD_STUDENT', 'Students', `Admitted new student ${newStudent.fullName} to Class ${newStudent.classId}-${newStudent.section}`);
    return newStudent;
  }
  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    students[idx] = { ...students[idx], ...updates };
    this.setItem(STORAGE_KEYS.STUDENTS, [...students]);
    this.logAction('Admin', 'Management', 'UPDATE_STUDENT', 'Students', `Updated student profile for ${students[idx].fullName}`);
    return students[idx];
  }
  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const target = students.find(s => s.id === id);
    if (!target) return false;
    this.setItem(STORAGE_KEYS.STUDENTS, students.filter(s => s.id !== id));
    this.logAction('Admin', 'Management', 'DELETE_STUDENT', 'Students', `Removed student ${target.fullName} (${id})`);
    return true;
  }

  // Teachers
  getTeachers(): Teacher[] {
    return this.getItem(STORAGE_KEYS.TEACHERS, initialTeachers);
  }
  getTeacherById(id: string): Teacher | undefined {
    return this.getTeachers().find(t => t.id === id);
  }
  addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
    const teachers = this.getTeachers();
    const newId = `EMP-T-${120 + teachers.length + 1}`;
    const newTeacher: Teacher = { ...teacher, id: newId };
    this.setItem(STORAGE_KEYS.TEACHERS, [...teachers, newTeacher]);
    this.logAction('Admin', 'Management', 'ADD_TEACHER', 'Teachers', `Appointed faculty member ${newTeacher.fullName} (${newTeacher.designation})`);
    return newTeacher;
  }
  updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const teachers = this.getTeachers();
    const idx = teachers.findIndex(t => t.id === id);
    if (idx === -1) return null;
    teachers[idx] = { ...teachers[idx], ...updates };
    this.setItem(STORAGE_KEYS.TEACHERS, [...teachers]);
    this.logAction('Admin', 'Management', 'UPDATE_TEACHER', 'Teachers', `Updated teacher profile for ${teachers[idx].fullName}`);
    return teachers[idx];
  }
  deleteTeacher(id: string): boolean {
    const teachers = this.getTeachers();
    const target = teachers.find(t => t.id === id);
    if (!target) return false;
    this.setItem(STORAGE_KEYS.TEACHERS, teachers.filter(t => t.id !== id));
    this.logAction('Admin', 'Management', 'DELETE_TEACHER', 'Teachers', `Removed teacher ${target.fullName} (${id})`);
    return true;
  }

  // Classes & Sections
  getClasses(): ClassSection[] {
    return this.getItem(STORAGE_KEYS.CLASSES, initialClasses);
  }
  addClass(cls: ClassSection): void {
    const classes = this.getClasses();
    this.setItem(STORAGE_KEYS.CLASSES, [...classes, cls]);
    this.logAction('Admin', 'Management', 'ADD_CLASS', 'Classes', `Created class division ${cls.classNumber}-${cls.section}`);
  }
  updateClass(id: string, updates: Partial<ClassSection>): ClassSection | null {
    const classes = this.getClasses();
    const idx = classes.findIndex(c => c.id === id);
    if (idx === -1) return null;
    classes[idx] = { ...classes[idx], ...updates };
    this.setItem(STORAGE_KEYS.CLASSES, [...classes]);
    this.logAction('Admin', 'Management', 'UPDATE_CLASS', 'Classes', `Updated class ${classes[idx].classNumber}-${classes[idx].section}`);
    return classes[idx];
  }
  deleteClass(id: string): boolean {
    const classes = this.getClasses();
    this.setItem(STORAGE_KEYS.CLASSES, classes.filter(c => c.id !== id));
    this.logAction('Admin', 'Management', 'DELETE_CLASS', 'Classes', `Removed class ${id}`);
    return true;
  }

  // Subjects
  getSubjects(): Subject[] {
    return this.getItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }
  addSubject(sub: Subject): void {
    const subjects = this.getSubjects();
    this.setItem(STORAGE_KEYS.SUBJECTS, [...subjects, sub]);
  }

  // Timetables
  getTimetable(classId: string = '10-A'): DayTimetable[] {
    return this.getItem(STORAGE_KEYS.TIMETABLES, initialClass10ATimetable);
  }
  updateTimetable(day: string, periodNumber: number, update: Partial<TimetablePeriod>): void {
    const tt = this.getTimetable();
    const dayObj = tt.find(d => d.day === day);
    if (dayObj) {
      const p = dayObj.periods.find(p => p.periodNumber === periodNumber);
      if (p) {
        Object.assign(p, update);
        this.setItem(STORAGE_KEYS.TIMETABLES, [...tt]);
        this.logAction('Admin', 'Management', 'UPDATE_TIMETABLE', 'Timetable', `Updated Period ${periodNumber} on ${day}`);
      }
    }
  }

  // Attendance
  getAttendance(date?: string, classId?: string, section?: string): AttendanceRecord[] {
    const records = this.getItem(STORAGE_KEYS.ATTENDANCE, initialAttendance);
    return records.filter(r => {
      if (date && r.date !== date) return false;
      if (classId && r.classId !== classId) return false;
      if (section && r.section !== section) return false;
      return true;
    });
  }
  markAttendance(records: AttendanceRecord[]): void {
    const existing = this.getItem(STORAGE_KEYS.ATTENDANCE, initialAttendance);
    const updated = [...existing];
    records.forEach(rec => {
      const idx = updated.findIndex(r => r.date === rec.date && r.studentId === rec.studentId);
      if (idx !== -1) {
        updated[idx] = rec;
      } else {
        updated.push(rec);
      }
    });
    this.setItem(STORAGE_KEYS.ATTENDANCE, updated);
    this.logAction(records[0]?.markedBy || 'Teacher', 'Teacher', 'MARK_ATTENDANCE', 'Attendance', `Recorded attendance for ${records.length} students`);
  }

  // Question Bank
  getQuestionBank(): Question[] {
    return this.getItem(STORAGE_KEYS.QUESTION_BANK, initialQuestionBank);
  }
  addQuestion(q: Omit<Question, 'id'>): Question {
    const bank = this.getQuestionBank();
    const newId = `Q-GEN-${Date.now()}`;
    const newQuestion: Question = { ...q, id: newId };
    this.setItem(STORAGE_KEYS.QUESTION_BANK, [newQuestion, ...bank]);
    return newQuestion;
  }

  // Question Papers
  getQuestionPapers(): QuestionPaper[] {
    return this.getItem(STORAGE_KEYS.QUESTION_PAPERS, initialQuestionPapers);
  }
  getQuestionPaperById(id: string): QuestionPaper | undefined {
    return this.getQuestionPapers().find(qp => qp.id === id);
  }
  saveQuestionPaper(paper: QuestionPaper): void {
    const papers = this.getQuestionPapers();
    const idx = papers.findIndex(p => p.id === paper.id);
    if (idx !== -1) {
      papers[idx] = paper;
    } else {
      papers.unshift(paper);
    }
    this.setItem(STORAGE_KEYS.QUESTION_PAPERS, [...papers]);
    this.logAction(paper.createdByName, 'Teacher', 'SAVE_QUESTION_PAPER', 'Examinations', `Created/updated question paper "${paper.title}"`);
  }

  // Exams
  getExams(): Exam[] {
    return this.getItem(STORAGE_KEYS.EXAMS, initialExams);
  }

  // Marks & Results
  getMarks(examId?: string, classNumber?: string): MarksEntry[] {
    const marks = this.getItem(STORAGE_KEYS.MARKS, initialMarksEntries);
    return marks.filter(m => {
      if (examId && m.examId !== examId) return false;
      if (classNumber && m.classNumber !== classNumber) return false;
      return true;
    });
  }
  saveMarks(marksEntries: MarksEntry[]): void {
    const existing = this.getItem(STORAGE_KEYS.MARKS, initialMarksEntries);
    const updated = [...existing];
    marksEntries.forEach(entry => {
      const idx = updated.findIndex(m => m.examId === entry.examId && m.studentId === entry.studentId && m.subject === entry.subject);
      if (idx !== -1) {
        updated[idx] = entry;
      } else {
        updated.push(entry);
      }
    });
    this.setItem(STORAGE_KEYS.MARKS, updated);
    this.logAction('Teacher', 'Teacher', 'SAVE_MARKS', 'Results', `Saved marks for ${marksEntries.length} entries`);
  }

  // Report Cards
  getReportCards(): ReportCard[] {
    return this.getItem(STORAGE_KEYS.REPORT_CARDS, [initialReportCard]);
  }
  getReportCardByStudentId(studentId: string): ReportCard | undefined {
    return this.getReportCards().find(rc => rc.studentId === studentId);
  }

  // Fees & Payments
  getFeeStructures(): FeeStructure[] {
    return this.getItem(STORAGE_KEYS.FEE_STRUCTURES, initialFeeStructures);
  }
  getInvoices(studentId?: string): FeeInvoice[] {
    const invoices = this.getItem(STORAGE_KEYS.INVOICES, initialInvoices);
    return studentId ? invoices.filter(i => i.studentId === studentId) : invoices;
  }
  getPayments(studentId?: string): FeePayment[] {
    const payments = this.getItem(STORAGE_KEYS.PAYMENTS, initialPayments);
    return studentId ? payments.filter(p => p.studentId === studentId) : payments;
  }
  recordPayment(payment: Omit<FeePayment, 'id' | 'receiptNumber'>): FeePayment {
    const payments = this.getPayments();
    const newReceipt = `RPS/REC/2026/${8820 + payments.length + 1}`;
    const newPayment: FeePayment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      receiptNumber: newReceipt
    };
    this.setItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Update invoice status
    const invoices = this.getInvoices();
    const targetInv = invoices.find(inv => inv.id === payment.invoiceId);
    if (targetInv) {
      targetInv.paidAmount += payment.amount;
      targetInv.balanceAmount = Math.max(0, targetInv.amount - targetInv.paidAmount);
      targetInv.status = targetInv.balanceAmount === 0 ? 'Paid' : 'Partial';
      this.setItem(STORAGE_KEYS.INVOICES, [...invoices]);
    }

    this.logAction(payment.receivedBy, 'Accountant', 'RECORD_PAYMENT', 'Fees', `Received fee payment of ₹${payment.amount} for ${payment.studentName} (${payment.paymentMode})`);
    return newPayment;
  }

  // Payrolls
  getPayrolls(): PayrollRecord[] {
    return this.getItem(STORAGE_KEYS.PAYROLLS, initialPayrolls);
  }

  // Homework
  getHomeworks(classNumber?: string, section?: string): Homework[] {
    const hw = this.getItem(STORAGE_KEYS.HOMEWORKS, initialHomeworks);
    return hw.filter(h => {
      if (classNumber && h.classNumber !== classNumber) return false;
      if (section && h.section !== section) return false;
      return true;
    });
  }
  addHomework(hw: Omit<Homework, 'id' | 'submissionsCount'>): Homework {
    const all = this.getItem(STORAGE_KEYS.HOMEWORKS, initialHomeworks);
    const newHw: Homework = {
      ...hw,
      id: `HW-2026-${100 + all.length + 1}`,
      submissionsCount: 0
    };
    this.setItem(STORAGE_KEYS.HOMEWORKS, [newHw, ...all]);
    this.logAction(hw.teacherName, 'Teacher', 'ASSIGN_HOMEWORK', 'Homework', `Assigned new homework: "${hw.title}" for Class ${hw.classNumber}-${hw.section}`);
    return newHw;
  }
  getHomeworkSubmissions(homeworkId?: string, studentId?: string): HomeworkSubmission[] {
    const subs = this.getItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialHomeworkSubmissions);
    return subs.filter(s => {
      if (homeworkId && s.homeworkId !== homeworkId) return false;
      if (studentId && s.studentId !== studentId) return false;
      return true;
    });
  }
  submitHomework(sub: Omit<HomeworkSubmission, 'id'>): HomeworkSubmission {
    const subs = this.getItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialHomeworkSubmissions);
    const newSub: HomeworkSubmission = { ...sub, id: `SUB-${Date.now()}` };
    this.setItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, [newSub, ...subs]);

    // Update homework submissionsCount
    const allHw = this.getItem(STORAGE_KEYS.HOMEWORKS, initialHomeworks);
    const hw = allHw.find(h => h.id === sub.homeworkId);
    if (hw) {
      hw.submissionsCount = (hw.submissionsCount || 0) + 1;
      this.setItem(STORAGE_KEYS.HOMEWORKS, [...allHw]);
    }
    return newSub;
  }
  reviewHomeworkSubmission(id: string, grade: string, feedback: string): void {
    const subs = this.getItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialHomeworkSubmissions);
    const target = subs.find(s => s.id === id);
    if (target) {
      target.status = 'Reviewed';
      target.grade = grade;
      target.feedback = feedback;
      this.setItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, [...subs]);
    }
  }

  // Library
  getBooks(): LibraryBook[] {
    return this.getItem(STORAGE_KEYS.BOOKS, initialBooks);
  }
  getBookTransactions(): LibraryTransaction[] {
    return this.getItem(STORAGE_KEYS.BOOK_TRANSACTIONS, initialTransactions);
  }
  issueBook(bookId: string, userId: string, userName: string, userType: 'Student' | 'Teacher'): LibraryTransaction | null {
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return null;

    book.availableCopies -= 1;
    this.setItem(STORAGE_KEYS.BOOKS, [...books]);

    const txs = this.getBookTransactions();
    const newTx: LibraryTransaction = {
      id: `TX-LIB-${Date.now()}`,
      bookId,
      bookTitle: book.title,
      userId,
      userName,
      userType,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Issued',
      fineAmount: 0
    };
    this.setItem(STORAGE_KEYS.BOOK_TRANSACTIONS, [newTx, ...txs]);
    this.logAction(userName, userType, 'ISSUE_BOOK', 'Library', `Issued "${book.title}" to ${userName}`);
    return newTx;
  }

  // Transport
  getVehicles(): TransportVehicle[] {
    return this.getItem(STORAGE_KEYS.VEHICLES, initialVehicles);
  }
  getRoutes(): TransportRoute[] {
    return this.getItem(STORAGE_KEYS.ROUTES, initialRoutes);
  }

  // Notices
  getNotices(): Notice[] {
    return this.getItem(STORAGE_KEYS.NOTICES, initialNotices);
  }
  addNotice(notice: Omit<Notice, 'id'>): Notice {
    const notices = this.getNotices();
    const newNotice: Notice = { ...notice, id: `NOT-2026-${110 + notices.length + 1}` };
    this.setItem(STORAGE_KEYS.NOTICES, [newNotice, ...notices]);
    this.logAction(notice.issuedBy, 'Management', 'PUBLISH_NOTICE', 'Communication', `Published circular: "${notice.title}"`);
    return newNotice;
  }

  // Events
  getEvents(): SchoolEvent[] {
    return this.getItem(STORAGE_KEYS.EVENTS, initialEvents);
  }
  addEvent(event: Omit<SchoolEvent, 'id'>): SchoolEvent {
    const events = this.getEvents();
    const newEvent: SchoolEvent = { ...event, id: `EVT-${Date.now()}` };
    this.setItem(STORAGE_KEYS.EVENTS, [newEvent, ...events]);
    this.logAction('Admin', 'Management', 'ADD_EVENT', 'Events', `Added school calendar event: "${event.title}"`);
    return newEvent;
  }

  // Leaves
  getLeaves(): LeaveRequest[] {
    return this.getItem(STORAGE_KEYS.LEAVES, initialLeaveRequests);
  }
  applyLeave(req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>): LeaveRequest {
    const leaves = this.getLeaves();
    const newLeave: LeaveRequest = {
      ...req,
      id: `LR-${110 + leaves.length + 1}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    this.setItem(STORAGE_KEYS.LEAVES, [newLeave, ...leaves]);
    return newLeave;
  }
  updateLeaveStatus(id: string, status: 'Approved' | 'Rejected', reviewerName: string): void {
    const leaves = this.getLeaves();
    const target = leaves.find(l => l.id === id);
    if (target) {
      target.status = status;
      target.reviewedBy = reviewerName;
      this.setItem(STORAGE_KEYS.LEAVES, [...leaves]);
      this.logAction(reviewerName, 'Management', 'REVIEW_LEAVE', 'Leaves', `${status} leave application for ${target.applicantName}`);
    }
  }

  // Certificates
  getCertificates(): CertificateRecord[] {
    return this.getItem(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  }
  generateCertificate(cert: Omit<CertificateRecord, 'id' | 'certificateNumber'>): CertificateRecord {
    const certs = this.getCertificates();
    const newNum = `RPS/CERT/2026/${String(certs.length + 91).padStart(3, '0')}`;
    const newCert: CertificateRecord = {
      ...cert,
      id: `CERT-${Date.now()}`,
      certificateNumber: newNum
    };
    this.setItem(STORAGE_KEYS.CERTIFICATES, [newCert, ...certs]);
    this.logAction(cert.signedBy, 'Management', 'ISSUE_CERTIFICATE', 'Certificates', `Issued ${cert.type} certificate to ${cert.studentName}`);
    return newCert;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }
  logAction(userName: string, role: string, action: string, module: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: userName.toLowerCase().replace(/\s+/g, '-'),
      userName,
      role,
      action,
      module,
      details
    };
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 99)]);
  }

  resetToDemo(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    this.initDefaults();
    window.location.reload();
  }
}

export const storage = new StorageService();

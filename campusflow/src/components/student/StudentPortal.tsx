/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Student,
  DayTimetable,
  AttendanceRecord,
  Homework,
  HomeworkSubmission,
  Exam,
  ReportCard,
  FeeInvoice,
  FeePayment,
  LibraryTransaction,
  Notice,
  SchoolEvent,
  SchoolSettings
} from '../../types/school';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  GraduationCap,
  Library,
  User,
  LogOut,
  Bell,
  Printer,
  Upload,
  Send,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Edit,
  X
} from 'lucide-react';
import { PrintableReportCard } from '../print/PrintableReportCard';
import { PrintableFeeReceipt } from '../print/PrintableFeeReceipt';
import { PrintableIDCard } from '../print/PrintableIDCard';

interface Props {
  onBackToWebsite: () => void;
}

export const StudentPortal: React.FC<Props> = ({ onBackToWebsite }) => {
  const { user, logout, quickSwitch } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timetable' | 'attendance' | 'homework' | 'exams' | 'results' | 'fees' | 'library' | 'profile'
  >('overview');

  const [settings, setSettings] = useState<SchoolSettings>(storage.getSettings());
  const [student, setStudent] = useState<Student>(
    storage.getStudentById(user?.refId || 'STU-2026-1042') || storage.getStudents()[0]
  );

  const [timetable, setTimetable] = useState<DayTimetable[]>(
    storage.getTimetable(student ? `${student.classId}-${student.section}` : '10-A')
  );
  const [homeworks, setHomeworks] = useState<Homework[]>(
    storage.getHomeworks(student?.classId, student?.section)
  );
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(
    storage.getHomeworkSubmissions(undefined, student?.id)
  );
  const [invoices, setInvoices] = useState<FeeInvoice[]>(storage.getInvoices(student?.id));
  const [payments, setPayments] = useState<FeePayment[]>(storage.getPayments(student?.id));
  const [reportCard, setReportCard] = useState<ReportCard | undefined>(
    storage.getReportCardByStudentId(student?.id)
  );
  const [exams, setExams] = useState<Exam[]>(storage.getExams());
  const [notices, setNotices] = useState<Notice[]>(storage.getNotices());
  const [events, setEvents] = useState<SchoolEvent[]>(storage.getEvents());
  const [libraryBooks, setLibraryBooks] = useState<LibraryTransaction[]>(
    storage.getBookTransactions().filter(t => t.userId === student?.id)
  );

  // Modals
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState<FeePayment | null>(null);
  const [showPrintID, setShowPrintID] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    fatherPhone: student?.fatherPhone || '',
    guardianEmail: student?.guardianEmail || '',
    emergencyContact: student?.emergencyContact || '',
    permanentAddress: student?.permanentAddress || '',
    bloodGroup: student?.bloodGroup || 'O+'
  });
  const [submittingHw, setSubmittingHw] = useState<Homework | null>(null);
  const [hwContent, setHwContent] = useState('');
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Subscribe to storage updates
  useEffect(() => {
    const unsub = storage.subscribe('campusflow_students', () => {
      if (student) {
        const updated = storage.getStudentById(student.id);
        if (updated) {
          setStudent(updated);
          setEditProfileForm({
            firstName: updated.firstName,
            lastName: updated.lastName,
            fatherPhone: updated.fatherPhone,
            guardianEmail: updated.guardianEmail,
            emergencyContact: updated.emergencyContact,
            permanentAddress: updated.permanentAddress,
            bloodGroup: updated.bloodGroup
          });
        }
      }
    });
    return unsub;
  }, [student]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    storage.updateStudent(student.id, {
      firstName: editProfileForm.firstName,
      lastName: editProfileForm.lastName,
      fullName: `${editProfileForm.firstName} ${editProfileForm.lastName}`,
      fatherPhone: editProfileForm.fatherPhone,
      guardianEmail: editProfileForm.guardianEmail,
      emergencyContact: editProfileForm.emergencyContact,
      permanentAddress: editProfileForm.permanentAddress,
      bloodGroup: editProfileForm.bloodGroup
    });
    const refreshed = storage.getStudentById(student.id);
    if (refreshed) setStudent(refreshed);
    setShowEditProfileModal(false);
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHw) return;
    storage.submitHomework({
      homeworkId: submittingHw.id,
      studentId: student.id,
      studentName: student.fullName,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Submitted',
      content: hwContent,
      attachmentName: `${student.firstName}_${submittingHw.subject.replace(/\s+/g, '_')}_HW.pdf`
    });
    setSubmissions(storage.getHomeworkSubmissions(undefined, student.id));
    setSubmittingHw(null);
    setHwContent('');
  };

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    const payment = storage.recordPayment({
      invoiceId: payingInvoice.id,
      studentId: student.id,
      studentName: student.fullName,
      classNumber: student.classId,
      section: student.section,
      amount: payingInvoice.balanceAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: paymentMode,
      transactionId: `PAY/${Date.now().toString().slice(-8)}`,
      receivedBy: 'Online Automated Gateway'
    });
    setInvoices(storage.getInvoices(student.id));
    setPayments(storage.getPayments(student.id));
    setPayingInvoice(null);
    setShowPrintReceipt(payment);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.applyLeave({
      applicantId: student.id,
      applicantName: student.fullName,
      applicantType: 'Student',
      classOrDesignation: `Class ${student.classId}-${student.section}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + leaveDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: leaveDays,
      reason: leaveReason
    });
    setLeaveSubmitted(true);
    setTimeout(() => {
      setLeaveSubmitted(false);
      setLeaveReason('');
    }, 3000);
  };

  const pendingHomeworkCount = homeworks.filter(
    h => !submissions.some(s => s.homeworkId === h.id)
  ).length;

  const totalFeePending = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);

  return (
    <div className="h-full overflow-y-auto bg-slate-100 flex flex-col font-sans">
      {/* Top Student Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* School Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-lg flex items-center justify-center border border-white">
              R
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif text-white tracking-tight leading-tight">
                {settings.schoolName}
              </h1>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                Student Academic Console
              </span>
            </div>
          </div>

          {/* Student Profile Quick View & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Switch:</span>
              <button
                onClick={() => quickSwitch('teacher')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Teacher
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => quickSwitch('management')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Management
              </button>
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400">
                <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-white leading-tight">{student.fullName}</p>
                <p className="text-[10px] text-amber-400">Class {student.classId}-{student.section} • Roll #{student.rollNumber}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onBackToWebsite();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-950 px-4 sm:px-6 overflow-x-auto border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto flex gap-1 py-1">
            {[
              { id: 'overview', label: 'My Dashboard' },
              { id: 'timetable', label: 'Timetable' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'homework', label: `Homework (${pendingHomeworkCount})` },
              { id: 'exams', label: 'Exams & Syllabus' },
              { id: 'results', label: 'Results & Report Card' },
              { id: 'fees', label: `Fees ${totalFeePending > 0 ? `(₹${totalFeePending.toLocaleString('en-IN')})` : ''}` },
              { id: 'library', label: 'Library' },
              { id: 'profile', label: 'My School Record' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Student Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Academic Session {settings.academicYear}
                </span>
                <h2 className="text-2xl font-bold font-serif text-slate-950">
                  Good Morning, {student.firstName} 👋
                </h2>
                <p className="text-xs text-slate-600">
                  You are enrolled in <strong className="text-slate-800">Class {student.classId}-{student.section}</strong> (Class Teacher: Mr. Vikram Malhotra).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPrintID(true)}
                  className="px-3.5 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" /> Digital Student ID Card
                </button>
                {reportCard && (
                  <button
                    onClick={() => setShowPrintReport(true)}
                    className="px-3.5 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-600 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Printable Report Card
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Overall Attendance</span>
                <span className="text-2xl font-black text-emerald-700 font-serif">94.6%</span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Satisfies Board Criteria</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Pending Homework</span>
                <span className={`text-2xl font-black font-serif ${pendingHomeworkCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {pendingHomeworkCount}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Due this week</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Next Examination</span>
                <span className="text-sm font-bold text-slate-900 font-serif block mt-1 truncate">
                  Mid-Term Exam 2026
                </span>
                <span className="text-[11px] text-blue-700 font-medium block mt-0.5">Starting 5th October</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Fee Balance</span>
                <span className={`text-2xl font-black font-serif ${totalFeePending > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  ₹{totalFeePending.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {totalFeePending > 0 ? 'Due 15th October' : 'All Clear'}
                </span>
              </div>
            </div>

            {/* Today's Timetable & Actionable Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" /> Today's Class Timetable (Monday)
                  </h3>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-xs text-amber-700 font-semibold hover:underline"
                  >
                    View Full Week →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {timetable[0]?.periods.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                          P{p.periodNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{p.subject}</h4>
                          <p className="text-[11px] text-slate-500">{p.teacherName} • {p.room}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        {p.startTime} - {p.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgent Notices & Library Reminder */}
              <div className="lg:col-span-4 space-y-4">
                {/* Notice Snippet */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-600" /> Priority Notice
                  </h4>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <strong className="block text-slate-900 font-bold">
                      {notices[0]?.title}
                    </strong>
                    <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-3">
                      {notices[0]?.content}
                    </p>
                    <span className="text-[10px] text-slate-500 block font-mono pt-1">
                      Date: {notices[0]?.date}
                    </span>
                  </div>
                </div>

                {/* Library Reminder */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Library className="w-3.5 h-3.5 text-indigo-600" /> Issued Library Books
                  </h4>
                  {libraryBooks.length > 0 ? (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs space-y-1">
                      <p className="font-bold text-slate-900">{libraryBooks[0].bookTitle}</p>
                      <p className="text-[11px] text-slate-600">Return Due: <strong className="text-indigo-800">{libraryBooks[0].dueDate}</strong></p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No active books issued.</p>
                  )}
                </div>

                {/* Bus Route */}
                {student.transportOpted && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">School Transport</span>
                      <p className="font-bold text-slate-900">{student.busStopName}</p>
                      <p className="text-[11px] text-slate-500">Route Code: {student.busRouteId} (Morning: 07:05 AM)</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Weekly Class Timetable
                </h2>
                <p className="text-xs text-slate-500">
                  Class {student.classId} - Section {student.section} • Room 204 (Aryabhata Wing)
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Timetable
              </button>
            </div>

            <div className="space-y-6">
              {timetable.map((dayObj) => (
                <div key={dayObj.day} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between">
                    <span>{dayObj.day}</span>
                    <span className="text-amber-400 font-mono">6 Scheduled Periods</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
                    {dayObj.periods.map((p) => (
                      <div key={p.id} className="p-3 bg-white space-y-1">
                        <span className="font-bold text-[10px] uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                          Period {p.periodNumber} ({p.startTime})
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">{p.subject}</h4>
                        <p className="text-[11px] text-slate-600">{p.teacherName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{p.room}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE & LEAVE */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Attendance Record</h2>
                <p className="text-xs text-slate-500">Term 1 Assessment Session 2026-27</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 block">Total Working Days</span>
                  <span className="text-2xl font-bold text-emerald-900 font-serif">112</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 block">Days Present</span>
                  <span className="text-2xl font-bold text-emerald-900 font-serif">106</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-xs text-amber-800 block">Approved Leaves</span>
                  <span className="text-2xl font-bold text-amber-900 font-serif">6</span>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Subject-Wise Attendance Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { sub: 'Science (Physics & Chem)', pct: 96, attended: '48/50' },
                    { sub: 'Mathematics', pct: 94, attended: '47/50' },
                    { sub: 'English Literature', pct: 92, attended: '46/50' },
                    { sub: 'Social Sciences', pct: 95, attended: '38/40' },
                    { sub: 'Information Technology Lab', pct: 98, attended: '29/30' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 font-medium">{item.sub}</strong>
                        <span className="text-slate-500 text-[11px] block">{item.attended} periods attended</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 font-mono">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Leave Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold font-serif text-slate-900 mb-1">
                Apply for Student Leave
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Applications are routed directly to Mr. Vikram Malhotra (Class Teacher).
              </p>

              {leaveSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1">
                  <strong className="block font-bold">Leave Application Lodged</strong>
                  <p>Your leave notification has been registered and forwarded to your class teacher.</p>
                </div>
              ) : (
                <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Number of Days</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={leaveDays}
                      onChange={(e) => setLeaveDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Reason for Absence</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. Attending sibling wedding / viral illness..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition"
                  >
                    Submit Leave Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Homework & Assignment Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Class {student.classId}-{student.section} Curriculum Assignments
              </p>
            </div>

            <div className="space-y-4">
              {homeworks.map((hw) => {
                const sub = submissions.find(s => s.homeworkId === hw.id);
                const isSubmitted = !!sub;

                return (
                  <div
                    key={hw.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {hw.subject}
                        </span>
                        <span className="text-xs text-slate-500">
                          Assigned by: <strong>{hw.teacherName}</strong>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{hw.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span>Assigned: {hw.assignedDate}</span>
                        <span>•</span>
                        <span className="font-semibold text-amber-800">Due Date: {hw.dueDate}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isSubmitted ? (
                        <div className="p-3 bg-white border border-emerald-200 rounded-xl text-xs text-left space-y-1">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Submitted
                          </span>
                          <span className="text-[10px] text-slate-500 block">At: {sub.submittedAt}</span>
                          {sub.grade && (
                            <div className="mt-1 pt-1 border-t border-slate-100">
                              <span className="text-xs font-bold text-amber-700">Grade: {sub.grade}</span>
                              <p className="text-[11px] text-slate-600 italic">"{sub.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubmittingHw(hw)}
                          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" /> Submit Response
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Modal */}
            {submittingHw && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
                  <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                    Submit: {submittingHw.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{submittingHw.subject} • Due {submittingHw.dueDate}</p>

                  <form onSubmit={handleHomeworkSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Notes / Solution Description</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Write your answer or mention details of your physical worksheet submission..."
                        value={hwContent}
                        onChange={(e) => setHwContent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      ></textarea>
                    </div>

                    <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-500">
                      <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                      <p className="text-[11px] font-semibold text-slate-700">Simulate Document Attachment</p>
                      <p className="text-[10px]">Attaches {student.firstName}_{submittingHw.subject.slice(0, 4)}_Solutions.pdf</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmittingHw(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                      >
                        Confirm Submission
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EXAMS & SYLLABUS */}
        {activeTab === 'exams' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Examination Schedules & Syllabus
              </h2>
              <p className="text-xs text-slate-500">Board Alignment: Class 10 (AISSE Pattern)</p>
            </div>

            <div className="space-y-6">
              {exams.map((ex) => (
                <div key={ex.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        {ex.status}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-serif mt-1">{ex.name}</h3>
                      <p className="text-xs text-slate-500">Duration: {ex.startDate} to {ex.endDate}</p>
                    </div>
                  </div>

                  {ex.schedule.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-300 text-slate-600 font-semibold bg-white">
                            <th className="py-2 px-3">Date & Day</th>
                            <th className="py-2 px-3">Time</th>
                            <th className="py-2 px-3">Subject</th>
                            <th className="py-2 px-3">Room / Hall</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ex.schedule.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-200 bg-white">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">{item.date} ({item.day})</td>
                              <td className="py-2.5 px-3 font-mono text-slate-700">{item.time}</td>
                              <td className="py-2.5 px-3 font-bold text-amber-900">{item.subject}</td>
                              <td className="py-2.5 px-3 text-slate-600">{item.room}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Datesheet concluded. Results available in Results section.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: RESULTS & REPORT CARD */}
        {activeTab === 'results' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Academic Results & Terminal Evaluation
                </h2>
                <p className="text-xs text-slate-500">Official Consolidated Performance Ledger</p>
              </div>

              {reportCard && (
                <button
                  onClick={() => setShowPrintReport(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" /> View & Print Official Report Card
                </button>
              )}
            </div>

            {reportCard ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Marks</span>
                    <span className="text-xl font-bold text-slate-900 font-serif">{reportCard.grandTotal} / {reportCard.maxPossible}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Percentage</span>
                    <span className="text-xl font-bold text-emerald-700 font-serif">{reportCard.percentage}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Overall Grade</span>
                    <span className="text-xl font-bold text-blue-700 font-serif">{reportCard.overallGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Class Rank</span>
                    <span className="text-xl font-bold text-amber-700 font-serif">#{reportCard.rankInClass}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5 text-center">Theory</th>
                        <th className="p-2.5 text-center">Practical / IA</th>
                        <th className="p-2.5 text-center font-bold">Total Marks</th>
                        <th className="p-2.5 text-center font-bold">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportCard.subjectMarks.map((s, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="p-2.5 font-medium text-slate-900">{s.subject}</td>
                          <td className="p-2.5 text-center">{s.theoryObtained} / {s.maxTheory}</td>
                          <td className="p-2.5 text-center">{s.practicalObtained} / {s.maxPractical}</td>
                          <td className="p-2.5 text-center font-bold text-slate-900">{s.totalObtained} / {s.totalMax}</td>
                          <td className="p-2.5 text-center font-bold text-blue-700">{s.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Report cards will be published after the conclusion of Mid-Term exams.</p>
            )}
          </div>
        )}

        {/* TAB 7: FEES & RECEIPTS */}
        {activeTab === 'fees' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                School Fee Ledger & Online Dues
              </h2>
              <p className="text-xs text-slate-500">
                Tuition, Laboratory, Bus Transport & Activity Invoices
              </p>
            </div>

            {/* Invoices */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Quarterly Fee Invoices
              </h3>
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {inv.status}
                        </span>
                        <span className="font-mono text-slate-500">{inv.invoiceNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{inv.quarter}</h4>
                      <p className="text-slate-600">Total: ₹{inv.amount.toLocaleString('en-IN')} • Due: {inv.dueDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {inv.balanceAmount > 0 ? (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Pay Due ₹{inv.balanceAmount.toLocaleString('en-IN')}
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Settled in Full
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Receipts */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Payment History & Official Receipts
              </h3>
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.receiptNumber}</p>
                      <p className="text-slate-500">{p.paymentDate} • Mode: {p.paymentMode}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-800 text-sm font-mono">₹{p.amount.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => setShowPrintReceipt(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Modal */}
            {payingInvoice && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
                  <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                    Complete School Fee Deposit
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{payingInvoice.quarter} • Amount: ₹{payingInvoice.balanceAmount.toLocaleString('en-IN')}</p>

                  <form onSubmit={handlePayFee} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['UPI', 'Card', 'Net Banking'] as const).map((mode) => (
                          <button
                            type="button"
                            key={mode}
                            onClick={() => setPaymentMode(mode)}
                            className={`p-2.5 rounded-xl border text-center font-bold ${
                              paymentMode === mode ? 'border-amber-600 bg-amber-50 text-amber-900' : 'border-slate-300'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] space-y-1">
                      <p>✓ Instant official transaction validation</p>
                      <p>✓ Immediate downloadable CBSE-compliant receipt</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPayingInvoice(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800"
                      >
                        Pay ₹{payingInvoice.balanceAmount.toLocaleString('en-IN')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: LIBRARY */}
        {activeTab === 'library' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                School Library & Borrowing History
              </h2>
              <p className="text-xs text-slate-500">Library Pass: {student.libraryCardNo || 'LIB-STU-412'}</p>
            </div>

            <div className="space-y-3">
              {libraryBooks.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{b.bookTitle}</h4>
                    <p className="text-slate-500">Issued: {b.issueDate} • Due: <strong className="text-indigo-800">{b.dueDate}</strong></p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold uppercase text-[10px]">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md">
                  <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">{student.fullName}</h2>
                  <p className="text-xs text-slate-500 font-mono">Admission No: {student.admissionNumber} • ID: {student.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Edit className="w-4 h-4" /> Edit Personal Details
                </button>
                <button
                  onClick={() => setShowPrintID(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> Print Student ID Card
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Academic & Bio Details</h4>
                <p><span className="text-slate-500">Class & Section:</span> Class {student.classId}-{student.section}</p>
                <p><span className="text-slate-500">Roll Number:</span> {student.rollNumber}</p>
                <p><span className="text-slate-500">Date of Birth:</span> {student.dob}</p>
                <p><span className="text-slate-500">Blood Group:</span> <strong className="text-red-600">{student.bloodGroup}</strong></p>
                <p><span className="text-slate-500">Aadhaar / National ID:</span> {student.aadharNumber}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Parent & Guardian Contacts</h4>
                <p><span className="text-slate-500">Father's Name:</span> {student.fatherName} ({student.fatherOccupation})</p>
                <p><span className="text-slate-500">Father's Phone:</span> {student.fatherPhone}</p>
                <p><span className="text-slate-500">Mother's Name:</span> {student.motherName} ({student.motherOccupation})</p>
                <p><span className="text-slate-500">Emergency Phone:</span> {student.emergencyContact}</p>
                <p><span className="text-slate-500">Registered Email:</span> {student.guardianEmail}</p>
              </div>

              <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Residential & Route Information</h4>
                <p><span className="text-slate-500">Permanent Address:</span> {student.permanentAddress}</p>
                <p><span className="text-slate-500">School Transport:</span> {student.transportOpted ? `Route ${student.busRouteId} (${student.busStopName})` : 'Private Transport / Walker'}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Update Student & Contact Information
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Admission: {student.admissionNumber} • ID: {student.id}
                </p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.firstName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.lastName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's / Guardian Phone</label>
                  <input
                    type="tel"
                    required
                    value={editProfileForm.fatherPhone}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, fatherPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    required
                    value={editProfileForm.emergencyContact}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Registered Email</label>
                <input
                  type="email"
                  required
                  value={editProfileForm.guardianEmail}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, guardianEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  required
                  value={editProfileForm.permanentAddress}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT REPORT CARD MODAL */}
      {showPrintReport && reportCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setShowPrintReport(false)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer no-print border border-rose-400 transition"
          >
            <X className="w-4 h-4" /> Close
          </button>
          <div className="max-w-4xl w-full my-8">
            <PrintableReportCard
              reportCard={reportCard}
              settings={settings}
              onClose={() => setShowPrintReport(false)}
            />
          </div>
        </div>
      )}

      {/* PRINT RECEIPT MODAL */}
      {showPrintReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setShowPrintReceipt(null)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer no-print border border-rose-400 transition"
          >
            <X className="w-4 h-4" /> Close
          </button>
          <div className="max-w-2xl w-full my-8">
            <PrintableFeeReceipt
              payment={showPrintReceipt}
              settings={settings}
              onClose={() => setShowPrintReceipt(null)}
            />
          </div>
        </div>
      )}

      {/* PRINT ID CARD MODAL */}
      {showPrintID && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setShowPrintID(false)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer no-print border border-rose-400 transition"
          >
            <X className="w-4 h-4" /> Close
          </button>
          <div className="max-w-3xl w-full my-8">
            <PrintableIDCard
              entity={student}
              type="student"
              settings={settings}
              onClose={() => setShowPrintID(false)}
              onEdit={() => {
                setShowPrintID(false);
                setShowEditProfileModal(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

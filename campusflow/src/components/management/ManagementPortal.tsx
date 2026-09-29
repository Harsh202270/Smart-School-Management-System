/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Student,
  Teacher,
  ClassSection,
  Subject,
  DayTimetable,
  AttendanceRecord,
  QuestionPaper,
  Exam,
  MarksEntry,
  ReportCard,
  FeeInvoice,
  FeePayment,
  PayrollRecord,
  LibraryBook,
  TransportVehicle,
  TransportRoute,
  Notice,
  SchoolEvent,
  LeaveRequest,
  CertificateRecord,
  AuditLog,
  SchoolSettings
} from '../../types/school';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Banknote,
  Library,
  Bus,
  Bell,
  Award,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  Printer,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  LogOut,
  ChevronRight,
  TrendingUp,
  Download,
  Filter,
  Edit,
  X,
  Menu,
  Check,
  CircleHelp
} from 'lucide-react';
import { PrintableReportCard } from '../print/PrintableReportCard';
import { PrintableFeeReceipt } from '../print/PrintableFeeReceipt';
import { PrintableIDCard } from '../print/PrintableIDCard';
import { PrintableQuestionPaper } from '../print/PrintableQuestionPaper';
import { PrintableCertificate } from '../print/PrintableCertificate';

interface Props {
  onBackToWebsite: () => void;
}

export const ManagementPortal: React.FC<Props> = ({ onBackToWebsite }) => {
  const { user, logout, quickSwitch } = useAuth();
  const [activeModule, setActiveModule] = useState<
    | 'dashboard'
    | 'students'
    | 'teachers'
    | 'classes'
    | 'timetable'
    | 'exams'
    | 'fees'
    | 'payroll'
    | 'library'
    | 'transport'
    | 'notices'
    | 'events'
    | 'id-cards'
    | 'certificates'
    | 'settings'
    | 'audit-logs'
  >('dashboard');

  // Mobile menu drawer toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState<SchoolSettings>(storage.getSettings());
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(storage.getTeachers());
  const [classes, setClasses] = useState<ClassSection[]>(storage.getClasses());
  const [subjects, setSubjects] = useState<Subject[]>(storage.getSubjects());
  const [timetable, setTimetable] = useState<DayTimetable[]>(storage.getTimetable('10-A'));
  const [invoices, setInvoices] = useState<FeeInvoice[]>(storage.getInvoices());
  const [payments, setPayments] = useState<FeePayment[]>(storage.getPayments());
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(storage.getPayrolls());
  const [books, setBooks] = useState<LibraryBook[]>(storage.getBooks());
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(storage.getVehicles());
  const [routes, setRoutes] = useState<TransportRoute[]>(storage.getRoutes());
  const [notices, setNotices] = useState<Notice[]>(storage.getNotices());
  const [events, setEvents] = useState<SchoolEvent[]>(storage.getEvents());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(storage.getLeaves());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(storage.getCertificates());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(storage.getAuditLogs());
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(storage.getQuestionPapers());

  // Search & Filter state
  const [globalSearch, setGlobalSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [classWingFilter, setClassWingFilter] = useState('All');
  const [idCardTypeTab, setIdCardTypeTab] = useState<'students' | 'teachers'>('students');
  const [idCardClassFilter, setIdCardClassFilter] = useState('All');

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Edit Teacher Modal state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    fullName: '',
    designation: 'TGT General Science',
    department: 'Science' as const,
    qualification: 'M.Sc., B.Ed.',
    experienceYears: 4,
    phone: '+91 98110-33441',
    email: 'teacher@riversidepublic.edu.in',
    basicSalary: 55000
  });

  // Add / Edit Class Modal state
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);
  const [classForm, setClassForm] = useState({
    classNumber: 'Nursery',
    section: 'A',
    roomNumber: 'Room 101',
    classTeacherName: 'Mrs. Pooja Sharma',
    capacity: 35,
    subjects: 'English, Mathematics, General Studies'
  });

  // Admission Wizard state
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [admissionStep, setAdmissionStep] = useState(1);
  const [showBusRouteModal, setShowBusRouteModal] = useState(false);
  const [newAdmission, setNewAdmission] = useState({
    firstName: '',
    lastName: '',
    classId: 'Nursery',
    section: 'A',
    rollNumber: 1,
    dob: '2023-01-15',
    gender: 'Male' as const,
    bloodGroup: 'B+',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    guardianEmail: '',
    permanentAddress: '',
    transportOpted: false,
    busRouteId: '',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80'
  });

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [printDoc, setPrintDoc] = useState<{ type: string; data: any } | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // New Notice state
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNoticeData, setNewNoticeData] = useState({
    title: '',
    category: 'Academic' as const,
    targetAudience: 'All' as const,
    content: '',
    isImportant: false
  });

  // New Certificate state
  const [showIssueCert, setShowIssueCert] = useState(false);
  const [certData, setCertData] = useState({
    studentId: '',
    type: 'Bonafide' as const,
    reasonOrAchievement: 'Required for passport application.'
  });

  // Subscriptions to storage
  useEffect(() => {
    const unsubStudents = storage.subscribe('campusflow_students', () => setStudents(storage.getStudents()));
    const unsubTeachers = storage.subscribe('campusflow_teachers', () => setTeachers(storage.getTeachers()));
    const unsubClasses = storage.subscribe('campusflow_classes', () => setClasses(storage.getClasses()));
    const unsubInvoices = storage.subscribe('campusflow_invoices', () => setInvoices(storage.getInvoices()));
    const unsubPayments = storage.subscribe('campusflow_payments', () => setPayments(storage.getPayments()));
    const unsubNotices = storage.subscribe('campusflow_notices', () => setNotices(storage.getNotices()));
    const unsubLeaves = storage.subscribe('campusflow_leaves', () => setLeaves(storage.getLeaves()));
    const unsubAudit = storage.subscribe('campusflow_audit_logs', () => setAuditLogs(storage.getAuditLogs()));
    return () => {
      unsubStudents();
      unsubTeachers();
      unsubClasses();
      unsubInvoices();
      unsubPayments();
      unsubNotices();
      unsubLeaves();
      unsubAudit();
    };
  }, []);

  // Save edited student
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    storage.updateStudent(editingStudent.id, {
      fullName: `${editingStudent.firstName} ${editingStudent.lastName}`,
      firstName: editingStudent.firstName,
      lastName: editingStudent.lastName,
      classId: editingStudent.classId,
      section: editingStudent.section,
      rollNumber: Number(editingStudent.rollNumber),
      dob: editingStudent.dob,
      bloodGroup: editingStudent.bloodGroup,
      status: editingStudent.status,
      fatherName: editingStudent.fatherName,
      fatherPhone: editingStudent.fatherPhone,
      guardianEmail: editingStudent.guardianEmail,
      permanentAddress: editingStudent.permanentAddress,
      transportOpted: editingStudent.transportOpted,
      busRouteId: editingStudent.transportOpted ? (editingStudent.busRouteId || 'R-01') : undefined
    });
    setStudents(storage.getStudents());
    setEditingStudent(null);
  };

  // Save edited teacher
  const handleSaveTeacherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    storage.updateTeacher(editingTeacher.id, {
      fullName: editingTeacher.fullName,
      employeeCode: editingTeacher.employeeCode,
      designation: editingTeacher.designation,
      department: editingTeacher.department,
      qualification: editingTeacher.qualification,
      experienceYears: Number(editingTeacher.experienceYears),
      phone: editingTeacher.phone,
      email: editingTeacher.email,
      status: editingTeacher.status,
      salary: editingTeacher.salary
    });
    setTeachers(storage.getTeachers());
    setEditingTeacher(null);
  };

  // Add or Edit class
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const subList = classForm.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const classId = `${classForm.classNumber}-${classForm.section}`;

    if (editingClass) {
      storage.updateClass(editingClass.id, {
        classNumber: classForm.classNumber,
        section: classForm.section,
        roomNumber: classForm.roomNumber,
        classTeacherName: classForm.classTeacherName,
        capacity: Number(classForm.capacity),
        subjects: subList
      });
    } else {
      storage.addClass({
        id: classId,
        classNumber: classForm.classNumber,
        section: classForm.section,
        roomNumber: classForm.roomNumber,
        classTeacherId: 'EMP-T-GEN',
        classTeacherName: classForm.classTeacherName,
        capacity: Number(classForm.capacity),
        studentCount: 0,
        subjects: subList
      });
    }
    setClasses(storage.getClasses());
    setShowClassModal(false);
    setEditingClass(null);
  };

  // Delete class division
  const handleDeleteClass = (id: string, label: string) => {
    if (confirm(`Are you sure you want to remove ${label}? This cannot be undone.`)) {
      storage.deleteClass(id);
      setClasses(storage.getClasses());
    }
  };

  // Appoint new teacher
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addTeacher({
      employeeCode: `RPS-FAC-${Math.floor(130 + Math.random() * 70)}`,
      fullName: newTeacherForm.fullName,
      designation: newTeacherForm.designation,
      department: newTeacherForm.department,
      qualification: newTeacherForm.qualification,
      experienceYears: Number(newTeacherForm.experienceYears),
      joiningDate: new Date().toISOString().split('T')[0],
      email: newTeacherForm.email,
      phone: newTeacherForm.phone,
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
      status: 'Active',
      assignedClasses: [],
      salary: {
        basic: Number(newTeacherForm.basicSalary),
        hra: Math.round(Number(newTeacherForm.basicSalary) * 0.24),
        da: Math.round(Number(newTeacherForm.basicSalary) * 0.18),
        allowances: 4000,
        deductions: Math.round(Number(newTeacherForm.basicSalary) * 0.12)
      }
    });
    setTeachers(storage.getTeachers());
    setShowAddTeacherModal(false);
    setNewTeacherForm({
      fullName: '',
      designation: 'TGT General Science',
      department: 'Science',
      qualification: 'M.Sc., B.Ed.',
      experienceYears: 4,
      phone: '+91 98110-33441',
      email: 'teacher@riversidepublic.edu.in',
      basicSalary: 55000
    });
  };

  // Complete Admission Wizard
  const handleCompleteAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const created = storage.addStudent({
      admissionNumber: `RPS/2026/${500 + students.length + 1}`,
      rollNumber: Number(newAdmission.rollNumber),
      firstName: newAdmission.firstName,
      lastName: newAdmission.lastName,
      fullName: `${newAdmission.firstName} ${newAdmission.lastName}`,
      gender: newAdmission.gender,
      dob: newAdmission.dob,
      bloodGroup: newAdmission.bloodGroup,
      aadharNumber: `4829-1029-${Math.floor(1000 + Math.random() * 9000)}`,
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
      classId: newAdmission.classId,
      section: newAdmission.section,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      category: 'General',
      fatherName: newAdmission.fatherName,
      fatherOccupation: newAdmission.fatherOccupation,
      fatherPhone: newAdmission.fatherPhone,
      motherName: newAdmission.motherName,
      motherOccupation: 'Professional',
      motherPhone: newAdmission.fatherPhone,
      guardianEmail: newAdmission.guardianEmail || 'parent@gmail.com',
      emergencyContact: newAdmission.fatherPhone,
      permanentAddress: newAdmission.permanentAddress,
      currentAddress: newAdmission.permanentAddress,
      transportOpted: newAdmission.transportOpted,
      busRouteId: newAdmission.transportOpted
        ? newAdmission.busRouteId
        : undefined,
      busStopName: undefined
    });
    setStudents(storage.getStudents());
    setShowAdmissionModal(false);
    setAdmissionStep(1);
    setSelectedStudentForProfile(created);
  };

  // Delete student
  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete record for ${name}?`)) {
      storage.deleteStudent(id);
      setStudents(storage.getStudents());
    }
  };

  // Delete teacher
  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove faculty record for ${name}?`)) {
      storage.deleteTeacher(id);
      setTeachers(storage.getTeachers());
    }
  };

  // Leave review
  const handleReviewLeave = (id: string, status: 'Approved' | 'Rejected') => {
    storage.updateLeaveStatus(id, status, 'Dr. Ananya Sharma');
    setLeaves(storage.getLeaves());
  };

  // Publish Notice
  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addNotice({
      ...newNoticeData,
      date: new Date().toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Dr. Ananya Sharma (Principal)'
    });
    setNotices(storage.getNotices());
    setShowAddNotice(false);
    setNewNoticeData({
      title: '',
      category: 'Academic',
      targetAudience: 'All',
      content: '',
      isImportant: false
    });
  };

  // Issue Certificate
  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.id === certData.studentId) || students[0];
    const newCert = storage.generateCertificate({
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      admissionNumber: targetStudent.admissionNumber,
      classNumber: targetStudent.classId,
      section: targetStudent.section,
      type: certData.type as any,
      issueDate: new Date().toISOString().split('T')[0],
      reasonOrAchievement: certData.reasonOrAchievement,
      signedBy: 'Dr. Ananya Sharma (Principal)'
    });
    setCertificates(storage.getCertificates());
    setShowIssueCert(false);
    setPrintDoc({ type: 'certificate', data: newCert });
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateSettings(settingsForm);
    setSettings(updated);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Dynamic unique list of classes ordered logically from Pre-Primary through Senior Secondary
  const orderRank: Record<string, number> = {
    playgroup: 0,
    nursery: 1,
    lkg: 2,
    ukg: 3,
    kg: 4,
    '1': 10, '2': 20, '3': 30, '4': 40, '5': 50,
    '6': 60, '7': 70, '8': 80, '9': 90, '10': 100,
    '11': 110, '12': 120
  };

  const distinctClasses = Array.from(new Set(classes.map(c => c.classNumber))).sort((a, b) => {
    const rankA = orderRank[a.toLowerCase()] ?? (parseInt(a, 10) * 10 || 999);
    const rankB = orderRank[b.toLowerCase()] ?? (parseInt(b, 10) * 10 || 999);
    return rankA - rankB;
  });

  const getWingForClass = (classNumber: string): string => {
    const lower = classNumber.toLowerCase();
    if (['nursery', 'lkg', 'ukg', 'playgroup', 'kg'].includes(lower)) return 'Pre-Primary';
    const num = parseInt(classNumber, 10);
    if (!isNaN(num)) {
      if (num >= 1 && num <= 5) return 'Primary';
      if (num >= 6 && num <= 8) return 'Middle';
      if (num >= 9 && num <= 10) return 'Secondary';
      if (num >= 11 && num <= 12) return 'Senior Secondary';
    }
    return 'Other';
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesClass = studentClassFilter === 'All' || s.classId.toLowerCase() === studentClassFilter.toLowerCase();
    const matchesSearch =
      s.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.classId.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Calculate Metrics
  const totalFeesCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalFeesPending = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);

  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Management', icon: GraduationCap },
    { id: 'teachers', label: 'Faculty & Staff', icon: Users },
    { id: 'classes', label: 'Classes & Structure', icon: BookOpen },
    { id: 'timetable', label: 'Master Timetable', icon: Clock },
    { id: 'exams', label: 'Exams & Question Papers', icon: FileText },
    { id: 'fees', label: 'Fee Accounts & Dues', icon: CreditCard },
    { id: 'payroll', label: 'Staff Payroll & Slips', icon: Banknote },
    { id: 'library', label: 'Central Library', icon: Library },
    { id: 'transport', label: 'Transport & Fleet', icon: Bus },
    { id: 'notices', label: 'Notices & Circulars', icon: Bell },
    { id: 'events', label: 'School Calendar', icon: Calendar },
    { id: 'id-cards', label: 'ID Card Studio', icon: QrCode },
    { id: 'certificates', label: 'Certificates & TC', icon: Award },
    { id: 'settings', label: 'School Settings', icon: Settings },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: ShieldCheck }
  ];

  return (
    <div className="h-full min-h-0 flex flex-col bg-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button with clear Menu text and toggle icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-400 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </button>

            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-lg flex items-center justify-center border border-white shrink-0">
              R
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif text-white tracking-tight leading-tight">
                {settings.schoolName}
              </h1>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                Central Operations Command & Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Switch:</span>
              <button
                onClick={() => quickSwitch('student')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Student
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => quickSwitch('teacher')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Teacher
              </button>
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=120&auto=format&fit=crop&q=80"
                  alt="Dr. Ananya Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-white leading-tight">{settings.principalName}</p>
                <p className="text-[10px] text-amber-400">Principal & Administration Head</p>
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
      </header>

      {/* Main Body: Independent Side Navigation & Main Workspace */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* MOBILE MENU BACKDROP */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs"
          ></div>
        )}

        {/* SIDEBAR NAVIGATION - INDEPENDENT SCROLL */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 h-full bg-slate-950 text-slate-300 p-4 shrink-0 border-r border-slate-800
            transform transition-transform duration-300 ease-in-out overflow-y-auto
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex justify-between items-center pb-3 mb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${activeModule === item.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* WORKSPACE CONTENT AREA - SCROLLS INDEPENDENTLY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          {/* 1. OPERATIONS DASHBOARD */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Academic Year {settings.academicYear} • Term 1
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-slate-950 mt-1">
                    Good Morning, Dr. Sharma
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Here's what's happening around  today.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveModule('students');
                      setShowAdmissionModal(true);
                    }}
                    className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Admit New Student
                  </button>
                  <button
                    onClick={() => setShowAddNotice(true)}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-600 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" /> Broadcast Notice
                  </button>
                </div>
              </div>

              {/* Statistics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Enrolled Students</span>
                  <span className="text-2xl font-black text-slate-900 font-serif">{students.length * 35 + 24}</span>
                  <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Across All Grades</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Teaching Faculty</span>
                  <span className="text-2xl font-black text-slate-900 font-serif">{teachers.length}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">100% Present Today</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Active Classes</span>
                  <span className="text-2xl font-black text-amber-700 font-serif">{classes.length}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Nursery to XII</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Today's Attendance</span>
                  <span className="text-2xl font-black text-emerald-700 font-serif">94.8%</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">High consistency</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Pending Fees</span>
                  <span className="text-2xl font-black text-red-700 font-serif font-mono">₹12.4L</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Active collection</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block">Transport Fleet</span>
                  <span className="text-2xl font-black text-slate-900 font-serif">24 Buses</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">All routes normal</span>
                </div>
              </div>

              {/* Operations Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Leave Requests */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" /> Pending Leave Applications ({leaves.filter(l => l.status === 'Pending').length})
                    </h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    {leaves.map((leave) => (
                      <div key={leave.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{leave.applicantName}</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-semibold">{leave.applicantType}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5 line-clamp-1">"{leave.reason}"</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {leave.startDate} to {leave.endDate} ({leave.days} Day{leave.days > 1 ? 's' : ''})
                          </span>
                        </div>
                        <div>
                          {leave.status === 'Pending' ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleReviewLeave(leave.id, 'Approved')}
                                className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewLeave(leave.id, 'Rejected')}
                                className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {leave.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Security Audit Logs */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Recent Operations Audit Log
                    </h3>
                    <button onClick={() => setActiveModule('audit-logs')} className="text-xs text-amber-700 font-semibold hover:underline">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.userName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">{log.role}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{log.timestamp.slice(11, 16)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENT MANAGEMENT */}
          {activeModule === 'students' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Student Information System
                  </h2>
                  <p className="text-xs text-slate-500">
                    Permanent Records, Admissions, Fee Status & Profiles
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAdmissionModal(true)}
                    className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> 7-Step Student Admission
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID or admission no..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs overflow-x-auto py-1 max-w-full">
                  <span className="text-slate-500 font-semibold shrink-0">Filter Grade:</span>
                  <button
                    onClick={() => setStudentClassFilter('All')}
                    className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${studentClassFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                  >
                    All Grades
                  </button>
                  {distinctClasses.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setStudentClassFilter(cls)}
                      className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${studentClassFilter === cls ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">ID / Adm No</th>
                      <th className="p-2.5">Class & Roll</th>
                      <th className="p-2.5">Parent Contacts</th>
                      <th className="p-2.5">Transport</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-900 flex items-center gap-2">
                          <img src={s.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                          <span>{s.fullName}</span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-600">
                          <div>{s.id}</div>
                          <div className="text-[10px] text-slate-400">{s.admissionNumber}</div>
                        </td>
                        <td className="p-2.5">
                          <span className="font-semibold text-slate-800">{s.classId}-{s.section}</span> (Roll #{s.rollNumber})
                        </td>
                        <td className="p-2.5">
                          <p className="font-medium text-slate-800">{s.fatherName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.fatherPhone}</p>
                        </td>
                        <td className="p-2.5">
                          {s.transportOpted ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Route {s.busRouteId || 'R-01'}
                            </span>
                          ) : (
                            <span className="text-slate-400">Self / Walker</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForProfile(s)}
                              className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-medium hover:bg-slate-800 cursor-pointer"
                              title="View Full Profile"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Edit Student Information"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => setPrintDoc({ type: 'idcard', data: s })}
                              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                              title="Print ID Card"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.fullName)}
                              className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TEACHERS & STAFF */}
          {activeModule === 'teachers' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Faculty & Pedagogical Staff Directory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage faculty profiles, qualifications, department appointments, and basic salaries
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Appoint Faculty Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((t) => (
                  <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-xs transition">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={t.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{t.fullName}</h4>
                          <p className="text-xs text-amber-700 font-medium">{t.designation}</p>
                          <span className="text-[10px] font-mono text-slate-500">{t.employeeCode}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">
                        <p><span className="text-slate-400">Dept:</span> <strong className="text-slate-700">{t.department}</strong></p>
                        <p><span className="text-slate-400">Experience:</span> {t.experienceYears} Years</p>
                        <p><span className="text-slate-400">Qualification:</span> {t.qualification}</p>
                        <p><span className="text-slate-400">Contact:</span> {t.phone}</p>
                        <p><span className="text-slate-400">Email:</span> {t.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-emerald-800">Basic: ₹{t.salary.basic.toLocaleString('en-IN')}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingTeacher(t)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Edit Faculty Details"
                        >
                          <Edit className="w-3 h-3" /> Edit Profile
                        </button>
                        <button
                          onClick={() => setPrintDoc({ type: 'teacher-id', data: t })}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Print Faculty Pass"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Pass
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(t.id, t.fullName)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition"
                          title="Remove Faculty Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CLASSES & SECTIONS */}
          {activeModule === 'classes' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    School Class & Academic Structure Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customizable school divisions: Nursery, LKG, UKG, and Grades 1 through 12
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingClass(null);
                    setClassForm({
                      classNumber: '',
                      section: 'A',
                      roomNumber: 'Room 101',
                      classTeacherName: 'Assigned Teacher',
                      capacity: 35,
                      subjects: 'English, Mathematics, Science'
                    });
                    setShowClassModal(true);
                  }}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Grade / Division
                </button>
              </div>

              {/* Wing Categorization Filter */}
              <div className="flex items-center gap-2 text-xs overflow-x-auto py-1">
                <span className="text-slate-500 font-semibold shrink-0">Filter Wing:</span>
                {[
                  { id: 'All', label: 'All Wings' },
                  { id: 'Pre-Primary', label: 'Pre-Primary (Nursery, LKG, UKG)' },
                  { id: 'Primary', label: 'Primary (Grades 1-5)' },
                  { id: 'Middle', label: 'Middle (Grades 6-8)' },
                  { id: 'Secondary', label: 'Secondary (Grades 9-10)' },
                  { id: 'Senior Secondary', label: 'Senior Secondary (Grades 11-12)' }
                ].map((wing) => (
                  <button
                    key={wing.id}
                    onClick={() => setClassWingFilter(wing.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${classWingFilter === wing.id
                      ? 'bg-slate-900 text-amber-400 font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {wing.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes
                  .filter(c => classWingFilter === 'All' || getWingForClass(c.classNumber) === classWingFilter)
                  .map((c) => {
                    const enrolledCount = students.filter(
                      s => s.classId.toLowerCase() === c.classNumber.toLowerCase() && s.section.toLowerCase() === c.section.toLowerCase()
                    ).length;
                    const wingLabel = getWingForClass(c.classNumber);

                    return (
                      <div key={c.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-xs transition">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-lg font-bold text-slate-900 font-serif block">
                                {c.classNumber}-{c.section}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                                {wingLabel} Wing
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold font-mono">
                              {enrolledCount} Enrolled / {c.capacity} Max
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 mt-2.5">
                            <p><span className="text-slate-400">Class Teacher:</span> <strong className="text-slate-800">{c.classTeacherName}</strong></p>
                            <p><span className="text-slate-400">Allocated Room:</span> {c.roomNumber}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-200 mt-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Enrolled Subjects</span>
                            <div className="flex flex-wrap gap-1">
                              {c.subjects.map((sub, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] rounded text-slate-700">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setStudentClassFilter(c.classNumber);
                              setActiveModule('students');
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                            title="View student list for this class"
                          >
                            <Users className="w-3.5 h-3.5 text-amber-600" /> Students ({enrolledCount})
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingClass(c);
                                setClassForm({
                                  classNumber: c.classNumber,
                                  section: c.section,
                                  roomNumber: c.roomNumber,
                                  classTeacherName: c.classTeacherName,
                                  capacity: c.capacity,
                                  subjects: c.subjects.join(', ')
                                });
                                setShowClassModal(true);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Edit division settings"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClass(c.id, `Class ${c.classNumber}-${c.section}`)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                              title="Delete this class division"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 5. MASTER TIMETABLE */}
          {activeModule === 'timetable' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Master School Timetable & Conflict Engine
                  </h2>
                  <p className="text-xs text-slate-500">
                    Automatic room collision and faculty overlap prevention
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Master Grid
                </button>
              </div>

              <div className="space-y-4">
                {timetable.map((d) => (
                  <div key={d.day} className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-900 text-white px-4 py-2 font-bold flex justify-between">
                      <span>{d.day}</span>
                      <span className="text-amber-400 font-mono">Academic Schedule</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                      {d.periods.map((p) => (
                        <div key={p.id} className="p-3 bg-white space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">Period {p.periodNumber} ({p.startTime})</span>
                          <h5 className="font-bold text-slate-900">{p.subject}</h5>
                          <p className="text-[11px] text-slate-600">{p.teacherName}</p>
                          <p className="text-[10px] text-slate-400">{p.room}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. EXAMINATIONS & QUESTION PAPERS */}
          {activeModule === 'exams' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Examinations & Question Paper Central
                  </h2>
                  <p className="text-xs text-slate-500">
                    Term assessments, centralized question bank, and publish control
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionPapers.map((qp) => (
                  <div key={qp.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          {qp.status}
                        </span>
                        <span className="font-mono text-slate-500 text-xs">{qp.subjectCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{qp.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">Class {qp.classNumber} • {qp.maxMarks} Marks • {qp.durationMinutes} Mins</p>
                      <p className="text-[11px] text-slate-400 mt-1">Author: {qp.createdByName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => setPrintDoc({ type: 'question-paper', data: qp })}
                        className="px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable Paper Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FEES & BILLING */}
          {activeModule === 'fees' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Fee Accounts, Invoicing & Receipts
                  </h2>
                  <p className="text-xs text-slate-500">
                    Quarterly fee structures, online transactions and outstanding dues
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 block">Total Collected (YTD)</span>
                  <span className="text-2xl font-bold text-emerald-900 font-serif font-mono">₹{totalFeesCollected.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <span className="text-xs text-red-800 block">Total Pending Dues</span>
                  <span className="text-2xl font-bold text-red-900 font-serif font-mono">₹{totalFeesPending.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-600 block">Active Invoices</span>
                  <span className="text-2xl font-bold text-slate-900 font-serif">{invoices.length}</span>
                </div>
              </div>

              {/* Invoices list */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                      <th className="p-2.5">Invoice #</th>
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Quarter</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Balance</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-200">
                        <td className="p-2.5 font-mono">{inv.invoiceNumber}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{inv.studentName}</td>
                        <td className="p-2.5">{inv.quarter}</td>
                        <td className="p-2.5 font-mono">₹{inv.amount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 font-mono font-bold text-red-700">₹{inv.balanceAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. PAYROLL */}
          {activeModule === 'payroll' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Faculty & Staff Salary Disbursement Ledger
                  </h2>
                  <p className="text-xs text-slate-500">
                    Disbursement Slips, Basic Pay, Allowances & Deductions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {payrolls.map((pr) => (
                  <div key={pr.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pr.employeeName}</h4>
                      <p className="text-slate-500">{pr.designation} • {pr.month}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Slip: {pr.slipNumber}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 text-sm block">
                        Net: ₹{pr.netSalary.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Disbursed ({pr.paymentDate})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. LIBRARY */}
          {activeModule === 'library' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Central Digitized Library Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  Stock records, book tracking, racks, and circulation ledger
                </p>
              </div>

              <div className="space-y-3">
                {books.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{b.title}</h4>
                      <p className="text-slate-600">Author: {b.author} • Category: {b.category}</p>
                      <p className="text-[10px] font-mono text-slate-400">ISBN: {b.isbn} • Rack: {b.locationRack}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono block">
                        {b.availableCopies} / {b.totalCopies} Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. TRANSPORT */}
          {activeModule === 'transport' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  School Fleet & Transport Routing System
                </h2>
                <p className="text-xs text-slate-500">
                  GPS-monitored buses, verified drivers and route stops
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routes.map((r) => (
                  <div key={r.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-900">{r.routeName} ({r.routeCode})</h4>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">{r.busNumber}</span>
                    </div>
                    <p className="text-slate-600">Driver: <strong>{r.driverName}</strong> ({r.driverPhone})</p>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Stops</span>
                      {r.stops.map((st, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                          <span>{st.stopName}</span>
                          <span className="font-mono text-slate-500">{st.morningPickupTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. NOTICES */}
          {activeModule === 'notices' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Official Notice Board & Circular Broadcasts
                  </h2>
                  <p className="text-xs text-slate-500">
                    Targeted circulars for Students, Parents, or All Faculty
                  </p>
                </div>
                <button
                  onClick={() => setShowAddNotice(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Publish New Notice
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div key={n.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                          {n.category}
                        </span>
                        <span className="text-slate-500 font-mono">Date: {n.date}</span>
                      </div>
                      <span className="text-slate-400">Target: {n.targetAudience}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <p className="text-slate-700 leading-relaxed">{n.content}</p>
                    <p className="text-[11px] text-slate-400 italic">Issued by: {n.issuedBy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. ID CARD STUDIO */}
          {activeModule === 'id-cards' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Student & Faculty Identity Pass Studio
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official CR-80 identity passes with school crest, photo, emergency contacts & barcode
                  </p>
                </div>

                {/* Tab Switcher between Students and Teachers */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setIdCardTypeTab('students')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${idCardTypeTab === 'students'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Student Passes ({students.length})
                  </button>
                  <button
                    onClick={() => setIdCardTypeTab('teachers')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${idCardTypeTab === 'teachers'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Faculty Passes ({teachers.length})
                  </button>
                </div>
              </div>

              {/* Student Passes View */}
              {idCardTypeTab === 'students' && (
                <div className="space-y-4">
                  {/* Grade Filter for Student ID Cards */}
                  <div className="flex items-center gap-2 text-xs overflow-x-auto py-1">
                    <span className="text-slate-500 font-semibold shrink-0">Filter Grade:</span>
                    <button
                      onClick={() => setIdCardClassFilter('All')}
                      className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${idCardClassFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      All Grades
                    </button>
                    {distinctClasses.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setIdCardClassFilter(cls)}
                        className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${idCardClassFilter === cls ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students
                      .filter(s => idCardClassFilter === 'All' || s.classId.toLowerCase() === idCardClassFilter.toLowerCase())
                      .map((s) => (
                        <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={s.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                              <p className="text-slate-600 font-medium">Class {s.classId}-{s.section} • Roll #{s.rollNumber}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Adm: {s.admissionNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              title="Edit Student Details"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Details
                            </button>
                            <button
                              onClick={() => setPrintDoc({ type: 'idcard', data: s })}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              title="Preview & Print ID Pass"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Pass
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Faculty Passes View */}
              {idCardTypeTab === 'teachers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={t.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.fullName}</p>
                          <p className="text-amber-700 font-medium">{t.designation}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Code: {t.employeeCode}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => setEditingTeacher(t)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Edit Faculty Details"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Details
                        </button>
                        <button
                          onClick={() => setPrintDoc({ type: 'teacher-id', data: t })}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Preview & Print ID Pass"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 13. CERTIFICATES */}
          {activeModule === 'certificates' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Official Certificates & Transfer Certificates
                  </h2>
                  <p className="text-xs text-slate-500">
                    Bonafide, Character, Transfer & Academic Excellence records
                  </p>
                </div>
                <button
                  onClick={() => setShowIssueCert(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Issue Certificate
                </button>
              </div>

              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {cert.type}
                        </span>
                        <span className="font-mono text-slate-500">{cert.certificateNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.studentName}</h4>
                      <p className="text-slate-600">Class {cert.classNumber}-{cert.section} • Issued on {cert.issueDate}</p>
                    </div>

                    <button
                      onClick={() => setPrintDoc({ type: 'certificate', data: cert })}
                      className="px-3.5 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Certificate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. SETTINGS */}
          {activeModule === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  School Profile & Operational Identity
                </h2>
                <p className="text-xs text-slate-500">
                  Configure school name, motto, principal details, contact info and academic parameters
                </p>
              </div>

              {settingsSavedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> School configuration updated successfully across all portals.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">School Name</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.schoolName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, schoolName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">School Motto</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.motto}
                      onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.academicYear}
                      onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Principal Name</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.principalName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, principalName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Principal Welcome Message</label>
                  <textarea
                    rows={3}
                    required
                    value={settingsForm.principalMessage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, principalMessage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {/* 15. AUDIT LOGS */}
          {activeModule === 'audit-logs' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Institutional Security & Operation Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Tamper-evident record of all operational events across students, teachers, marks, and finances
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">User</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Module</th>
                      <th className="p-2.5">Action</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2.5 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{log.userName}</td>
                        <td className="p-2.5 font-mono">{log.role}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{log.module}</td>
                        <td className="p-2.5 font-mono text-[11px] text-amber-800 font-bold">{log.action}</td>
                        <td className="p-2.5 text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Edit Student Details
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {editingStudent.id} • Admission: {editingStudent.admissionNumber}
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.firstName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={editingStudent.classId}
                    onChange={(e) => setEditingStudent({ ...editingStudent, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    {distinctClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.section}
                    onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="number"
                    required
                    value={editingStudent.rollNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editingStudent.dob}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={editingStudent.bloodGroup}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editingStudent.fatherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Phone</label>
                  <input
                    type="tel"
                    value={editingStudent.fatherPhone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Email</label>
                <input
                  type="email"
                  value={editingStudent.guardianEmail}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Permanent Residential Address</label>
                <textarea
                  rows={2}
                  value={editingStudent.permanentAddress}
                  onChange={(e) => setEditingStudent({ ...editingStudent, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="editTransportOpt"
                  checked={editingStudent.transportOpted}
                  onChange={(e) => setEditingStudent({ ...editingStudent, transportOpted: e.target.checked })}
                  className="rounded text-amber-600"
                />
                <label htmlFor="editTransportOpt" className="font-semibold text-slate-800">
                  Enrolled in School Bus Transport Service
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Save Student Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Edit Faculty Profile
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Employee Code: {editingTeacher.employeeCode}
                </p>
              </div>
              <button
                onClick={() => setEditingTeacher(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeacherEdit} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.fullName}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.designation}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingTeacher.department}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Computers">Computers</option>
                    <option value="Arts & Sports">Arts & Sports</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.qualification}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teaching Experience (Years)</label>
                  <input
                    type="number"
                    required
                    value={editingTeacher.experienceYears}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingTeacher.phone}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Basic Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTeacher.salary?.basic || 60000}
                    onChange={(e) =>
                      setEditingTeacher({
                        ...editingTeacher,
                        salary: { ...editingTeacher.salary, basic: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingTeacher.status}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLASS DIVISION MODAL */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  {editingClass ? 'Edit Academic Division' : 'Create Academic Class / Grade'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure grades: Nursery, LKG, UKG, Grade 1 to 12
                </p>
              </div>
              <button
                onClick={() => setShowClassModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Grade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nursery, LKG, UKG, 1, 2, 6, 10"
                    value={classForm.classNumber}
                    onChange={(e) => setClassForm({ ...classForm, classNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A, B, Science, Commerce"
                    value={classForm.section}
                    onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg uppercase font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Room</label>
                  <input
                    type="text"
                    required
                    value={classForm.roomNumber}
                    onChange={(e) => setClassForm({ ...classForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Student Capacity</label>
                  <input
                    type="number"
                    required
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Class Teacher</label>
                <input
                  type="text"
                  required
                  value={classForm.classTeacherName}
                  onChange={(e) => setClassForm({ ...classForm, classTeacherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. English, Mathematics, Science, Social Studies"
                  value={classForm.subjects}
                  onChange={(e) => setClassForm({ ...classForm, subjects: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Save Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7-STEP ADMISSION WIZARD MODAL */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                  Step {admissionStep} of 7 • New Student Enrollment
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">

                </h3>
              </div>
              <button
                onClick={() => setShowAdmissionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteAdmission} className="py-4 space-y-4 text-xs">
              {admissionStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 1: Student Identity Information</h4>

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-inner flex items-center justify-center">
                      {newAdmission.photoUrl ? (
                        <img
                          src={newAdmission.photoUrl}
                          alt="Student preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 text-center px-2">Upload Photo</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="block font-semibold text-slate-700 mb-1">Student Photo</label>
                      <label className="inline-flex items-center justify-center cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 transition">
                        Add / Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = typeof reader.result === 'string' ? reader.result : newAdmission.photoUrl;
                              setNewAdmission((prev) => ({ ...prev, photoUrl: result }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <p className="mt-2 text-[10px] text-slate-500">Square image preview will appear here automatically.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diya"
                        value={newAdmission.firstName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sengupta"
                        value={newAdmission.lastName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={newAdmission.dob}
                        onChange={(e) => setNewAdmission({ ...newAdmission, dob: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                      <select
                        value={newAdmission.gender}
                        onChange={(e) => setNewAdmission({ ...newAdmission, gender: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={newAdmission.bloodGroup}
                        onChange={(e) => setNewAdmission({ ...newAdmission, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {admissionStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 2: Parent & Guardian Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Debabrata Sengupta"
                        value={newAdmission.fatherName}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fatherName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        placeholder="e.g. Professor"
                        value={newAdmission.fatherOccupation}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fatherOccupation: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father's Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98110-XXXXX"
                        value={newAdmission.fatherPhone}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fatherPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Parent Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="parent@gmail.com"
                        value={newAdmission.guardianEmail}
                        onChange={(e) => setNewAdmission({ ...newAdmission, guardianEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {admissionStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 3: Academic Class & Section Allocation</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Admit to Class / Grade</label>
                      <select
                        value={newAdmission.classId}
                        onChange={(e) => setNewAdmission({ ...newAdmission, classId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      >
                        {distinctClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Section</label>
                      <select
                        value={newAdmission.section}
                        onChange={(e) => setNewAdmission({ ...newAdmission, section: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="Science">Section Science</option>
                        <option value="Commerce">Section Commerce</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                      <input
                        type="number"
                        value={newAdmission.rollNumber}
                        onChange={(e) => setNewAdmission({ ...newAdmission, rollNumber: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {admissionStep === 4 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 4: Residential Address & Verification</h4>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Permanent Residential Address</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Flat / House No, Locality, Pincode, City..."
                      value={newAdmission.permanentAddress}
                      onChange={(e) => setNewAdmission({ ...newAdmission, permanentAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    ></textarea>
                  </div>
                </div>
              )}

              {admissionStep === 5 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 5: Document Checklist & Verification</h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                      <span>Birth Certificate Verified (Municipal Authority)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                      <span>Previous School Transfer Certificate (TC) Counter-signed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                      <span>Aadhaar Card / Identity Proof Verified</span>
                    </label>
                  </div>
                </div>
              )}

              {/* kslfksdjfskldjf */}

              {admissionStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm">
                      Step 6: School Bus Transport
                    </h4>

                    <button
                      type="button"
                      onClick={() => setShowBusRouteModal(true)}
                      className="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition cursor-pointer"
                      title="View all bus routes"
                    >
                      <CircleHelp className="w-4 h-4" />
                    </button>
                  </div>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={newAdmission.transportOpted}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          transportOpted: e.target.checked,
                          busRouteId: e.target.checked
                            ? (newAdmission.busRouteId || routes[0]?.routeCode || '')
                            : ''
                        })
                      }
                      className="rounded text-amber-600"
                    />

                    <span className="font-bold text-slate-800">
                      Enroll student in School Bus Transport Service
                    </span>
                  </label>

                  {newAdmission.transportOpted && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Select Bus Route
                      </label>

                      <select
                        value={newAdmission.busRouteId}
                        onChange={(e) =>
                          setNewAdmission({
                            ...newAdmission,
                            busRouteId: e.target.value
                          })
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                      >
                        <option value="">
                          Select Bus Route
                        </option>

                        {routes.map((route) => (
                          <option key={route.id} value={route.routeCode}>
                            {route.routeCode} — {route.routeName}
                          </option>
                        ))}
                      </select>

                      {newAdmission.busRouteId && (
                        <p className="text-emerald-700 text-[11px] mt-2 font-medium">
                          ✓ Selected Route: {newAdmission.busRouteId}
                        </p>
                      )}
                    </div>
                  )}

                  {!newAdmission.transportOpted && (
                    <p className="text-slate-500 text-[11px]">
                      Student will use self transport / will not use school bus service.
                    </p>
                  )}
                </div>
              )}

              {admissionStep === 7 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Step 7: Final Review & Confirmation</h4>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-xs text-slate-800">
                    <p><strong>Candidate:</strong> {newAdmission.firstName} {newAdmission.lastName}</p>
                    <p><strong>Class & Section:</strong> {newAdmission.classId}-{newAdmission.section} (Roll #{newAdmission.rollNumber})</p>
                    <p><strong>Parent Contact:</strong> {newAdmission.fatherName} ({newAdmission.fatherPhone})</p>
                    <p>
                      <strong>Transport:</strong>{' '}
                      {newAdmission.transportOpted
                        ? `Yes (${newAdmission.busRouteId || 'Route not selected'})`
                        : 'No'}
                    </p>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Submitting this form creates the permanent student record, assigns admission number, and generates the student ID card.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                {admissionStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setAdmissionStep(admissionStep - 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                  >
                    ← Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {admissionStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => setAdmissionStep(admissionStep + 1)}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
                  >
                    Complete Admission
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUS ROUTE HELP MODAL */}
      {showBusRouteModal && (
        <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  School Bus Routes
                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  Available bus routes for student transport
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBusRouteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Routes */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-3">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <div
                    key={route.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 font-bold text-[11px] font-mono">
                            {route.routeCode}
                          </span>

                          <h4 className="font-bold text-slate-900 text-sm">
                            {route.routeName}
                          </h4>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                          <p>
                            <span className="font-semibold text-slate-700">
                              Pickup:
                            </span>{' '}
                            {route.pickupTime}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-700">
                              Drop:
                            </span>{' '}
                            {route.dropTime}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-700">
                              Stops:
                            </span>{' '}
                            {route.stops?.join(' → ') || 'Multiple school bus stops'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAdmission({
                            ...newAdmission,
                            transportOpted: true,
                            busRouteId: route.routeCode
                          });

                          setShowBusRouteModal(false);
                        }}
                        className="shrink-0 px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  No bus routes are currently available.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBusRouteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-semibold hover:bg-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE MODAL */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <img src={selectedStudentForProfile.photoUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{selectedStudentForProfile.fullName}</h3>
                  <p className="text-xs text-slate-500 font-mono">Admission No: {selectedStudentForProfile.admissionNumber} • ID: {selectedStudentForProfile.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Academic Enrolment</h4>
                <p><span className="text-slate-500">Class:</span> Class {selectedStudentForProfile.classId}-{selectedStudentForProfile.section}</p>
                <p><span className="text-slate-500">Roll No:</span> #{selectedStudentForProfile.rollNumber}</p>
                <p><span className="text-slate-500">DOB:</span> {selectedStudentForProfile.dob}</p>
                <p><span className="text-slate-500">Blood Group:</span> <strong className="text-red-600">{selectedStudentForProfile.bloodGroup}</strong></p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Parent Contacts</h4>
                <p><span className="text-slate-500">Father:</span> {selectedStudentForProfile.fatherName}</p>
                <p><span className="text-slate-500">Phone:</span> {selectedStudentForProfile.fatherPhone}</p>
                <p><span className="text-slate-500">Email:</span> {selectedStudentForProfile.guardianEmail}</p>
              </div>

              <div className="col-span-2 p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Residential Address:</span>
                <p className="text-slate-800">{selectedStudentForProfile.permanentAddress}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setEditingStudent(selectedStudentForProfile);
                  setSelectedStudentForProfile(null);
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Student Data
              </button>
              <button
                onClick={() => {
                  setPrintDoc({ type: 'idcard', data: selectedStudentForProfile });
                  setSelectedStudentForProfile(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" /> Generate Student ID Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW NOTICE MODAL */}
      {showAddNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start pb-2 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-0.5">
                  Broadcast Official Notice / Circular
                </h3>
                <p className="text-xs text-slate-500">Published instantaneously to school homepage & portals.</p>
              </div>
              <button
                onClick={() => setShowAddNotice(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Winter Break 2026"
                  value={newNoticeData.title}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNoticeData.category}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option>Academic</option>
                    <option>Examination</option>
                    <option>Sports</option>
                    <option>Holiday</option>
                    <option>Admission</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audience</label>
                  <select
                    value={newNoticeData.targetAudience}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option>All</option>
                    <option>Students</option>
                    <option>Teachers</option>
                    <option>Parents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the instructions, reporting timings, or dates..."
                  value={newNoticeData.content}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNotice(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start pb-2 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-0.5">
                  Issue Official School Certificate
                </h3>
                <p className="text-xs text-slate-500">Generates formal institutional certificate with seal.</p>
              </div>
              <button
                onClick={() => setShowIssueCert(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Enrolled Student</label>
                <select
                  value={certData.studentId}
                  onChange={(e) => setCertData({ ...certData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.admissionNumber} - {s.classId}-{s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certificate Type</label>
                <select
                  value={certData.type}
                  onChange={(e) => setCertData({ ...certData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                >
                  <option>Bonafide</option>
                  <option>Transfer Certificate</option>
                  <option>Character Certificate</option>
                  <option>Academic Excellence</option>
                  <option>Sports Achievement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Commendation Text</label>
                <textarea
                  rows={3}
                  required
                  value={certData.reasonOrAchievement}
                  onChange={(e) => setCertData({ ...certData, reasonOrAchievement: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueCert(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Issue & Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT DOCUMENTS MODAL CONTAINER WITH CLOSE BUTTON ALWAYS ACCESSIBLE */}
      {printDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          {/* Floating High-Contrast Close Button */}
          <button
            onClick={() => setPrintDoc(null)}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer no-print border border-rose-400 transition"
            title="Close Preview"
          >
            <X className="w-4 h-4" /> Close Preview
          </button>

          <div className="max-w-4xl w-full my-8 relative">
            {printDoc.type === 'idcard' && (
              <PrintableIDCard
                entity={printDoc.data}
                type="student"
                settings={settings}
                onClose={() => setPrintDoc(null)}
                onEdit={(entity) => {
                  setPrintDoc(null);
                  setEditingStudent(entity as Student);
                }}
              />
            )}
            {printDoc.type === 'teacher-id' && (
              <PrintableIDCard
                entity={printDoc.data}
                type="teacher"
                settings={settings}
                onClose={() => setPrintDoc(null)}
                onEdit={(entity) => {
                  setPrintDoc(null);
                  setEditingTeacher(entity as Teacher);
                }}
              />
            )}
            {printDoc.type === 'certificate' && (
              <PrintableCertificate
                certificate={printDoc.data}
                settings={settings}
                onClose={() => setPrintDoc(null)}
              />
            )}
            {printDoc.type === 'question-paper' && (
              <PrintableQuestionPaper
                paper={printDoc.data}
                settings={settings}
                onClose={() => setPrintDoc(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

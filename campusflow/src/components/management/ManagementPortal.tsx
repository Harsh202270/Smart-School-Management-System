import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Student,
  Teacher,
  ClassSection,
  Subject,
  DayTimetable,
  QuestionPaper,
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
  QrCode,
  LogOut,
  X,
  Menu,
  Wallet
} from 'lucide-react';

import { PrintableIDCard } from '../print/PrintableIDCard';
import { PrintableQuestionPaper } from '../print/PrintableQuestionPaper';
import { PrintableCertificate } from '../print/PrintableCertificate';

import { DashboardModule } from './DashboardModule';
import { StudentsModule } from './StudentsModule';
import { TeachersModule } from './TeachersModule';
import { ClassesModule } from './ClassesModule';
import { TimetableModule } from './TimetableModule';
import { ExamsModule } from './ExamsModule';
import { FeesModule } from './FeesModule';
import { PayrollModule } from './PayrollModule';
import { LibraryModule } from './LibraryModule';
import { TransportModule } from './TransportModule';
import { NoticesModule } from './NoticesModule';
import { EventsModule } from './EventsModule';
import { IdCardsModule } from './IdCardsModule';
import { CertificatesModule } from './CertificatesModule';
import { SettingsModule } from './SettingsModule';
import { AuditLogsModule } from './AuditLogsModule';
import StudentAdmissionModal from './modals/StudentAdmissionModal';
import { StudentEditModal } from './modals/StudentEditModal';
import TeacherEditModal from './modals/TeacherEditModal';
import TeacherAddModal from './modals/TeacherAddModal';
import TeacherCredentialsModal from './modals/TeacherCredentialsModal';
import ClassModal from './modals/ClassModal';
import { NoticeModal } from './modals/NoticeModal';
import { CertificateModal } from './modals/CertificateModal';
import FeeStructureModule from './FeeStructureModule';

interface Props {
  onBackToWebsite: () => void;
}

type ActiveModule =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'timetable'
  | 'exams'
  | 'fees'
  | 'fee-structure'
  | 'payroll'
  | 'library'
  | 'transport'
  | 'notices'
  | 'events'
  | 'id-cards'
  | 'certificates'
  | 'settings'
  | 'audit-logs';


export const ManagementPortal: React.FC<Props> = ({
  onBackToWebsite
}) => {
  const { logout, quickSwitch } = useAuth();

  /* =========================================================
     MAIN NAVIGATION
  ========================================================= */

  const navigate = useNavigate();
  const location = useLocation();

  const validModules: ActiveModule[] = [
    'dashboard',
    'students',
    'teachers',
    'classes',
    'timetable',
    'exams',
    'fees',
    'fee-structure',
    'payroll',
    'library',
    'transport',
    'notices',
    'events',
    'id-cards',
    'certificates',
    'settings',
    'audit-logs'
  ];

  const getModuleFromUrl = (): ActiveModule => {

    const moduleName =
      location.pathname.split('/')[2];

    if (
      validModules.includes(
        moduleName as ActiveModule
      )
    ) {
      return moduleName as ActiveModule;
    }

    return 'dashboard';
  };

  const [activeModule, setActiveModuleState] =
    useState<ActiveModule>(getModuleFromUrl());

  const setActiveModule = (
    module: ActiveModule
  ) => {

    setActiveModuleState(module);

    navigate(
      `/management/${module}`,
      { replace: true }
    );
  };

  useEffect(() => {

    const moduleName =
      location.pathname.split('/')[2];

    if (
      validModules.includes(
        moduleName as ActiveModule
      )
    ) {

      setActiveModuleState(
        moduleName as ActiveModule
      );

    } else {

      navigate(
        '/management/dashboard',
        { replace: true }
      );

    }

  }, [location.pathname, navigate]);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* =========================================================
     MAIN DATA
  ========================================================= */

  const [settings, setSettings] =
    useState<SchoolSettings>(storage.getSettings());

  const [students, setStudents] =
    useState<Student[]>(storage.getStudents());

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [classes, setClasses] =
    useState<ClassSection[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>(storage.getSubjects());

  const [timetable, setTimetable] =
    useState<DayTimetable[]>(
      storage.getTimetable('10-A')
    );

  const [invoices, setInvoices] =
    useState<FeeInvoice[]>(storage.getInvoices());

  const [payments, setPayments] =
    useState<FeePayment[]>(storage.getPayments());

  const [payrolls, setPayrolls] =
    useState<PayrollRecord[]>(storage.getPayrolls());

  const [books, setBooks] =
    useState<LibraryBook[]>(storage.getBooks());

  const [vehicles, setVehicles] =
    useState<TransportVehicle[]>(
      storage.getVehicles()
    );

  const [routes, setRoutes] =
    useState<TransportRoute[]>(
      storage.getRoutes()
    );

  const [notices, setNotices] =
    useState<Notice[]>(storage.getNotices());

  const [events, setEvents] =
    useState<SchoolEvent[]>(storage.getEvents());

  const [leaves, setLeaves] =
    useState<LeaveRequest[]>(storage.getLeaves());

  const [certificates, setCertificates] =
    useState<CertificateRecord[]>(
      storage.getCertificates()
    );

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>(
      storage.getAuditLogs()
    );

  const [questionPapers, setQuestionPapers] =
    useState<QuestionPaper[]>(
      storage.getQuestionPapers()
    );

  /* =========================================================
     SEARCH / FILTER STATE
  ========================================================= */

  const [globalSearch, setGlobalSearch] =
    useState('');

  const [studentClassFilter, setStudentClassFilter] =
    useState('All');

  const [classWingFilter, setClassWingFilter] =
    useState('All');

  const [idCardTypeTab, setIdCardTypeTab] =
    useState<'students' | 'teachers'>('students');

  const [idCardClassFilter, setIdCardClassFilter] =
    useState('All');

  /* =========================================================
     STUDENT STATE
  ========================================================= */

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);

  const [selectedStudentForProfile, setSelectedStudentForProfile] =
    useState<Student | null>(null);

  /* =========================================================
     TEACHER STATE
  ========================================================= */

  const [editingTeacher, setEditingTeacher] =
    useState<Teacher | null>(null);

  const [showAddTeacherModal, setShowAddTeacherModal] =
    useState(false);

  const [teacherCredentials, setTeacherCredentials] = useState<{
    employeeCode: string;
    initialPassword: string;
    fullName: string;
  } | null>(null);

  type TeacherAddForm = {
    fullName: string;
    designation: string;
    department:
    | 'Science'
    | 'Mathematics'
    | 'Languages'
    | 'Social Studies'
    | 'Computers'
    | 'Arts & Sports';
    qualification: string;
    experienceYears: number;
    phone: string;
    email: string;
    basicSalary: number;
    photoUrl: string;
  };

  const [newTeacherForm, setNewTeacherForm] =
    useState<TeacherAddForm>({
      fullName: '',
      designation: 'TGT General Science',
      department: 'Science',
      qualification: 'M.Sc., B.Ed.',
      experienceYears: 4,
      phone: '+91 98110-33441',
      email: 'teacher@riversidepublic.edu.in',
      basicSalary: 55000,
      photoUrl: ''
    });

  /* =========================================================
     CLASS STATE
  ========================================================= */

  const [showClassModal, setShowClassModal] =
    useState(false);

  const [editingClass, setEditingClass] =
    useState<ClassSection | null>(null);

  type ClassFormState = {
    classNumber: string;
    section: string;
    roomNumber: string;
    classTeacherId: string;
    classTeacherName: string;
    capacity: number;
    subjects: string[];
    otherSubject: string;
  };

  const [classForm, setClassForm] = useState<ClassFormState>({
    classNumber: 'Nursery',
    section: 'A',
    roomNumber: 'Room 101',
    classTeacherId: '',
    classTeacherName: 'Mrs. Pooja Sharma',
    capacity: 35,
    subjects: ['English', 'Mathematics', 'General Studies'],
    otherSubject: ''
  });

  /* =========================================================
     ADMISSION WIZARD STATE
  ========================================================= */

  const [showAdmissionModal, setShowAdmissionModal] =
    useState(false);

  const [admissionStep, setAdmissionStep] =
    useState(1);

  const [showBusRouteModal, setShowBusRouteModal] =
    useState(false);

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
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80'
  });

  /* =========================================================
     PRINT STATE
  ========================================================= */

  const [printDoc, setPrintDoc] =
    useState<{
      type: string;
      data: any;
    } | null>(null);

  /* =========================================================
     SETTINGS STATE
  ========================================================= */

  const [settingsForm, setSettingsForm] =
    useState(settings);

  const [settingsSavedNotice, setSettingsSavedNotice] =
    useState(false);

  /* =========================================================
     NOTICE STATE
  ========================================================= */

  const [showAddNotice, setShowAddNotice] =
    useState(false);

  const [newNoticeData, setNewNoticeData] = useState<
    React.ComponentProps<typeof NoticeModal>['formData']
  >({
    title: '',
    category: 'Academic' as const,
    targetAudience: 'All' as const,
    content: '',
    isImportant: false
  });

  /* =========================================================
   CERTIFICATE STATE
========================================================= */

  type CertificateForm = {
    studentId: string;
    type:
    | 'Bonafide'
    | 'Transfer Certificate'
    | 'Character Certificate'
    | 'Academic Excellence'
    | 'Sports Achievement';
    reasonOrAchievement: string;
  };

  const [showIssueCert, setShowIssueCert] =
    useState(false);

  const [certData, setCertData] =
    useState<CertificateForm>({
      studentId: '',
      type: 'Bonafide',
      reasonOrAchievement:
        'Required for passport application.'
    });

  /* =========================================================
     STORAGE SUBSCRIPTIONS
  ========================================================= */

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL ||
          'http://localhost:8000/api';

        const response = await fetch(
          `${API_URL}/teachers`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.detail || 'Failed to load teachers'
          );
        }

        setTeachers(result.data || []);

      } catch (error) {
        console.error(
          'Failed to load teachers:',
          error
        );
      }
    };

    loadTeachers();
  }, []);

  const loadClasses = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8000/api';

      const response = await fetch(
        `${API_URL}/classes`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to load classes'
        );
      }

      setClasses(result.data || []);

    } catch (error) {
      console.error(
        'Failed to load classes:',
        error
      );
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);


  /* =========================================================
     STUDENT HANDLERS
  ========================================================= */

  const handleSaveStudentEdit = (
    student: Student
  ) => {
    if (!student) return;

    storage.updateStudent(student.id, {
      fullName:
        `${student.firstName} ${student.lastName}`,

      firstName: student.firstName,
      lastName: student.lastName,
      classId: student.classId,
      section: student.section,
      rollNumber: Number(student.rollNumber),
      dob: student.dob,
      bloodGroup: student.bloodGroup,
      status: student.status,
      fatherName: student.fatherName,
      fatherPhone: student.fatherPhone,
      guardianEmail: student.guardianEmail,
      permanentAddress:
        student.permanentAddress,

      transportOpted:
        student.transportOpted,

      busRouteId:
        student.transportOpted
          ? student.busRouteId || 'R-01'
          : undefined
    });

    setStudents(storage.getStudents());
    setEditingStudent(null);
  };

  const handleDeleteStudent = (
    id: string,
    name: string
  ) => {
    if (
      confirm(
        `Are you sure you want to permanently delete record for ${name}?`
      )
    ) {
      storage.deleteStudent(id);
      setStudents(storage.getStudents());
    }
  };

  /* =========================================================
     TEACHER HANDLERS
  ========================================================= */

  const handleSaveTeacherEdit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingTeacher) return;

    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8000/api';

      const response = await fetch(
        `${API_URL}/teachers/${editingTeacher.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employeeCode: editingTeacher.employeeCode,
            fullName: editingTeacher.fullName,
            designation: editingTeacher.designation,
            department: editingTeacher.department,
            qualification: editingTeacher.qualification,
            experienceYears: Number(
              editingTeacher.experienceYears
            ),
            phone: editingTeacher.phone,
            email: editingTeacher.email,
            basicSalary: Number(
              editingTeacher.salary?.basic || 0
            ),
            photoUrl: editingTeacher.photoUrl || '',
            status: editingTeacher.status || 'Active',
          }),
        }
      );

      const result = await response.json();

      console.log('UPDATE TEACHER API RESPONSE:', result);

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to update teacher'
        );
      }

      const updatedTeacher = result.data;

      if (!updatedTeacher) {
        throw new Error(
          'Teacher updated but no teacher data returned from server.'
        );
      }

      // Update UI immediately
      setTeachers((previousTeachers) =>
        previousTeachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? updatedTeacher
            : teacher
        )
      );

      // Close edit modal
      setEditingTeacher(null);

      alert('Teacher profile updated successfully.');

    } catch (error) {
      console.error(
        'Teacher update API error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update teacher'
      );
    }
  };

  const handleAddTeacher = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8000/api';

      const response = await fetch(
        `${API_URL}/teachers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: newTeacherForm.fullName,
            designation: newTeacherForm.designation,
            department: newTeacherForm.department,
            qualification: newTeacherForm.qualification,
            experienceYears: Number(
              newTeacherForm.experienceYears
            ),
            phone: newTeacherForm.phone,
            email: newTeacherForm.email,
            basicSalary: Number(
              newTeacherForm.basicSalary
            ),
            photoUrl: newTeacherForm.photoUrl,
          }),
        }
      );

      const result = await response.json();

      console.log('API RESPONSE:', result);

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to add teacher'
        );
      }

      // Backend se created teacher nikalo
      const createdTeacher = result.data;

      console.log(
        'CREATED TEACHER:',
        createdTeacher
      );

      if (!createdTeacher) {
        throw new Error(
          'Teacher created but no teacher data returned from server.'
        );
      }

      // IMPORTANT: credentials popup data
      const credentials = {
        employeeCode:
          createdTeacher.employeeCode,

        initialPassword:
          createdTeacher.initialPassword,

        fullName:
          createdTeacher.fullName,
      };

      console.log(
        'SETTING CREDENTIALS:',
        credentials
      );

      // Popup open
      setTeacherCredentials(credentials);

      // Appointment form close
      setShowAddTeacherModal(false);

      // Form reset
      setNewTeacherForm({
        fullName: '',
        designation: 'TGT General Science',
        department: 'Science',
        qualification: 'M.Sc., B.Ed.',
        experienceYears: 4,
        phone: '+91 98110-33441',
        email: 'teacher@riversidepublic.edu.in',
        basicSalary: 55000,
        photoUrl: ''
      });

      try {
        const teachersResponse = await fetch(
          `${API_URL}/teachers`
        );
        const teachersResult = await teachersResponse.json();

        if (teachersResponse.ok && Array.isArray(teachersResult.data)) {
          setTeachers(teachersResult.data);
        }
      } catch (refreshError) {
        console.error(
          'Teacher was added, but the teacher list could not be refreshed:',
          refreshError
        );
      }

    } catch (error) {

      console.error(
        'Teacher API error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to add teacher'
      );
    }
  };

  const handleDeleteTeacher = (
    id: string,
    name: string
  ) => {
    if (
      confirm(
        `Are you sure you want to remove faculty record for ${name}?`
      )
    ) {
      storage.deleteTeacher(id);
      setTeachers(storage.getTeachers());
    }
  };

  /* =========================================================
     CLASS HANDLERS
  ========================================================= */

  const handleSaveClass = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const subList =
      (Array.isArray(classForm.subjects)
        ? classForm.subjects
        : String(classForm.subjects).split(','))
        .map(s => String(s).trim())
        .filter(Boolean);

    const classId =
      `${classForm.classNumber}-${classForm.section}`;

    if (editingClass) {
      storage.updateClass(
        editingClass.id,
        {
          classNumber:
            classForm.classNumber,

          section:
            classForm.section,

          roomNumber:
            classForm.roomNumber,

          classTeacherName:
            classForm.classTeacherName,

          capacity:
            Number(classForm.capacity),

          subjects:
            subList
        }
      );
    } else {
      storage.addClass({
        id: classId,

        classNumber:
          classForm.classNumber,

        section:
          classForm.section,

        roomNumber:
          classForm.roomNumber,

        classTeacherId:
          'EMP-T-GEN',

        classTeacherName:
          classForm.classTeacherName,

        capacity:
          Number(classForm.capacity),

        studentCount: 0,

        subjects:
          subList
      });
    }


    setShowClassModal(false);
    setEditingClass(null);
  };

  const handleDeleteClass = async (
    id: string,
    label: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove ${label}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:8000/api';

      const response = await fetch(
        `${API_URL}/classes/${id}`,
        {
          method: 'DELETE'
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to delete class'
        );
      }

      alert('Class deleted successfully');

      // Refresh classes from PostgreSQL
      await loadClasses();

    } catch (error) {
      console.error(
        'Delete class error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete class'
      );
    }
  };

  /* =========================================================
     ADMISSION HANDLER
  ========================================================= */

  const handleCompleteAdmission = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const created = storage.addStudent({
      admissionNumber:
        `RPS/2026/${500 + students.length + 1}`,

      rollNumber:
        Number(newAdmission.rollNumber),

      firstName:
        newAdmission.firstName,

      lastName:
        newAdmission.lastName,

      fullName:
        `${newAdmission.firstName} ${newAdmission.lastName}`,

      gender:
        newAdmission.gender,

      dob:
        newAdmission.dob,

      bloodGroup:
        newAdmission.bloodGroup,

      aadharNumber:
        `4829-1029-${Math.floor(
          1000 + Math.random() * 9000
        )}`,

      photoUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',

      classId:
        newAdmission.classId,

      section:
        newAdmission.section,

      admissionDate:
        new Date()
          .toISOString()
          .split('T')[0],

      status: 'Active',

      category: 'General',

      fatherName:
        newAdmission.fatherName,

      fatherOccupation:
        newAdmission.fatherOccupation,

      fatherPhone:
        newAdmission.fatherPhone,

      motherName:
        newAdmission.motherName,

      motherOccupation:
        'Professional',

      motherPhone:
        newAdmission.fatherPhone,

      guardianEmail:
        newAdmission.guardianEmail ||
        'parent@gmail.com',

      emergencyContact:
        newAdmission.fatherPhone,

      permanentAddress:
        newAdmission.permanentAddress,

      currentAddress:
        newAdmission.permanentAddress,

      transportOpted:
        newAdmission.transportOpted,

      busRouteId:
        newAdmission.transportOpted
          ? newAdmission.busRouteId
          : undefined,

      busStopName:
        undefined
    });

    setStudents(storage.getStudents());

    setShowAdmissionModal(false);

    setAdmissionStep(1);

    setSelectedStudentForProfile(created);
  };

  /* =========================================================
     LEAVE HANDLER
  ========================================================= */

  const handleReviewLeave = (
    id: string,
    status: 'Approved' | 'Rejected'
  ) => {
    storage.updateLeaveStatus(
      id,
      status,
      'Dr. Ananya Sharma'
    );

    setLeaves(storage.getLeaves());
  };

  /* =========================================================
     NOTICE HANDLER
  ========================================================= */

  const handlePublishNotice = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    storage.addNotice({
      ...newNoticeData,

      date:
        new Date()
          .toISOString()
          .split('T')[0],

      publishDate:
        new Date()
          .toISOString()
          .split('T')[0],

      issuedBy:
        'Dr. Ananya Sharma (Principal)'
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

  /* =========================================================
     CERTIFICATE HANDLER
  ========================================================= */

  const handleIssueCertificate = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const targetStudent =
      students.find(
        s => s.id === certData.studentId
      ) || students[0];

    if (!targetStudent) return;

    const newCert =
      storage.generateCertificate({
        studentId:
          targetStudent.id,

        studentName:
          targetStudent.fullName,

        admissionNumber:
          targetStudent.admissionNumber,

        classNumber:
          targetStudent.classId,

        section:
          targetStudent.section,

        type:
          certData.type as any,

        issueDate:
          new Date()
            .toISOString()
            .split('T')[0],

        reasonOrAchievement:
          certData.reasonOrAchievement,

        signedBy:
          'Dr. Ananya Sharma (Principal)'
      });

    setCertificates(
      storage.getCertificates()
    );

    setShowIssueCert(false);

    setPrintDoc({
      type: 'certificate',
      data: newCert
    });
  };

  /* =========================================================
     SETTINGS HANDLER
  ========================================================= */

  const handleSaveSettings = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const updated =
      storage.updateSettings(
        settingsForm
      );

    setSettings(updated);

    setSettingsSavedNotice(true);

    setTimeout(
      () =>
        setSettingsSavedNotice(false),
      3000
    );
  };

  /* =========================================================
     CLASS HELPERS
  ========================================================= */

  const orderRank: Record<string, number> = {
    playgroup: 0,
    nursery: 1,
    lkg: 2,
    ukg: 3,
    kg: 4,

    '1': 10,
    '2': 20,
    '3': 30,
    '4': 40,
    '5': 50,
    '6': 60,
    '7': 70,
    '8': 80,
    '9': 90,
    '10': 100,
    '11': 110,
    '12': 120
  };

  const distinctClasses =
    Array.from(
      new Set(
        (classes ?? []).map(
          c => c.classNumber
        )
      )
    ).sort((a, b) => {
      const rankA =
        orderRank[
        a.toLowerCase()
        ] ??
        (parseInt(a, 10) * 10 || 999);

      const rankB =
        orderRank[
        b.toLowerCase()
        ] ??
        (parseInt(b, 10) * 10 || 999);

      return rankA - rankB;
    });

  const getWingForClass = (
    classNumber: string
  ): string => {
    const lower =
      classNumber.toLowerCase();

    if (
      [
        'nursery',
        'lkg',
        'ukg',
        'playgroup',
        'kg'
      ].includes(lower)
    ) {
      return 'Pre-Primary';
    }

    const num =
      parseInt(
        classNumber,
        10
      );

    if (!isNaN(num)) {
      if (num >= 1 && num <= 5)
        return 'Primary';

      if (num >= 6 && num <= 8)
        return 'Middle';

      if (num >= 9 && num <= 10)
        return 'Secondary';

      if (num >= 11 && num <= 12)
        return 'Senior Secondary';
    }

    return 'Other';
  };

  /* =========================================================
     FILTERED STUDENTS
  ========================================================= */

  const filteredStudents =
    students.filter(s => {
      const matchesClass =
        studentClassFilter === 'All' ||
        s.classId.toLowerCase() ===
        studentClassFilter.toLowerCase();

      const matchesSearch =
        s.fullName
          .toLowerCase()
          .includes(
            globalSearch.toLowerCase()
          ) ||

        s.id
          .toLowerCase()
          .includes(
            globalSearch.toLowerCase()
          ) ||

        s.admissionNumber
          .toLowerCase()
          .includes(
            globalSearch.toLowerCase()
          ) ||

        s.classId
          .toLowerCase()
          .includes(
            globalSearch.toLowerCase()
          );

      return (
        matchesClass &&
        matchesSearch
      );
    });

  /* =========================================================
     FEE METRICS
  ========================================================= */

  const totalFeesCollected =
    payments.reduce(
      (acc, p) =>
        acc + p.amount,
      0
    );

  const totalFeesPending =
    invoices.reduce(
      (acc, inv) =>
        acc + inv.balanceAmount,
      0
    );

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navItems = [
    {
      id: 'dashboard',
      label: 'Operations Dashboard',
      icon: LayoutDashboard
    },

    {
      id: 'students',
      label: 'Student Management',
      icon: GraduationCap
    },

    {
      id: 'teachers',
      label: 'Faculty & Staff',
      icon: Users
    },

    {
      id: 'classes',
      label: 'Classes & Structure',
      icon: BookOpen
    },

    {
      id: 'timetable',
      label: 'Master Timetable',
      icon: Clock
    },

    {
      id: 'exams',
      label: 'Exams & Question Papers',
      icon: FileText
    },

    {
      id: 'fees',
      label: 'Fee Accounts & Dues',
      icon: CreditCard
    },

    {
      id: 'fee-structure',
      label: 'Fee Structure',
      icon: Wallet
    },

    {
      id: 'payroll',
      label: 'Staff Payroll & Slips',
      icon: Banknote
    },

    {
      id: 'library',
      label: 'Central Library',
      icon: Library
    },

    {
      id: 'transport',
      label: 'Transport & Fleet',
      icon: Bus
    },

    {
      id: 'notices',
      label: 'Notices & Circulars',
      icon: Bell
    },

    {
      id: 'events',
      label: 'School Calendar',
      icon: Calendar
    },

    {
      id: 'id-cards',
      label: 'ID Card Studio',
      icon: QrCode
    },

    {
      id: 'certificates',
      label: 'Certificates & TC',
      icon: Award
    },

    {
      id: 'settings',
      label: 'School Settings',
      icon: Settings
    },

    {
      id: 'audit-logs',
      label: 'Security Audit Logs',
      icon: ShieldCheck
    }
  ];

  /* =========================================================
     EVERYTHING MODULES NEED
  ========================================================= */

  const portal = {
    activeModule,
    setActiveModule,

    settings,
    setSettings,

    students,
    setStudents,

    teachers,
    setTeachers,

    classes,
    setClasses,

    subjects,
    setSubjects,

    timetable,
    setTimetable,

    invoices,
    setInvoices,

    payments,
    setPayments,

    payrolls,
    setPayrolls,

    books,
    setBooks,

    vehicles,
    setVehicles,

    routes,
    setRoutes,

    notices,
    setNotices,

    events,
    setEvents,

    leaves,
    setLeaves,

    certificates,
    setCertificates,

    auditLogs,
    setAuditLogs,

    questionPapers,
    setQuestionPapers,

    globalSearch,
    setGlobalSearch,

    studentClassFilter,
    setStudentClassFilter,

    classWingFilter,
    setClassWingFilter,

    idCardTypeTab,
    setIdCardTypeTab,

    idCardClassFilter,
    setIdCardClassFilter,

    editingStudent,
    setEditingStudent,

    selectedStudentForProfile,
    setSelectedStudentForProfile,

    editingTeacher,
    setEditingTeacher,

    showAddTeacherModal,
    setShowAddTeacherModal,

    newTeacherForm,
    setNewTeacherForm,

    showClassModal,
    setShowClassModal,

    editingClass,
    setEditingClass,

    classForm,
    setClassForm,

    showAdmissionModal,
    setShowAdmissionModal,

    admissionStep,
    setAdmissionStep,

    showBusRouteModal,
    setShowBusRouteModal,

    newAdmission,
    setNewAdmission,

    printDoc,
    setPrintDoc,

    settingsForm,
    setSettingsForm,

    settingsSavedNotice,
    setSettingsSavedNotice,

    showAddNotice,
    setShowAddNotice,

    newNoticeData,
    setNewNoticeData,

    showIssueCert,
    setShowIssueCert,

    certData,
    setCertData,

    filteredStudents,
    distinctClasses,

    totalFeesCollected,
    totalFeesPending,

    getWingForClass,

    handleSaveStudentEdit,
    handleDeleteStudent,

    handleSaveTeacherEdit,
    handleAddTeacher,
    handleDeleteTeacher,

    handleSaveClass,
    handleDeleteClass,

    handleCompleteAdmission,

    handleReviewLeave,

    handlePublishNotice,

    handleIssueCertificate,

    handleSaveSettings
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-100 font-sans overflow-x-hidden">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0 z-30">

        <div className="w-full min-w-0 px-3 sm:px-5 lg:px-6 min-h-16 py-2 flex items-center justify-between gap-2">

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-amber-400 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}

              <span>Menu</span>
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-lg flex items-center justify-center border border-white shrink-0">
              R
            </div>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm lg:text-base font-bold font-serif text-white tracking-tight leading-tight truncate">
                {settings.schoolName}
              </h1>

              <span className="hidden sm:block text-[9px] sm:text-[10px] text-amber-400 font-semibold uppercase tracking-wider truncate">
                Central Operations Command & Administration
              </span>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">

            {/* Quick Switcher */}

            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">

              <span className="text-[11px] text-slate-400 font-medium">
                Switch:
              </span>

              <button
                onClick={() =>
                  quickSwitch('student')
                }
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Student
              </button>

              <span className="text-slate-600">
                |
              </span>

              <button
                onClick={() =>
                  quickSwitch('teacher')
                }
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Teacher
              </button>

            </div>

            {/* Principal */}

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700">

              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0">

                <img
                  src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=120&auto=format&fit=crop&q=80"
                  alt="Principal"
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="hidden sm:block text-left text-xs">

                <p className="font-bold text-white leading-tight">
                  {settings.principalName}
                </p>

                <p className="text-[10px] text-amber-400">
                  Principal & Administration Head
                </p>

              </div>

            </div>

            {/* Logout */}

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

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="flex-1 min-h-[calc(100vh-4rem)] flex min-w-0 relative">

        {/* Mobile backdrop */}

        {mobileMenuOpen && (
          <div
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="md:hidden fixed top-16 inset-x-0 bottom-0 z-40 bg-slate-950/75 backdrop-blur-xs"
          />
        )}

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className={`
            fixed md:sticky top-16 bottom-0 left-0 z-50
            w-72 max-w-[85vw] md:w-60 lg:w-64 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]
            bg-slate-950 text-slate-300
            p-3 sm:p-4 shrink-0
            border-r border-slate-800
            transform transition-transform
            duration-300 ease-in-out
            overflow-y-auto
            ${mobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
            }
          `}
        >

          <div className="md:hidden flex justify-between items-center pb-3 mb-2 border-b border-slate-800">

            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Navigation Menu
            </span>

            <button
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Close
            </button>

          </div>

          <nav className="space-y-1">

            {navItems.map(item => {

              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(
                      item.id as ActiveModule
                    );

                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3
                    px-3 py-2 rounded-xl
                    text-xs font-semibold
                    transition cursor-pointer
                    ${activeModule === item.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }
                  `}
                >

                  <Icon className="w-4 h-4 shrink-0" />

                  <span className="truncate">
                    {item.label}
                  </span>

                </button>
              );

            })}

          </nav>

        </aside>

        {/* ===================================================
            WORKSPACE
        =================================================== */}

        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-8 bg-slate-100">

          <div className="w-full min-w-0 max-w-full [&>*]:max-w-full">
            {activeModule === 'dashboard' && (
              <DashboardModule
                settings={settings}
                students={students}
                teachers={teachers}
                classes={classes}
                leaves={leaves}
                auditLogs={auditLogs}
                onOpenStudents={() => setActiveModule('students')}
                onOpenAdmission={() => setShowAdmissionModal(true)}
                onOpenNotice={() => setShowAddNotice(true)}
                onOpenAuditLogs={() => setActiveModule('audit-logs')}
                onReviewLeave={handleReviewLeave}
              />
            )}

            {activeModule === 'students' && (
              <StudentsModule
                classes={classes}
                onAdmission={() => setShowAdmissionModal(true)}
                onProfile={(student) => setSelectedStudentForProfile(student)}
                onEdit={(student) => setEditingStudent(student)}
                onPrintIdCard={(student) =>
                  setPrintDoc({
                    type: 'idcard',
                    data: student
                  })
                }
                onDelete={handleDeleteStudent}
              />
            )}

            {activeModule === 'teachers' && (
              <TeachersModule
                teachers={teachers}
                onAddTeacher={() => setShowAddTeacherModal(true)}
                onEditTeacher={(teacher) => setEditingTeacher(teacher)}
                onPrintTeacherId={(teacher) =>
                  setPrintDoc({
                    type: 'teacher-id',
                    data: teacher
                  })
                }
                onDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {activeModule === 'classes' && (
              <ClassesModule
                classes={classes}
                students={students}

                classWingFilter={classWingFilter}
                setClassWingFilter={setClassWingFilter}

                setEditingClass={setEditingClass}
                setClassForm={(value) =>
                  setClassForm((previous) => {
                    const moduleForm = {
                      ...previous,
                      subjects: previous.subjects.join(', ')
                    };
                    const nextForm =
                      typeof value === 'function'
                        ? value(moduleForm)
                        : value;

                    return {
                      ...previous,
                      ...nextForm,
                      subjects: nextForm.subjects
                        .split(',')
                        .map((subject) => subject.trim())
                        .filter(Boolean)
                    };
                  })
                }
                setShowClassModal={setShowClassModal}

                setStudentClassFilter={setStudentClassFilter}
                setActiveModule={(value) =>
                  setActiveModule(
                    typeof value === 'function'
                      ? value(activeModule)
                      : value
                  )
                }

                getWingForClass={getWingForClass}

                handleDeleteClass={handleDeleteClass}
              />
            )}

            {activeModule === 'timetable' && (
              <TimetableModule
                timetable={timetable}
              />
            )}

            {activeModule === 'exams' && (
              <ExamsModule
                questionPapers={questionPapers}
                onPreviewQuestionPaper={(qp) =>
                  setPrintDoc({
                    type: 'question-paper',
                    data: qp,
                  })
                }
              />
            )}

            {activeModule === 'fees' && (
              <FeesModule
                invoices={invoices}
                payments={payments}
              />
            )}

            {activeModule === 'fee-structure' && (
              <FeeStructureModule
                classes={classes}
              />
            )}

            {activeModule === 'payroll' && (
              <PayrollModule payrolls={payrolls} />
            )}

            {activeModule === 'library' && (
              <LibraryModule books={books} />
            )}

            {activeModule === 'transport' && (
              <TransportModule
                routes={routes}
              />
            )}

            {activeModule === 'notices' && <NoticesModule />}

            {activeModule === 'events' && (
              <EventsModule
                events={events}
                setEvents={setEvents}
              />
            )}

            {activeModule === 'id-cards' && (
              <IdCardsModule
                students={students}
                teachers={teachers}
                idCardTypeTab={idCardTypeTab}
                setIdCardTypeTab={setIdCardTypeTab}
                idCardClassFilter={idCardClassFilter}
                setIdCardClassFilter={setIdCardClassFilter}
                distinctClasses={distinctClasses}
                setEditingStudent={setEditingStudent}
                setEditingTeacher={setEditingTeacher}
                setPrintDoc={setPrintDoc}
                handleDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {activeModule === 'certificates' && (
              <CertificatesModule
                certificates={certificates}
                onIssueCertificate={() => setShowIssueCert(true)}
                onPrintCertificate={(certificate) =>
                  setPrintDoc({
                    type: 'certificate',
                    data: certificate,
                  })
                }
              />
            )}

            {activeModule === 'settings' && (
              <SettingsModule
                settingsForm={settingsForm}
                setSettingsForm={setSettingsForm}
              />
            )}

            {activeModule === 'audit-logs' && (
              <AuditLogsModule auditLogs={auditLogs} />
            )}

            {showIssueCert && (
              <CertificateModal
                students={students}
                certData={certData}
                setCertData={setCertData}
                onClose={() => setShowIssueCert(false)}
                onSubmit={handleIssueCertificate}
              />
            )}


          </div>

          <StudentAdmissionModal
            isOpen={showAdmissionModal}
            onClose={() => setShowAdmissionModal(false)}
            studentCount={students.length}
            distinctClasses={distinctClasses}
            routes={routes}
            onStudentCreated={(created) => {
              setStudents(storage.getStudents());
              setSelectedStudentForProfile(created);
            }}
          />

          <StudentEditModal
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
            distinctClasses={distinctClasses}
            onSave={handleSaveStudentEdit}
          />

          <TeacherEditModal
            editingTeacher={editingTeacher}
            setEditingTeacher={setEditingTeacher}
            onSave={handleSaveTeacherEdit}
          />

          <TeacherAddModal
            isOpen={showAddTeacherModal}
            formData={newTeacherForm}
            setFormData={setNewTeacherForm}
            onClose={() => setShowAddTeacherModal(false)}
            onSubmit={handleAddTeacher}
          />

          <TeacherCredentialsModal
            isOpen={!!teacherCredentials}
            employeeCode={teacherCredentials?.employeeCode || ''}
            initialPassword={teacherCredentials?.initialPassword || ''}
            fullName={teacherCredentials?.fullName || ''}
            onClose={() => setTeacherCredentials(null)}
          />

          <ClassModal
            show={showClassModal}
            editingClass={editingClass}
            classForm={classForm as any}
            setClassForm={setClassForm as React.Dispatch<React.SetStateAction<any>>}
            onClose={() => {
              setShowClassModal(false);
              setEditingClass(null);
            }}
            onSuccess={loadClasses}
          />

          <NoticeModal
            isOpen={showAddNotice}
            formData={newNoticeData}
            onChange={setNewNoticeData}
            onClose={() => setShowAddNotice(false)}
            onSubmit={handlePublishNotice}
          />

        </main>

      </div>

      {/* =====================================================
          PRINT PREVIEW
      ===================================================== */}

      {printDoc && (

        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-x-hidden overflow-y-auto">

          <button
            onClick={() =>
              setPrintDoc(null)
            }
            className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[70] px-3 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer no-print border border-rose-400 transition"
          >
            <X className="w-4 h-4" />
            Close Preview
          </button>

          <div className="w-full max-w-4xl min-w-0 my-8 relative">

            {printDoc.type === 'idcard' && (
              <PrintableIDCard
                entity={printDoc.data}
                type="student"
                settings={settings}
                onClose={() =>
                  setPrintDoc(null)
                }
                onEdit={(entity) => {
                  setPrintDoc(null);
                  setEditingStudent(
                    entity as Student
                  );
                }}
              />
            )}

            {printDoc.type === 'teacher-id' && (
              <PrintableIDCard
                entity={printDoc.data}
                type="teacher"
                settings={settings}
                onClose={() =>
                  setPrintDoc(null)
                }
                onEdit={(entity) => {
                  setPrintDoc(null);
                  setEditingTeacher(
                    entity as Teacher
                  );
                }}
              />
            )}

            {printDoc.type === 'certificate' && (
              <PrintableCertificate
                certificate={printDoc.data}
                settings={settings}
                onClose={() =>
                  setPrintDoc(null)
                }
              />
            )}

            {printDoc.type === 'question-paper' && (
              <PrintableQuestionPaper
                paper={printDoc.data}
                settings={settings}
                onClose={() =>
                  setPrintDoc(null)
                }
              />
            )}

          </div>

        </div>

      )}

    </div>
  );
};
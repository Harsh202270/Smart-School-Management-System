/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  useAuth
} from '../../context/AuthContext';

import {
  storage
} from '../../services/storageService';

import {
  Teacher,
  Student,
  DayTimetable,
  AttendanceRecord,
  Question,
  QuestionPaper,
  Homework,
  HomeworkSubmission,
  SchoolSettings,
  LeaveRequest,
  MarksEntry,
} from '../../types/school';

import { TeacherSidebar } from './TeacherSidebar';
import { TeacherHeader } from './TeacherHeader';
import { TeacherDashboard } from './TeacherDashboard';
import { TeacherAttendance } from './TeacherAttendance';
import { TeacherHomework } from './TeacherHomework';
import { TeacherQuestionPapers } from './TeacherQuestionPapers';
import { TeacherMarks } from './TeacherMarks';
import { TeacherTimetable } from './TeacherTimetable';
import { TeacherLeave } from './TeacherLeave';

interface Props {
  onBackToWebsite: () => void;
}

export type TeacherTab =
  | 'overview'
  | 'attendance'
  | 'homework'
  | 'question-papers'
  | 'marks'
  | 'timetable'
  | 'leave';

export type AttendanceStatus =
  AttendanceRecord['status'];

export interface MarksData {
  theory: number;
  practical: number;
  remarks: string;
}

/*
 * =========================================================
 * BACKEND TEACHER DATA
 * =========================================================
 *
 * This is the data returned by:
 *
 * POST /api/auth/login
 */
interface BackendTeacher {
  id: string;
  role?: string;
  employeeCode?: string;
  name: string;
  email?: string;
  designation?: string;
  department?: string;
  photoUrl?: string;
  avatar?: string;
}

/*
 * =========================================================
 * CONVERT BACKEND TEACHER -> FRONTEND TEACHER
 * =========================================================
 *
 * Existing Teacher components expect:
 *
 * fullName
 * employeeCode
 * designation
 * email
 * photoUrl
 *
 * Backend returns:
 *
 * name
 * employeeCode
 * designation
 * email
 *
 * So we convert it here.
 */
const convertBackendTeacherToTeacher = (
  backendTeacher: BackendTeacher
): Teacher => {

  return {
    ...(backendTeacher as unknown as Teacher),

    id:
      backendTeacher.id,

    employeeCode:
      backendTeacher.employeeCode ||
      backendTeacher.id,

    fullName:
      backendTeacher.name,

    email:
      backendTeacher.email || '',

    designation:
      backendTeacher.designation ||
      'Faculty Member',

    department:
      backendTeacher.department || '',

    photoUrl:
      backendTeacher.photoUrl ||
      backendTeacher.avatar ||
      ''
  } as Teacher;
};


export const TeacherPortal: React.FC<Props> = ({
  onBackToWebsite
}) => {

  const {
    user,
    logout,
    quickSwitch
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /* =========================================================
     ACTIVE TAB
     ========================================================= */

  const [activeTab, setActiveTab] =
    useState<TeacherTab>('overview');


  /* =========================================================
     SCHOOL SETTINGS
     ========================================================= */

  const [settings, setSettings] =
    useState<SchoolSettings>(
      storage.getSettings()
    );


  /* =========================================================
     GET REAL LOGGED-IN TEACHER
     =========================================================
     
     IMPORTANT:
     
     First priority:
     school_current_teacher
     
     This contains the backend login response.
     
     We DO NOT use teachers[0].
     We DO NOT use EMP-T-108.
     We DO NOT use Vikram Malhotra.
     ========================================================= */

  const getCurrentTeacher =
    (): Teacher | null => {

      /*
       * -----------------------------------------
       * 1. BACKEND LOGIN DATA
       * -----------------------------------------
       */

      const savedBackendTeacher =
        localStorage.getItem(
          'school_current_teacher'
        );

      if (savedBackendTeacher) {

        try {

          const parsed =
            JSON.parse(
              savedBackendTeacher
            ) as BackendTeacher;

          if (
            parsed &&
            parsed.id &&
            parsed.name
          ) {

            return convertBackendTeacherToTeacher(
              parsed
            );
          }

        } catch (error) {

          console.error(
            'Invalid school_current_teacher data:',
            error
          );

        }
      }


      /*
       * -----------------------------------------
       * 2. AUTH CONTEXT USER
       * -----------------------------------------
       */

      if (
        user &&
        user.role === 'teacher'
      ) {

        const teacherFromStorage =
          storage.getTeacherById(
            user.refId ||
            user.id
          );

        if (teacherFromStorage) {
          return teacherFromStorage;
        }

        /*
         * If storage doesn't contain the teacher,
         * create the minimum Teacher object from
         * AuthContext.
         */

        return {
          ...(user as unknown as Teacher),

          id:
            user.refId ||
            user.id,

          employeeCode:
            user.employeeCode ||
            user.refId ||
            user.id,

          fullName:
            user.name,

          email:
            user.email,

          designation:
            user.designation ||
            user.badgeTitle,

          department:
            user.department ||
            '',

          photoUrl:
            user.avatar ||
            ''
        } as Teacher;
      }


      /*
       * -----------------------------------------
       * NO TEACHER FOUND
       * -----------------------------------------
       */

      return null;
    };


  /*
   * =========================================================
   * TEACHER STATE
   * =========================================================
   */

  const [teacher, setTeacher] =
    useState<Teacher | null>(
      getCurrentTeacher()
    );


  /* =========================================================
     STUDENTS
     ========================================================= */

  const [students, setStudents] =
    useState<Student[]>(
      storage.getStudents()
    );


  /* =========================================================
     TIMETABLE
     ========================================================= */

  const [timetable, setTimetable] =
    useState<DayTimetable[]>(
      storage.getTimetable('10-A')
    );


  /* =========================================================
     HOMEWORK
     ========================================================= */

  const [homeworks, setHomeworks] =
    useState<Homework[]>(
      storage.getHomeworks()
    );


  /* =========================================================
     SUBMISSIONS
     ========================================================= */

  const [submissions, setSubmissions] =
    useState<HomeworkSubmission[]>(
      storage.getHomeworkSubmissions()
    );


  /* =========================================================
     QUESTION PAPERS
     ========================================================= */

  const [questionPapers, setQuestionPapers] =
    useState<QuestionPaper[]>(
      storage.getQuestionPapers()
    );


  /* =========================================================
     QUESTION BANK
     ========================================================= */

  const [questionBank, setQuestionBank] =
    useState<Question[]>(
      storage.getQuestionBank()
    );


  /* =========================================================
     MARKS
     ========================================================= */

  const [marksEntries, setMarksEntries] =
    useState<MarksEntry[]>(
      storage.getMarks(
        'EXAM-2026-UT1',
        '10'
      )
    );


  /* =========================================================
     LEAVE
     ========================================================= */

  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(() => {

      const s =
        storage as any;

      return typeof s.getLeaveRequests ===
        'function'
        ? s.getLeaveRequests() || []
        : [];
    });


  /* =========================================================
     CLASS 10-A STUDENTS
     ========================================================= */

  const class10AStudents =
    useMemo(
      () =>
        students.filter(
          (s) =>
            String(s.classId) === '10' &&
            String(s.section).toUpperCase() === 'A'
        ),
      [students]
    );


  /* =========================================================
     ATTENDANCE
     ========================================================= */

  const [attendanceDate, setAttendanceDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );

  const [classAttendanceMap, setClassAttendanceMap] =
    useState<
      Record<
        string,
        AttendanceStatus
      >
    >({});

  const [attendanceSavedMsg, setAttendanceSavedMsg] =
    useState(false);


  /* =========================================================
     HOMEWORK FORM
     ========================================================= */

  const [showAddHwModal, setShowAddHwModal] =
    useState(false);

  const [newHw, setNewHw] =
    useState({
      title: '',
      classNumber: '10',
      section: 'A',
      subject: 'Science (Physics)',
      dueDate:
        new Date(
          Date.now() +
            4 *
              24 *
              60 *
              60 *
              1000
        )
          .toISOString()
          .split('T')[0],
      description: ''
    });


  const [reviewingSub, setReviewingSub] =
    useState<HomeworkSubmission | null>(
      null
    );

  const [gradeInput, setGradeInput] =
    useState('A+');

  const [feedbackInput, setFeedbackInput] =
    useState(
      'Excellent work, well reasoned.'
    );


  /* =========================================================
     QUESTION PAPER
     ========================================================= */

  const [showCreatePaperModal, setShowCreatePaperModal] =
    useState(false);

  const [previewPaper, setPreviewPaper] =
    useState<QuestionPaper | null>(
      null
    );

  const [paperTitle, setPaperTitle] =
    useState(
      'Class 10 Physics Assessment'
    );

  const [paperMaxMarks, setPaperMaxMarks] =
    useState(50);

  const [paperDuration, setPaperDuration] =
    useState(120);

  const [selectedQuestions, setSelectedQuestions] =
    useState<Question[]>([]);

  const [isAiGenerating, setIsAiGenerating] =
    useState(false);

  const [aiTopicPrompt, setAiTopicPrompt] =
    useState(
      'Optics and Electric Circuits'
    );


  /* =========================================================
     MARKS FORM
     ========================================================= */

  const [marksData, setMarksData] =
    useState<
      Record<string, MarksData>
    >({});

  const [marksSavedNotice, setMarksSavedNotice] =
    useState(false);


  /* =========================================================
     LEAVE FORM
     ========================================================= */

  const [leaveDays, setLeaveDays] =
    useState(2);

  const [leaveReason, setLeaveReason] =
    useState('');

  const [leaveSuccess, setLeaveSuccess] =
    useState(false);


  /* =========================================================
     URL -> ACTIVE TAB
     ========================================================= */

  useEffect(() => {

    const path =
      location.pathname;

    if (
      path === '/teacher' ||
      path === '/teacher/dashboard'
    ) {

      setActiveTab('overview');

    } else if (
      path === '/teacher/attendance'
    ) {

      setActiveTab('attendance');

    } else if (
      path === '/teacher/homework'
    ) {

      setActiveTab('homework');

    } else if (
      path === '/teacher/question-papers'
    ) {

      setActiveTab('question-papers');

    } else if (
      path === '/teacher/marks'
    ) {

      setActiveTab('marks');

    } else if (
      path === '/teacher/timetable'
    ) {

      setActiveTab('timetable');

    } else if (
      path === '/teacher/leave'
    ) {

      setActiveTab('leave');
    }

  }, [
    location.pathname
  ]);


  /* =========================================================
     TAB -> URL
     ========================================================= */

  const handleTabChange = (
    value: TeacherTab | ((prevTab: TeacherTab) => TeacherTab)
  ) => {

    const nextTab =
      typeof value === 'function'
        ? value(activeTab)
        : value;

    setActiveTab(nextTab);

    const routes:
      Record<
        TeacherTab,
        string
      > = {

      overview:
        '/teacher/dashboard',

      attendance:
        '/teacher/attendance',

      homework:
        '/teacher/homework',

      'question-papers':
        '/teacher/question-papers',

      marks:
        '/teacher/marks',

      timetable:
        '/teacher/timetable',

      leave:
        '/teacher/leave'
    };

    navigate(
      routes[nextTab]
    );
  };


  /* =========================================================
     ATTENDANCE LOAD
     ========================================================= */

  useEffect(() => {

    const existing =
      storage.getAttendance(
        attendanceDate,
        '10',
        'A'
      );

    const map:
      Record<
        string,
        AttendanceStatus
      > = {};

    class10AStudents.forEach(
      (s) => {

        const rec =
          existing.find(
            (r) =>
              r.studentId ===
              s.id
          );

        map[s.id] =
          rec
            ? rec.status
            : 'Present';
      }
    );

    setClassAttendanceMap(
      map
    );

  }, [
    attendanceDate,
    class10AStudents
  ]);


  /* =========================================================
     MARK ALL ATTENDANCE
     ========================================================= */

  const handleMarkAll = (
    status: AttendanceStatus
  ) => {

    const updated:
      Record<
        string,
        AttendanceStatus
      > = {};

    class10AStudents.forEach(
      (s) => {
        updated[s.id] =
          status;
      }
    );

    setClassAttendanceMap(
      updated
    );
  };


  /* =========================================================
     SAVE ATTENDANCE
     ========================================================= */

  const handleSaveAttendance =
    () => {

      if (!teacher) {
        return;
      }

      const records:
        AttendanceRecord[] =
        class10AStudents.map(
          (s) => ({
            id:
              `att-${Date.now()}-${s.id}`,

            date:
              attendanceDate,

            classId:
              '10',

            section:
              'A',

            studentId:
              s.id,

            studentName:
              s.fullName,

            rollNumber:
              s.rollNumber,

            status:
              classAttendanceMap[
                s.id
              ] ||
              'Present',

            markedBy:
              teacher.fullName
          })
        );

      storage.markAttendance(
        records
      );

      setAttendanceSavedMsg(
        true
      );

      setTimeout(() => {
        setAttendanceSavedMsg(
          false
        );
      }, 3000);
    };


  /* =========================================================
     CREATE HOMEWORK
     ========================================================= */

  const handleCreateHomework = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!teacher) {
      return;
    }

    storage.addHomework({

      ...newHw,

      teacherId:
        teacher.id,

      teacherName:
        teacher.fullName,

      assignedDate:
        new Date()
          .toISOString()
          .split('T')[0],

      totalStudents:
        class10AStudents.length
    });

    setHomeworks(
      storage.getHomeworks()
    );

    setShowAddHwModal(
      false
    );

    setNewHw({

      title: '',

      classNumber: '10',

      section: 'A',

      subject:
        'Science (Physics)',

      dueDate:
        new Date(
          Date.now() +
            4 *
              24 *
              60 *
              60 *
              1000
        )
          .toISOString()
          .split('T')[0],

      description: ''
    });
  };


  /* =========================================================
     REVIEW SUBMISSION
     ========================================================= */

  const handleReviewSubmission = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!reviewingSub) {
      return;
    }

    storage.reviewHomeworkSubmission(
      reviewingSub.id,
      gradeInput,
      feedbackInput
    );

    setSubmissions(
      storage.getHomeworkSubmissions()
    );

    setReviewingSub(
      null
    );
  };


  /* =========================================================
     ADD QUESTION
     ========================================================= */

  const handleAddQuestionToPaper = (
    q: Question
  ) => {

    setSelectedQuestions(
      (prev) =>
        prev.some(
          (item) =>
            item.id === q.id
        )
          ? prev
          : [
              ...prev,
              q
            ]
    );
  };


  /* =========================================================
     REMOVE QUESTION
     ========================================================= */

  const handleRemoveQuestionFromPaper = (
    id: string
  ) => {

    setSelectedQuestions(
      (prev) =>
        prev.filter(
          (q) =>
            q.id !== id
        )
    );
  };


  /* =========================================================
     AI QUESTION GENERATION
     ========================================================= */

  const handleAiGenerateQuestions =
    async () => {

      setIsAiGenerating(
        true
      );

      try {

        const response =
          await fetch(
            '/api/ai/generate-question-paper',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({
                topic:
                  aiTopicPrompt,

                classNumber:
                  '10',

                subject:
                  'Physics & Science'
              })
            }
          );

        const data =
          await response.json();

        if (
          data &&
          Array.isArray(
            data.questions
          )
        ) {

          data.questions.forEach(
            (q: any) => {

              const created =
                storage.addQuestion(
                  q
                );

              setSelectedQuestions(
                (prev) =>
                  prev.some(
                    (item) =>
                      item.id ===
                      created.id
                  )
                    ? prev
                    : [
                        ...prev,
                        created
                      ]
              );
            }
          );

          setQuestionBank(
            storage.getQuestionBank()
          );
        }

      } catch {

        const fallbackQuestions =
          questionBank.slice(
            0,
            3
          );

        setSelectedQuestions(
          (prev) => {

            const next =
              [
                ...prev
              ];

            fallbackQuestions.forEach(
              (q) => {

                if (
                  !next.some(
                    (item) =>
                      item.id ===
                      q.id
                  )
                ) {

                  next.push(
                    q
                  );
                }
              }
            );

            return next;
          }
        );

      } finally {

        setIsAiGenerating(
          false
        );
      }
    };


  /* =========================================================
     SAVE QUESTION PAPER
     ========================================================= */

  const handleSaveAndPublishPaper =
    () => {

      if (!teacher) {
        return;
      }

      const newPaper = {

        id:
          `QP-${Date.now()}`,

        title:
          paperTitle,

        examId:
          'EXAM-2026-MID',

        examName:
          'Mid-Term Examination 2026',

        classNumber:
          '10',

        className:
          '10',

        section:
          'A',

        subject:
          'Science (Physics)',

        subjectCode:
          'SCI-086',

        duration:
          paperDuration,

        durationMinutes:
          paperDuration,

        questions:
          selectedQuestions.length >
          0
            ? selectedQuestions
            : questionBank.slice(
                0,
                4
              ),

        maxMarks:
          paperMaxMarks,

        generalInstructions: [

          'All questions are compulsory.',

          'Read questions carefully before answering.',

          'Draw neat diagrams wherever asked.',

          'Calculators and electronic gadgets are strictly prohibited.'
        ],

        sections: [

          {

            sectionTitle:
              'Section A - Objective & Short Answer Questions',

            instructions:
              'Answer in concise sentences or select the correct alternative.',

            questions:
              selectedQuestions.length >
              0
                ? selectedQuestions
                : questionBank.slice(
                    0,
                    4
                  )
          }
        ],

        createdBy:
          teacher.id,

        createdByName:
          teacher.fullName,

        createdAt:
          new Date()
            .toISOString()
            .split('T')[0],

        status:
          'Published'
      } as QuestionPaper;

      storage.saveQuestionPaper(
        newPaper
      );

      setQuestionPapers(
        storage.getQuestionPapers()
      );

      setShowCreatePaperModal(
        false
      );

      setPreviewPaper(
        newPaper
      );
    };


  /* =========================================================
     MARKS LOAD
     ========================================================= */

  useEffect(() => {

    const map:
      Record<
        string,
        MarksData
      > = {};

    class10AStudents.forEach(
      (s) => {

        const existing =
          marksEntries.find(
            (m) =>
              m.studentId ===
                s.id &&
              m.subject ===
                'Science'
          );

        map[s.id] = {

          theory:
            existing
              ? existing.theoryMarks
              : 35,

          practical:
            existing
              ? existing.practicalMarks
              : 10,

          remarks:
            existing?.remarks ||
            'Good progress'
        };
      }
    );

    setMarksData(
      map
    );

  }, [
    class10AStudents,
    marksEntries
  ]);


  /* =========================================================
     SAVE MARKS
     ========================================================= */

  const handleSaveMarks =
    () => {

      const entries:
        MarksEntry[] =
        class10AStudents.map(
          (s) => {

            const data =
              marksData[
                s.id
              ] || {

                theory:
                  35,

                practical:
                  10,

                remarks:
                  'Good'
              };

            const total =
              data.theory +
              data.practical;

            const percentage =
              (
                total /
                50
              ) *
              100;

            let grade =
              'B1';

            if (
              percentage >=
              91
            ) {

              grade =
                'A1';

            } else if (
              percentage >=
              81
            ) {

              grade =
                'A2';

            } else if (
              percentage >=
              71
            ) {

              grade =
                'B1';

            } else if (
              percentage >=
              61
            ) {

              grade =
                'B2';

            } else if (
              percentage >=
              51
            ) {

              grade =
                'C1';
            }

            return {

              id:
                `M-${Date.now()}-${s.id}`,

              examId:
                'EXAM-2026-UT1',

              examName:
                'Unit Test 1 (July 2026)',

              studentId:
                s.id,

              studentName:
                s.fullName,

              rollNumber:
                s.rollNumber,

              classNumber:
                '10',

              section:
                'A',

              subject:
                'Science',

              theoryMarks:
                data.theory,

              practicalMarks:
                data.practical,

              totalMarks:
                total,

              maxMarks:
                50,

              percentage,

              grade,

              status:
                percentage >=
                33
                  ? 'Pass'
                  : 'Fail',

              remarks:
                data.remarks
            };
          }
        );

      storage.saveMarks(
        entries
      );

      setMarksEntries(
        entries
      );

      setMarksSavedNotice(
        true
      );

      setTimeout(() => {

        setMarksSavedNotice(
          false
        );

      }, 3000);
    };


  /* =========================================================
     APPLY LEAVE
     ========================================================= */

  const handleApplyLeave = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!teacher) {
      return;
    }

    const s =
      storage as any;

    s.applyLeave({

      applicantId:
        teacher.id,

      applicantName:
        teacher.fullName,

      applicantType:
        'Teacher',

      classOrDesignation:
        teacher.designation,

      startDate:
        new Date()
          .toISOString()
          .split('T')[0],

      endDate:
        new Date(
          Date.now() +
            leaveDays *
              24 *
              60 *
              60 *
              1000
        )
          .toISOString()
          .split('T')[0],

      days:
        leaveDays,

      reason:
        leaveReason
    });

    if (
      typeof s.getLeaveRequests ===
      'function'
    ) {

      setLeaveRequests(
        s.getLeaveRequests() ||
        []
      );
    }

    setLeaveSuccess(
      true
    );

    setTimeout(() => {

      setLeaveSuccess(
        false
      );

      setLeaveReason(
        ''
      );

    }, 3000);
  };


  /* =========================================================
     REFRESH DATA
     ========================================================= */

  const refreshAll =
    () => {

      setSettings(
        storage.getSettings()
      );

      /*
       * IMPORTANT:
       *
       * Always get the current teacher
       * from backend login data first.
       */
      const currentTeacher =
        getCurrentTeacher();

      if (currentTeacher) {

        setTeacher(
          currentTeacher
        );

      } else {

        /*
         * No logged-in teacher.
         *
         * DO NOT use teachers[0].
         * DO NOT use EMP-T-108.
         *
         * Send user back to login.
         */

        setTeacher(
          null
        );

        navigate(
          '/login',
          {
            replace: true
          }
        );

        return;
      }


      setStudents(
        storage.getStudents()
      );

      setTimetable(
        storage.getTimetable(
          '10-A'
        )
      );

      setHomeworks(
        storage.getHomeworks()
      );

      setSubmissions(
        storage.getHomeworkSubmissions()
      );

      setQuestionPapers(
        storage.getQuestionPapers()
      );

      setQuestionBank(
        storage.getQuestionBank()
      );

      setMarksEntries(
        storage.getMarks(
          'EXAM-2026-UT1',
          '10'
        )
      );

      const s =
        storage as any;

      if (
        typeof s.getLeaveRequests ===
        'function'
      ) {

        setLeaveRequests(
          s.getLeaveRequests() ||
          []
        );
      }
    };


  /*
   * =========================================================
   * REFRESH WHEN LOGGED-IN TEACHER CHANGES
   * =========================================================
   */

  useEffect(() => {

    refreshAll();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [
    user?.refId
  ]);


  /* =========================================================
     COUNTS
     ========================================================= */

  const presentCount =
    Object.values(
      classAttendanceMap
    ).filter(
      (st) =>
        st === 'Present'
    ).length;

  const absentCount =
    Object.values(
      classAttendanceMap
    ).filter(
      (st) =>
        st === 'Absent'
    ).length;


  /* =========================================================
     NO TEACHER
     ========================================================= */

  if (!teacher) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Teacher session not found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please login again.
          </p>

          <button
            onClick={() =>
              navigate('/login')
            }
            className="mt-5 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold"
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }


  /* =========================================================
     UI
     ========================================================= */

  return (

    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">

      {/* HEADER */}

      <TeacherHeader
        teacher={teacher}
        settings={settings}
        quickSwitch={quickSwitch}
        onLogout={() => {

          logout();

          onBackToWebsite();

        }}
      />


      {/* SIDEBAR + MAIN */}

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        <TeacherSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />


        {/* MAIN */}

        <main className="flex-1 min-w-0 min-h-0 w-full overflow-y-auto">

          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">


            {/* =================================================
               DASHBOARD
               ================================================= */}

            {activeTab === 'overview' && (

              <TeacherDashboard

                teacher={teacher}

                homeworks={homeworks}

                questionPapers={
                  questionPapers
                }

                submissions={
                  submissions
                }

                presentCount={
                  presentCount
                }

                absentCount={
                  absentCount
                }

                onOpenAttendance={() =>
                  handleTabChange(
                    'attendance'
                  )
                }

                onOpenHomework={() =>
                  handleTabChange(
                    'homework'
                  )
                }

                onOpenTimetable={() =>
                  handleTabChange(
                    'timetable'
                  )
                }

                onReviewSubmission={(
                  sub
                ) => {

                  setReviewingSub(
                    sub
                  );

                  handleTabChange(
                    'homework'
                  );

                }}

                onAssignHomework={() =>
                  setShowAddHwModal(
                    true
                  )
                }

              />

            )}


            {/* =================================================
               ATTENDANCE
               ================================================= */}

            {activeTab === 'attendance' && (

              <TeacherAttendance

                teacher={
                  teacher
                }

                students={
                  class10AStudents
                }

                attendanceDate={
                  attendanceDate
                }

                setAttendanceDate={
                  setAttendanceDate
                }

                attendanceMap={
                  classAttendanceMap
                }

                setAttendanceMap={
                  setClassAttendanceMap
                }

                attendanceSavedMsg={
                  attendanceSavedMsg
                }

                onMarkAll={
                  handleMarkAll
                }

                onSave={
                  handleSaveAttendance
                }

                presentCount={
                  presentCount
                }

                absentCount={
                  absentCount
                }

              />

            )}


            {/* =================================================
               HOMEWORK
               ================================================= */}

            {activeTab === 'homework' && (

              <TeacherHomework

                teacher={
                  teacher
                }

                homeworks={
                  homeworks
                }

                submissions={
                  submissions
                }

                showAddModal={
                  showAddHwModal
                }

                setShowAddModal={
                  setShowAddHwModal
                }

                newHomework={
                  newHw
                }

                setNewHomework={
                  setNewHw
                }

                reviewingSubmission={
                  reviewingSub
                }

                setReviewingSubmission={
                  setReviewingSub
                }

                gradeInput={
                  gradeInput
                }

                setGradeInput={
                  setGradeInput
                }

                feedbackInput={
                  feedbackInput
                }

                setFeedbackInput={
                  setFeedbackInput
                }

                onCreateHomework={
                  handleCreateHomework
                }

                onReviewSubmission={
                  handleReviewSubmission
                }

              />

            )}


            {/* =================================================
               QUESTION PAPERS
               ================================================= */}

            {activeTab === 'question-papers' && (

              <TeacherQuestionPapers

                settings={
                  settings
                }

                questionPapers={
                  questionPapers
                }

                questionBank={
                  questionBank
                }

                showCreateModal={
                  showCreatePaperModal
                }

                setShowCreateModal={
                  setShowCreatePaperModal
                }

                previewPaper={
                  previewPaper
                }

                setPreviewPaper={
                  setPreviewPaper
                }

                paperTitle={
                  paperTitle
                }

                setPaperTitle={
                  setPaperTitle
                }

                paperMaxMarks={
                  paperMaxMarks
                }

                setPaperMaxMarks={
                  setPaperMaxMarks
                }

                paperDuration={
                  paperDuration
                }

                setPaperDuration={
                  setPaperDuration
                }

                selectedQuestions={
                  selectedQuestions
                }

                isAiGenerating={
                  isAiGenerating
                }

                aiTopicPrompt={
                  aiTopicPrompt
                }

                setAiTopicPrompt={
                  setAiTopicPrompt
                }

                onAddQuestion={
                  handleAddQuestionToPaper
                }

                onRemoveQuestion={
                  handleRemoveQuestionFromPaper
                }

                onAiGenerate={
                  handleAiGenerateQuestions
                }

                onSavePaper={
                  handleSaveAndPublishPaper
                }

              />

            )}


            {/* =================================================
               MARKS
               ================================================= */}

            {activeTab === 'marks' && (

              <TeacherMarks

                students={
                  class10AStudents
                }

                marksData={
                  marksData
                }

                setMarksData={
                  setMarksData
                }

                marksSavedNotice={
                  marksSavedNotice
                }

                onSave={
                  handleSaveMarks
                }

              />

            )}


            {/* =================================================
               TIMETABLE
               ================================================= */}

            {activeTab === 'timetable' && (

              <TeacherTimetable

                teacher={
                  teacher
                }

                timetable={
                  timetable
                }

              />

            )}


            {/* =================================================
               LEAVE
               ================================================= */}

            {activeTab === 'leave' && (

              <TeacherLeave

                teacher={
                  teacher
                }

                leaveDays={
                  leaveDays
                }

                setLeaveDays={
                  setLeaveDays
                }

                leaveReason={
                  leaveReason
                }

                setLeaveReason={
                  setLeaveReason
                }

                leaveSuccess={
                  leaveSuccess
                }

                leaveRequests={
                  leaveRequests
                }

                onApply={
                  handleApplyLeave
                }

              />

            )}

          </div>

        </main>

      </div>

    </div>
  );
};


export default TeacherPortal;
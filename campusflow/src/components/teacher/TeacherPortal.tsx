/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Teacher,
  Student,
  DayTimetable,
  AttendanceRecord,
  Question,
  QuestionPaper,
  Exam,
  MarksEntry,
  Homework,
  HomeworkSubmission,
  SchoolSettings,
  LeaveRequest
} from '../../types/school';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  Plus,
  Printer,
  Sparkles,
  LogOut,
  Send,
  Eye,
  Check,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { PrintableQuestionPaper } from '../print/PrintableQuestionPaper';
import { PrintableIDCard } from '../print/PrintableIDCard';

interface Props {
  onBackToWebsite: () => void;
}

export const TeacherPortal: React.FC<Props> = ({ onBackToWebsite }) => {
  const { user, logout, quickSwitch } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'homework' | 'question-papers' | 'marks' | 'timetable' | 'leave'
  >('overview');

  const [settings, setSettings] = useState<SchoolSettings>(storage.getSettings());
  const [teacher, setTeacher] = useState<Teacher>(
    storage.getTeacherById(user?.refId || 'EMP-T-108') || storage.getTeachers()[0]
  );

  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [class10AStudents, setClass10AStudents] = useState<Student[]>(
    storage.getStudents().filter(s => s.classId === '10' && s.section === 'A')
  );

  const [timetable, setTimetable] = useState<DayTimetable[]>(storage.getTimetable('10-A'));
  const [homeworks, setHomeworks] = useState<Homework[]>(storage.getHomeworks());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(storage.getHomeworkSubmissions());
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(storage.getQuestionPapers());
  const [questionBank, setQuestionBank] = useState<Question[]>(storage.getQuestionBank());
  const [exams, setExams] = useState<Exam[]>(storage.getExams());
  const [marksEntries, setMarksEntries] = useState<MarksEntry[]>(storage.getMarks('EXAM-2026-UT1', '10'));

  // Attendance state
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [classAttendanceMap, setClassAttendanceMap] = useState<Record<string, AttendanceRecord['status']>>({});
  const [attendanceSavedMsg, setAttendanceSavedMsg] = useState(false);

  // Homework creation state
  const [showAddHwModal, setShowAddHwModal] = useState(false);
  const [newHw, setNewHw] = useState({
    title: '',
    classNumber: '10',
    section: 'A',
    subject: 'Science (Physics)',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  // Homework grading state
  const [reviewingSub, setReviewingSub] = useState<HomeworkSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('A+');
  const [feedbackInput, setFeedbackInput] = useState('Excellent work, well reasoned.');

  // Question Paper Creator state
  const [showCreatePaperModal, setShowCreatePaperModal] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);
  const [paperTitle, setPaperTitle] = useState('Class 10 Physics Assessment');
  const [paperMaxMarks, setPaperMaxMarks] = useState(50);
  const [paperDuration, setPaperDuration] = useState(120);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopicPrompt, setAiTopicPrompt] = useState('Optics and Electric Circuits');

  // Marks Entry state
  const [marksData, setMarksData] = useState<Record<string, { theory: number; practical: number; remarks: string }>>({});
  const [marksSavedNotice, setMarksSavedNotice] = useState(false);

  // Leave state
  const [leaveDays, setLeaveDays] = useState(2);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Initialize attendance map for 10-A
  useEffect(() => {
    const existing = storage.getAttendance(attendanceDate, '10', 'A');
    const map: Record<string, AttendanceRecord['status']> = {};
    class10AStudents.forEach(s => {
      const rec = existing.find(r => r.studentId === s.id);
      map[s.id] = rec ? rec.status : 'Present';
    });
    setClassAttendanceMap(map);
  }, [attendanceDate, class10AStudents]);

  // Initialize marks entry form
  useEffect(() => {
    const map: Record<string, { theory: number; practical: number; remarks: string }> = {};
    class10AStudents.forEach(s => {
      const existing = marksEntries.find(m => m.studentId === s.id && m.subject === 'Science');
      map[s.id] = {
        theory: existing ? existing.theoryMarks : 35,
        practical: existing ? existing.practicalMarks : 10,
        remarks: existing?.remarks || 'Good progress'
      };
    });
    setMarksData(map);
  }, [class10AStudents, marksEntries]);

  // Attendance actions
  const handleMarkAll = (status: AttendanceRecord['status']) => {
    const updated: Record<string, AttendanceRecord['status']> = {};
    class10AStudents.forEach(s => {
      updated[s.id] = status;
    });
    setClassAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = class10AStudents.map(s => ({
      id: `att-${Date.now()}-${s.id}`,
      date: attendanceDate,
      classId: '10',
      section: 'A',
      studentId: s.id,
      studentName: s.fullName,
      rollNumber: s.rollNumber,
      status: classAttendanceMap[s.id] || 'Present',
      markedBy: teacher.fullName
    }));
    storage.markAttendance(records);
    setAttendanceSavedMsg(true);
    setTimeout(() => setAttendanceSavedMsg(false), 3000);
  };

  // Homework actions
  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addHomework({
      ...newHw,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      assignedDate: new Date().toISOString().split('T')[0],
      totalStudents: class10AStudents.length
    });
    setHomeworks(storage.getHomeworks());
    setShowAddHwModal(false);
    setNewHw({
      title: '',
      classNumber: '10',
      section: 'A',
      subject: 'Science (Physics)',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: ''
    });
  };

  const handleReviewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSub) return;
    storage.reviewHomeworkSubmission(reviewingSub.id, gradeInput, feedbackInput);
    setSubmissions(storage.getHomeworkSubmissions());
    setReviewingSub(null);
  };

  // Question Paper actions
  const handleAddQuestionToPaper = (q: Question) => {
    if (!selectedQuestions.some(item => item.id === q.id)) {
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };

  const handleRemoveQuestionFromPaper = (id: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));
  };

  // AI Question Generation assistance
  const handleAiGenerateQuestions = async () => {
    setIsAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicPrompt,
          classNumber: '10',
          subject: 'Physics & Science'
        })
      });
      const data = await response.json();
      if (data && data.questions && Array.isArray(data.questions)) {
        data.questions.forEach((q: any) => {
          const created = storage.addQuestion(q);
          setSelectedQuestions(prev => [...prev, created]);
        });
        setQuestionBank(storage.getQuestionBank());
      }
    } catch {
      // Fallback: Add 2 sample curriculum questions from bank
      const fallbackQuestions = questionBank.slice(0, 3);
      fallbackQuestions.forEach(q => {
        if (!selectedQuestions.some(item => item.id === q.id)) {
          setSelectedQuestions(prev => [...prev, q]);
        }
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveAndPublishPaper = () => {
    const newPaper: QuestionPaper = {
      id: `QP-${Date.now()}`,
      title: paperTitle,
      examId: 'EXAM-2026-MID',
      examName: 'Mid-Term Examination 2026',
      classNumber: '10',
      subject: 'Science (Physics)',
      subjectCode: 'SCI-086',
      durationMinutes: paperDuration,
      maxMarks: paperMaxMarks,
      generalInstructions: [
        'All questions are compulsory.',
        'Read questions carefully before answering.',
        'Draw neat diagrams wherever asked.',
        'Calculators and electronic gadgets are strictly prohibited.'
      ],
      sections: [
        {
          sectionTitle: 'Section A - Objective & Short Answer Questions',
          instructions: 'Answer in concise sentences or select the correct alternative.',
          questions: selectedQuestions.length > 0 ? selectedQuestions : questionBank.slice(0, 4)
        }
      ],
      createdBy: teacher.id,
      createdByName: teacher.fullName,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Published'
    };
    storage.saveQuestionPaper(newPaper);
    setQuestionPapers(storage.getQuestionPapers());
    setShowCreatePaperModal(false);
    setPreviewPaper(newPaper);
  };

  // Marks actions
  const handleSaveMarks = () => {
    const entries: MarksEntry[] = class10AStudents.map(s => {
      const data = marksData[s.id] || { theory: 35, practical: 10, remarks: 'Good' };
      const total = data.theory + data.practical;
      const percentage = (total / 50) * 100;
      let grade = 'B1';
      if (percentage >= 91) grade = 'A1';
      else if (percentage >= 81) grade = 'A2';
      else if (percentage >= 71) grade = 'B1';
      else if (percentage >= 61) grade = 'B2';
      else if (percentage >= 51) grade = 'C1';

      return {
        id: `M-${Date.now()}-${s.id}`,
        examId: 'EXAM-2026-UT1',
        examName: 'Unit Test 1 (July 2026)',
        studentId: s.id,
        studentName: s.fullName,
        rollNumber: s.rollNumber,
        classNumber: '10',
        section: 'A',
        subject: 'Science',
        theoryMarks: data.theory,
        practicalMarks: data.practical,
        totalMarks: total,
        maxMarks: 50,
        percentage,
        grade,
        status: percentage >= 33 ? 'Pass' : 'Fail',
        remarks: data.remarks
      };
    });
    storage.saveMarks(entries);
    setMarksEntries(entries);
    setMarksSavedNotice(true);
    setTimeout(() => setMarksSavedNotice(false), 3000);
  };

  // Leave actions
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.applyLeave({
      applicantId: teacher.id,
      applicantName: teacher.fullName,
      applicantType: 'Teacher',
      classOrDesignation: teacher.designation,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + leaveDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: leaveDays,
      reason: leaveReason
    });
    setLeaveSuccess(true);
    setTimeout(() => {
      setLeaveSuccess(false);
      setLeaveReason('');
    }, 3000);
  };

  const presentCount = Object.values(classAttendanceMap).filter(st => st === 'Present').length;
  const absentCount = Object.values(classAttendanceMap).filter(st => st === 'Absent').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Teacher Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-lg flex items-center justify-center border border-white">
              R
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif text-white tracking-tight leading-tight">
                {settings.schoolName}
              </h1>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                Faculty Workspace & Academic Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Switch:</span>
              <button
                onClick={() => quickSwitch('student')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Student
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
                <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-white leading-tight">{teacher.fullName}</p>
                <p className="text-[10px] text-amber-400">{teacher.designation}</p>
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
              { id: 'overview', label: 'Faculty Dashboard' },
              { id: 'attendance', label: 'Mark Attendance (10-A)' },
              { id: 'homework', label: 'Homework & Review' },
              { id: 'question-papers', label: 'Question Paper Creator' },
              { id: 'marks', label: 'Exam Marks Entry' },
              { id: 'timetable', label: 'My Teaching Schedule' },
              { id: 'leave', label: 'Leave Applications' }
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

      {/* Main Teacher Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Class Teacher of 10-A • Senior PGT Physics
                </span>
                <h2 className="text-2xl font-bold font-serif text-slate-950 mt-1">
                  Good Morning, {teacher.fullName}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  You have 4 teaching periods scheduled today. First class: Period 1 at 08:00 AM (Physics Lab 1).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 bg-slate-900 text-white font-medium text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Mark Today's Attendance
                </button>
                <button
                  onClick={() => setShowAddHwModal(true)}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-600 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Assign Homework
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Class 10-A Strength</span>
                <span className="text-2xl font-black text-slate-900 font-serif">38 Students</span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
                  {presentCount} Present • {absentCount} Absent
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Assigned Homeworks</span>
                <span className="text-2xl font-black text-amber-700 font-serif">{homeworks.length}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Active assignments</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Question Papers Made</span>
                <span className="text-2xl font-black text-slate-900 font-serif">{questionPapers.length}</span>
                <span className="text-[11px] text-blue-700 font-medium block mt-0.5">Mid-Term & UT Papers</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Monthly Gross Salary</span>
                <span className="text-2xl font-black text-emerald-800 font-serif font-mono">₹1,06,000</span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Disbursed (Sep 2026)</span>
              </div>
            </div>

            {/* Quick Action Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Teaching Schedule */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" /> Today's Teaching Schedule
                  </h3>
                  <button onClick={() => setActiveTab('timetable')} className="text-xs text-amber-700 font-semibold hover:underline">
                    Full Timetable →
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { period: 'Period 2 (08:45 AM - 09:30 AM)', class: 'Class 10-A', subject: 'Science (Physics Lab 1)', status: 'Practical Session' },
                    { period: 'Period 4 (10:45 AM - 11:30 AM)', class: 'Class 11-Science', subject: 'Physics (Optics & Wave)', status: 'Room 301' },
                    { period: 'Period 5 (11:30 AM - 12:15 PM)', class: 'Class 12-Science', subject: 'Physics (Electromagnetism)', status: 'Room 302' },
                    { period: 'Period 6 (12:15 PM - 01:00 PM)', class: 'Class 10-B', subject: 'Science (Physics Theory)', status: 'Room 205' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">{p.subject}</span>
                        <span className="text-[11px] text-slate-500">{p.class} • {p.status}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                        {p.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions Pending Review */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Recent Student Submissions
                  </h3>
                  <button onClick={() => setActiveTab('homework')} className="text-xs text-amber-700 font-semibold hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                        <span className="text-[11px] text-slate-500">Submitted at {sub.submittedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.grade ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                            Grade: {sub.grade}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewingSub(sub);
                              setActiveTab('homework');
                            }}
                            className="px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                          >
                            Grade Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Class 10-A Daily Attendance Register
                </h2>
                <p className="text-xs text-slate-500">
                  Class Teacher: {teacher.fullName} • Room 204
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Save Register
                </button>
              </div>
            </div>

            {/* Status alerts */}
            {attendanceSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Attendance saved successfully and synchronized with school administrative records.
              </div>
            )}

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Quick Fill:</span>
                <button
                  onClick={() => handleMarkAll('Present')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('Absent')}
                  className="px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                >
                  Mark All Absent
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-emerald-700">Present: {presentCount}</span>
                <span className="text-red-700">Absent: {absentCount}</span>
                <span className="text-slate-600">Total Enrolled: {class10AStudents.length}</span>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="p-2.5">Roll No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5">Admission No</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5">Quick Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {class10AStudents.map((s) => {
                    const status = classAttendanceMap[s.id] || 'Present';
                    return (
                      <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold font-mono text-slate-800">#{s.rollNumber}</td>
                        <td className="p-2.5 font-semibold text-slate-900 flex items-center gap-2">
                          <img src={s.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span>{s.fullName}</span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-500">{s.admissionNumber}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'Absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex gap-1.5">
                            {(['Present', 'Absent', 'Late', 'Half Day'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => setClassAttendanceMap({ ...classAttendanceMap, [s.id]: st })}
                                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                                  status === st
                                    ? 'bg-slate-900 text-white font-bold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HOMEWORK & REVIEW */}
        {activeTab === 'homework' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Homework & Assignment Manager
                </h2>
                <p className="text-xs text-slate-500">
                  Curriculum Tasks for Class 10 (Physics, Mathematics & Languages)
                </p>
              </div>

              <button
                onClick={() => setShowAddHwModal(true)}
                className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Assign New Homework
              </button>
            </div>

            <div className="space-y-4">
              {homeworks.map((hw) => (
                <div key={hw.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {hw.subject}
                        </span>
                        <span className="text-xs text-slate-500">Class {hw.classNumber}-{hw.section}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{hw.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{hw.description}</p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-bold text-amber-800 block">Due: {hw.dueDate}</span>
                      <span className="text-slate-500 text-[11px]">
                        {hw.submissionsCount} / {hw.totalStudents || 38} Submissions
                      </span>
                    </div>
                  </div>

                  {/* Submission list toggle */}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500 text-[11px]">Teacher: {hw.teacherName}</span>
                    <button
                      onClick={() => {
                        const targetSub = submissions.find(s => s.homeworkId === hw.id);
                        if (targetSub) setReviewingSub(targetSub);
                      }}
                      className="text-amber-800 font-semibold hover:underline"
                    >
                      Review Submissions ({hw.submissionsCount}) →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Homework Modal */}
            {showAddHwModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
                  <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                    Assign Homework to Class 10
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Students receive automatic notifications in their portal.</p>

                  <form onSubmit={handleCreateHomework} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chapter 9 Lens Formula Problem Set"
                        value={newHw.title}
                        onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                        <select
                          value={newHw.subject}
                          onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option>Science (Physics)</option>
                          <option>Science (Chemistry)</option>
                          <option>Mathematics</option>
                          <option>English Literature</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={newHw.dueDate}
                          onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Instructions / Problems</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Specify textbook questions, diagram instructions, or submission formatting..."
                        value={newHw.description}
                        onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddHwModal(false)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                      >
                        Publish Assignment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Review Submission Modal */}
            {reviewingSub && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
                  <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                    Grade Submission: {reviewingSub.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">Submitted on {reviewingSub.submittedAt}</p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 mb-4">
                    <p className="text-slate-800"><strong>Student Note:</strong> {reviewingSub.content}</p>
                    {reviewingSub.attachmentName && (
                      <p className="text-blue-700 font-medium">📎 Attachment: {reviewingSub.attachmentName}</p>
                    )}
                  </div>

                  <form onSubmit={handleReviewSubmission} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Assign Grade</label>
                      <select
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        <option>A+</option>
                        <option>A</option>
                        <option>B+</option>
                        <option>B</option>
                        <option>Needs Improvement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Teacher Feedback</label>
                      <textarea
                        rows={3}
                        required
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setReviewingSub(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800"
                      >
                        Submit Evaluation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUESTION PAPER CREATOR (MAJOR FEATURE) */}
        {activeTab === 'question-papers' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Examination Question Paper Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Create, configure, and print board-compliant question papers with question bank reuse and AI authoring.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreatePaperModal(true)}
                  className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Build New Question Paper
                </button>
              </div>
            </div>

            {/* List of Created Papers */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Published & Draft Examination Papers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {paper.status}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{paper.subjectCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Class {paper.classNumber} • Max Marks: {paper.maxMarks} • Time: {paper.durationMinutes} Mins
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Author: {paper.createdByName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500">
                        {paper.sections.reduce((acc, s) => acc + s.questions.length, 0)} Total Questions
                      </span>
                      <button
                        onClick={() => setPreviewPaper(paper)}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Bank Explorer */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Question Bank Repository ({questionBank.length} Questions)
                </h3>
              </div>
              <div className="space-y-2">
                {questionBank.map((q) => (
                  <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div className="space-y-0.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-800 font-mono text-[10px]">{q.id}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{q.type}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{q.topic}</span>
                        <span className="font-bold text-slate-900">[{q.marks} Mark{q.marks > 1 ? 's' : ''}]</span>
                      </div>
                      <p className="text-slate-800">{q.questionText}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 px-2 py-1 bg-slate-50 rounded border border-slate-200">
                      {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE QUESTION PAPER MODAL */}
            {showCreatePaperModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif">
                        Create Printable Examination Paper
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configure exam parameters and select questions from the repository or generate new ones with AI.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreatePaperModal(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-5 my-4 text-xs">
                    {/* Basic Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Paper Title</label>
                        <input
                          type="text"
                          value={paperTitle}
                          onChange={(e) => setPaperTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Maximum Marks</label>
                        <input
                          type="number"
                          value={paperMaxMarks}
                          onChange={(e) => setPaperMaxMarks(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Question Generator Box */}
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" /> Question Authoring Assistant
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiTopicPrompt}
                          onChange={(e) => setAiTopicPrompt(e.target.value)}
                          placeholder="e.g. Optics, Ohm's law, Light reflection"
                          className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAiGenerateQuestions}
                          disabled={isAiGenerating}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          {isAiGenerating ? 'Generating...' : 'Generate Questions'}
                        </button>
                      </div>
                    </div>

                    {/* Questions Picker */}
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">
                        Select Questions from Bank ({selectedQuestions.length} Selected):
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 p-2 rounded-lg bg-slate-50">
                        {questionBank.map((q) => {
                          const isSelected = selectedQuestions.some(item => item.id === q.id);
                          return (
                            <div
                              key={q.id}
                              className={`p-2 rounded-lg border text-xs flex justify-between items-center ${
                                isSelected ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex-1 pr-2">
                                <span className="font-bold text-slate-800 mr-1">[{q.marks}M]</span>
                                <span className="text-slate-700">{q.questionText}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  isSelected
                                    ? handleRemoveQuestionFromPaper(q.id)
                                    : handleAddQuestionToPaper(q)
                                }
                                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                  isSelected ? 'bg-red-100 text-red-700' : 'bg-slate-900 text-white'
                                }`}
                              >
                                {isSelected ? 'Remove' : '+ Add'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowCreatePaperModal(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndPublishPaper}
                      className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg text-xs hover:bg-slate-800"
                    >
                      Save & Publish Question Paper
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW PAPER MODAL */}
            {previewPaper && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="max-w-4xl w-full my-8">
                  <PrintableQuestionPaper
                    paper={previewPaper}
                    settings={settings}
                    onClose={() => setPreviewPaper(null)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MARKS ENTRY */}
        {activeTab === 'marks' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Examination Marks Entry Register
                </h2>
                <p className="text-xs text-slate-500">
                  Unit Test 1 (July 2026) • Class 10-A • Science (Max Marks: 50)
                </p>
              </div>

              <button
                onClick={handleSaveMarks}
                className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Save All Marks
              </button>
            </div>

            {marksSavedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Marks entries recorded and report cards updated automatically.
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="p-2.5">Roll No</th>
                    <th className="p-2.5">Student Name</th>
                    <th className="p-2.5 text-center">Theory (Max 40)</th>
                    <th className="p-2.5 text-center">Practical (Max 10)</th>
                    <th className="p-2.5 text-center">Total (50)</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {class10AStudents.map((s) => {
                    const row = marksData[s.id] || { theory: 35, practical: 10, remarks: 'Good' };
                    const total = row.theory + row.practical;
                    const pct = (total / 50) * 100;
                    const grade = pct >= 91 ? 'A1' : pct >= 81 ? 'A2' : pct >= 71 ? 'B1' : 'B2';

                    return (
                      <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2.5 font-bold font-mono text-slate-800">#{s.rollNumber}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{s.fullName}</td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={row.theory}
                            onChange={(e) =>
                              setMarksData({
                                ...marksData,
                                [s.id]: { ...row, theory: Number(e.target.value) }
                              })
                            }
                            className="w-16 px-2 py-1 text-center bg-white border border-slate-300 rounded font-mono font-bold"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={row.practical}
                            onChange={(e) =>
                              setMarksData({
                                ...marksData,
                                [s.id]: { ...row, practical: Number(e.target.value) }
                              })
                            }
                            className="w-16 px-2 py-1 text-center bg-white border border-slate-300 rounded font-mono font-bold"
                          />
                        </td>
                        <td className="p-2.5 text-center font-bold font-mono text-slate-900 text-sm">
                          {total}
                        </td>
                        <td className="p-2.5 text-center font-bold text-blue-700">
                          {grade}
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={(e) =>
                              setMarksData({
                                ...marksData,
                                [s.id]: { ...row, remarks: e.target.value }
                              })
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Personal Faculty Schedule & Teaching Workload
              </h2>
              <p className="text-xs text-slate-500">
                Weekly Allotted Periods: 22 Teaching Periods + 6 Mentoring Slots
              </p>
            </div>

            <div className="space-y-4">
              {timetable.map((dayObj) => (
                <div key={dayObj.day} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between">
                    <span>{dayObj.day}</span>
                    <span className="text-amber-400 font-mono">Academic Duty</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
                    {dayObj.periods.map((p) => {
                      const isMyClass = p.teacherId === teacher.id;
                      return (
                        <div key={p.id} className={`p-3 space-y-1 ${isMyClass ? 'bg-amber-50/70 border-l-2 border-l-amber-500' : 'bg-white'}`}>
                          <span className="font-bold text-[10px] uppercase text-slate-600 block">
                            Period {p.periodNumber}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs">{p.subject}</h4>
                          <p className="text-[11px] text-slate-500">{p.room}</p>
                          {isMyClass && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1 rounded inline-block">
                              Assigned Faculty
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LEAVE APPLICATION */}
        {activeTab === 'leave' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-xl">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Faculty Leave Application
              </h2>
              <p className="text-xs text-slate-500">
                Applications are reviewed directly by Dr. Ananya Sharma (Principal).
              </p>
            </div>

            {leaveSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs space-y-1">
                <strong className="block font-bold">Leave Form Submitted</strong>
                <p>Your casual/academic leave application has been forwarded to the Principal's secretariat.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number of Working Days</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason / Official Purpose</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Attending National Physics Teachers Conclave at IIT Delhi..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition"
                >
                  Submit Official Leave Request
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

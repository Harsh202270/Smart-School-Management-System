import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  FileText,
  Plus,
  Users,
  GraduationCap,
  MapPin,
} from 'lucide-react';

import {
  Homework,
  QuestionPaper,
  HomeworkSubmission,
  Teacher,
} from '../../types/school';

interface Props {
  teacher: Teacher;
  homeworks: Homework[];
  questionPapers: QuestionPaper[];
  submissions: HomeworkSubmission[];
  presentCount: number;
  absentCount: number;

  onOpenAttendance: () => void;
  onOpenHomework: () => void;
  onOpenTimetable: () => void;
  onReviewSubmission: (
    submission: HomeworkSubmission
  ) => void;
  onAssignHomework: () => void;
}

const API_URL =
  'http://127.0.0.1:8000/api/timetables';

export const TeacherDashboard: React.FC<Props> = ({
  teacher,
  homeworks,
  questionPapers,
  submissions,
  presentCount,
  absentCount,
  onOpenAttendance,
  onOpenHomework,
  onOpenTimetable,
  onReviewSubmission,
  onAssignHomework,
}) => {
  const teacherData = teacher as any;

  const teacherName =
    teacherData.fullName ||
    teacherData.name ||
    'Teacher';

  const designation =
    teacherData.designation ||
    'Faculty Member';

  /*
   * IMPORTANT:
   * Backend teacher ID is preferred.
   *
   * Example:
   * EMP-T-103 = Chirag kumar
   */
  const teacherId =
    teacherData.id ||
    teacherData.teacherId ||
    teacherData.employeeCode ||
    '';

  const employeeCode =
    teacherData.employeeCode ||
    teacherData.id ||
    '';

  const department =
    teacherData.department ||
    'Academic';

  /*
   * ============================================================
   * CLASS TEACHER ASSIGNMENT
   * ============================================================
   */

  const classTeacherOf =
    teacherData.classTeacherOf ||
    teacherData.class_teacher_of ||
    null;

  const classNumber =
    classTeacherOf?.classNumber ||
    classTeacherOf?.class_number ||
    classTeacherOf?.className ||
    '';

  const section =
    classTeacherOf?.section ||
    '';

  const roomNumber =
    classTeacherOf?.roomNumber ||
    classTeacherOf?.room_number ||
    '';

  const totalStudents =
    teacherData.totalStudents ||
    teacherData.total_students ||
    0;

  const hasClassTeacherAssignment =
    Boolean(classNumber);


  /*
   * ============================================================
   * TEACHER TIMETABLE FROM BACKEND API
   * ============================================================
   */

  const [apiTimetable, setApiTimetable] =
    useState<any[]>([]);

  const [timetableLoading, setTimetableLoading] =
    useState(true);

  const [timetableError, setTimetableError] =
    useState('');


  /*
   * Load only logged-in teacher's timetable.
   *
   * Example:
   * /api/timetables?teacher_id=EMP-T-103
   */
  useEffect(() => {
    const loadTeacherTimetable = async () => {
      try {
        setTimetableLoading(true);
        setTimetableError('');

        if (!teacherId) {
          setApiTimetable([]);
          setTimetableError(
            'Teacher ID not found.'
          );
          return;
        }

        const response = await fetch(
          `${API_URL}?teacher_id=${encodeURIComponent(
            String(teacherId)
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Timetable API failed: ${response.status}`
          );
        }

        const result =
          await response.json();

        const data =
          Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];

        /*
         * Extra safety:
         * If backend returns all timetable records,
         * frontend still keeps only this teacher's records.
         */
        const teacherTimetable =
          data.filter((item: any) => {
            const apiTeacherId =
              item?.teacher_id ??
              item?.teacherId ??
              '';

            return (
              String(apiTeacherId)
                .trim()
                .toLowerCase() ===
              String(teacherId)
                .trim()
                .toLowerCase()
            );
          });

        setApiTimetable(
          teacherTimetable
        );

      } catch (error) {
        console.error(
          'Teacher timetable loading error:',
          error
        );

        setApiTimetable([]);

        setTimetableError(
          'Unable to load timetable.'
        );
      } finally {
        setTimetableLoading(false);
      }
    };

    loadTeacherTimetable();
  }, [teacherId]);


  /*
   * ============================================================
   * TODAY
   * ============================================================
   *
   * Asia/Kolkata is used so the dashboard follows Indian time.
   */
  const todayName =
    new Intl.DateTimeFormat(
      'en-US',
      {
        weekday: 'long',
        timeZone: 'Asia/Kolkata',
      }
    ).format(new Date());


  /*
   * ============================================================
   * TODAY'S TEACHING SCHEDULE
   * ============================================================
   */

  const todayTimetable =
    useMemo(() => {
      return [...apiTimetable]
        .filter((item: any) => {
          const day =
            item?.day_of_week ??
            item?.day ??
            '';

          return (
            String(day)
              .trim()
              .toLowerCase() ===
            todayName
              .trim()
              .toLowerCase()
          );
        })
        .sort((a: any, b: any) => {
          return (
            Number(
              a?.period_number ??
              a?.periodNumber ??
              0
            ) -
            Number(
              b?.period_number ??
              b?.periodNumber ??
              0
            )
          );
        });
    }, [
      apiTimetable,
      todayName,
    ]);


  /*
   * Format API time.
   *
   * 08:00:00 -> 08:00
   */
  const formatTime = (
    value: any
  ) => {
    if (!value) {
      return '--:--';
    }

    return String(value)
      .slice(0, 5);
  };


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="space-y-6">

      {/* =====================================================
          WELCOME CARD
      ===================================================== */}

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {department} Department
            </span>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {employeeCode}
            </span>

          </div>

          <h2 className="text-2xl font-bold font-serif text-slate-950 mt-3">
            Good Morning, {teacherName}
          </h2>

          <p className="text-xs text-slate-600 mt-1">
            {designation} • {department} Department
          </p>

          <p className="text-xs text-slate-500 mt-2 max-w-2xl">
            Welcome to your faculty workspace. Manage your
            assigned classes, attendance, homework, question
            papers, marks, timetable and leave applications
            from this dashboard.
          </p>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={onOpenAttendance}
            className="px-4 py-2.5 bg-slate-900 text-white font-medium text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Mark Attendance
          </button>

          <button
            type="button"
            onClick={onAssignHomework}
            className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-600 transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Assign Homework
          </button>

        </div>

      </div>


      {/* =====================================================
          CLASS TEACHER ASSIGNMENT
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>

            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              Class Teacher Assignment
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Your assigned class and student routing
            </p>

          </div>

          {hasClassTeacherAssignment && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
              ACTIVE
            </span>
          )}

        </div>

        {hasClassTeacherAssignment ? (

          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* CLASS */}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <span className="text-[11px] text-slate-500 block">
                  Class Teacher Of
                </span>

                <span className="text-xl font-black text-slate-900 font-serif block mt-1">
                  Class {classNumber}
                  {section
                    ? `-${section}`
                    : ''}
                </span>

              </div>


              {/* STUDENTS */}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <span className="text-[11px] text-slate-500 block">
                  Total Students
                </span>

                <span className="text-xl font-black text-slate-900 font-serif block mt-1">
                  {totalStudents}
                </span>

                <span className="text-[10px] text-slate-500">
                  Students in assigned class
                </span>

              </div>


              {/* ROOM */}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Classroom
                </span>

                <span className="text-xl font-black text-slate-900 font-serif block mt-1">
                  {roomNumber ||
                    'Not Assigned'}
                </span>

              </div>

            </div>


            {/* TEACHER DETAIL */}

            <div className="mt-5 p-4 rounded-xl border border-amber-200 bg-amber-50">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                    Class Teacher
                  </span>

                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {teacherName}
                  </h4>

                  <p className="text-[11px] text-slate-600 mt-1">
                    {designation} • {department}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={onOpenAttendance}
                  className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Take Class Attendance
                </button>

              </div>

            </div>

          </div>

        ) : (

          <div className="p-8 text-center">

            <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />

            <p className="text-sm font-semibold text-slate-700 mt-3">
              No Class Teacher Assignment Found
            </p>

            <p className="text-xs text-slate-500 mt-1">
              This teacher is currently not assigned as a class teacher.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">

          <span className="text-xs text-slate-500 block">
            Today's Attendance
          </span>

          <span className="text-2xl font-black text-slate-900 font-serif">
            {presentCount +
              absentCount}
          </span>

          <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
            {presentCount} Present • {absentCount} Absent
          </span>

        </div>


        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">

          <span className="text-xs text-slate-500 block">
            Assigned Homework
          </span>

          <span className="text-2xl font-black text-amber-700 font-serif">
            {homeworks.length}
          </span>

          <span className="text-[11px] text-slate-500 block mt-0.5">
            Active assignments
          </span>

        </div>


        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">

          <span className="text-xs text-slate-500 block">
            Question Papers
          </span>

          <span className="text-2xl font-black text-slate-900 font-serif">
            {questionPapers.length}
          </span>

          <span className="text-[11px] text-blue-700 font-medium block mt-0.5">
            Papers created
          </span>

        </div>


        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">

          <span className="text-xs text-slate-500 block">
            Faculty Profile
          </span>

          <span className="text-base font-black text-emerald-800 font-serif block mt-1">
            {designation}
          </span>

          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            {department} • {employeeCode}
          </span>

        </div>

      </div>


      {/* =====================================================
          LOWER CONTENT
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* ===================================================
            TODAY'S TEACHING SCHEDULE
        =================================================== */}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">

            <div>

              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Today's Teaching Schedule
              </h3>

              <p className="text-[10px] text-slate-400 mt-1">
                {todayName}
              </p>

            </div>

            <button
              type="button"
              onClick={onOpenTimetable}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              Full Timetable →
            </button>

          </div>


          {/* LOADING */}

          {timetableLoading && (

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">

              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />

              <p className="text-xs text-slate-500 mt-3">
                Loading your teaching schedule...
              </p>

            </div>

          )}


          {/* ERROR */}

          {!timetableLoading &&
            timetableError && (

              <div className="p-4 rounded-xl border border-red-200 bg-red-50">

                <p className="text-xs font-semibold text-red-700">
                  {timetableError}
                </p>

                <p className="text-[10px] text-red-500 mt-1">
                  Please check the timetable API and teacher ID.
                </p>

              </div>

            )}


          {/* NO CLASS TODAY */}

          {!timetableLoading &&
            !timetableError &&
            todayTimetable.length === 0 && (

              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">

                <Clock className="w-7 h-7 text-slate-300 mx-auto" />

                <p className="text-sm font-semibold text-slate-700 mt-3">
                  No Teaching Periods Today
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  You have no assigned teaching periods for {todayName}.
                </p>

                <button
                  type="button"
                  onClick={onOpenTimetable}
                  className="mt-4 px-3 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                >
                  View My Timetable
                </button>

              </div>

            )}


          {/* TODAY'S PERIODS */}

          {!timetableLoading &&
            !timetableError &&
            todayTimetable.length > 0 && (

              <div className="space-y-3">

                {todayTimetable.map(
                  (
                    period: any,
                    index: number
                  ) => {

                    const periodNumber =
                      period?.period_number ??
                      period?.periodNumber ??
                      index + 1;

                    const subject =
                      period?.subject ||
                      'Subject Not Assigned';

                    const currentClass =
                      period?.class_number ??
                      period?.classNumber ??
                      '';

                    const currentSection =
                      period?.section ||
                      '';

                    const room =
                      period?.room_number ??
                      period?.room ??
                      'Room Not Assigned';

                    const startTime =
                      formatTime(
                        period?.start_time ??
                        period?.startTime
                      );

                    const endTime =
                      formatTime(
                        period?.end_time ??
                        period?.endTime
                      );

                    return (
                      <div
                        key={
                          period?.id ??
                          `${periodNumber}-${index}`
                        }
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                          {/* PERIOD */}

                          <div className="shrink-0 w-20">

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                              Period
                            </span>

                            <span className="text-lg font-black text-slate-900 font-serif">
                              {periodNumber}
                            </span>

                          </div>


                          {/* SUBJECT */}

                          <div className="min-w-0 flex-1">

                            <span className="text-sm font-black text-slate-900 block truncate">
                              {subject}
                            </span>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">

                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {startTime} - {endTime}
                              </span>

                              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                Class {currentClass}
                                {currentSection
                                  ? `-${currentSection}`
                                  : ''}
                              </span>

                            </div>

                          </div>


                          {/* ROOM */}

                          <div className="shrink-0 sm:text-right">

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                              Room
                            </span>

                            <span className="text-xs font-bold text-slate-800 flex items-center sm:justify-end gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-600" />
                              {room}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

        </div>


        {/* ===================================================
            RECENT SUBMISSIONS
        =================================================== */}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">

            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Recent Student Submissions
            </h3>

            <button
              type="button"
              onClick={onOpenHomework}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              View All →
            </button>

          </div>

          <div className="space-y-2 text-xs">

            {submissions.length === 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
                No student submissions available.
              </div>
            )}

            {submissions.map(
              (sub) => (

                <div
                  key={sub.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-3 sm:items-center"
                >

                  <div>

                    <span className="font-bold text-slate-900 block">
                      {sub.studentName}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      Submitted at {sub.submittedAt}
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    {sub.grade ? (

                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        Grade: {sub.grade}
                      </span>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          onReviewSubmission(
                            sub
                          )
                        }
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                      >
                        Grade Now
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
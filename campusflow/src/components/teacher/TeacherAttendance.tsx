import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { Student, Teacher } from '../../types/school';
import { AttendanceStatus } from './TeacherPortal';

interface Props {
  teacher: Teacher;

  students: Student[];

  attendanceDate: string;

  setAttendanceDate: React.Dispatch<
    React.SetStateAction<string>
  >;

  attendanceMap: Record<
    string,
    AttendanceStatus
  >;

  setAttendanceMap: React.Dispatch<
    React.SetStateAction<
      Record<string, AttendanceStatus>
    >
  >;

  attendanceSavedMsg: boolean;

  onMarkAll: (
    status: AttendanceStatus
  ) => void;

  onSave: () => void;

  presentCount: number;

  absentCount: number;
}


/*
|--------------------------------------------------------------------------
| BACKEND
|--------------------------------------------------------------------------
*/

const TEACHER_CLASS_API =
  'http://127.0.0.1:8000/api/teacher/my-class';

const TEACHER_CLASS_STUDENTS_API =
  'http://127.0.0.1:8000/api/teacher/my-class/students';


export const TeacherAttendance: React.FC<Props> = ({
  teacher,
  students,
  attendanceDate,
  setAttendanceDate,
  attendanceMap,
  setAttendanceMap,
  attendanceSavedMsg,
  onMarkAll,
  onSave,
  presentCount,
  absentCount,
}) => {

  const teacherData = teacher as any;


  /*
  |--------------------------------------------------------------------------
  | TEACHER ID
  |--------------------------------------------------------------------------
  |
  | Backend login gives:
  |
  | id: "EMP-T-103"
  |
  */

  const teacherId =
    teacherData?.id ||
    teacherData?.teacherId ||
    teacherData?.employeeCode ||
    '';


  const teacherName =
    teacherData?.fullName ||
    teacherData?.name ||
    'Teacher';


  /*
  |--------------------------------------------------------------------------
  | CLASS ASSIGNMENT
  |--------------------------------------------------------------------------
  */

  const [classTeacherOf, setClassTeacherOf] =
    useState<any>(
      teacherData?.classTeacherOf ||
      teacherData?.class_teacher_of ||
      null
    );


  const [classLoading, setClassLoading] =
    useState(false);


  const [classError, setClassError] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | STUDENTS
  |--------------------------------------------------------------------------
  */

  const [apiStudents, setApiStudents] =
    useState<any[]>([]);


  const [studentsLoading, setStudentsLoading] =
    useState(false);


  const [studentsError, setStudentsError] =
    useState('');


  /*
  |--------------------------------------------------------------------------
  | LOAD TEACHER CLASS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!teacherId) {
      setClassTeacherOf(null);
      return;
    }


    const loadTeacherClass =
      async () => {

        try {

          setClassLoading(true);

          setClassError('');


          const response =
            await fetch(
              `${TEACHER_CLASS_API}?teacher_id=${encodeURIComponent(
                teacherId
              )}`
            );


          if (!response.ok) {

            throw new Error(
              `Teacher class API failed: ${response.status}`
            );

          }


          const result =
            await response.json();


          if (
            result?.success &&
            result?.data
          ) {

            setClassTeacherOf(
              result.data
            );

          } else {

            setClassTeacherOf(null);

            setClassError(
              result?.message ||
              'No class teacher assignment found.'
            );

          }

        } catch (error) {

          console.error(
            'Teacher class loading error:',
            error
          );

          setClassTeacherOf(null);

          setClassError(
            'Unable to load teacher class assignment.'
          );

        } finally {

          setClassLoading(false);

        }

      };


    loadTeacherClass();

  }, [teacherId]);


  /*
  |--------------------------------------------------------------------------
  | CLASS DETAILS
  |--------------------------------------------------------------------------
  */

  const classNumber =
    classTeacherOf?.classNumber ||
    classTeacherOf?.class_number ||
    '';


  const section =
    classTeacherOf?.section ||
    '';


  const roomNumber =
    classTeacherOf?.roomNumber ||
    classTeacherOf?.room_number ||
    '';


  /*
  |--------------------------------------------------------------------------
  | LOAD ONLY ASSIGNED CLASS STUDENTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!teacherId) {

      setApiStudents([]);

      return;

    }


    const loadStudents =
      async () => {

        try {

          setStudentsLoading(true);

          setStudentsError('');


          const response =
            await fetch(
              `${TEACHER_CLASS_STUDENTS_API}?teacher_id=${encodeURIComponent(
                teacherId
              )}`
            );


          if (!response.ok) {

            throw new Error(
              `Teacher students API failed: ${response.status}`
            );

          }


          const result =
            await response.json();


          const data =
            Array.isArray(result?.data)
              ? result.data
              : [];


          setApiStudents(data);


        } catch (error) {

          console.error(
            'Teacher students loading error:',
            error
          );


          setApiStudents([]);


          setStudentsError(
            'Unable to load students from server.'
          );


        } finally {

          setStudentsLoading(false);

        }

      };


    loadStudents();

  }, [teacherId]);


  /*
  |--------------------------------------------------------------------------
  | FINAL STUDENT LIST
  |--------------------------------------------------------------------------
  |
  | Backend already returns only students
  | belonging to logged-in teacher's class.
  |
  */

  const assignedClassStudents =
    useMemo(() => {

      /*
       * Primary source:
       * backend teacher-specific students
       */

      if (apiStudents.length > 0) {

        return [...apiStudents].sort(
          (a: any, b: any) => {

            const rollA =
              Number(
                a?.rollNumber ??
                a?.roll_number ??
                0
              );


            const rollB =
              Number(
                b?.rollNumber ??
                b?.roll_number ??
                0
              );


            return rollA - rollB;

          }
        );

      }


      /*
       * Do NOT use random/all students.
       *
       * Only use parent students if class
       * assignment is available.
       */

      if (!classNumber) {
        return [];
      }


      const targetClass =
        String(classNumber)
          .trim()
          .toLowerCase();


      const targetSection =
        String(section)
          .trim()
          .toLowerCase();


      return (students || [])
        .filter((student: any) => {

          const studentClass =
            String(
              student?.classId ??
              student?.class_id ??
              ''
            )
              .trim()
              .toLowerCase();


          const studentSection =
            String(
              student?.section ??
              ''
            )
              .trim()
              .toLowerCase();


          if (
            studentClass !==
            targetClass
          ) {
            return false;
          }


          if (
            targetSection &&
            studentSection !==
            targetSection
          ) {
            return false;
          }


          const status =
            String(
              student?.status ??
              'Active'
            )
              .trim()
              .toLowerCase();


          if (
            status &&
            status !== 'active'
          ) {
            return false;
          }


          return true;

        })
        .sort(
          (
            a: any,
            b: any
          ) => {

            const rollA =
              Number(
                a?.rollNumber ??
                a?.roll_number ??
                0
              );


            const rollB =
              Number(
                b?.rollNumber ??
                b?.roll_number ??
                0
              );


            return rollA - rollB;

          }
        );

    }, [
      apiStudents,
      students,
      classNumber,
      section,
    ]);


  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  */

  const totalStudents =
    assignedClassStudents.length;


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const isLoading =
    classLoading ||
    studentsLoading;


  /*
  |--------------------------------------------------------------------------
  | NO CLASS
  |--------------------------------------------------------------------------
  */

  const noClass =
    !classLoading &&
    !classNumber;


  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">

        <div>

          <h2 className="text-xl font-bold font-serif text-slate-900">

            {classNumber
              ? `Class ${classNumber}${
                  section
                    ? `-${section}`
                    : ''
                }`
              : 'Class Attendance'}{' '}

            Daily Attendance Register

          </h2>


          <p className="text-xs text-slate-500 mt-1">

            Class Teacher: {teacherName}

            {roomNumber
              ? ` • ${roomNumber}`
              : ''}

          </p>


          <p className="text-[11px] text-slate-400 mt-1">

            {totalStudents} students
            in assigned class

          </p>

        </div>


        <div className="flex items-center gap-3">

          <input
            type="date"
            value={attendanceDate}
            onChange={(e) =>
              setAttendanceDate(
                e.target.value
              )
            }
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
          />


          <button
            type="button"
            onClick={onSave}
            disabled={
              totalStudents === 0 ||
              isLoading
            }
            className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >

            <Check className="w-3.5 h-3.5" />

            Save Register

          </button>

        </div>

      </div>


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {attendanceSavedMsg && (

        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">

          <CheckCircle2 className="w-4 h-4" />

          Attendance saved successfully and
          synchronized with school administrative
          records.

        </div>

      )}


      {/* =====================================================
          CLASS ERROR
      ===================================================== */}

      {classError && (

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">

          <p className="text-xs font-bold text-red-700">

            {classError}

          </p>

        </div>

      )}


      {/* =====================================================
          STUDENT ERROR
      ===================================================== */}

      {studentsError && (

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">

          <p className="text-xs font-bold text-red-700">

            {studentsError}

          </p>

        </div>

      )}


      {/* =====================================================
          NO ASSIGNMENT
      ===================================================== */}

      {noClass && !classError && (

        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">

          <p className="text-sm font-bold text-amber-800">

            No Class Teacher Assignment Found

          </p>


          <p className="text-xs text-amber-700 mt-1">

            This teacher is not currently assigned
            as a class teacher.

          </p>

        </div>

      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {isLoading && (

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2">

          <Loader2 className="w-4 h-4 animate-spin text-slate-700" />

          <span className="text-xs font-semibold text-slate-600">

            Loading teacher class and students...

          </span>

        </div>

      )}


      {/* =====================================================
          QUICK FILL
      ===================================================== */}

      {!isLoading &&
        classNumber &&
        totalStudents > 0 && (

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="font-semibold text-slate-700">

                Quick Fill:

              </span>


              <button
                type="button"
                onClick={() =>
                  onMarkAll('Present')
                }
                className="px-3 py-1 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700"
              >

                Mark All Present

              </button>


              <button
                type="button"
                onClick={() =>
                  onMarkAll('Absent')
                }
                className="px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
              >

                Mark All Absent

              </button>

            </div>


            <div className="flex items-center gap-4 text-xs font-bold">

              <span className="text-emerald-700">

                Present: {presentCount}

              </span>


              <span className="text-red-700">

                Absent: {absentCount}

              </span>


              <span className="text-slate-600">

                Total: {totalStudents}

              </span>

            </div>

          </div>

        )}


      {/* =====================================================
          STUDENT TABLE
      ===================================================== */}

      {!isLoading &&
        classNumber &&
        totalStudents > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full text-xs text-left border-collapse border border-slate-200">

              <thead>

                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">

                  <th className="p-2.5">
                    Roll No
                  </th>

                  <th className="p-2.5">
                    Student Name
                  </th>

                  <th className="p-2.5">
                    Admission No
                  </th>

                  <th className="p-2.5 text-center">
                    Status
                  </th>

                  <th className="p-2.5">
                    Quick Toggle
                  </th>

                </tr>

              </thead>


              <tbody>

                {assignedClassStudents.map(
                  (s: any) => {

                    const status =
                      attendanceMap[s.id] ||
                      'Present';


                    const studentName =
                      s.fullName ||
                      `${s.firstName || ''} ${
                        s.lastName || ''
                      }`.trim() ||
                      'Student';


                    const photo =
                      s.photoUrl ||
                      s.photo_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        studentName
                      )}`;


                    return (

                      <tr
                        key={s.id}
                        className="border-b border-slate-200 hover:bg-slate-50/50"
                      >

                        <td className="p-2.5 font-bold font-mono text-slate-800">

                          #
                          {s.rollNumber ??
                            s.roll_number ??
                            '-'}

                        </td>


                        <td className="p-2.5 font-semibold text-slate-900">

                          <div className="flex items-center gap-2">

                            <img
                              src={photo}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />

                            <div>

                              <span className="block">

                                {studentName}

                              </span>


                              <span className="text-[10px] text-slate-400">

                                Class {classNumber}

                                {section
                                  ? `-${section}`
                                  : ''}

                              </span>

                            </div>

                          </div>

                        </td>


                        <td className="p-2.5 font-mono text-slate-500">

                          {s.admissionNumber ??
                            s.admission_number ??
                            '-'}

                        </td>


                        <td className="p-2.5 text-center">

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'Absent'
                                  ? 'bg-red-100 text-red-800'
                                  : status === 'Late'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                            }`}
                          >

                            {status}

                          </span>

                        </td>


                        <td className="p-2.5">

                          <div className="flex gap-1.5 flex-wrap">

                            {(
                              [
                                'Present',
                                'Absent',
                                'Late',
                                'Half Day',
                              ] as const
                            ).map(
                              (st) => (

                                <button
                                  key={st}
                                  type="button"
                                  onClick={() =>
                                    setAttendanceMap(
                                      (prev) => ({
                                        ...prev,
                                        [s.id]:
                                          st,
                                      })
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                                    status === st
                                      ? 'bg-slate-900 text-white font-bold'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >

                                  {st}

                                </button>

                              )
                            )}

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}


      {/* =====================================================
          NO STUDENTS
      ===================================================== */}

      {!isLoading &&
        classNumber &&
        totalStudents === 0 && (

          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">

            <p className="text-sm font-semibold text-slate-700">

              No Students Found

            </p>


            <p className="text-xs text-slate-500 mt-1">

              No active students found for
              Class {classNumber}

              {section
                ? `-${section}`
                : ''}.

            </p>

          </div>

        )}

    </div>
  );
};
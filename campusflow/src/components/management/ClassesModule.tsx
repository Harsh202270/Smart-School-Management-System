import React from 'react';
import {
  Plus,
  Users,
  Edit,
  Trash2
} from 'lucide-react';

import {
  Student,
  ClassSection
} from '../../types/school';

interface ClassesModuleProps {
  classes: ClassSection[];
  students: Student[];

  classWingFilter: string;
  setClassWingFilter: React.Dispatch<React.SetStateAction<string>>;

  setEditingClass: React.Dispatch<React.SetStateAction<ClassSection | null>>;
  setClassForm: React.Dispatch<
    React.SetStateAction<{
      classNumber: string;
      section: string;
      roomNumber: string;
      classTeacherName: string;
      capacity: number;
      subjects: string;
    }>
  >;
  setShowClassModal: React.Dispatch<React.SetStateAction<boolean>>;

  setStudentClassFilter: React.Dispatch<React.SetStateAction<string>>;
  setActiveModule: React.Dispatch<
    React.SetStateAction<
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
    >
  >;

  getWingForClass: (classNumber: string) => string;

  handleDeleteClass: (id: string, label: string) => void;
}

export const ClassesModule: React.FC<ClassesModuleProps> = ({
  classes,
  students,

  classWingFilter,
  setClassWingFilter,

  setEditingClass,
  setClassForm,
  setShowClassModal,

  setStudentClassFilter,
  setActiveModule,

  getWingForClass,

  handleDeleteClass
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

      {/* HEADER */}
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
          <Plus className="w-3.5 h-3.5" />

          Add New Grade / Division
        </button>

      </div>


      {/* WING FILTER */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto py-1">

        <span className="text-slate-500 font-semibold shrink-0">
          Filter Wing:
        </span>

        {[
          {
            id: 'All',
            label: 'All Wings'
          },
          {
            id: 'Pre-Primary',
            label: 'Pre-Primary (Nursery, LKG, UKG)'
          },
          {
            id: 'Primary',
            label: 'Primary (Grades 1-5)'
          },
          {
            id: 'Middle',
            label: 'Middle (Grades 6-8)'
          },
          {
            id: 'Secondary',
            label: 'Secondary (Grades 9-10)'
          },
          {
            id: 'Senior Secondary',
            label: 'Senior Secondary (Grades 11-12)'
          }
        ].map((wing) => (

          <button
            key={wing.id}
            onClick={() => setClassWingFilter(wing.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              classWingFilter === wing.id
                ? 'bg-slate-900 text-amber-400 font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {wing.label}
          </button>

        ))}

      </div>


      {/* CLASS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {classes
          .filter(
            (c) =>
              classWingFilter === 'All' ||
              getWingForClass(c.classNumber) === classWingFilter
          )
          .map((c) => {

            const enrolledCount = students.filter(
              (s) =>
                s.classId.toLowerCase() ===
                  c.classNumber.toLowerCase() &&
                s.section.toLowerCase() ===
                  c.section.toLowerCase()
            ).length;

            const wingLabel = getWingForClass(c.classNumber);

            return (

              <div
                key={c.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-xs transition"
              >

                <div>

                  {/* CLASS TITLE */}
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


                  {/* TEACHER + ROOM */}
                  <div className="text-xs text-slate-600 space-y-1 mt-2.5">

                    <p>
                      <span className="text-slate-400">
                        Class Teacher:
                      </span>{' '}

                      <strong className="text-slate-800">
                        {c.classTeacherName}
                      </strong>
                    </p>

                    <p>
                      <span className="text-slate-400">
                        Allocated Room:
                      </span>{' '}

                      {c.roomNumber}
                    </p>

                  </div>


                  {/* SUBJECTS */}
                  <div className="pt-2 border-t border-slate-200 mt-2">

                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Enrolled Subjects
                    </span>

                    <div className="flex flex-wrap gap-1">

                      {c.subjects.map((sub, sIdx) => (

                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] rounded text-slate-700"
                        >
                          {sub}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>


                {/* ACTIONS */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">

                  {/* STUDENTS */}
                  <button
                    onClick={() => {
                      setStudentClassFilter(c.classNumber);
                      setActiveModule('students');
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    title="View student list for this class"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-600" />

                    Students ({enrolledCount})
                  </button>


                  <div className="flex items-center gap-1.5">

                    {/* EDIT */}
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
                      <Edit className="w-3 h-3" />

                      Edit
                    </button>


                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDeleteClass(
                          c.id,
                          `Class ${c.classNumber}-${c.section}`
                        )
                      }
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
  );
};
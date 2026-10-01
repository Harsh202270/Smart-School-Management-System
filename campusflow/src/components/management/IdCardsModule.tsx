import React from 'react';
import {
  Student,
  Teacher
} from '../../types/school';
import {
  Edit,
  Printer,
  QrCode,
  Trash2
} from 'lucide-react';

interface IdCardsModuleProps {
  students: Student[];
  teachers: Teacher[];

  idCardTypeTab: 'students' | 'teachers';
  setIdCardTypeTab: React.Dispatch<
    React.SetStateAction<'students' | 'teachers'>
  >;

  idCardClassFilter: string;
  setIdCardClassFilter: React.Dispatch<React.SetStateAction<string>>;

  distinctClasses: string[];

  setEditingStudent: React.Dispatch<
    React.SetStateAction<Student | null>
  >;

  setEditingTeacher: React.Dispatch<
    React.SetStateAction<Teacher | null>
  >;

  setPrintDoc: React.Dispatch<
    React.SetStateAction<{
      type: string;
      data: any;
    } | null>
  >;

  handleDeleteTeacher: (id: string, name: string) => void;
}

export const IdCardsModule: React.FC<IdCardsModuleProps> = ({
  students,
  teachers,

  idCardTypeTab,
  setIdCardTypeTab,

  idCardClassFilter,
  setIdCardClassFilter,

  distinctClasses,

  setEditingStudent,
  setEditingTeacher,

  setPrintDoc,

  handleDeleteTeacher
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">

        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Student & Faculty Identity Pass Studio
          </h2>

          <p className="text-xs text-slate-500">
            Official CR-80 identity passes with school crest, photo,
            emergency contacts & barcode
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">

          <button
            onClick={() => setIdCardTypeTab('students')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              idCardTypeTab === 'students'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Passes ({students.length})
          </button>

          <button
            onClick={() => setIdCardTypeTab('teachers')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              idCardTypeTab === 'teachers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Passes ({teachers.length})
          </button>

        </div>
      </div>

      {/* ========================================================= */}
      {/* STUDENT PASSES */}
      {/* ========================================================= */}

      {idCardTypeTab === 'students' && (
        <div className="space-y-4">

          {/* Grade Filter */}
          <div className="flex items-center gap-2 text-xs overflow-x-auto py-1">

            <span className="text-slate-500 font-semibold shrink-0">
              Filter Grade:
            </span>

            <button
              onClick={() => setIdCardClassFilter('All')}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${
                idCardClassFilter === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Grades
            </button>

            {distinctClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setIdCardClassFilter(cls)}
                className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${
                  idCardClassFilter === cls
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}

          </div>

          {/* Student Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {students
              .filter(
                (s) =>
                  idCardClassFilter === 'All' ||
                  s.classId.toLowerCase() ===
                    idCardClassFilter.toLowerCase()
              )
              .map((s) => (

                <div
                  key={s.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-3"
                >

                  {/* Student Info */}
                  <div className="flex items-center gap-3">

                    <img
                      src={s.photoUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                    />

                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {s.fullName}
                      </p>

                      <p className="text-slate-600 font-medium">
                        Class {s.classId}-{s.section} • Roll #{s.rollNumber}
                      </p>

                      <p className="text-[10px] text-slate-400 font-mono">
                        Adm: {s.admissionNumber}
                      </p>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">

                    <button
                      onClick={() => setEditingStudent(s)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      title="Edit Student Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details
                    </button>

                    <button
                      onClick={() =>
                        setPrintDoc({
                          type: 'idcard',
                          data: s
                        })
                      }
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      title="Preview & Print ID Pass"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      Print Pass
                    </button>

                  </div>

                </div>

              ))}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* FACULTY PASSES */}
      {/* ========================================================= */}

      {idCardTypeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {teachers.map((t) => (

            <div
              key={t.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-3"
            >

              {/* Teacher Info */}
              <div className="flex items-center gap-3">

                <img
                  src={t.photoUrl}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                />

                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {t.fullName}
                  </p>

                  <p className="text-amber-700 font-medium">
                    {t.designation}
                  </p>

                  <p className="text-[10px] text-slate-400 font-mono">
                    Code: {t.employeeCode}
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">

                <button
                  onClick={() => setEditingTeacher(t)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  title="Edit Faculty Details"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Details
                </button>

                <button
                  onClick={() =>
                    setPrintDoc({
                      type: 'teacher-id',
                      data: t
                    })
                  }
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  title="Preview & Print ID Pass"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  Print Pass
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};
import React from 'react';
import { Teacher } from '../../types/school';
import {
  Plus,
  Edit,
  QrCode,
  Trash2
} from 'lucide-react';

interface TeachersModuleProps {
  teachers: Teacher[];

  onAddTeacher: () => void;

  onEditTeacher: (teacher: Teacher) => void;

  onPrintTeacherId: (teacher: Teacher) => void;

  onDeleteTeacher: (id: string, fullName: string) => void;
}

export const TeachersModule: React.FC<TeachersModuleProps> = ({
  teachers,
  onAddTeacher,
  onEditTeacher,
  onPrintTeacherId,
  onDeleteTeacher
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">

        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Faculty & Pedagogical Staff Directory
          </h2>

          <p className="text-xs text-slate-500">
            Manage faculty profiles, qualifications, department appointments,
            and basic salaries
          </p>
        </div>

        <button
          onClick={onAddTeacher}
          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Appoint Faculty Member
        </button>

      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {teachers.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-xs transition"
          >

            {/* Teacher Information */}
            <div>

              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-3">

                <img
                  src={t.photoUrl}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                />

                <div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {t.fullName}
                  </h4>

                  <p className="text-xs text-amber-700 font-medium">
                    {t.designation}
                  </p>

                  <span className="text-[10px] font-mono text-slate-500">
                    {t.employeeCode}
                  </span>

                </div>

              </div>

              {/* Details */}
              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">

                <p>
                  <span className="text-slate-400">
                    Dept:
                  </span>{' '}
                  <strong className="text-slate-700">
                    {t.department}
                  </strong>
                </p>

                <p>
                  <span className="text-slate-400">
                    Experience:
                  </span>{' '}
                  {t.experienceYears} Years
                </p>

                <p>
                  <span className="text-slate-400">
                    Qualification:
                  </span>{' '}
                  {t.qualification}
                </p>

                <p>
                  <span className="text-slate-400">
                    Contact:
                  </span>{' '}
                  {t.phone}
                </p>

                <p>
                  <span className="text-slate-400">
                    Email:
                  </span>{' '}
                  {t.email}
                </p>

              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">

              {/* Salary */}
              <span className="font-mono font-bold text-emerald-800">
                Basic: ₹
                {t.salary.basic.toLocaleString('en-IN')}
              </span>

              {/* Buttons */}
              <div className="flex items-center gap-1.5">

                {/* Edit */}
                <button
                  onClick={() => onEditTeacher(t)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  title="Edit Faculty Details"
                >
                  <Edit className="w-3 h-3" />
                  Edit Profile
                </button>

                {/* Print ID / Pass */}
                <button
                  onClick={() => onPrintTeacherId(t)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  title="Print Faculty Pass"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Pass
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteTeacher(t.id, t.fullName)}
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

      {/* Empty State */}
      {teachers.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-500">
          No faculty members found.
        </div>
      )}

    </div>
  );
};
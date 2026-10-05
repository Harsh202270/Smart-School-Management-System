import React from 'react';
import { LogOut, UserRound } from 'lucide-react';
import { Teacher, SchoolSettings } from '../../types/school';

interface Props {
  teacher: Teacher;
  settings: SchoolSettings;
  quickSwitch?: (
    role: 'student' | 'management' | 'teacher'
  ) => void;
  onLogout: () => void;
}

export const TeacherHeader: React.FC<Props> = ({
  teacher,
  settings,
  quickSwitch,
  onLogout,
}) => {
  /*
   * Backend teacher data ko safely read karna.
   *
   * Backend:
   * name
   * designation
   * department
   * employeeCode
   *
   * Frontend Teacher:
   * fullName
   * designation
   */
  const teacherName =
    (teacher as any).fullName ||
    (teacher as any).name ||
    'Teacher';

  const designation =
    (teacher as any).designation ||
    'Faculty Member';

  const employeeCode =
    (teacher as any).employeeCode ||
    (teacher as any).id ||
    '';

  const department =
    (teacher as any).department ||
    '';

  const photoUrl =
    (teacher as any).photoUrl ||
    '';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LEFT - SCHOOL */}
        <div className="flex items-center gap-3 min-w-0">

          <div className="w-9 h-9 shrink-0 rounded-lg bg-amber-500 text-slate-950 font-serif font-black text-lg flex items-center justify-center border border-white">
            R
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold font-serif text-white tracking-tight leading-tight truncate">
              {settings.schoolName}
            </h1>

            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block truncate">
              Faculty Workspace & Academic Control
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-4 ml-3">

          {/* QUICK SWITCH */}
          {quickSwitch && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">

              <span className="text-[11px] text-slate-400 font-medium">
                Switch:
              </span>

              <button
                type="button"
                onClick={() => quickSwitch('student')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Student
              </button>

              <span className="text-slate-600">
                |
              </span>

              <button
                type="button"
                onClick={() => quickSwitch('management')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-700"
              >
                Management
              </button>
            </div>
          )}

          {/* TEACHER INFORMATION */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700">

            {/* PHOTO / FALLBACK */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-slate-800 flex items-center justify-center shrink-0">

              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={teacherName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="w-4 h-4 text-amber-400" />
              )}

            </div>

            {/* NAME */}
            <div className="hidden sm:block text-left text-xs max-w-[220px]">

              <p className="font-bold text-white leading-tight truncate">
                {teacherName}
              </p>

              <p className="text-[10px] text-amber-400 truncate">
                {designation}
              </p>

              <p className="text-[9px] text-slate-400 truncate">
                {employeeCode}
                {department
                  ? ` • ${department}`
                  : ''}
              </p>

            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
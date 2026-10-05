import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types/school';
import { MarksData } from './TeacherPortal';

interface Props {
  students: Student[];
  marksData: Record<string, MarksData>;
  setMarksData: React.Dispatch<
    React.SetStateAction<Record<string, MarksData>>
  >;
  marksSavedNotice: boolean;
  onSave: () => void;
}

export const TeacherMarks: React.FC<Props> = ({
  students,
  marksData,
  setMarksData,
  marksSavedNotice,
  onSave,
}) => {
  return (
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
          onClick={onSave}
          className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
        >
          <Check className="w-3.5 h-3.5" />
          Save All Marks
        </button>
      </div>

      {marksSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Marks entries recorded and report cards updated automatically.
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
            {students.map((s) => {
              const row = marksData[s.id] || {
                theory: 35,
                practical: 10,
                remarks: 'Good',
              };

              const total = row.theory + row.practical;
              const pct = (total / 50) * 100;

              const grade =
                pct >= 91
                  ? 'A1'
                  : pct >= 81
                    ? 'A2'
                    : pct >= 71
                      ? 'B1'
                      : pct >= 61
                        ? 'B2'
                        : 'C1';

              return (
                <tr
                  key={s.id}
                  className="border-b border-slate-200 hover:bg-slate-50/50"
                >
                  <td className="p-2.5 font-bold font-mono text-slate-800">
                    #{s.rollNumber}
                  </td>

                  <td className="p-2.5 font-semibold text-slate-900">
                    {s.fullName}
                  </td>

                  <td className="p-2.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={row.theory}
                      onChange={(e) =>
                        setMarksData((prev) => ({
                          ...prev,
                          [s.id]: {
                            ...row,
                            theory: Number(e.target.value),
                          },
                        }))
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
                        setMarksData((prev) => ({
                          ...prev,
                          [s.id]: {
                            ...row,
                            practical: Number(e.target.value),
                          },
                        }))
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
                        setMarksData((prev) => ({
                          ...prev,
                          [s.id]: {
                            ...row,
                            remarks: e.target.value,
                          },
                        }))
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
  );
};

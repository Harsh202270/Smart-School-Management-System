import React from 'react';
import { DayTimetable, Teacher } from '../../types/school';

interface Props {
  teacher: Teacher;
  timetable: DayTimetable[];
}

export const TeacherTimetable: React.FC<Props> = ({
  teacher,
  timetable,
}) => {
  return (
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
        {timetable.length === 0 && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            No timetable data available for Class 10-A.
          </div>
        )}

        {timetable.map((dayObj) => (
          <div
            key={dayObj.day}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between">
              <span>{dayObj.day}</span>
              <span className="text-amber-400 font-mono">
                Academic Duty
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
              {dayObj.periods.map((p) => {
                const isMyClass = p.teacherId === teacher.id;

                return (
                  <div
                    key={p.id}
                    className={`p-3 space-y-1 ${
                      isMyClass
                        ? 'bg-amber-50/70 border-l-2 border-l-amber-500'
                        : 'bg-white'
                    }`}
                  >
                    <span className="font-bold text-[10px] uppercase text-slate-600 block">
                      Period {p.periodNumber}
                    </span>

                    <h4 className="font-bold text-slate-900 text-xs">
                      {p.subject}
                    </h4>

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
  );
};

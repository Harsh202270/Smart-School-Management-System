import React from 'react';
import { LeaveRequest, Teacher } from '../../types/school';

interface Props {
  teacher: Teacher;
  leaveDays: number;
  setLeaveDays: React.Dispatch<React.SetStateAction<number>>;
  leaveReason: string;
  setLeaveReason: React.Dispatch<React.SetStateAction<string>>;
  leaveSuccess: boolean;
  leaveRequests: LeaveRequest[];
  onApply: (e: React.FormEvent) => void;
}

export const TeacherLeave: React.FC<Props> = ({
  teacher,
  leaveDays,
  setLeaveDays,
  leaveReason,
  setLeaveReason,
  leaveSuccess,
  leaveRequests,
  onApply,
}) => {
  return (
    <div className="space-y-6">
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
            <strong className="block font-bold">
              Leave Form Submitted
            </strong>
            <p>
              Your casual/academic leave application has been forwarded to the
              Principal's secretariat.
            </p>
          </div>
        ) : (
          <form onSubmit={onApply} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Number of Working Days
              </label>

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
              <label className="block font-semibold text-slate-700 mb-1">
                Reason / Official Purpose
              </label>

              <textarea
                rows={4}
                required
                placeholder="e.g. Attending National Physics Teachers Conclave at IIT Delhi..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
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

      {leaveRequests.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Recent Leave Requests
          </h3>

          <div className="space-y-2">
            {leaveRequests
              .filter(
                (item: any) =>
                  String(item.applicantId ?? item.teacherId) ===
                  String(teacher.id)
              )
              .slice(-5)
              .reverse()
              .map((item: any) => (
                <div
                  key={item.id || `${item.startDate}-${item.reason}`}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.reason}
                    </p>
                    <p className="text-slate-500 mt-0.5">
                      {item.startDate} → {item.endDate}
                    </p>
                  </div>

                  <span className="h-fit px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {item.status || 'Pending'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

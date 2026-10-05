import React from 'react';
import {
  Plus,
  Bell,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import {
  Student,
  Teacher,
  ClassSection,
  LeaveRequest,
  AuditLog,
} from '../../types/school';

interface DashboardModuleProps {
  settings: {
    academicYear: string;
  };

  students: Student[];
  teachers: Teacher[];
  classes: ClassSection[];
  leaves: LeaveRequest[];
  auditLogs: AuditLog[];

  onOpenStudents: () => void;
  onOpenAdmission: () => void;
  onOpenNotice: () => void;
  onOpenAuditLogs: () => void;

  onReviewLeave: (
    id: string,
    status: 'Approved' | 'Rejected'
  ) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  settings,
  students,
  teachers,
  classes,
  leaves,
  auditLogs,
  onOpenStudents,
  onOpenAdmission,
  onOpenNotice,
  onOpenAuditLogs,
  onReviewLeave,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Dashboard Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Academic Year {settings.academicYear} • Term 1
          </span>

          <h2 className="text-2xl font-bold font-serif text-slate-950 mt-1">
            Good Morning, Dr. Sharma
          </h2>

          <p className="text-xs text-slate-600 mt-0.5">
            Here's what's happening around today.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              onOpenStudents();
              onOpenAdmission();
            }}
            className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Admit New Student
          </button>

          <button
            onClick={onOpenNotice}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-600 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            Broadcast Notice
          </button>

        </div>
      </div>

      {/* Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {/* Students */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Enrolled Students
          </span>

          <span className="text-2xl font-black text-slate-900 font-serif">
            {students.length * 35 + 24}
          </span>

          <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
            Across All Grades
          </span>
        </div>

        {/* Teachers */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Teaching Faculty
          </span>

          <span className="text-2xl font-black text-slate-900 font-serif">
            {teachers.length}
          </span>

          <span className="text-[11px] text-slate-500 block mt-0.5">
            100% Present Today
          </span>
        </div>

        {/* Classes */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Active Classes
          </span>

          <span className="text-2xl font-black text-amber-700 font-serif">
            {classes.length}
          </span>

          <span className="text-[11px] text-slate-500 block mt-0.5">
            Nursery to XII
          </span>
        </div>

        {/* Attendance */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Today's Attendance
          </span>

          <span className="text-2xl font-black text-emerald-700 font-serif">
            94.8%
          </span>

          <span className="text-[11px] text-emerald-600 block mt-0.5">
            High consistency
          </span>
        </div>

        {/* Fees */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Pending Fees
          </span>

          <span className="text-2xl font-black text-red-700 font-serif font-mono">
            ₹12.4L
          </span>

          <span className="text-[11px] text-slate-500 block mt-0.5">
            Active collection
          </span>
        </div>

        {/* Transport */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">
            Transport Fleet
          </span>

          <span className="text-2xl font-black text-slate-900 font-serif">
            24 Buses
          </span>

          <span className="text-[11px] text-emerald-600 block mt-0.5">
            All routes normal
          </span>
        </div>

      </div>

      {/* Operations Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Leave Requests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">

            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">

              <Clock className="w-4 h-4 text-amber-600" />

              Pending Leave Applications (
              {leaves.filter(
                (leave) => leave.status === 'Pending'
              ).length}
              )

            </h3>

          </div>

          <div className="space-y-3 text-xs">

            {leaves.map((leave) => (

              <div
                key={leave.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center"
              >

                <div>

                  <div className="flex items-center gap-2">

                    <span className="font-bold text-slate-900">
                      {leave.applicantName}
                    </span>

                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-semibold">
                      {leave.applicantType}
                    </span>

                  </div>

                  <p className="text-slate-600 mt-0.5 line-clamp-1">
                    "{leave.reason}"
                  </p>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {leave.startDate} to {leave.endDate} (
                    {leave.days} Day
                    {leave.days > 1 ? 's' : ''}
                    )
                  </span>

                </div>

                <div>

                  {leave.status === 'Pending' ? (

                    <div className="flex gap-1.5">

                      <button
                        onClick={() =>
                          onReviewLeave(
                            leave.id,
                            'Approved'
                          )
                        }
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800 cursor-pointer"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          onReviewLeave(
                            leave.id,
                            'Rejected'
                          )
                        }
                        className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Reject
                      </button>

                    </div>

                  ) : (

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        leave.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {leave.status}
                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Recent Security Audit Logs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">

            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">

              <ShieldCheck className="w-4 h-4 text-emerald-600" />

              Recent Operations Audit Log

            </h3>

            <button
              onClick={onOpenAuditLogs}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              View All →
            </button>

          </div>

          <div className="space-y-2.5 text-xs">

            {auditLogs
              .slice(0, 5)
              .map((log) => (

                <div
                  key={log.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between"
                >

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="font-bold text-slate-900">
                        {log.userName}
                      </span>

                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">
                        {log.role}
                      </span>

                    </div>

                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {log.details}
                    </p>

                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                    {log.timestamp.slice(11, 16)}
                  </span>

                </div>

              ))}

          </div>

        </div>

      </div>

    </div>
  );
};
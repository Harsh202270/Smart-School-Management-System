import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AuditLog } from '../../types/school';

interface AuditLogsModuleProps {
  auditLogs: AuditLog[];
}

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = ({
  auditLogs
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Institutional Security & Operation Audit Trail
        </h2>

        <p className="text-xs text-slate-500">
          Tamper-evident record of all operational events across students,
          teachers, marks, and finances
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse border border-slate-200">
          
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
              <th className="p-2.5">Timestamp</th>
              <th className="p-2.5">User</th>
              <th className="p-2.5">Role</th>
              <th className="p-2.5">Module</th>
              <th className="p-2.5">Action</th>
              <th className="p-2.5">Description</th>
            </tr>
          </thead>

          <tbody>
            {auditLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-200 hover:bg-slate-50/50"
              >
                <td className="p-2.5 font-mono text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>

                <td className="p-2.5 font-semibold text-slate-900">
                  {log.userName}
                </td>

                <td className="p-2.5 font-mono">
                  {log.role}
                </td>

                <td className="p-2.5 font-semibold text-slate-700">
                  {log.module}
                </td>

                <td className="p-2.5 font-mono text-[11px] text-amber-800 font-bold">
                  {log.action}
                </td>

                <td className="p-2.5 text-slate-600">
                  {log.details}
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {auditLogs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-slate-400"
                >
                  No audit logs available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};
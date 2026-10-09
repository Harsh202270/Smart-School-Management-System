import React from 'react';
import { PayrollRecord } from '../../types/school';

interface PayrollModuleProps {
  payrolls: PayrollRecord[];
}

export const PayrollModule: React.FC<PayrollModuleProps> = ({
  payrolls
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Faculty & Staff Salary Disbursement Ledger
          </h2>

          <p className="text-xs text-slate-500">
            Disbursement Slips, Basic Pay, Allowances & Deductions
          </p>
        </div>
      </div>

      {/* Payroll Records */}
      <div className="space-y-4">
        {payrolls.map((pr) => (
          <div
            key={pr.id}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs"
          >

            {/* Employee Details */}
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {pr.employeeName}
              </h4>

              <p className="text-slate-500">
                {pr.designation} • {pr.month}
              </p>

              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Slip: {pr.slipNumber}
              </p>
            </div>

            {/* Salary Details */}
            <div className="text-right">
              <span className="font-mono font-bold text-emerald-800 text-sm block">
                Net: ₹{pr.netSalary.toLocaleString('en-IN')}
              </span>

              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Disbursed ({pr.paymentDate})
              </span>
            </div>

          </div>
        ))}

        {/* Empty State */}
        {payrolls.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
            No payroll records available.
          </div>
        )}
      </div>

    </div>
  );
};

export default PayrollModule;
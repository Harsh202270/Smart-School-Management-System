/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { FeePayment, FeeInvoice, SchoolSettings } from '../../types/school';
import { Receipt, Printer, X } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface Props {
  payment: FeePayment;
  invoice?: FeeInvoice;
  settings: SchoolSettings;
  onClose?: () => void;
}

export const PrintableFeeReceipt: React.FC<Props> = ({ payment, invoice, settings, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    triggerPrint('fee-receipt-print-target');
  };

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-sans max-w-2xl mx-auto my-2">
      {/* ALWAYS-VISIBLE STICKY ACTION HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">Official Fee Receipt</h3>
            <p className="text-[11px] text-slate-400">Receipt #{payment.receiptNumber} • {payment.studentName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer ml-1"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" /> Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Receipt Box */}
      <div id="fee-receipt-print-target" className="p-8 print:p-2 printable-document">
        <div className="border border-slate-400 p-6 rounded relative bg-slate-50/20">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-300">
            <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-slate-900">
              {settings.schoolName}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {settings.affiliation} • {settings.address}, {settings.city}
            </p>
            <p className="text-[11px] text-slate-500">
              Phone: {settings.phone} • Email: accounts@riversidepublic.edu.in
            </p>
            <div className="mt-2 inline-block bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
              Fee Deposit Receipt
            </div>
          </div>

          {/* Receipt Number & Date */}
          <div className="flex justify-between items-center text-xs py-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500">Receipt No:</span> <strong className="font-mono text-slate-900">{payment.receiptNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500">Date:</span> <strong>{payment.paymentDate}</strong>
            </div>
          </div>

          {/* Student Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-200">
            <div>
              <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-900">{payment.studentName}</strong></p>
              <p><span className="text-slate-500">Student ID:</span> {payment.studentId}</p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">Class & Section:</span> Class {payment.classNumber}-{payment.section}</p>
              <p><span className="text-slate-500">Payment Mode:</span> <span className="font-semibold text-blue-700">{payment.paymentMode}</span></p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="my-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 bg-slate-100/60">
                  <th className="py-2 text-left font-semibold">Fee Particulars</th>
                  <th className="py-2 text-right font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.breakdown ? (
                  invoice.breakdown.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-1.5 text-slate-700">{item.title}</td>
                      <td className="py-1.5 text-right font-mono text-slate-800">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 text-slate-700">Quarterly Academic & Infrastructure Dues</td>
                    <td className="py-1.5 text-right font-mono text-slate-800">₹{payment.amount.toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 font-bold text-slate-900 text-sm">
                  <td className="py-2">Total Amount Received</td>
                  <td className="py-2 text-right text-emerald-800 font-mono">₹{payment.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Transaction details & note */}
          <div className="text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded space-y-1 mb-6">
            {payment.transactionId && (
              <p><span className="text-slate-500">Transaction Reference:</span> <span className="font-mono">{payment.transactionId}</span></p>
            )}
            <p className="italic text-slate-500">
              Note: Fees once paid are non-refundable. This is a computer-generated official receipt recognized for tax exemption under section 80C.
            </p>
          </div>

          {/* Signature */}
          <div className="flex justify-between items-end text-xs pt-4 border-t border-slate-300">
            <div>
              <p className="text-[10px] text-slate-400">Cashier / Accountant:</p>
              <p className="font-medium text-slate-700">{payment.receivedBy}</p>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-dashed border-slate-400 w-32 mb-1 inline-block"></div>
              <p className="font-medium text-slate-700">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Accounts Office, RPS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

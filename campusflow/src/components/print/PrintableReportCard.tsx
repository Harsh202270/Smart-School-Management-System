/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ReportCard, SchoolSettings } from '../../types/school';
import { Award, BookOpen, CheckCircle2, Printer, X } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface Props {
  reportCard: ReportCard;
  settings: SchoolSettings;
  onClose?: () => void;
}

export const PrintableReportCard: React.FC<Props> = ({ reportCard, settings, onClose }) => {
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
    triggerPrint('report-card-print-target');
  };

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-sans max-w-4xl mx-auto my-2">
      {/* ALWAYS-VISIBLE STICKY ACTION HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">Official Terminal Report Card</h3>
            <p className="text-[11px] text-slate-400">{reportCard.studentName} • Class {reportCard.classNumber}-{reportCard.section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
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

      {/* Printable Area */}
      <div id="report-card-print-target" className="p-8 print:p-2 printable-document">
        <div className="border-4 border-double border-slate-800 p-6 rounded-md bg-white">
          {/* School Header */}
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <div className="flex justify-center items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-serif font-black text-2xl border-2 border-amber-500">
                R
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase font-serif">
                  {settings.schoolName}
                </h1>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                  {settings.motto} • Estd. {settings.establishedYear}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {settings.affiliation} • School Code: {settings.schoolCode}
            </p>
            <p className="text-xs text-slate-500">
              {settings.address}, {settings.city} - {settings.pincode} • Phone: {settings.phone}
            </p>
            <div className="mt-3 inline-block bg-slate-100 px-4 py-1 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-800 rounded">
              Student Academic Performance Statement ({reportCard.academicYear})
            </div>
          </div>

          {/* Student Meta Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-300 text-xs leading-relaxed">
            <div className="space-y-1">
              <p><span className="font-semibold text-slate-600">Student Name:</span> <strong className="text-slate-950 text-sm">{reportCard.studentName}</strong></p>
              <p><span className="font-semibold text-slate-600">Admission No:</span> {reportCard.admissionNumber}</p>
              <p><span className="font-semibold text-slate-600">Class & Section:</span> Class {reportCard.classNumber} - Section {reportCard.section}</p>
              <p><span className="font-semibold text-slate-600">Roll Number:</span> #{reportCard.rollNumber}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-semibold text-slate-600">Examination:</span> <strong>{reportCard.examName}</strong></p>
              <p><span className="font-semibold text-slate-600">Academic Session:</span> {reportCard.academicYear}</p>
              <p><span className="font-semibold text-slate-600">Attendance:</span> <span className="font-bold text-emerald-700">{reportCard.attendancePercentage}%</span></p>
              {reportCard.rankInClass && (
                <p><span className="font-semibold text-slate-600">Class Rank:</span> <span className="font-bold text-amber-700">#{reportCard.rankInClass}</span></p>
              )}
            </div>
          </div>

          {/* Marks Table */}
          <div className="my-5 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="p-2 border border-slate-300">Subject</th>
                  <th className="p-2 border border-slate-300 text-center">Max Theory</th>
                  <th className="p-2 border border-slate-300 text-center">Theory Obtained</th>
                  <th className="p-2 border border-slate-300 text-center">Max Practical / IA</th>
                  <th className="p-2 border border-slate-300 text-center">Practical Obtained</th>
                  <th className="p-2 border border-slate-300 text-center">Total Max</th>
                  <th className="p-2 border border-slate-300 text-center font-bold">Total Marks</th>
                  <th className="p-2 border border-slate-300 text-center font-bold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {reportCard.subjectMarks.map((sub, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2 border border-slate-300 font-medium text-slate-900">{sub.subject}</td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">{sub.maxTheory}</td>
                    <td className="p-2 border border-slate-300 text-center font-medium">{sub.theoryObtained}</td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">{sub.maxPractical}</td>
                    <td className="p-2 border border-slate-300 text-center font-medium">{sub.practicalObtained}</td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600">{sub.totalMax}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">{sub.totalObtained}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">{sub.grade}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                  <td className="p-2 border border-slate-300" colSpan={5}>
                    Grand Total & Overall Performance
                  </td>
                  <td className="p-2 border border-slate-300 text-center">{reportCard.maxPossible}</td>
                  <td className="p-2 border border-slate-300 text-center text-emerald-800 text-sm">
                    {reportCard.grandTotal}
                  </td>
                  <td className="p-2 border border-slate-300 text-center text-emerald-800 text-sm">
                    {reportCard.overallGrade}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cumulative Stats */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-center my-4">
            <div>
              <span className="text-slate-500 block">Aggregate Percentage</span>
              <span className="text-base font-bold text-slate-900">{reportCard.percentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Overall Grade</span>
              <span className="text-base font-bold text-blue-700">{reportCard.overallGrade}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Result Status</span>
              <span className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 inline" /> PASSED
              </span>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-3 my-4 text-xs">
            <div className="p-2.5 border border-slate-200 bg-amber-50/40 rounded">
              <span className="font-semibold text-slate-700 block">Class Teacher's Observation:</span>
              <p className="text-slate-700 italic mt-0.5">"{reportCard.classTeacherRemarks}"</p>
            </div>
            <div className="p-2.5 border border-slate-200 bg-slate-50 rounded">
              <span className="font-semibold text-slate-700 block">Principal's Note:</span>
              <p className="text-slate-700 italic mt-0.5">"{reportCard.principalRemarks}"</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-8 border-t border-slate-300">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-2"></div>
              <p className="font-medium text-slate-700">Class Teacher</p>
              <p className="text-[10px] text-slate-400">Class In-charge</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-slate-400 flex items-center justify-center text-[9px] uppercase tracking-wider text-slate-500 font-bold border-dashed mb-1">
                School Seal
              </div>
              <p className="text-[10px] text-slate-400">Date: {reportCard.issueDate}</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-6 mb-2 flex items-end justify-center pb-1">
                <span className="font-serif italic font-semibold text-slate-800 text-sm">Ananya Sharma</span>
              </div>
              <p className="font-medium text-slate-700">Principal</p>
              <p className="text-[10px] text-slate-400">Dr. Ananya Sharma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

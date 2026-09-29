/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CertificateRecord, SchoolSettings } from '../../types/school';
import { Printer, Award, X } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface Props {
  certificate: CertificateRecord;
  settings: SchoolSettings;
  onClose?: () => void;
}

export const PrintableCertificate: React.FC<Props> = ({ certificate, settings, onClose }) => {
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
    triggerPrint('certificate-print-target');
  };

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-serif max-w-4xl mx-auto my-2">
      {/* ALWAYS-VISIBLE STICKY ACTION HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 font-sans shadow-md print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">Official Certificate of {certificate.type}</h3>
            <p className="text-[11px] text-slate-400">{certificate.studentName} • Ref #{certificate.certificateNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Certificate
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

      {/* Certificate Frame with Ornate Border */}
      <div id="certificate-print-target" className="p-8 print:p-2 printable-document bg-white">
        <div className="border-8 border-double border-amber-800/80 p-8 rounded-lg bg-amber-50/20 relative">
          <div className="border border-amber-900/30 p-6 rounded relative">
            {/* Certificate No and Date */}
            <div className="flex justify-between items-center text-xs font-sans pb-4 text-slate-600">
              <div>
                <span>Ref No: </span>
                <strong className="font-mono text-slate-800">{certificate.certificateNumber}</strong>
              </div>
              <div>
                <span>Date: </span>
                <strong className="text-slate-800">{certificate.issueDate}</strong>
              </div>
            </div>

            {/* School Header */}
            <div className="text-center pb-6 border-b border-amber-900/20">
              <div className="w-14 h-14 rounded-full bg-slate-950 text-amber-400 mx-auto flex items-center justify-center font-bold text-2xl border-2 border-amber-500 mb-2">
                R
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-wider text-slate-950">
                {settings.schoolName}
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-sans mt-0.5">
                {settings.affiliation} • {settings.address}, {settings.city}
              </p>
              <div className="mt-4 inline-block border-b-2 border-amber-700 pb-1">
                <h2 className="text-xl font-bold uppercase tracking-widest text-amber-900">
                  {certificate.type} Certificate
                </h2>
              </div>
            </div>

            {/* Certificate Body Paragraph */}
            <div className="py-10 px-4 text-center leading-loose text-base text-slate-800">
              <p>
                This is to solemnly certify that <strong className="text-slate-950 text-xl underline decoration-amber-600 underline-offset-8 px-2">{certificate.studentName}</strong>,
                bearing Admission Number <strong className="font-mono">{certificate.admissionNumber}</strong>, is / was a bonafide student of this institution,
                enrolled in <strong className="text-slate-950">Class {certificate.classNumber} - Section {certificate.section}</strong> during the academic session <strong>{settings.academicYear}</strong>.
              </p>

              <div className="mt-6 p-4 bg-white/70 border border-amber-200 rounded max-w-2xl mx-auto italic text-slate-700 text-sm font-sans">
                "{certificate.reasonOrAchievement}"
              </div>

              <p className="mt-6 text-sm text-slate-600 font-sans">
                To the best of our knowledge and school records, their conduct, character, and academic demeanor have been exemplary throughout their tenure with us. We wish them success in all their future academic pursuits.
              </p>
            </div>

            {/* Signatures and Seal */}
            <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs font-sans mt-6">
              <div>
                <div className="h-10 border-b border-slate-400 mx-6 mb-2"></div>
                <p className="font-medium text-slate-700">Prepared & Verified By</p>
                <p className="text-[10px] text-slate-400">Registrar Office</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-800 flex items-center justify-center text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                  Institutional Seal
                </div>
              </div>
              <div>
                <div className="h-10 border-b border-slate-400 mx-6 mb-2 flex items-end justify-center pb-1">
                  <span className="font-serif italic font-semibold text-slate-900 text-base">Ananya Sharma</span>
                </div>
                <p className="font-medium text-slate-700">{certificate.signedBy}</p>
                <p className="text-[10px] text-slate-400">Head of Institution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

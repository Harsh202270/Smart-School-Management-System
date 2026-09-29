/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Student, Teacher, SchoolSettings } from '../../types/school';
import { Printer, QrCode, X, Edit } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface Props {
  entity: Student | Teacher;
  type: 'student' | 'teacher';
  settings: SchoolSettings;
  onClose?: () => void;
  onEdit?: (entity: Student | Teacher) => void;
}

export const PrintableIDCard: React.FC<Props> = ({ entity, type, settings, onClose, onEdit }) => {
  const isStudent = type === 'student';
  const student = isStudent ? (entity as Student) : null;
  const teacher = !isStudent ? (entity as Teacher) : null;

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
    triggerPrint('id-card-print-target');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-sans max-w-3xl mx-auto my-2">
      {/* ALWAYS-VISIBLE STICKY ACTION HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              {isStudent ? 'Official Student Identity Pass' : 'Official Faculty Identity Pass'}
            </h3>
            <p className="text-[11px] text-slate-400">{entity.fullName} • Standard CR-80 Specification</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(entity)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title={isStudent ? 'Edit Student Details' : 'Edit Faculty Details'}
            >
              <Edit className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 border border-slate-700 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Pass
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer ml-1"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" /> Close
            </button>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div id="id-card-print-target" className="p-8 print:p-2 printable-document">
        <div className="flex flex-wrap items-center justify-center gap-6 print:m-0">
          {/* CARD FRONT */}
          <div className="w-[320px] h-[480px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl shadow-lg border-2 border-amber-500/40 p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Card Top Banner */}
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm font-serif">
                  R
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-serif leading-none">
                    {settings.schoolName}
                  </h4>
                  <span className="text-[9px] text-slate-300 uppercase tracking-widest">
                    New Delhi • Estd. 1999
                  </span>
                </div>
              </div>
              <div className="h-0.5 bg-amber-500/50 w-full my-2"></div>
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full inline-block tracking-wider">
                {isStudent ? 'Student Identity Pass' : 'Faculty Pass'}
              </span>
            </div>

            {/* Photo & Name */}
            <div className="text-center relative z-10 my-auto">
              <div className="w-28 h-32 mx-auto rounded-lg overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-700 mb-3">
                <img
                  src={isStudent ? student?.photoUrl : teacher?.photoUrl}
                  alt={entity.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{entity.fullName}</h2>
              <p className="text-amber-400 text-xs font-semibold">
                {isStudent
                  ? `Class ${student?.classId}-${student?.section} | Roll #${student?.rollNumber}`
                  : teacher?.designation}
              </p>
              <p className="text-slate-300 text-[11px] font-mono mt-0.5">
                ID: {isStudent ? student?.id : teacher?.employeeCode}
              </p>
            </div>

            {/* Quick Meta */}
            <div className="bg-slate-950/60 rounded-lg p-2.5 text-[11px] border border-slate-700/60 relative z-10">
              {isStudent ? (
                <div className="grid grid-cols-2 gap-1 text-slate-200">
                  <div><span className="text-slate-400">DOB:</span> {student?.dob}</div>
                  <div><span className="text-slate-400">Blood:</span> <span className="text-red-400 font-bold">{student?.bloodGroup}</span></div>
                  <div className="col-span-2 truncate"><span className="text-slate-400">Emergency:</span> {student?.emergencyContact}</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 text-slate-200">
                  <div><span className="text-slate-400">Dept:</span> {teacher?.department}</div>
                  <div><span className="text-slate-400">Exp:</span> {teacher?.experienceYears} Yrs</div>
                  <div className="col-span-2 truncate"><span className="text-slate-400">Phone:</span> {teacher?.phone}</div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-end pt-2 text-[9px] text-slate-400 border-t border-slate-700/50 relative z-10">
              <div>
                <p>Valid Till: <span className="text-slate-200 font-medium">31 Mar 2027</span></p>
              </div>
              <div className="text-right">
                <p className="font-serif italic text-amber-300 text-[11px]">Ananya Sharma</p>
                <p>Principal Sign</p>
              </div>
            </div>
          </div>

          {/* CARD BACK */}
          <div className="w-[320px] h-[480px] bg-white text-slate-800 rounded-xl shadow-lg border-2 border-slate-300 p-5 flex flex-col justify-between text-xs">
            <div>
              <div className="text-center pb-2 border-b border-slate-200">
                <h5 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
                  Emergency & Verification
                </h5>
                <p className="text-[10px] text-slate-500">{settings.address}, {settings.city}</p>
              </div>

              <div className="mt-4 space-y-2 text-[11px]">
                {isStudent && (
                  <>
                    <p><strong className="text-slate-700">Father's Name:</strong> {student?.fatherName}</p>
                    <p><strong className="text-slate-700">Mother's Name:</strong> {student?.motherName}</p>
                    <p><strong className="text-slate-700">Parent Phone:</strong> {student?.fatherPhone}</p>
                    <p><strong className="text-slate-700">Residential Address:</strong></p>
                    <p className="text-slate-600 text-[10px] leading-snug pl-1 border-l-2 border-amber-500">
                      {student?.permanentAddress}
                    </p>
                    {student?.transportOpted && (
                      <p className="text-emerald-700 font-medium">
                        ✓ Transport: Route {student.busRouteId} ({student.busStopName})
                      </p>
                    )}
                  </>
                )}
                {!isStudent && (
                  <>
                    <p><strong className="text-slate-700">Employee Code:</strong> {teacher?.employeeCode}</p>
                    <p><strong className="text-slate-700">Official Email:</strong> {teacher?.email}</p>
                    <p><strong className="text-slate-700">Qualification:</strong> {teacher?.qualification}</p>
                    <p><strong className="text-slate-700">Joining Date:</strong> {teacher?.joiningDate}</p>
                    <p className="text-slate-500 text-[10px] mt-2">
                      Authorized faculty member of Riverside Public School.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center pt-3 border-t border-slate-200">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <div className="text-left text-[10px] text-slate-500">
                  <p className="font-semibold text-slate-700">Scan for verification</p>
                  <p>Lost ID helpline:</p>
                  <p className="font-mono font-bold text-slate-900">{settings.phone}</p>
                </div>
              </div>
              <div className="mt-3 text-[9px] text-slate-400">
                This card is the property of {settings.schoolName}. If found, please return to the school administrative reception.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

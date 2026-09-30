import React from 'react';
import { X } from 'lucide-react';
import { Student } from '../../../types/school';

type CertificateType =
  | 'Bonafide'
  | 'Transfer Certificate'
  | 'Character Certificate'
  | 'Academic Excellence'
  | 'Sports Achievement';

interface CertificateData {
  studentId: string;
  type: CertificateType;
  reasonOrAchievement: string;
}

interface CertificateModalProps {
  students: Student[];
  certData: CertificateData;
  setCertData: React.Dispatch<React.SetStateAction<CertificateData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  students,
  certData,
  setCertData,
  onClose,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">

        {/* Header */}
        <div className="flex justify-between items-start pb-2 border-b border-slate-200 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-0.5">
              Issue Official School Certificate
            </h3>

            <p className="text-xs text-slate-500">
              Generates formal institutional certificate with seal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3 text-xs">

          {/* Student */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Enrolled Student
            </label>

            <select
              required
              value={certData.studentId}
              onChange={(e) =>
                setCertData({
                  ...certData,
                  studentId: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="">
                Select a student
              </option>

              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.admissionNumber} - {s.classId}-{s.section})
                </option>
              ))}
            </select>
          </div>

          {/* Certificate Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Certificate Type
            </label>

            <select
              required
              value={certData.type}
              onChange={(e) =>
                setCertData({
                  ...certData,
                  type: e.target.value as CertificateType
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
            >
              <option value="Bonafide">
                Bonafide
              </option>

              <option value="Transfer Certificate">
                Transfer Certificate
              </option>

              <option value="Character Certificate">
                Character Certificate
              </option>

              <option value="Academic Excellence">
                Academic Excellence
              </option>

              <option value="Sports Achievement">
                Sports Achievement
              </option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason / Commendation Text
            </label>

            <textarea
              rows={3}
              required
              value={certData.reasonOrAchievement}
              onChange={(e) =>
                setCertData({
                  ...certData,
                  reasonOrAchievement: e.target.value
                })
              }
              placeholder="Enter reason or commendation..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Issue & Preview
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};
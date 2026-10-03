import React from 'react';
import { Plus, Printer } from 'lucide-react';
import { CertificateRecord } from '../../types/school';

interface CertificatesModuleProps {
  certificates: CertificateRecord[];
  onIssueCertificate: () => void;
  onPrintCertificate: (certificate: CertificateRecord) => void;
}

export const CertificatesModule: React.FC<CertificatesModuleProps> = ({
  certificates,
  onIssueCertificate,
  onPrintCertificate,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Official Certificates & Transfer Certificates
          </h2>

          <p className="text-xs text-slate-500">
            Bonafide, Character, Transfer & Academic Excellence records
          </p>
        </div>

        <button
          onClick={onIssueCertificate}
          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Issue Certificate
        </button>
      </div>

      {/* Certificate List */}
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs"
          >
            {/* Certificate Information */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                  {cert.type}
                </span>

                <span className="font-mono text-slate-500">
                  {cert.certificateNumber}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                {cert.studentName}
              </h4>

              <p className="text-slate-600">
                Class {cert.classNumber}-{cert.section} • Issued on{' '}
                {cert.issueDate}
              </p>
            </div>

            {/* Print Button */}
            <button
              onClick={() => onPrintCertificate(cert)}
              className="px-3.5 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
          </div>
        ))}

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-2xl">
            No certificates have been issued yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesModule;
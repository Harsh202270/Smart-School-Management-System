import React from 'react';
import { Printer } from 'lucide-react';
import { QuestionPaper } from '../../types/school';

interface ExamsModuleProps {
  questionPapers: QuestionPaper[];
  onPreviewQuestionPaper: (questionPaper: QuestionPaper) => void;
}

export const ExamsModule: React.FC<ExamsModuleProps> = ({
  questionPapers,
  onPreviewQuestionPaper,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Examinations & Question Paper Central
          </h2>

          <p className="text-xs text-slate-500">
            Term assessments, centralized question bank, and publish control
          </p>
        </div>
      </div>

      {/* Question Papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionPapers.map((qp) => (
          <div
            key={qp.id}
            className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between"
          >
            <div>
              
              {/* Status + Subject Code */}
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  {qp.status}
                </span>

                <span className="font-mono text-slate-500 text-xs">
                  {qp.subjectCode}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {qp.title}
              </h4>

              {/* Class / Marks / Duration */}
              <p className="text-xs text-slate-600 mt-1">
                Class {qp.classNumber} • {qp.maxMarks} Marks •{' '}
                {qp.durationMinutes} Mins
              </p>

              {/* Author */}
              <p className="text-[11px] text-slate-400 mt-1">
                Author: {qp.createdByName}
              </p>
            </div>

            {/* Preview Button */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => onPreviewQuestionPaper(qp)}
                className="px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition"
              >
                <Printer className="w-3.5 h-3.5" />

                Printable Paper Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {questionPapers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">
            No question papers available.
          </p>
        </div>
      )}
    </div>
  );
};
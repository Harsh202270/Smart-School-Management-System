/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { QuestionPaper, SchoolSettings } from '../../types/school';
import { Printer, FileText, X } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface Props {
  paper: QuestionPaper;
  settings: SchoolSettings;
  onClose?: () => void;
}

export const PrintableQuestionPaper: React.FC<Props> = ({ paper, settings, onClose }) => {
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
    triggerPrint('question-paper-print-target');
  };

  let globalQuestionNumber = 1;

  return (
    <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-serif max-w-4xl mx-auto my-2">
      {/* ALWAYS-VISIBLE STICKY ACTION HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 font-sans shadow-md print:hidden border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">Printable Examination Paper</h3>
            <p className="text-[11px] text-slate-400">{paper.title} • {paper.subjectCode}</p>
          </div>
          <span className="bg-indigo-900 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-medium ml-2">
            {paper.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
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

      {/* Official Paper Body */}
      <div id="question-paper-print-target" className="p-8 print:p-2 printable-document bg-white">
        <div className="border border-slate-400 p-8 rounded-sm bg-white">
          {/* Top Roll No Box */}
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-300 font-sans">
            <div className="flex items-center gap-2">
              <span>Roll No:</span>
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-6 h-6 border border-slate-500 rounded-sm"></div>
                ))}
              </div>
            </div>
            <div>
              <span>Subject Code: </span>
              <strong className="font-mono">{paper.subjectCode}</strong>
            </div>
          </div>

          {/* Paper Header */}
          <div className="text-center py-4 border-b-2 border-slate-800">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-950">
              {settings.schoolName}
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-600 font-sans mt-0.5">
              {paper.examName} • Academic Session 2026-27
            </p>
            <div className="my-2">
              <h2 className="text-lg font-bold uppercase underline underline-offset-4">
                {paper.title}
              </h2>
              <p className="text-xs font-sans text-slate-700 mt-1">
                Class: <strong>{paper.classNumber}</strong> • Subject: <strong>{paper.subject}</strong>
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-sans font-bold px-4 pt-2 text-slate-800 border-t border-slate-200">
              <span>Time Allowed: {Math.floor(paper.durationMinutes / 60)} Hours {paper.durationMinutes % 60 ? `${paper.durationMinutes % 60} Mins` : ''}</span>
              <span>Maximum Marks: {paper.maxMarks}</span>
            </div>
          </div>

          {/* General Instructions */}
          <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs font-sans">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
              General Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-700 leading-relaxed">
              {paper.generalInstructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ol>
          </div>

          <div className="h-0.5 bg-slate-800 my-4"></div>

          {/* Sections and Questions */}
          <div className="space-y-6">
            {paper.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                {/* Section Divider */}
                <div className="text-center py-1 bg-slate-100 border-y border-slate-300">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-sans">
                    {section.sectionTitle}
                  </h3>
                  {section.instructions && (
                    <p className="text-xs text-slate-600 italic font-sans">{section.instructions}</p>
                  )}
                </div>

                {/* Questions in Section */}
                <div className="space-y-4">
                  {section.questions.map((q) => {
                    const currentQNum = globalQuestionNumber++;
                    return (
                      <div key={q.id} className="text-sm leading-relaxed text-slate-900 pl-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <span className="font-bold font-sans mr-2">Q.{currentQNum}</span>
                            <span>{q.questionText}</span>

                            {/* If MCQ */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-2 ml-6 text-xs font-sans">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <span className="font-semibold">({String.fromCharCode(65 + oIdx)})</span>
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="font-sans font-bold text-xs text-slate-700 whitespace-nowrap pt-0.5">
                            [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Paper End Mark */}
          <div className="text-center font-sans text-xs text-slate-500 uppercase tracking-widest pt-8 border-t border-slate-300 mt-8">
            *** End of Question Paper ***
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Plus, Printer, Sparkles } from 'lucide-react';
import {
  Question,
  QuestionPaper,
  SchoolSettings,
} from '../../types/school';
import { PrintableQuestionPaper } from '../print/PrintableQuestionPaper';

interface Props {
  settings: SchoolSettings;
  questionPapers: QuestionPaper[];
  questionBank: Question[];
  showCreateModal: boolean;
  setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  previewPaper: QuestionPaper | null;
  setPreviewPaper: React.Dispatch<React.SetStateAction<QuestionPaper | null>>;
  paperTitle: string;
  setPaperTitle: React.Dispatch<React.SetStateAction<string>>;
  paperMaxMarks: number;
  setPaperMaxMarks: React.Dispatch<React.SetStateAction<number>>;
  paperDuration: number;
  setPaperDuration: React.Dispatch<React.SetStateAction<number>>;
  selectedQuestions: Question[];
  isAiGenerating: boolean;
  aiTopicPrompt: string;
  setAiTopicPrompt: React.Dispatch<React.SetStateAction<string>>;
  onAddQuestion: (q: Question) => void;
  onRemoveQuestion: (id: string) => void;
  onAiGenerate: () => void;
  onSavePaper: () => void;
}

export const TeacherQuestionPapers: React.FC<Props> = ({
  settings,
  questionPapers,
  questionBank,
  showCreateModal,
  setShowCreateModal,
  previewPaper,
  setPreviewPaper,
  paperTitle,
  setPaperTitle,
  paperMaxMarks,
  setPaperMaxMarks,
  paperDuration,
  setPaperDuration,
  selectedQuestions,
  isAiGenerating,
  aiTopicPrompt,
  setAiTopicPrompt,
  onAddQuestion,
  onRemoveQuestion,
  onAiGenerate,
  onSavePaper,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Examination Question Paper Studio
          </h2>
          <p className="text-xs text-slate-500">
            Create, configure, and print board-compliant question papers with
            question bank reuse and AI authoring.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Build New Question Paper
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Published & Draft Examination Papers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {paper.status}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {paper.subjectCode}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {paper.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1">
                  Class {paper.classNumber} • Max Marks: {paper.maxMarks} • Time:{' '}
                  {paper.durationMinutes} Mins
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Author: {paper.createdByName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">
                  {paper.sections.reduce(
                    (acc, section) => acc + section.questions.length,
                    0
                  )}{' '}
                  Total Questions
                </span>

                <button
                  onClick={() => setPreviewPaper(paper)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Printable Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Question Bank Repository ({questionBank.length} Questions)
        </h3>

        <div className="space-y-2">
          {questionBank.map((q) => (
            <div
              key={q.id}
              className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center"
            >
              <div className="space-y-0.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-800 font-mono text-[10px]">
                    {q.id}
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    {q.type}
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    {q.topic}
                  </span>
                  <span className="font-bold text-slate-900">
                    [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                  </span>
                </div>

                <p className="text-slate-800">{q.questionText}</p>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 px-2 py-1 bg-slate-50 rounded border border-slate-200">
                {q.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Create Printable Examination Paper
                </h3>
                <p className="text-xs text-slate-500">
                  Configure exam parameters and select questions from the
                  repository or generate new ones with AI.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 my-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paper Title
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={paperMaxMarks}
                    onChange={(e) => setPaperMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Question Authoring Assistant
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopicPrompt}
                    onChange={(e) => setAiTopicPrompt(e.target.value)}
                    placeholder="e.g. Optics, Ohm's law, Light reflection"
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                  />

                  <button
                    type="button"
                    onClick={onAiGenerate}
                    disabled={isAiGenerating}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition"
                  >
                    {isAiGenerating ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">
                  Select Questions from Bank ({selectedQuestions.length}{' '}
                  Selected):
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 p-2 rounded-lg bg-slate-50">
                  {questionBank.map((q) => {
                    const isSelected = selectedQuestions.some(
                      (item) => item.id === q.id
                    );

                    return (
                      <div
                        key={q.id}
                        className={`p-2 rounded-lg border text-xs flex justify-between items-center ${
                          isSelected
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <span className="font-bold text-slate-800 mr-1">
                            [{q.marks}M]
                          </span>
                          <span className="text-slate-700">
                            {q.questionText}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            isSelected
                              ? onRemoveQuestion(q.id)
                              : onAddQuestion(q)
                          }
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            isSelected
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          {isSelected ? 'Remove' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSavePaper}
                className="px-4 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg text-xs hover:bg-slate-800"
              >
                Save & Publish Question Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {previewPaper && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <PrintableQuestionPaper
              paper={previewPaper}
              settings={settings}
              onClose={() => setPreviewPaper(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

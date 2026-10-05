import React from 'react';
import { Plus } from 'lucide-react';
import {
  Homework,
  HomeworkSubmission,
  Teacher,
} from '../../types/school';

interface HomeworkForm {
  title: string;
  classNumber: string;
  section: string;
  subject: string;
  dueDate: string;
  description: string;
}

interface Props {
  teacher: Teacher;
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  newHomework: HomeworkForm;
  setNewHomework: React.Dispatch<React.SetStateAction<HomeworkForm>>;
  reviewingSubmission: HomeworkSubmission | null;
  setReviewingSubmission: React.Dispatch<
    React.SetStateAction<HomeworkSubmission | null>
  >;
  gradeInput: string;
  setGradeInput: React.Dispatch<React.SetStateAction<string>>;
  feedbackInput: string;
  setFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
  onCreateHomework: (e: React.FormEvent) => void;
  onReviewSubmission: (e: React.FormEvent) => void;
}

export const TeacherHomework: React.FC<Props> = ({
  teacher,
  homeworks,
  submissions,
  showAddModal,
  setShowAddModal,
  newHomework,
  setNewHomework,
  reviewingSubmission,
  setReviewingSubmission,
  gradeInput,
  setGradeInput,
  feedbackInput,
  setFeedbackInput,
  onCreateHomework,
  onReviewSubmission,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Homework & Assignment Manager
          </h2>
          <p className="text-xs text-slate-500">
            Curriculum Tasks for Class 10 (Physics, Mathematics & Languages)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Assign New Homework
        </button>
      </div>

      <div className="space-y-4">
        {homeworks.length === 0 && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            No homework assignments found.
          </div>
        )}

        {homeworks.map((hw) => (
          <div
            key={hw.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {hw.subject}
                  </span>
                  <span className="text-xs text-slate-500">
                    Class {hw.classNumber}-{hw.section}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {hw.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1">
                  {hw.description}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-amber-800 block">
                  Due: {hw.dueDate}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {hw.submissionsCount} / {hw.totalStudents || 38} Submissions
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">
                Teacher: {hw.teacherName}
              </span>

              <button
                onClick={() => {
                  const targetSub = submissions.find(
                    (s) => s.homeworkId === hw.id
                  );
                  if (targetSub) setReviewingSubmission(targetSub);
                }}
                className="text-amber-800 font-semibold hover:underline"
              >
                Review Submissions ({hw.submissionsCount}) →
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Assign Homework to Class 10
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Students receive automatic notifications in their portal.
            </p>

            <form onSubmit={onCreateHomework} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 9 Lens Formula Problem Set"
                  value={newHomework.title}
                  onChange={(e) =>
                    setNewHomework({
                      ...newHomework,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={newHomework.subject}
                    onChange={(e) =>
                      setNewHomework({
                        ...newHomework,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option>Science (Physics)</option>
                    <option>Science (Chemistry)</option>
                    <option>Mathematics</option>
                    <option>English Literature</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newHomework.dueDate}
                    onChange={(e) =>
                      setNewHomework({
                        ...newHomework,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instructions / Problems
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify textbook questions, diagram instructions, or submission formatting..."
                  value={newHomework.description}
                  onChange={(e) =>
                    setNewHomework({
                      ...newHomework,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Grade Submission: {reviewingSubmission.studentName}
            </h3>

            <p className="text-xs text-slate-500 mb-3">
              Submitted on {reviewingSubmission.submittedAt}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 mb-4">
              <p className="text-slate-800">
                <strong>Student Note:</strong> {reviewingSubmission.content}
              </p>

              {reviewingSubmission.attachmentName && (
                <p className="text-blue-700 font-medium">
                  📎 Attachment: {reviewingSubmission.attachmentName}
                </p>
              )}
            </div>

            <form onSubmit={onReviewSubmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Grade
                </label>

                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option>A+</option>
                  <option>A</option>
                  <option>B+</option>
                  <option>B</option>
                  <option>Needs Improvement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Teacher Feedback
                </label>

                <textarea
                  rows={3}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

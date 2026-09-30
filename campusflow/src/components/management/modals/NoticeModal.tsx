import React from 'react';

interface NoticeFormData {
  title: string;
  category: 'Academic' | 'Examination' | 'Sports' | 'Holiday' | 'Admission';
  targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents';
  content: string;
  isImportant: boolean;
}

interface NoticeModalProps {
  isOpen: boolean;
  formData: NoticeFormData;
  onChange: (data: NoticeFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  formData,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">

        {/* Header */}
        <div className="flex justify-between items-start pb-2 border-b border-slate-200 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-0.5">
              Broadcast Official Notice / Circular
            </h3>

            <p className="text-xs text-slate-500">
              Published instantaneously to school homepage & portals.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3 text-xs">

          {/* Circular Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Circular Title
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Schedule for Winter Break 2026"
              value={formData.title}
              onChange={(e) =>
                onChange({
                  ...formData,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Category + Audience */}
          <div className="grid grid-cols-2 gap-3">

            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    category: e.target.value as NoticeFormData['category'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Sports">Sports</option>
                <option value="Holiday">Holiday</option>
                <option value="Admission">Admission</option>
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Audience
              </label>

              <select
                value={formData.targetAudience}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    targetAudience:
                      e.target.value as NoticeFormData['targetAudience'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="All">All</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
                <option value="Parents">Parents</option>
              </select>
            </div>
          </div>

          {/* Circular Content */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Circular Content
            </label>

            <textarea
              rows={4}
              required
              placeholder="Detail the instructions, reporting timings, or dates..."
              value={formData.content}
              onChange={(e) =>
                onChange({
                  ...formData,
                  content: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Important Notice */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isImportant}
              onChange={(e) =>
                onChange({
                  ...formData,
                  isImportant: e.target.checked,
                })
              }
              className="rounded text-amber-600"
            />

            <label className="font-semibold text-slate-700">
              Mark as Important Notice
            </label>
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
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Publish Notice
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};
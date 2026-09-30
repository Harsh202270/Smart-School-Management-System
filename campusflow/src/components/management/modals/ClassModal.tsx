import React from 'react';
import { ClassSection } from '../../../types/school';

interface ClassForm {
  classNumber: string;
  section: string;
  roomNumber: string;
  classTeacherName: string;
  capacity: number;
  subjects: string;
}

interface ClassModalProps {
  show: boolean;
  editingClass: ClassSection | null;
  classForm: ClassForm;
  setClassForm: React.Dispatch<React.SetStateAction<ClassForm>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  show,
  editingClass,
  classForm,
  setClassForm,
  onClose,
  onSubmit
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">

        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              {editingClass
                ? 'Edit Academic Division'
                : 'Create Academic Class / Grade'}
            </h3>

            <p className="text-xs text-slate-500">
              Configure grades: Nursery, LKG, UKG, Grade 1 to 12
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="py-4 space-y-3 text-xs"
        >

          {/* Class + Section */}
          <div className="grid grid-cols-2 gap-3">

            {/* Class / Grade */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Class / Grade Name
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Nursery, LKG, UKG, 1, 2, 6, 10"
                value={classForm.classNumber}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    classNumber: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            {/* Section */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Section
              </label>

              <input
                type="text"
                required
                placeholder="e.g. A, B, Science, Commerce"
                value={classForm.section}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    section: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg uppercase font-bold"
              />
            </div>

          </div>

          {/* Room + Capacity */}
          <div className="grid grid-cols-2 gap-3">

            {/* Room */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allocated Room
              </label>

              <input
                type="text"
                required
                value={classForm.roomNumber}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    roomNumber: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Max Student Capacity
              </label>

              <input
                type="number"
                required
                min="1"
                value={classForm.capacity}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    capacity: Number(e.target.value)
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>

          </div>

          {/* Class Teacher */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assigned Class Teacher
            </label>

            <input
              type="text"
              required
              value={classForm.classTeacherName}
              onChange={(e) =>
                setClassForm({
                  ...classForm,
                  classTeacherName: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subjects (Comma separated)
            </label>

            <input
              type="text"
              required
              placeholder="e.g. English, Mathematics, Science, Social Studies"
              value={classForm.subjects}
              onChange={(e) =>
                setClassForm({
                  ...classForm,
                  subjects: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              Save Division
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ClassModal;
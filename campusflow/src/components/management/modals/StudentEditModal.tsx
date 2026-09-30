import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Upload, Trash2 } from 'lucide-react';
import { Student } from '../../../types/school';

interface StudentEditModalProps {
  editingStudent: Student | null;
  setEditingStudent: React.Dispatch<
    React.SetStateAction<Student | null>
  >;
  distinctClasses: string[];
  onSave: (student: Student) => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  editingStudent,
  setEditingStudent,
  distinctClasses,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    editingStudent?.photoUrl || null
  );

  useEffect(() => {
    setPhotoPreview(editingStudent?.photoUrl || null);
    setPhotoError('');
  }, [editingStudent?.id, editingStudent?.photoUrl]);

  const [photoError, setPhotoError] = useState('');

  if (!editingStudent) {
    return null;
  }

  /* =========================================================
     PHOTO CHANGE
  ========================================================= */

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoError('');

    /* Allowed image types */
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError(
        'Only JPG, PNG and WEBP images are allowed.'
      );

      e.target.value = '';
      return;
    }

    useEffect(() => {
      setPhotoPreview(editingStudent?.photoUrl || null);
      setPhotoError('');
    }, [editingStudent?.id, editingStudent?.photoUrl]);

    /* Maximum 5 MB */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setPhotoError(
        'Image size must be less than 5 MB.'
      );

      e.target.value = '';
      return;
    }

    /* Convert selected image to preview */
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setPhotoPreview(result);

        setEditingStudent({
          ...editingStudent,
          photoUrl: result
        });
      }
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     REMOVE PHOTO
  ========================================================= */

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoError('');

    setEditingStudent({
      ...editingStudent,
      photoUrl: ''
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    onSave({
      ...editingStudent,
      photoUrl: photoPreview || ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">

      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-300 my-4 sm:my-8 overflow-hidden">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-slate-200">

          <div className="flex justify-between items-start gap-3">

            <div className="min-w-0">

              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                Edit Student Details
              </h3>

              <p className="text-[10px] sm:text-xs text-slate-500 font-mono mt-1 break-all">
                ID: {editingStudent.id}
                {' • '}
                Admission: {editingStudent.admissionNumber}
              </p>

            </div>

            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 lg:p-8 space-y-5 text-xs max-h-[75vh] overflow-y-auto"
        >

          {/* ===================================================
              STUDENT PHOTO
          =================================================== */}

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

              {/* PHOTO */}

              <div className="relative shrink-0">

                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-sm">

                  {photoPreview ? (

                    <img
                      src={
                        photoPreview?.startsWith('/uploads/')
                          ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8000'}${photoPreview}`
                          : photoPreview || undefined
                      }
                      alt={editingStudent.fullName}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">

                      <Camera className="w-8 h-8 mb-1" />

                      <span className="text-[10px]">
                        No Photo
                      </span>

                    </div>

                  )}

                </div>

              </div>

              {/* PHOTO CONTROLS */}

              <div className="flex-1 w-full text-center sm:text-left">

                <p className="font-bold text-slate-800 text-sm">
                  Student Photo
                </p>

                <p className="text-[10px] text-slate-500 mt-1">
                  Upload JPG, PNG or WEBP image. Maximum 5 MB.
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">

                  {/* HIDDEN INPUT */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {/* CHANGE PHOTO */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />

                    {photoPreview
                      ? 'Change Photo'
                      : 'Upload Photo'}
                  </button>

                  {/* REMOVE */}

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />

                      Remove
                    </button>
                  )}

                </div>

                {/* PHOTO ERROR */}

                {photoError && (
                  <p className="text-[10px] text-red-600 font-semibold mt-2">
                    {photoError}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* ===================================================
              FIRST NAME + LAST NAME
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                First Name
              </label>

              <input
                type="text"
                required
                value={editingStudent.firstName}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    firstName: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500"
              />

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Last Name
              </label>

              <input
                type="text"
                required
                value={editingStudent.lastName}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    lastName: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500"
              />

            </div>

          </div>

          {/* ===================================================
              CLASS + SECTION + ROLL
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Class / Grade
              </label>

              <select
                value={editingStudent.classId}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    classId: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold outline-none"
              >

                {distinctClasses.map((cls) => (
                  <option
                    key={cls}
                    value={cls}
                  >
                    {cls}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Section
              </label>

              <input
                type="text"
                required
                value={editingStudent.section}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    section: e.target.value.toUpperCase()
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg uppercase font-bold outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Roll Number
              </label>

              <input
                type="number"
                min="1"
                required
                value={editingStudent.rollNumber}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    rollNumber: Number(e.target.value)
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold outline-none"
              />

            </div>

          </div>

          {/* ===================================================
              DOB + BLOOD GROUP + STATUS
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>

              <input
                type="date"
                required
                value={editingStudent.dob}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    dob: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Blood Group
              </label>

              <input
                type="text"
                value={editingStudent.bloodGroup || ''}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    bloodGroup: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Status
              </label>

              <select
                value={editingStudent.status}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    status: e.target.value as Student['status']
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Transferred">
                  Transferred
                </option>

                <option value="Alumni">
                  Alumni
                </option>

              </select>

            </div>

          </div>

          {/* ===================================================
              FATHER NAME + PHONE
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Father's Name
              </label>

              <input
                type="text"
                value={editingStudent.fatherName || ''}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    fatherName: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Father's Phone
              </label>

              <input
                type="tel"
                value={editingStudent.fatherPhone || ''}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    fatherPhone: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />

            </div>

          </div>

          {/* ===================================================
              PARENT EMAIL
          =================================================== */}

          <div>

            <label className="block font-semibold text-slate-700 mb-1">
              Parent Email
            </label>

            <input
              type="email"
              value={editingStudent.guardianEmail || ''}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  guardianEmail: e.target.value
                })
              }
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            />

          </div>

          {/* ===================================================
              ADDRESS
          =================================================== */}

          <div>

            <label className="block font-semibold text-slate-700 mb-1">
              Permanent Residential Address
            </label>

            <textarea
              rows={3}
              value={editingStudent.permanentAddress || ''}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  permanentAddress: e.target.value
                })
              }
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none resize-none"
            />

          </div>

          {/* ===================================================
              TRANSPORT
          =================================================== */}

          <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">

            <input
              type="checkbox"
              id="editTransportOpt"
              checked={editingStudent.transportOpted}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  transportOpted: e.target.checked
                })
              }
              className="rounded text-amber-600 mt-0.5"
            />

            <label
              htmlFor="editTransportOpt"
              className="font-semibold text-slate-800 leading-5"
            >
              Enrolled in School Bus Transport Service
            </label>

          </div>

          {/* ===================================================
              BUTTONS
          =================================================== */}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-200">

            <button
              type="button"
              onClick={() =>
                setEditingStudent(null)
              }
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              Save Student Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StudentEditModal;
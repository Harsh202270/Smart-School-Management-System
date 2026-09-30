import React, { useEffect, useRef, useState } from 'react';
import { Teacher } from '../../../types/school';
import {
  Camera,
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface TeacherEditModalProps {
  editingTeacher: Teacher | null;
  setEditingTeacher: React.Dispatch<React.SetStateAction<Teacher | null>>;
  onSave: (e: React.FormEvent) => void;
}

export const TeacherEditModal: React.FC<TeacherEditModalProps> = ({
  editingTeacher,
  setEditingTeacher,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string>('');

  /*
   * Existing teacher photo load karo
   */
  useEffect(() => {
    if (editingTeacher?.photoUrl) {
      setPhotoPreview(editingTeacher.photoUrl);
    } else {
      setPhotoPreview('');
    }
  }, [editingTeacher]);

  if (!editingTeacher) {
    return null;
  }

  /*
   * Image select
   */
  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Allowed image types
     */
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select JPG, JPEG, PNG or WEBP image.');
      return;
    }

    /*
     * Maximum 5 MB
     */
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.');
      return;
    }

    /*
     * Preview ke liye Base64
     */
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setPhotoPreview(result);

        /*
         * Teacher object me bhi image update
         */
        setEditingTeacher({
          ...editingTeacher,
          photoUrl: result,
        });
      }
    };

    reader.readAsDataURL(file);

    /*
     * Same image dobara select karne ki permission
     */
    e.target.value = '';
  };

  /*
   * Remove photo
   */
  const handleRemovePhoto = () => {
    setPhotoPreview('');

    setEditingTeacher({
      ...editingTeacher,
      photoUrl: '',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /*
   * Open file picker
   */
  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-slate-950/75
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-2
        sm:p-4
        overflow-y-auto
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          sm:rounded-3xl
          max-w-3xl
          w-full
          p-4
          sm:p-6
          lg:p-8
          shadow-2xl
          border
          border-slate-300
          my-4
          sm:my-8
          max-h-[95vh]
          overflow-y-auto
        "
      >

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div
          className="
            flex
            justify-between
            items-start
            gap-3
            pb-4
            border-b
            border-slate-200
          "
        >
          <div className="min-w-0">
            <h3
              className="
                text-lg
                sm:text-xl
                font-bold
                font-serif
                text-slate-900
              "
            >
              Edit Faculty Profile
            </h3>

            <p
              className="
                text-[10px]
                sm:text-xs
                text-slate-500
                font-mono
                break-all
                mt-1
              "
            >
              Employee Code: {editingTeacher.employeeCode}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingTeacher(null)}
            className="
              w-8
              h-8
              rounded-full
              bg-slate-100
              hover:bg-slate-200
              text-slate-600
              flex
              items-center
              justify-center
              cursor-pointer
              shrink-0
              transition
            "
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}
        <form
          onSubmit={onSave}
          className="
            pt-5
            space-y-5
            text-xs
          "
        >

          {/* ===================================================
              PROFILE PHOTO
          ==================================================== */}
          <div
            className="
              bg-slate-50
              border
              border-slate-200
              rounded-2xl
              p-4
              sm:p-5
            "
          >
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">

              {/* PHOTO PREVIEW */}
              <div className="shrink-0">

                <div
                  className="
                    relative
                    w-32
                    h-40
                    sm:w-36
                    sm:h-44
                    rounded-2xl
                    overflow-hidden
                    border-2
                    border-slate-300
                    bg-slate-200
                    shadow-sm
                  "
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={editingTeacher.fullName}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-full
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-slate-400
                      "
                    >
                      <ImageIcon className="w-12 h-12" />

                      <span className="text-[10px] mt-2">
                        No Photo
                      </span>
                    </div>
                  )}

                  {/* CAMERA ICON */}
                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    className="
                      absolute
                      bottom-2
                      right-2
                      w-9
                      h-9
                      rounded-full
                      bg-slate-900
                      text-white
                      flex
                      items-center
                      justify-center
                      hover:bg-slate-800
                      cursor-pointer
                      shadow-lg
                    "
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PHOTO CONTROLS */}
              <div
                className="
                  flex-1
                  w-full
                  text-center
                  sm:text-left
                "
              >
                <h4
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >
                  Faculty Photo
                </h4>

                <p
                  className="
                    text-[11px]
                    text-slate-500
                    mt-1
                    leading-relaxed
                  "
                >
                  Upload or change the faculty profile photo.
                  Use a clear passport-size photograph.
                </p>

                {/* HIDDEN FILE INPUT */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {/* BUTTONS */}
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-2
                    mt-4
                  "
                >
                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    className="
                      w-full
                      sm:w-auto
                      px-4
                      py-2.5
                      bg-slate-900
                      hover:bg-slate-800
                      text-white
                      rounded-lg
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-2
                      cursor-pointer
                      transition
                    "
                  >
                    <Upload className="w-4 h-4" />

                    {photoPreview
                      ? 'Change Photo'
                      : 'Upload Photo'}
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="
                        w-full
                        sm:w-auto
                        px-4
                        py-2.5
                        bg-red-50
                        hover:bg-red-100
                        text-red-600
                        border
                        border-red-200
                        rounded-lg
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                        cursor-pointer
                        transition
                      "
                    >
                      <Trash2 className="w-4 h-4" />

                      Remove Photo
                    </button>
                  )}
                </div>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    mt-2
                  "
                >
                  JPG, JPEG, PNG or WEBP • Maximum 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FULL NAME
          ==================================================== */}
          <div>
            <label
              className="
                block
                font-semibold
                text-slate-700
                mb-1
              "
            >
              Full Name & Title
            </label>

            <input
              type="text"
              required
              value={editingTeacher.fullName}
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  fullName: e.target.value,
                })
              }
              className="
                w-full
                px-3
                py-2.5
                bg-slate-50
                border
                border-slate-300
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-amber-400
                focus:border-amber-400
              "
            />
          </div>

          {/* ===================================================
              DESIGNATION + DEPARTMENT
          ==================================================== */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* DESIGNATION */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Designation
              </label>

              <input
                type="text"
                required
                value={editingTeacher.designation}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    designation: e.target.value,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Department
              </label>

              <select
                value={editingTeacher.department}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    department: e.target.value as any,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              >
                <option value="Science">
                  Science
                </option>

                <option value="Mathematics">
                  Mathematics
                </option>

                <option value="Languages">
                  Languages
                </option>

                <option value="Social Studies">
                  Social Studies
                </option>

                <option value="Computers">
                  Computers
                </option>

                <option value="Arts & Sports">
                  Arts & Sports
                </option>
              </select>
            </div>
          </div>

          {/* ===================================================
              QUALIFICATION + EXPERIENCE
          ==================================================== */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* QUALIFICATION */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Qualifications
              </label>

              <input
                type="text"
                required
                value={editingTeacher.qualification}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    qualification: e.target.value,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Teaching Experience (Years)
              </label>

              <input
                type="number"
                required
                min="0"
                value={editingTeacher.experienceYears}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    experienceYears: Number(
                      e.target.value
                    ),
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>
          </div>

          {/* ===================================================
              EMAIL + PHONE
          ==================================================== */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* EMAIL */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Official Email
              </label>

              <input
                type="email"
                required
                value={editingTeacher.email}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    email: e.target.value,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Contact Phone
              </label>

              <input
                type="tel"
                required
                value={editingTeacher.phone}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    phone: e.target.value,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>
          </div>

          {/* ===================================================
              SALARY + STATUS
          ==================================================== */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* SALARY */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Basic Monthly Salary (₹)
              </label>

              <input
                type="number"
                required
                min="0"
                value={
                  editingTeacher.salary?.basic || 60000
                }
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    salary: {
                      ...editingTeacher.salary,
                      basic: Number(e.target.value),
                    },
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  font-mono
                  font-bold
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              />
            </div>

            {/* STATUS */}
            <div>
              <label
                className="
                  block
                  font-semibold
                  text-slate-700
                  mb-1
                "
              >
                Status
              </label>

              <select
                value={editingTeacher.status}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    status: e.target.value as any,
                  })
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-slate-50
                  border
                  border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:border-amber-400
                "
              >
                <option value="Active">
                  Active
                </option>

                <option value="On Leave">
                  On Leave
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          {/* ===================================================
              BUTTONS
          ==================================================== */}
          <div
            className="
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-2
              pt-4
              border-t
              border-slate-200
            "
          >

            <button
              type="button"
              onClick={() => setEditingTeacher(null)}
              className="
                w-full
                sm:w-auto
                px-5
                py-2.5
                border
                border-slate-300
                rounded-lg
                text-slate-600
                cursor-pointer
                hover:bg-slate-50
                transition
                font-medium
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                w-full
                sm:w-auto
                px-5
                py-2.5
                bg-slate-900
                text-amber-400
                font-bold
                rounded-lg
                hover:bg-slate-800
                transition
                cursor-pointer
              "
            >
              Save Faculty Profile
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditModal;
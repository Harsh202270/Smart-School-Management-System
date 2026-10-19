import React, { useRef, useState } from 'react';

interface TeacherAddModalProps {
  isOpen: boolean;

  formData: {
    fullName: string;
    designation: string;
    department:
    | 'Science'
    | 'Mathematics'
    | 'Languages'
    | 'Social Studies'
    | 'Computers'
    | 'Arts & Sports';
    qualification: string;
    experienceYears: number;
    phone: string;
    email: string;
    basicSalary: number;
    photoUrl: string;
  };

  setFormData: React.Dispatch<
    React.SetStateAction<TeacherAddModalProps['formData']>
  >;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent,
    data: TeacherAddModalProps['formData']
  ) => Promise<{
    teacherId: string;
    password: string;
  } | void> | {
    teacherId: string;
    password: string;
  } | void;
}

const TeacherAddModal: React.FC<TeacherAddModalProps> = ({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoError, setPhotoError] = useState('');

  if (!isOpen) {
    return null;
  }

  /* =========================================================
     OPEN FILE PICKER
  ========================================================= */

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /* =========================================================
     SELECT PHOTO
  ========================================================= */

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file.');

      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Photo size must be less than 2 MB.');

      e.target.value = '';
      return;
    }

    setPhotoError('');

    const reader = new FileReader();

    reader.onload = () => {
      setFormData({
        ...formData,
        photoUrl: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     REMOVE PHOTO
  ========================================================= */

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photoUrl: '',
    });

    setPhotoError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-slate-950/75
        backdrop-blur-sm
        flex items-center justify-center
        p-2 sm:p-4
        overflow-y-auto
      "
    >
      <div
        className="
          bg-white
          rounded-2xl sm:rounded-3xl
          w-full
          max-w-2xl
          max-h-[96vh] sm:max-h-[94vh]
          shadow-2xl
          border border-slate-300
          flex flex-col
          overflow-hidden
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
            px-4 py-4
            sm:px-6 sm:py-5
            lg:px-8
            border-b border-slate-200
            shrink-0
          "
        >
          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <div
                className="
                  w-9 h-9
                  rounded-xl
                  bg-slate-900
                  text-amber-400
                  flex items-center justify-center
                  font-bold
                  shadow-sm
                "
              >
                👤
              </div>

              <div>

                <h3
                  className="
                    text-lg sm:text-xl
                    font-bold
                    font-serif
                    text-slate-900
                    leading-tight
                  "
                >
                  Appoint Faculty Member
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Create a new faculty profile
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-8 h-8
              sm:w-9 sm:h-9
              shrink-0
              rounded-full
              bg-slate-100
              hover:bg-slate-200
              active:bg-slate-300
              text-slate-600
              flex items-center justify-center
              font-bold
              cursor-pointer
              transition
            "
            aria-label="Close"
          >
            ✕
          </button>

        </div>

        {/* =====================================================
            FORM AREA
        ===================================================== */}

        <div
          className="
            overflow-y-auto
            overscroll-contain
            px-3 py-4
            sm:px-5 sm:py-5
            lg:px-8 lg:py-6
          "
        >

          <form
            onSubmit={(e) => onSubmit(e, formData)}
            className="
              space-y-4
              sm:space-y-5
              text-xs
            "
          >

            {/* =================================================
                PHOTO
            ================================================= */}

            <div
              className="
                border border-slate-200
                rounded-xl sm:rounded-2xl
                p-3 sm:p-4
                bg-slate-50
              "
            >

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  items-center sm:items-start
                  gap-4 sm:gap-5
                "
              >

                {/* PHOTO PREVIEW */}

                <div
                  className="
                    w-24 h-24
                    sm:w-28 sm:h-28
                    rounded-xl sm:rounded-2xl
                    overflow-hidden
                    border-2 border-slate-300
                    bg-white
                    flex items-center justify-center
                    shrink-0
                  "
                >

                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Faculty Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400">

                      <div className="text-3xl sm:text-4xl mb-1">
                        👤
                      </div>

                      <div className="text-[9px] sm:text-[10px]">
                        No Photo
                      </div>

                    </div>
                  )}

                </div>

                {/* UPLOAD AREA */}

                <div className="w-full min-w-0 text-center sm:text-left">

                  <label className="block font-bold text-slate-800 mb-1">
                    Faculty Photo
                  </label>

                  <p className="text-[10px] sm:text-[11px] text-slate-500 mb-3">
                    Upload a profile photo for this faculty member.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      gap-2
                      justify-center
                      sm:justify-start
                    "
                  >

                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="
                        w-full sm:w-auto
                        px-4 py-2
                        bg-slate-900
                        text-white
                        rounded-lg
                        font-semibold
                        hover:bg-slate-800
                        active:bg-slate-700
                        transition
                        cursor-pointer
                      "
                    >
                      📷 Upload Photo
                    </button>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="
                          w-full sm:w-auto
                          px-4 py-2
                          border border-slate-300
                          text-slate-700
                          rounded-lg
                          font-semibold
                          hover:bg-white
                          active:bg-slate-100
                          transition
                          cursor-pointer
                        "
                      >
                        Change Photo
                      </button>
                    )}

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="
                          w-full sm:w-auto
                          px-4 py-2
                          border border-red-200
                          text-red-600
                          rounded-lg
                          font-semibold
                          hover:bg-red-50
                          active:bg-red-100
                          transition
                          cursor-pointer
                        "
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2">
                    JPG, JPEG, PNG or WEBP • Maximum 2 MB
                  </p>

                  {photoError && (
                    <p className="text-[10px] text-red-600 mt-2 font-semibold">
                      {photoError}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                FULL NAME
            ================================================= */}

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Full Name & Title
              </label>

              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className="
                  w-full
                  px-3 py-2.5
                  bg-slate-50
                  border border-slate-300
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-slate-300
                  focus:border-slate-400
                  transition
                "
                placeholder="Enter full name"
              />

            </div>

            {/* =================================================
                DESIGNATION + DEPARTMENT
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Designation
                </label>

                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      designation: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
                  "
                  placeholder="e.g. TGT Science"
                />

              </div>

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>

                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department:
                        e.target.value as typeof formData.department,
                    })
                  }
                  className="
                    w-full
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
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

            {/* =================================================
                QUALIFICATION + EXPERIENCE
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Qualifications
                </label>

                <input
                  type="text"
                  required
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualification: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
                  "
                  placeholder="e.g. M.Sc., B.Ed."
                />

              </div>

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Teaching Experience (Years)
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceYears: Number(e.target.value),
                    })
                  }
                  className="
                    w-full
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
                  "
                />

              </div>

            </div>

            {/* =================================================
                EMAIL + PHONE
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Official Email
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="
                    w-full
                    min-w-0
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
                  "
                  placeholder="teacher@school.com"
                />

              </div>

              <div className="min-w-0">

                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="
                    w-full
                    min-w-0
                    px-3 py-2.5
                    bg-slate-50
                    border border-slate-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:border-slate-400
                    transition
                  "
                  placeholder="+91 XXXXX XXXXX"
                />

              </div>

            </div>

            {/* =================================================
                SALARY
            ================================================= */}

            <div>

              <label className="block font-semibold text-slate-700 mb-1">
                Basic Monthly Salary (₹)
              </label>

              <input
                type="number"
                required
                min="0"
                value={formData.basicSalary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basicSalary: Number(e.target.value),
                  })
                }
                className="
                  w-full
                  px-3 py-2.5
                  bg-slate-50
                  border border-slate-300
                  rounded-lg
                  font-mono
                  font-bold
                  outline-none
                  focus:ring-2
                  focus:ring-slate-300
                  focus:border-slate-400
                  transition
                "
                placeholder="55000"
              />

            </div>

            {/* =================================================
                SECURITY INFORMATION
            ================================================= */}

            <div
              className="
                rounded-xl
                border border-amber-200
                bg-amber-50
                px-4 py-3
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    w-8 h-8
                    rounded-lg
                    bg-amber-100
                    flex items-center justify-center
                    shrink-0
                  "
                >
                  🔐
                </div>

                <div>

                  <p className="font-bold text-slate-800">
                    Login credentials
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-slate-600 mt-1 leading-relaxed">
                    A secure random initial password and Faculty Employee ID
                    will be generated automatically after this faculty member
                    is appointed.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
                pt-4
                border-t border-slate-200
              "
            >

              <button
                type="button"
                onClick={onClose}
                className="
                  w-full sm:w-auto
                  px-5 py-2.5
                  border border-slate-300
                  rounded-lg
                  text-slate-600
                  font-semibold
                  cursor-pointer
                  hover:bg-slate-50
                  active:bg-slate-100
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  w-full sm:w-auto
                  px-5 py-2.5
                  bg-slate-900
                  text-amber-400
                  font-bold
                  rounded-lg
                  hover:bg-slate-800
                  active:bg-slate-700
                  transition
                  cursor-pointer
                  shadow-sm
                "
              >
                Appoint Faculty Member
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default TeacherAddModal;
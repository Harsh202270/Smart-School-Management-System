import React from 'react';
import {
  X,
  Edit,
  Printer,
  User,
  GraduationCap,
  Users,
  MapPin,
  Bus,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';

import { Student } from '../../types/school';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onPrintIdCard?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onEdit,
  onPrintIdCard
}) => {
  if (!student) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[60]
        bg-slate-950/70 backdrop-blur-sm
        flex items-center justify-center
        p-0 sm:p-3 md:p-5 lg:p-6
      "
    >

      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          bg-white
          w-full
          h-full
          sm:h-auto
          sm:max-h-[95vh]
          md:max-h-[92vh]
          lg:max-w-6xl
          overflow-hidden
          sm:rounded-2xl
          md:rounded-3xl
          shadow-2xl
          border border-slate-200
          flex flex-col
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="bg-slate-900 text-white px-4 py-4 sm:px-5 sm:py-5 md:px-6 shrink-0">

          <div className="flex items-start justify-between gap-3">

            {/* PROFILE HEADER */}

            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">

              {/* PHOTO */}

              <div
                className="
                  w-14 h-14
                  sm:w-16 sm:h-16
                  md:w-20 md:h-20
                  rounded-xl md:rounded-2xl
                  overflow-hidden
                  border-2 border-white/20
                  bg-white/10
                  shrink-0
                "
              >

                <img
                  src={
                    student.photoUrl ||
                    'https://via.placeholder.com/160'
                  }
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* NAME + DETAILS */}

              <div className="min-w-0">

                <div className="flex items-center gap-2 flex-wrap">

                  <h2
                    className="
                      text-base
                      sm:text-lg
                      md:text-xl
                      font-bold
                      break-words
                    "
                  >
                    {student.fullName}
                  </h2>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-bold shrink-0">
                    {student.status || 'Active'}
                  </span>

                </div>

                <p className="text-[10px] sm:text-xs text-slate-300 mt-1">
                  Student Profile
                </p>

                <div
                  className="
                    flex flex-col
                    sm:flex-row
                    sm:flex-wrap
                    gap-x-4
                    gap-y-1
                    mt-2
                    text-[9px]
                    sm:text-[11px]
                    text-slate-300
                  "
                >

                  <span className="break-all">
                    ID:{' '}
                    <strong className="text-white">
                      {student.id}
                    </strong>
                  </span>

                  <span className="break-all">
                    Admission No:{' '}
                    <strong className="text-white">
                      {student.admissionNumber}
                    </strong>
                  </span>

                </div>

              </div>

            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={onClose}
              className="
                w-8 h-8
                sm:w-9 sm:h-9
                rounded-full
                bg-white/10
                hover:bg-white/20
                flex items-center justify-center
                transition
                cursor-pointer
                shrink-0
              "
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-3
            sm:p-4
            md:p-5
            lg:p-6
            space-y-4
            sm:space-y-5
          "
        >

          {/* =================================================
              QUICK INFORMATION
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-4
              gap-2
              sm:gap-3
            "
          >

            <InfoCard
              label="Class"
              value={`${student.classId}-${student.section}`}
            />

            <InfoCard
              label="Roll Number"
              value={`#${student.rollNumber}`}
            />

            <InfoCard
              label="Gender"
              value={student.gender || '-'}
            />

            <InfoCard
              label="Blood Group"
              value={student.bloodGroup || '-'}
            />

          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <ProfileSection
            icon={<User className="w-4 h-4" />}
            title="Personal Information"
          >

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
              "
            >

              <Detail
                label="First Name"
                value={student.firstName}
              />

              <Detail
                label="Last Name"
                value={student.lastName}
              />

              <Detail
                label="Date of Birth"
                value={student.dob || '-'}
              />

              <Detail
                label="Gender"
                value={student.gender || '-'}
              />

              <Detail
                label="Blood Group"
                value={student.bloodGroup || '-'}
              />

              <Detail
                label="Category"
                value={student.category || '-'}
              />

              <Detail
                label="Aadhaar Number"
                value={student.aadharNumber || '-'}
              />

            </div>

          </ProfileSection>

          {/* =================================================
              ACADEMIC INFORMATION
          ================================================= */}

          <ProfileSection
            icon={<GraduationCap className="w-4 h-4" />}
            title="Academic Information"
          >

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
              "
            >

              <Detail
                label="Class / Grade"
                value={student.classId}
              />

              <Detail
                label="Section"
                value={student.section}
              />

              <Detail
                label="Roll Number"
                value={String(student.rollNumber)}
              />

              <Detail
                label="Admission Date"
                value={student.admissionDate || '-'}
              />

              <Detail
                label="Admission Number"
                value={student.admissionNumber}
              />

              <Detail
                label="Student ID"
                value={student.id}
              />

              <Detail
                label="Status"
                value={student.status || 'Active'}
              />

            </div>

          </ProfileSection>

          {/* =================================================
              PARENT INFORMATION
          ================================================= */}

          <ProfileSection
            icon={<Users className="w-4 h-4" />}
            title="Parent & Guardian Information"
          >

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-4
              "
            >

              {/* FATHER */}

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">

                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">
                  Father
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3">

                  <Detail
                    label="Name"
                    value={student.fatherName || '-'}
                  />

                  <Detail
                    label="Occupation"
                    value={student.fatherOccupation || '-'}
                  />

                  <Detail
                    label="Phone"
                    value={student.fatherPhone || '-'}
                  />

                </div>

              </div>

              {/* MOTHER */}

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">

                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">
                  Mother
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3">

                  <Detail
                    label="Name"
                    value={student.motherName || '-'}
                  />

                  <Detail
                    label="Occupation"
                    value={student.motherOccupation || '-'}
                  />

                  <Detail
                    label="Phone"
                    value={student.motherPhone || '-'}
                  />

                </div>

              </div>

            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
                mt-4
              "
            >

              <Detail
                label="Guardian Email"
                value={student.guardianEmail || '-'}
              />

              <Detail
                label="Emergency Contact"
                value={student.emergencyContact || '-'}
              />

            </div>

          </ProfileSection>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <ProfileSection
            icon={<MapPin className="w-4 h-4" />}
            title="Address Information"
          >

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-4
              "
            >

              {/* PERMANENT */}

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">

                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Permanent Address
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                  {student.permanentAddress || '-'}
                </p>

              </div>

              {/* CURRENT */}

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">

                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Current Address
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                  {student.currentAddress || '-'}
                </p>

              </div>

            </div>

          </ProfileSection>

          {/* =================================================
              TRANSPORT
          ================================================= */}

          <ProfileSection
            icon={<Bus className="w-4 h-4" />}
            title="Transport Information"
          >

            {student.transportOpted ? (

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                "
              >

                <Detail
                  label="Transport"
                  value="School Bus"
                />

                <Detail
                  label="Route"
                  value={
                    student.busRouteId ||
                    'Not Assigned'
                  }
                />

                <Detail
                  label="Bus Stop"
                  value={
                    student.busStopName ||
                    '-'
                  }
                />

              </div>

            ) : (

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600">
                Student is not enrolled in school bus transport.
              </div>

            )}

          </ProfileSection>

          {/* =================================================
              OTHER INFORMATION
          ================================================= */}

          <ProfileSection
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Other Information"
          >

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
              "
            >

              <Detail
                label="Library Card"
                value={student.libraryCardNo || '-'}
              />

              <Detail
                label="Created At"
                value={
                  student.createdAt
                    ? new Date(
                        student.createdAt
                      ).toLocaleString()
                    : '-'
                }
              />

              <Detail
                label="Updated At"
                value={
                  student.updatedAt
                    ? new Date(
                        student.updatedAt
                      ).toLocaleString()
                    : '-'
                }
              />

            </div>

          </ProfileSection>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            px-3
            sm:px-5
            md:px-6
            py-3
            sm:py-4
            bg-slate-50
            border-t border-slate-200
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            shrink-0
          "
        >

          {/* FOOTER LABEL */}

          <div className="flex items-center gap-2 text-[10px] text-slate-400">

            <CalendarDays className="w-3.5 h-3.5 shrink-0" />

            <span>
              Permanent Student Record
            </span>

          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-col
              xs:flex-row
              sm:flex-row
              items-stretch
              sm:items-center
              gap-2
              w-full
              sm:w-auto
            "
          >

            {onPrintIdCard && (
              <button
                type="button"
                onClick={() =>
                  onPrintIdCard(student)
                }
                className="
                  px-3 py-2
                  border border-slate-300
                  rounded-lg
                  text-xs
                  font-semibold
                  text-slate-700
                  hover:bg-white
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  cursor-pointer
                  w-full
                  sm:w-auto
                "
              >
                <Printer className="w-3.5 h-3.5" />

                Print ID Card
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() =>
                  onEdit(student)
                }
                className="
                  px-3 py-2
                  bg-amber-500
                  hover:bg-amber-600
                  text-slate-950
                  rounded-lg
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  cursor-pointer
                  w-full
                  sm:w-auto
                "
              >
                <Edit className="w-3.5 h-3.5" />

                Edit Student
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="
                px-3 py-2
                bg-slate-900
                hover:bg-slate-800
                text-white
                rounded-lg
                text-xs
                font-semibold
                cursor-pointer
                w-full
                sm:w-auto
              "
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const InfoCard: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {

  return (
    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">

      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">
        {label}
      </p>

      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1 truncate">
        {value}
      </p>

    </div>
  );
};


/* =========================================================
   PROFILE SECTION
========================================================= */

const ProfileSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({
  icon,
  title,
  children
}) => {

  return (
    <section className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden">

      <div
        className="
          px-3
          sm:px-4
          py-2.5
          sm:py-3
          bg-slate-50
          border-b border-slate-200
          flex
          items-center
          gap-2
        "
      >

        <span className="text-slate-700 shrink-0">
          {icon}
        </span>

        <h3 className="text-[11px] sm:text-xs font-bold text-slate-800">
          {title}
        </h3>

      </div>

      <div className="p-3 sm:p-4">
        {children}
      </div>

    </section>
  );
};


/* =========================================================
   DETAIL
========================================================= */

const Detail: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value
}) => {

  return (
    <div className="min-w-0">

      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        {label}
      </p>

      <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5 break-words">
        {value || '-'}
      </p>

    </div>
  );
};


export default StudentProfileModal;
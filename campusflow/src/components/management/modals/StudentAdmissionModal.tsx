import React, { useState } from 'react';
import { CircleHelp, X } from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

import {
  Student,
  TransportRoute
} from '../../../types/school';

interface StudentAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentCount: number;
  distinctClasses: string[];
  routes: TransportRoute[];
  onStudentCreated: (student: Student) => void;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  isOpen,
  onClose,
  studentCount,
  distinctClasses,
  routes,
  onStudentCreated
}) => {
  const [admissionStep, setAdmissionStep] = useState(1);
  const [showBusRouteModal, setShowBusRouteModal] = useState(false);

  const [newAdmission, setNewAdmission] = useState({
    firstName: '',
    lastName: '',
    classId: 'Nursery',
    section: 'A',
    rollNumber: 1,
    dob: '2023-01-15',
    gender: 'Male' as const,
    bloodGroup: 'B+',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    guardianEmail: '',
    permanentAddress: '',
    transportOpted: false,
    busRouteId: '',
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80'
  });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setAdmissionStep(1);
    setShowBusRouteModal(false);
    onClose();
  };

  const handleCompleteAdmission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: Number(newAdmission.rollNumber),

          firstName: newAdmission.firstName,
          lastName: newAdmission.lastName,

          gender: newAdmission.gender,
          dob: newAdmission.dob,
          bloodGroup: newAdmission.bloodGroup,

          // Backend me abhi actual Aadhaar nahi bhej rahe
          aadharNumber: null,

          // Abhi photo URL bhej rahe hain
          photoUrl: newAdmission.photoUrl || null,

          classId: newAdmission.classId,
          section: newAdmission.section,

          admissionDate: new Date()
            .toISOString()
            .split('T')[0],

          status: 'Active',
          category: 'General',

          fatherName: newAdmission.fatherName,
          fatherOccupation: newAdmission.fatherOccupation,
          fatherPhone: newAdmission.fatherPhone,

          motherName: newAdmission.motherName || null,
          motherOccupation: null,
          motherPhone: null,

          guardianEmail: newAdmission.guardianEmail || null,

          emergencyContact: newAdmission.fatherPhone || null,

          permanentAddress:
            newAdmission.permanentAddress || null,

          currentAddress:
            newAdmission.permanentAddress || null,

          transportOpted:
            newAdmission.transportOpted,

          busRouteId:
            newAdmission.transportOpted
              ? newAdmission.busRouteId || null
              : null,

          busStopName: null,

          libraryCardNo: null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to create student'
        );
      }

      // Backend se actual created student milega
      const createdStudent = result.data;

      console.log('Student created:', createdStudent);

      setAdmissionStep(1);

      onStudentCreated(createdStudent);

      onClose();

    } catch (error) {
      console.error('Create student error:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create student'
      );
    }
  };

  return (
    <>
      {/* =========================================================
          7-STEP ADMISSION WIZARD MODAL
      ========================================================= */}

      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">

          {/* HEADER */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                Step {admissionStep} of 7 • New Student Enrollment
              </span>

              <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">
                Student Admission
              </h3>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleCompleteAdmission}
            className="py-4 space-y-4 text-xs"
          >

            {/* =====================================================
                STEP 1
            ===================================================== */}

            {admissionStep === 1 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 1: Student Identity Information
                </h4>

                {/* PHOTO */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">

                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-inner flex items-center justify-center">

                    {newAdmission.photoUrl ? (
                      <img
                        src={newAdmission.photoUrl}
                        alt="Student preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 text-center px-2">
                        Upload Photo
                      </span>
                    )}

                  </div>

                  <div className="flex-1">

                    <label className="block font-semibold text-slate-700 mb-1">
                      Student Photo
                    </label>

                    <label className="inline-flex items-center justify-center cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 transition">
                      Add / Upload Image

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          const reader = new FileReader();

                          reader.onload = () => {
                            const result =
                              typeof reader.result === 'string'
                                ? reader.result
                                : newAdmission.photoUrl;

                            setNewAdmission((prev) => ({
                              ...prev,
                              photoUrl: result
                            }));
                          };

                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    <p className="mt-2 text-[10px] text-slate-500">
                      Square image preview will appear here automatically.
                    </p>

                  </div>

                </div>

                {/* NAME */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      First Name *
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Diya"
                      value={newAdmission.firstName}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          firstName: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Last Name *
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Sengupta"
                      value={newAdmission.lastName}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          lastName: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                </div>

                {/* DOB / GENDER / BLOOD */}
                <div className="grid grid-cols-3 gap-3">

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      required
                      value={newAdmission.dob}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          dob: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Gender
                    </label>

                    <select
                      value={newAdmission.gender}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          gender: e.target.value as any
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Blood Group
                    </label>

                    <input
                      type="text"
                      value={newAdmission.bloodGroup}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          bloodGroup: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* =====================================================
                STEP 2
            ===================================================== */}

            {admissionStep === 2 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 2: Parent & Guardian Details
                </h4>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Father's Name *
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Debabrata Sengupta"
                      value={newAdmission.fatherName}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          fatherName: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Occupation
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Professor"
                      value={newAdmission.fatherOccupation}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          fatherOccupation: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Father's Phone *
                    </label>

                    <input
                      type="tel"
                      required
                      placeholder="+91 98110-XXXXX"
                      value={newAdmission.fatherPhone}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          fatherPhone: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Parent Email *
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="parent@gmail.com"
                      value={newAdmission.guardianEmail}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          guardianEmail: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* =====================================================
                STEP 3
            ===================================================== */}

            {admissionStep === 3 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 3: Academic Class & Section Allocation
                </h4>

                <div className="grid grid-cols-3 gap-3">

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Admit to Class / Grade
                    </label>

                    <select
                      value={newAdmission.classId}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          classId: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    >
                      {distinctClasses.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Section
                    </label>

                    <select
                      value={newAdmission.section}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          section: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="Science">Section Science</option>
                      <option value="Commerce">Section Commerce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Roll Number
                    </label>

                    <input
                      type="number"
                      value={newAdmission.rollNumber}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          rollNumber: Number(e.target.value)
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* =====================================================
                STEP 4
            ===================================================== */}

            {admissionStep === 4 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 4: Residential Address & Verification
                </h4>

                <div>

                  <label className="block font-semibold text-slate-700 mb-1">
                    Permanent Residential Address
                  </label>

                  <textarea
                    rows={3}
                    required
                    placeholder="Flat / House No, Locality, Pincode, City..."
                    value={newAdmission.permanentAddress}
                    onChange={(e) =>
                      setNewAdmission({
                        ...newAdmission,
                        permanentAddress: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />

                </div>

              </div>
            )}

            {/* =====================================================
                STEP 5
            ===================================================== */}

            {admissionStep === 5 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 5: Document Checklist & Verification
                </h4>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-amber-600"
                    />

                    <span>
                      Birth Certificate Verified (Municipal Authority)
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-amber-600"
                    />

                    <span>
                      Previous School Transfer Certificate (TC) Counter-signed
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-amber-600"
                    />

                    <span>
                      Aadhaar Card / Identity Proof Verified
                    </span>
                  </label>

                </div>

              </div>
            )}

            {/* =====================================================
                STEP 6
            ===================================================== */}

            {admissionStep === 6 && (
              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <h4 className="font-bold text-slate-800 text-sm">
                    Step 6: School Bus Transport
                  </h4>

                  <button
                    type="button"
                    onClick={() => setShowBusRouteModal(true)}
                    className="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition cursor-pointer"
                    title="View all bus routes"
                  >
                    <CircleHelp className="w-4 h-4" />
                  </button>

                </div>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">

                  <input
                    type="checkbox"
                    checked={newAdmission.transportOpted}
                    onChange={(e) =>
                      setNewAdmission({
                        ...newAdmission,
                        transportOpted: e.target.checked,
                        busRouteId: e.target.checked
                          ? (
                            newAdmission.busRouteId ||
                            routes[0]?.routeCode ||
                            ''
                          )
                          : ''
                      })
                    }
                    className="rounded text-amber-600"
                  />

                  <span className="font-bold text-slate-800">
                    Enroll student in School Bus Transport Service
                  </span>

                </label>

                {newAdmission.transportOpted && (
                  <div>

                    <label className="block font-semibold text-slate-700 mb-1">
                      Select Bus Route
                    </label>

                    <select
                      value={newAdmission.busRouteId}
                      onChange={(e) =>
                        setNewAdmission({
                          ...newAdmission,
                          busRouteId: e.target.value
                        })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                    >

                      <option value="">
                        Select Bus Route
                      </option>

                      {routes.map((route) => (
                        <option
                          key={route.id}
                          value={route.routeCode}
                        >
                          {route.routeCode} — {route.routeName}
                        </option>
                      ))}

                    </select>

                    {newAdmission.busRouteId && (
                      <p className="text-emerald-700 text-[11px] mt-2 font-medium">
                        ✓ Selected Route: {newAdmission.busRouteId}
                      </p>
                    )}

                  </div>
                )}

                {!newAdmission.transportOpted && (
                  <p className="text-slate-500 text-[11px]">
                    Student will use self transport / will not use school bus service.
                  </p>
                )}

              </div>
            )}

            {/* =====================================================
                STEP 7
            ===================================================== */}

            {admissionStep === 7 && (
              <div className="space-y-3">

                <h4 className="font-bold text-slate-800 text-sm">
                  Step 7: Final Review & Confirmation
                </h4>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-xs text-slate-800">

                  <p>
                    <strong>Candidate:</strong>{' '}
                    {newAdmission.firstName} {newAdmission.lastName}
                  </p>

                  <p>
                    <strong>Class & Section:</strong>{' '}
                    {newAdmission.classId}-{newAdmission.section}
                    {' '}
                    (Roll #{newAdmission.rollNumber})
                  </p>

                  <p>
                    <strong>Parent Contact:</strong>{' '}
                    {newAdmission.fatherName}
                    {' '}
                    ({newAdmission.fatherPhone})
                  </p>

                  <p>
                    <strong>Transport:</strong>{' '}

                    {newAdmission.transportOpted
                      ? `Yes (${newAdmission.busRouteId || 'Route not selected'})`
                      : 'No'}
                  </p>

                </div>

                <p className="text-slate-500 text-[11px]">
                  Submitting this form creates the permanent student record,
                  assigns admission number, and generates the student ID card.
                </p>

              </div>
            )}

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">

              {admissionStep > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setAdmissionStep(admissionStep - 1)
                  }
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}

              {admissionStep < 7 ? (
                <button
                  type="button"
                  onClick={() =>
                    setAdmissionStep(admissionStep + 1)
                  }
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Complete Admission
                </button>
              )}

            </div>

          </form>

        </div>
      </div>

      {/* =========================================================
          BUS ROUTE HELP MODAL
      ========================================================= */}

      {showBusRouteModal && (
        <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-slate-300">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">

              <div>

                <h3 className="text-base font-bold text-slate-900 font-serif">
                  School Bus Routes
                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  Available bus routes for student transport
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowBusRouteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* ROUTES */}

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-3">

              {routes.length > 0 ? (

                routes.map((route) => (

                  <div
                    key={route.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 font-bold text-[11px] font-mono">
                            {route.routeCode}
                          </span>

                          <h4 className="font-bold text-slate-900 text-sm">
                            {route.routeName}
                          </h4>

                        </div>

                        <div className="mt-2 text-[11px] text-slate-600 space-y-1">

                          <p>
                            <span className="font-semibold text-slate-700">
                              Pickup:
                            </span>{' '}
                            {route.pickupTime}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-700">
                              Drop:
                            </span>{' '}
                            {route.dropTime}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-700">
                              Stops:
                            </span>{' '}
                            {route.stops?.join(' → ') ||
                              'Multiple school bus stops'}
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAdmission({
                            ...newAdmission,
                            transportOpted: true,
                            busRouteId: route.routeCode
                          });

                          setShowBusRouteModal(false);
                        }}
                        className="shrink-0 px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        Select
                      </button>

                    </div>

                  </div>

                ))

              ) : (

                <div className="p-6 text-center text-sm text-slate-500">
                  No bus routes are currently available.
                </div>

              )}

            </div>

            {/* FOOTER */}

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">

              <button
                type="button"
                onClick={() => setShowBusRouteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-semibold hover:bg-white cursor-pointer"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default StudentAdmissionModal;
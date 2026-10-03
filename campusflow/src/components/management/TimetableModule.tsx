import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  DoorOpen,
  Edit3,
  GraduationCap,
  Plus,
  Printer,
  Save,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { DayTimetable } from '../../types/school';

interface TimetableModuleProps {
  timetable: DayTimetable[];
}

type TimetableEntry = {
  id: string;
  day: string;
  className: string;
  section: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room: string;
  isBreak?: boolean;
};

type FormData = {
  day: string;
  className: string;
  section: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room: string;
  isBreak: boolean;
};

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ALL_CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

// const ALL_SECTIONS = ['A', 'B', 'C', 'D'];
const ALL_SECTIONS = ['A'];

const SUBJECTS = [
  'English',
  'Hindi',
  'Mathematics',
  'Science',
  'Social Science',
  'Computer',
  'Physics',
  'Chemistry',
  'Biology',
  'Accountancy',
  'Business Studies',
  'Economics',
  'Physical Education',
  'General Knowledge',
  'Art',
  'Music',
];

const TEACHERS = [
  'Amit Sharma',
  'Priya Singh',
  'Rahul Kumar',
  'Neha Verma',
  'Anjali Gupta',
  'Rohit Mehta',
  'Pooja Sharma',
  'Vikas Yadav',
  'Sneha Kapoor',
  'Manish Jain',
];

const ROOMS = [
  'Room 101',
  'Room 102',
  'Room 103',
  'Room 104',
  'Room 105',
  'Science Lab',
  'Computer Lab',
  'Library',
  'Activity Room',
];

const PERIODS = [
  {
    periodNumber: 1,
    startTime: '08:00',
    endTime: '08:45',
  },
  {
    periodNumber: 2,
    startTime: '08:45',
    endTime: '09:30',
  },
  {
    periodNumber: 3,
    startTime: '09:30',
    endTime: '10:15',
  },
  {
    periodNumber: 4,
    startTime: '10:15',
    endTime: '11:00',
  },
  {
    periodNumber: 5,
    startTime: '11:15',
    endTime: '12:00',
  },
  {
    periodNumber: 6,
    startTime: '12:00',
    endTime: '12:45',
  },
  {
    periodNumber: 7,
    startTime: '12:45',
    endTime: '01:30',
  },
  {
    periodNumber: 8,
    startTime: '01:30',
    endTime: '02:15',
  },
];

const DEFAULT_FORM: FormData = {
  day: 'Monday',
  className: 'Class 1',
  section: 'A',
  periodNumber: 1,
  startTime: '08:00',
  endTime: '08:45',
  subject: 'English',
  teacherName: 'Amit Sharma',
  room: 'Room 101',
  isBreak: false,
};

function createId() {
  return `TT-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function getPeriodTime(periodNumber: number) {
  return (
    PERIODS.find(
      (period) =>
        period.periodNumber === periodNumber
    ) || PERIODS[0]
  );
}

/*
|--------------------------------------------------------------------------
| CREATE SAMPLE DATA
|--------------------------------------------------------------------------
| This creates entries for ALL classes and ALL sections.
| Therefore the grid never hides classes.
|--------------------------------------------------------------------------
*/

function createDemoData(): TimetableEntry[] {
  const result: TimetableEntry[] = [];

  const demoSubjects = [
    'English',
    'Mathematics',
    'Science',
    'Hindi',
    'Computer',
    'Social Science',
    'Physics',
    'Chemistry',
  ];

  ALL_CLASSES.forEach((className, classIndex) => {
    ALL_SECTIONS.forEach(
      (section, sectionIndex) => {
        DAYS.forEach(
          (day, dayIndex) => {
            PERIODS.forEach(
              (period, periodIndex) => {
                /*
                 * Period 4 is lunch/break.
                 */

                if (
                  period.periodNumber === 4
                ) {
                  result.push({
                    id: `DEMO-${classIndex}-${sectionIndex}-${dayIndex}-${periodIndex}`,
                    day,
                    className,
                    section,
                    periodNumber:
                      period.periodNumber,
                    startTime:
                      period.startTime,
                    endTime:
                      period.endTime,
                    subject:
                      'Lunch Break',
                    teacherName: '',
                    room: '',
                    isBreak: true,
                  });

                  return;
                }

                const subject =
                  demoSubjects[
                  (classIndex +
                    sectionIndex +
                    dayIndex +
                    periodIndex) %
                  demoSubjects.length
                  ];

                /*
                 * IMPORTANT:
                 * We intentionally distribute teachers and rooms.
                 * This also allows the conflict engine to detect
                 * real conflicts if the same teacher/room appears.
                 */

                const teacher =
                  TEACHERS[
                  (classIndex +
                    sectionIndex +
                    periodIndex +
                    dayIndex) %
                  TEACHERS.length
                  ];

                const room =
                  ROOMS[
                  (classIndex +
                    sectionIndex +
                    periodIndex) %
                  ROOMS.length
                  ];

                result.push({
                  id: `DEMO-${classIndex}-${sectionIndex}-${dayIndex}-${periodIndex}`,
                  day,
                  className,
                  section,
                  periodNumber:
                    period.periodNumber,
                  startTime:
                    period.startTime,
                  endTime:
                    period.endTime,
                  subject,
                  teacherName:
                    teacher,
                  room,
                });
              }
            );
          }
        );
      }
    );
  });

  return result;
}

export const TimetableModule: React.FC<
  TimetableModuleProps
> = ({ timetable }) => {
  /*
  |--------------------------------------------------------------------------
  | INITIAL DATA
  |--------------------------------------------------------------------------
  */

  const [entries, setEntries] =
    useState<TimetableEntry[]>(() => {
      /*
       * IMPORTANT:
       * Old DayTimetable structure does not contain className/section.
       * Therefore it cannot safely create a complete class-wise grid.
       *
       * If old data exists, convert it to Class 1-A,
       * otherwise create complete school grid.
       */

      if (
        timetable &&
        timetable.length > 0
      ) {
        const converted: TimetableEntry[] =
          [];

        timetable.forEach((day) => {
          day.periods?.forEach(
            (period) => {
              converted.push({
                id:
                  period.id ||
                  createId(),
                day: day.day,
                className: 'Class 1',
                section: 'A',
                periodNumber:
                  period.periodNumber,
                startTime:
                  period.startTime,
                endTime:
                  (period as any)
                    .endTime ||
                  getPeriodTime(
                    period.periodNumber
                  ).endTime,
                subject:
                  period.subject,
                teacherName:
                  period.teacherName,
                room: period.room,
              });
            }
          );
        });

        /*
         * Existing old data ko keep karenge.
         * But complete class grid ke liye missing cells
         * automatically blank rahenge.
         */

        return converted;
      }

      return createDemoData();
    });

  const [selectedDay, setSelectedDay] =
    useState('Monday');

  const [selectedClass, setSelectedClass] =
    useState('All Classes');

  const [selectedSection, setSelectedSection] =
    useState('All Sections');

  const [search, setSearch] =
    useState('');

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<FormData>(DEFAULT_FORM);

  const [showCopyModal, setShowCopyModal] =
    useState(false);

  const [copyTargetDay, setCopyTargetDay] =
    useState('Tuesday');

  const [notification, setNotification] =
    useState<{
      type: 'success' | 'error';
      message: string;
    } | null>(null);

  /*
  |--------------------------------------------------------------------------
  | CONFLICT DETAILS MODAL
  |--------------------------------------------------------------------------
  */

  const [conflictEntry, setConflictEntry] =
    useState<TimetableEntry | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | GET ALL SCHOOL CLASSES
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | This does NOT depend on existing timetable entries.
  | Every class + section always appears.
  |--------------------------------------------------------------------------
  */

  const allClassSections = useMemo(() => {
    const result: {
      className: string;
      section: string;
    }[] = [];

    ALL_CLASSES.forEach(
      (className) => {
        ALL_SECTIONS.forEach(
          (section) => {
            result.push({
              className,
              section,
            });
          }
        );
      }
    );

    return result;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERED CLASS COLUMNS
  |--------------------------------------------------------------------------
  */

  const visibleClassSections =
    useMemo(() => {
      let result = [
        ...allClassSections,
      ];

      if (
        selectedClass !==
        'All Classes'
      ) {
        result =
          result.filter(
            (item) =>
              item.className ===
              selectedClass
          );
      }

      if (
        selectedSection !==
        'All Sections'
      ) {
        result =
          result.filter(
            (item) =>
              item.section ===
              selectedSection
          );
      }

      if (search.trim()) {
        const value =
          search.toLowerCase();

        result =
          result.filter(
            (item) =>
              item.className
                .toLowerCase()
                .includes(value) ||
              item.section
                .toLowerCase()
                .includes(value)
          );
      }

      return result;
    }, [
      allClassSections,
      selectedClass,
      selectedSection,
      search,
    ]);

  /*
  |--------------------------------------------------------------------------
  | GET ENTRY
  |--------------------------------------------------------------------------
  */

  const getEntry = (
    className: string,
    section: string,
    periodNumber: number
  ) => {
    return entries.find(
      (entry) =>
        entry.day === selectedDay &&
        entry.className ===
        className &&
        entry.section === section &&
        entry.periodNumber ===
        periodNumber
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CONFLICT ENGINE
  |--------------------------------------------------------------------------
  |
  | Detects:
  |
  | 1. Same class + section + period
  | 2. Same teacher + day + period
  | 3. Same room + day + period
  |
  |--------------------------------------------------------------------------
  */

  const conflictMap = useMemo(() => {
    const map = new Map<
      string,
      {
        type: string;
        message: string;
        relatedEntries: TimetableEntry[];
      }
    >();

    for (
      let i = 0;
      i < entries.length;
      i++
    ) {
      const current =
        entries[i];

      for (
        let j = i + 1;
        j < entries.length;
        j++
      ) {
        const other =
          entries[j];

        /*
         * Different day = no conflict
         */

        if (
          current.day !==
          other.day ||
          current.periodNumber !==
          other.periodNumber
        ) {
          continue;
        }

        /*
         * Same class / section
         */

        if (
          current.className ===
          other.className &&
          current.section ===
          other.section
        ) {
          map.set(current.id, {
            type: 'Class Conflict',
            message: `${current.className} - Section ${current.section} has more than one routing in Period ${current.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });

          map.set(other.id, {
            type: 'Class Conflict',
            message: `${other.className} - Section ${other.section} has more than one routing in Period ${other.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });
        }

        /*
         * Same teacher
         */

        if (
          current.teacherName &&
          other.teacherName &&
          current.teacherName ===
          other.teacherName
        ) {
          map.set(current.id, {
            type: 'Teacher Conflict',
            message: `${current.teacherName} is assigned to multiple classes in Period ${current.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });

          map.set(other.id, {
            type: 'Teacher Conflict',
            message: `${other.teacherName} is assigned to multiple classes in Period ${other.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });
        }

        /*
         * Same room
         */

        if (
          current.room &&
          other.room &&
          current.room ===
          other.room
        ) {
          map.set(current.id, {
            type: 'Room Conflict',
            message: `${current.room} is assigned to multiple classes in Period ${current.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });

          map.set(other.id, {
            type: 'Room Conflict',
            message: `${other.room} is assigned to multiple classes in Period ${other.periodNumber}.`,
            relatedEntries: [
              current,
              other,
            ],
          });
        }
      }
    }

    return map;
  }, [entries]);

  /*
  |--------------------------------------------------------------------------
  | CURRENT DAY ENTRIES
  |--------------------------------------------------------------------------
  */

  const currentDayEntries =
    useMemo(() => {
      return entries.filter(
        (entry) =>
          entry.day ===
          selectedDay
      );
    }, [entries, selectedDay]);

  /*
  |--------------------------------------------------------------------------
  | CONFLICT COUNT
  |--------------------------------------------------------------------------
  */

  const currentDayConflictCount =
    useMemo(() => {
      let count = 0;

      currentDayEntries.forEach(
        (entry) => {
          if (
            conflictMap.has(
              entry.id
            )
          ) {
            count++;
          }
        }
      );

      return count;
    }, [
      currentDayEntries,
      conflictMap,
    ]);

  /*
  |--------------------------------------------------------------------------
  | TEACHER COUNT
  |--------------------------------------------------------------------------
  */

  const currentTeacherCount =
    useMemo(() => {
      return new Set(
        currentDayEntries
          .filter(
            (entry) =>
              !entry.isBreak &&
              entry.teacherName
          )
          .map(
            (entry) =>
              entry.teacherName
          )
      ).size;
    }, [currentDayEntries]);

  /*
  |--------------------------------------------------------------------------
  | ROOM COUNT
  |--------------------------------------------------------------------------
  */

  const currentRoomCount =
    useMemo(() => {
      return new Set(
        currentDayEntries
          .filter(
            (entry) =>
              !entry.isBreak &&
              entry.room
          )
          .map(
            (entry) =>
              entry.room
          )
      ).size;
    }, [currentDayEntries]);

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION
  |--------------------------------------------------------------------------
  */

  function showNotification(type: 'success' | 'error', message: string) {
  setNotification({ type, message });

  setTimeout(() => {
    setNotification(null);
  }, type === 'error' ? 7000 : 3500);
}

  /*
  |--------------------------------------------------------------------------
  | OPEN ADD MODAL
  |--------------------------------------------------------------------------
  */

  function openAddModal(
    className?: string,
    section?: string,
    periodNumber?: number
  ) {
    const period =
      getPeriodTime(
        periodNumber || 1
      );

    setEditingId(null);

    setForm({
      ...DEFAULT_FORM,
      day: selectedDay,
      className:
        className ||
        (selectedClass !==
          'All Classes'
          ? selectedClass
          : 'Class 1'),
      section:
        section ||
        (selectedSection !==
          'All Sections'
          ? selectedSection
          : 'A'),
      periodNumber:
        periodNumber || 1,
      startTime:
        period.startTime,
      endTime:
        period.endTime,
    });

    setShowModal(true);
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT MODAL
  |--------------------------------------------------------------------------
  */

  function openEditModal(
    entry: TimetableEntry
  ) {
    setEditingId(entry.id);

    setForm({
      day: entry.day,
      className: entry.className,
      section: entry.section,
      periodNumber:
        entry.periodNumber,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      teacherName:
        entry.teacherName,
      room: entry.room,
      isBreak:
        Boolean(entry.isBreak),
    });

    setShowModal(true);
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE
  |--------------------------------------------------------------------------
  */

  function validateForm() {
    if (!form.className) {
      return 'Please select class.';
    }

    if (!form.section) {
      return 'Please select section.';
    }

    if (!form.startTime) {
      return 'Please select start time.';
    }

    if (!form.endTime) {
      return 'Please select end time.';
    }

    if (
      form.startTime >=
      form.endTime
    ) {
      return 'End time must be after start time.';
    }

    /*
     * Class duplicate
     */

    const duplicateClass =
      entries.find((entry) => {
        if (
          editingId &&
          entry.id === editingId
        ) {
          return false;
        }

        return (
          entry.day === form.day &&
          entry.className ===
          form.className &&
          entry.section ===
          form.section &&
          entry.periodNumber ===
          form.periodNumber
        );
      });

    if (duplicateClass) {
      return `${form.className} - ${form.section} already has a timetable in Period ${form.periodNumber}.`;
    }

    if (form.isBreak) {
      return null;
    }

    if (!form.subject) {
      return 'Please select subject.';
    }

    if (!form.teacherName) {
      return 'Please select teacher.';
    }

    if (!form.room) {
      return 'Please select room.';
    }

    /*
     * Teacher conflict
     */

    const teacherConflict =
      entries.find((entry) => {
        if (
          editingId &&
          entry.id === editingId
        ) {
          return false;
        }

        return (
          entry.day === form.day &&
          entry.periodNumber ===
          form.periodNumber &&
          entry.teacherName ===
          form.teacherName
        );
      });

    if (teacherConflict) {
      return `${form.teacherName} is already assigned to ${teacherConflict.className} - ${teacherConflict.section} in Period ${form.periodNumber}.`;
    }

    /*
     * Room conflict
     */

    const roomConflict =
      entries.find((entry) => {
        if (
          editingId &&
          entry.id === editingId
        ) {
          return false;
        }

        return (
          entry.day === form.day &&
          entry.periodNumber ===
          form.periodNumber &&
          entry.room === form.room
        );
      });

    if (roomConflict) {
      return `${form.room} is already occupied by ${roomConflict.className} - ${roomConflict.section} in Period ${form.periodNumber}.`;
    }

    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  function saveEntry() {
    const error =
      validateForm();

    if (error) {
      showNotification(
        'error',
        error
      );
      return;
    }

    if (editingId) {
      setEntries(
        (previous) =>
          previous.map(
            (entry) =>
              entry.id ===
                editingId
                ? {
                  ...entry,
                  ...form,
                }
                : entry
          )
      );

      showNotification(
        'success',
        'Timetable updated successfully.'
      );
    } else {
      const newEntry: TimetableEntry =
      {
        id: createId(),
        ...form,
      };

      setEntries(
        (previous) => [
          ...previous,
          newEntry,
        ]
      );

      showNotification(
        'success',
        'Timetable routing added successfully.'
      );
    }

    setShowModal(false);
    setEditingId(null);
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  function deleteEntry(
    id: string
  ) {
    if (
      !window.confirm(
        'Are you sure you want to delete this routing?'
      )
    ) {
      return;
    }

    setEntries(
      (previous) =>
        previous.filter(
          (entry) =>
            entry.id !== id
        )
    );

    showNotification(
      'success',
      'Routing deleted successfully.'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | COPY DAY
  |--------------------------------------------------------------------------
  */

  function copyCurrentDay() {
    if (
      selectedDay ===
      copyTargetDay
    ) {
      showNotification(
        'error',
        'Source and target day cannot be same.'
      );

      return;
    }

    const sourceEntries =
      entries.filter(
        (entry) =>
          entry.day ===
          selectedDay
      );

    if (
      sourceEntries.length ===
      0
    ) {
      showNotification(
        'error',
        'No timetable found for this day.'
      );

      return;
    }

    if (
      !window.confirm(
        `Replace ${copyTargetDay} timetable with ${selectedDay} timetable?`
      )
    ) {
      return;
    }

    const remaining =
      entries.filter(
        (entry) =>
          entry.day !==
          copyTargetDay
      );

    const copied =
      sourceEntries.map(
        (entry) => ({
          ...entry,
          id: createId(),
          day: copyTargetDay,
        })
      );

    setEntries([
      ...remaining,
      ...copied,
    ]);

    showNotification(
      'success',
      `${selectedDay} timetable copied to ${copyTargetDay}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5 max-w-[1900px] mx-auto">

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (
        <div className="fixed right-5 top-5 z-[9999]">

          <div
            className={`min-w-[330px] max-w-[450px] bg-white border rounded-xl shadow-2xl p-4 flex gap-3 ${notification.type === 'success'
                ? 'border-emerald-200'
                : 'border-red-300'
              }`}
          >

            {notification.type ===
              'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            )}

            <div className="flex-1">

              <p className="text-xs font-bold text-slate-900">
                {notification.type ===
                  'success'
                  ? 'Success'
                  : 'Timetable Alert'}
              </p>

              <p className="text-[11px] text-slate-600 mt-1">
                {notification.message}
              </p>

            </div>

            <button
              onClick={() =>
                setNotification(null)
              }
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>

              <div>

                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Master School Timetable
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Complete class-wise daily routing with automatic conflict detection
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  openAddModal()
                }
                className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
                Add Period
              </button>

              <button
                onClick={() =>
                  setShowCopyModal(true)
                }
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-50"
              >
                <Copy className="w-4 h-4" />
                Copy Day
              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

            </div>

          </div>

        </div>

        {/* DAY TABS */}

        <div className="border-t border-slate-200 bg-slate-50 p-3 overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {DAYS.map((day) => {
              const active =
                selectedDay ===
                day;

              const dayEntries =
                entries.filter(
                  (entry) =>
                    entry.day ===
                    day
                );

              const dayConflicts =
                dayEntries.filter(
                  (entry) =>
                    conflictMap.has(
                      entry.id
                    )
                ).length;

              return (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDay(day)
                  }
                  className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${active
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                >

                  <CalendarDays className="w-3.5 h-3.5" />

                  {day}

                  {dayConflicts >
                    0 && (
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    )}

                </button>
              );
            })}

          </div>

        </div>

      </div>

      {/* =====================================================
          FILTER
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <SelectBox
            label="Class"
            value={selectedClass}
            options={[
              'All Classes',
              ...ALL_CLASSES,
            ]}
            onChange={
              setSelectedClass
            }
          />

          <SelectBox
            label="Section"
            value={selectedSection}
            options={[
              'All Sections',
              ...ALL_SECTIONS,
            ]}
            onChange={
              setSelectedSection
            }
          />

          <div>

            <label className="field-label">
              Search Class
            </label>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search class or section..."
              className="field-input"
            />

          </div>

          <div>

            <label className="field-label">
              Current Day
            </label>

            <div className="field-input flex items-center">
              <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span className="font-semibold">
                {selectedDay}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

        <SummaryCard
          icon={<GraduationCap />}
          title="Class Sections"
          value={
            visibleClassSections.length
          }
        />

        <SummaryCard
          icon={<BookOpen />}
          title="Today's Routings"
          value={
            currentDayEntries.length
          }
        />

        <SummaryCard
          icon={<Users />}
          title="Teachers"
          value={
            currentTeacherCount
          }
        />

        <SummaryCard
          icon={<DoorOpen />}
          title="Rooms Used"
          value={currentRoomCount}
        />

        <SummaryCard
          icon={<AlertTriangle />}
          title="Conflicts"
          value={
            currentDayConflictCount
          }
          danger={
            currentDayConflictCount >
            0
          }
        />

      </div>

      {/* =====================================================
          MASTER TABLE
      ====================================================== */}

      <div
        id="master-timetable"
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >

        {/* PRINT HEADER */}

        <div className="hidden print:block p-5 border-b border-slate-300">

          <h1 className="text-xl font-bold">
            School Master Timetable
          </h1>

          <p className="text-sm mt-1">
            {selectedDay}
          </p>

        </div>

        {/* TABLE HEADER */}

        <div className="px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              {selectedDay} — All Class Routing
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Every class and section is displayed together
            </p>

          </div>

          <div className="flex items-center gap-4 text-[10px]">

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-200" />
              Scheduled
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-200" />
              Break
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300" />
              Conflict
            </span>

          </div>

        </div>

        {/* =================================================
            HORIZONTAL MASTER TABLE
        ================================================== */}

        <div className="overflow-x-auto">

          <table className="border-collapse min-w-max w-full">

            <thead>

              <tr className="bg-slate-900 text-white">

                {/* TIME */}

                <th className="sticky left-0 z-30 bg-slate-900 w-[145px] min-w-[145px] px-3 py-3 text-left border-r border-white/10">

                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    School Time
                  </p>

                  <p className="text-xs font-bold mt-1">
                    Period
                  </p>

                </th>

                {/* EVERY CLASS */}

                {visibleClassSections.map(
                  (item) => (
                    <th
                      key={`${item.className}-${item.section}`}
                      className="w-[190px] min-w-[190px] px-3 py-3 text-center border-r border-white/10"
                    >

                      <div className="text-xs font-bold">
                        {item.className}
                      </div>

                      <div className="text-[9px] text-slate-300 mt-1">
                        Section{' '}
                        {item.section}
                      </div>

                    </th>
                  )
                )}

              </tr>

            </thead>

            <tbody>

              {PERIODS.map(
                (period) => (
                  <tr
                    key={
                      period.periodNumber
                    }
                    className="border-b border-slate-200"
                  >

                    {/* TIME */}

                    <td className="sticky left-0 z-20 bg-slate-50 border-r border-slate-200 px-3 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">

                          <span className="text-[10px] font-bold">
                            P
                            {
                              period.periodNumber
                            }
                          </span>

                        </div>

                        <div>

                          <p className="text-[10px] font-bold text-slate-700">
                            Period{' '}
                            {
                              period.periodNumber
                            }
                          </p>

                          <p className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">
                            {
                              period.startTime
                            }{' '}
                            →{' '}
                            {
                              period.endTime
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CLASS CELLS */}

                    {visibleClassSections.map(
                      (item) => {
                        const entry =
                          getEntry(
                            item.className,
                            item.section,
                            period.periodNumber
                          );

                        const conflict =
                          entry
                            ? conflictMap.get(
                              entry.id
                            )
                            : undefined;

                        return (
                          <td
                            key={`${item.className}-${item.section}-${period.periodNumber}`}
                            className="p-2 border-r border-slate-100 align-top"
                          >

                            {entry ? (
                              <TimetableCell
                                entry={entry}
                                conflict={
                                  Boolean(
                                    conflict
                                  )
                                }
                                conflictMessage={
                                  conflict?.message
                                }
                                onEdit={() =>
                                  openEditModal(
                                    entry
                                  )
                                }
                                onDelete={() =>
                                  deleteEntry(
                                    entry.id
                                  )
                                }
                                onConflict={() =>
                                  setConflictEntry(
                                    entry
                                  )
                                }
                              />
                            ) : (
                              <EmptyCell
                                onClick={() =>
                                  openAddModal(
                                    item.className,
                                    item.section,
                                    period.periodNumber
                                  )
                                }
                              />
                            )}

                          </td>
                        );
                      }
                    )}

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <p className="text-[10px] text-slate-500">
            Click an empty cell to add a period. Click an existing period to edit it.
          </p>

          <p className="text-[10px] font-semibold text-slate-600">
            {selectedDay} •{' '}
            {
              visibleClassSections.length
            } Class Sections
          </p>

        </div>

      </div>

      {/* =====================================================
          CONFLICT MODAL
      ====================================================== */}

      {conflictEntry && (
        <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            <div className="p-5 bg-red-50 border-b border-red-200 flex items-start justify-between">

              <div className="flex gap-3">

                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>

                <div>

                  <h3 className="text-sm font-bold text-red-900">
                    Timetable Conflict Detected
                  </h3>

                  <p className="text-[11px] text-red-700 mt-1">
                    Automatic conflict engine found an overlap.
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setConflictEntry(
                    null
                  )
                }
                className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>

            </div>

            <div className="p-5">

              {(() => {
                const conflict =
                  conflictMap.get(
                    conflictEntry.id
                  );

                return (
                  <>

                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">

                      <p className="text-xs font-bold text-red-900">
                        {conflict?.type ||
                          'Conflict'}
                      </p>

                      <p className="text-[11px] text-red-700 mt-1">
                        {conflict?.message ||
                          'A timetable overlap exists.'}
                      </p>

                    </div>

                    <div className="mt-4 space-y-2">

                      {conflict?.relatedEntries.map(
                        (entry) => (
                          <div
                            key={
                              entry.id
                            }
                            className="p-3 border border-slate-200 rounded-xl"
                          >

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="text-xs font-bold text-slate-900">
                                  {
                                    entry.className
                                  }{' '}
                                  -{' '}
                                  {
                                    entry.section
                                  }
                                </p>

                                <p className="text-[10px] text-slate-500 mt-1">
                                  {
                                    entry.subject
                                  }
                                </p>

                              </div>

                              <div className="text-right">

                                <p className="text-[10px] font-semibold text-slate-700">
                                  {
                                    entry.teacherName ||
                                    'No Teacher'
                                  }
                                </p>

                                <p className="text-[9px] text-slate-400 mt-1">
                                  {
                                    entry.room ||
                                    'No Room'
                                  }
                                </p>

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </>
                );
              })()}

            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end">

              <button
                onClick={() =>
                  setConflictEntry(
                    null
                  )
                }
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          COPY DAY MODAL
      ====================================================== */}

      {showCopyModal && (
        <div className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            <div className="p-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h3 className="text-sm font-bold text-slate-900">
                  Copy Complete Day
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Copy all classes and periods.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCopyModal(false)
                }
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

            </div>

            <div className="p-5 space-y-4">

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">

                <p className="text-[9px] uppercase font-bold text-slate-400">
                  Source
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {selectedDay}
                </p>

              </div>

              <SelectBox
                label="Copy To"
                value={copyTargetDay}
                options={DAYS.filter(
                  (day) =>
                    day !== selectedDay
                )}
                onChange={
                  setCopyTargetDay
                }
              />

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">

                <p className="text-[10px] text-amber-800">
                  Target day's existing timetable will be replaced.
                </p>

              </div>

            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowCopyModal(false)
                }
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  copyCurrentDay();
                  setShowCopyModal(
                    false
                  );
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Timetable
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[400] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

            <div className="sticky top-0 z-10 bg-white p-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h3 className="text-base font-bold text-slate-900">
                  {editingId
                    ? 'Edit Timetable'
                    : 'Add Timetable Period'}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Create class routing with teacher and room assignment.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="p-5 space-y-5">

              {/* CLASS */}

              <div>

                <p className="text-xs font-bold text-slate-800 mb-3">
                  Class Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <SelectBox
                    label="Day"
                    value={form.day}
                    options={DAYS}
                    onChange={(value) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          day: value,
                        })
                      )
                    }
                  />

                  <SelectBox
                    label="Class"
                    value={form.className}
                    options={
                      ALL_CLASSES
                    }
                    onChange={(value) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          className:
                            value,
                        })
                      )
                    }
                  />

                  <SelectBox
                    label="Section"
                    value={form.section}
                    options={
                      ALL_SECTIONS
                    }
                    onChange={(value) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          section:
                            value,
                        })
                      )
                    }
                  />

                </div>

              </div>

              {/* PERIOD */}

              <div>

                <p className="text-xs font-bold text-slate-800 mb-3">
                  Period Timing
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <SelectBox
                    label="Period"
                    value={String(
                      form.periodNumber
                    )}
                    options={Array.from(
                      {
                        length: 8,
                      },
                      (_, i) =>
                        String(
                          i + 1
                        )
                    )}
                    onChange={(value) => {
                      const number =
                        Number(
                          value
                        );

                      const period =
                        getPeriodTime(
                          number
                        );

                      setForm(
                        (previous) => ({
                          ...previous,
                          periodNumber:
                            number,
                          startTime:
                            period.startTime,
                          endTime:
                            period.endTime,
                        })
                      );
                    }}
                  />

                  <div>

                    <label className="field-label">
                      Starting Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.startTime
                      }
                      onChange={(e) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            startTime:
                              e.target
                                .value,
                          })
                        )
                      }
                      className="field-input"
                    />

                  </div>

                  <div>

                    <label className="field-label">
                      Ending Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.endTime
                      }
                      onChange={(e) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            endTime:
                              e.target
                                .value,
                          })
                        )
                      }
                      className="field-input"
                    />

                  </div>

                </div>

              </div>

              {/* BREAK */}

              <label className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">

                <input
                  type="checkbox"
                  checked={
                    form.isBreak
                  }
                  onChange={(e) =>
                    setForm(
                      (previous) => ({
                        ...previous,
                        isBreak:
                          e.target
                            .checked,
                      })
                    )
                  }
                  className="w-4 h-4"
                />

                <div>

                  <p className="text-xs font-bold text-amber-900">
                    This is a Break / Lunch
                  </p>

                  <p className="text-[10px] text-amber-700 mt-1">
                    Teacher and room are not required.
                  </p>

                </div>

              </label>

              {/* SUBJECT */}

              {!form.isBreak && (
                <div>

                  <p className="text-xs font-bold text-slate-800 mb-3">
                    Academic Assignment
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <SelectBox
                      label="Subject"
                      value={
                        form.subject
                      }
                      options={
                        SUBJECTS
                      }
                      onChange={(value) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            subject:
                              value,
                          })
                        )
                      }
                    />

                    <SelectBox
                      label="Teacher"
                      value={
                        form.teacherName
                      }
                      options={
                        TEACHERS
                      }
                      onChange={(value) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            teacherName:
                              value,
                          })
                        )
                      }
                    />

                    <SelectBox
                      label="Room"
                      value={
                        form.room
                      }
                      options={
                        ROOMS
                      }
                      onChange={(value) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            room: value,
                          })
                        )
                      }
                    />

                  </div>

                </div>
              )}

              {/* AUTO CHECK */}

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex gap-3">

                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />

                <div>

                  <p className="text-xs font-bold text-blue-900">
                    Automatic Conflict Checking
                  </p>

                  <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">
                    Before saving, the system checks class duplication, teacher overlap and room overlap for the same day and period.
                  </p>

                </div>

              </div>

            </div>

            <div className="sticky bottom-0 bg-white p-5 border-t border-slate-200 flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={saveEntry}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId
                  ? 'Update Timetable'
                  : 'Save Timetable'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| TIMETABLE CELL
|--------------------------------------------------------------------------
*/

interface TimetableCellProps {
  entry: TimetableEntry;
  conflict: boolean;
  conflictMessage?: string;
  onEdit: () => void;
  onDelete: () => void;
  onConflict: () => void;
}

const TimetableCell: React.FC<
  TimetableCellProps
> = ({
  entry,
  conflict,
  conflictMessage,
  onEdit,
  onDelete,
  onConflict,
}) => {
    /*
     * BREAK CELL
     */

    if (entry.isBreak) {
      return (
        <div className="min-h-[130px] rounded-xl bg-amber-50 border border-amber-200 p-3">

          <div className="flex items-center justify-between">

            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600">
              Break
            </span>

            <div className="flex gap-1">

              <SmallAction
                icon={<Edit3 />}
                onClick={onEdit}
              />

              <SmallAction
                icon={<Trash2 />}
                danger
                onClick={onDelete}
              />

            </div>

          </div>

          <div className="flex flex-col items-center justify-center min-h-[90px]">

            <Clock3 className="w-5 h-5 text-amber-500" />

            <p className="text-[11px] font-bold text-amber-900 mt-2">
              {entry.subject ||
                'Break'}
            </p>

            <p className="text-[9px] text-amber-700 mt-1">
              {entry.startTime} →{' '}
              {entry.endTime}
            </p>

          </div>

        </div>
      );
    }

    /*
     * NORMAL CELL
     */

    return (
      <div
        className={`relative min-h-[130px] rounded-xl p-3 ${conflict
            ? 'bg-red-50 border-2 border-red-300'
            : 'bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300'
          }`}
      >

        {/* CONFLICT ALERT */}

        {conflict && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConflict();
            }}
            title={
              conflictMessage ||
              'Timetable conflict detected'
            }
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </button>
        )}

        {/* SUBJECT */}

        <div
          className={`pr-8 text-[11px] font-bold ${conflict
              ? 'text-red-800'
              : 'text-slate-900'
            }`}
        >
          {entry.subject}
        </div>

        {/* TEACHER */}

        <div className="flex items-center gap-1.5 mt-4">

          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span className="text-[10px] font-semibold text-slate-700 truncate">
            {entry.teacherName}
          </span>

        </div>

        {/* ROOM */}

        <div className="flex items-center gap-1.5 mt-2">

          <DoorOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span className="text-[9px] text-slate-500 truncate">
            {entry.room}
          </span>

        </div>

        {/* TIME */}

        <div className="mt-3 pt-2 border-t border-slate-200">

          <div className="flex items-center gap-1">

            <Clock3 className="w-3 h-3 text-slate-400" />

            <span className="text-[9px] text-slate-500">
              {entry.startTime} →{' '}
              {entry.endTime}
            </span>

          </div>

        </div>

        {/* CONFLICT TEXT */}

        {conflict && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConflict();
            }}
            className="mt-2 text-[8px] font-bold text-red-600 hover:underline"
          >
            Conflict detected — view details
          </button>
        )}

        {/* ACTIONS */}

        <div className="absolute bottom-2 right-2 flex gap-1">

          <SmallAction
            icon={<Edit3 />}
            onClick={onEdit}
          />

          <SmallAction
            icon={<Trash2 />}
            danger
            onClick={onDelete}
          />

        </div>

      </div>
    );
  };

/*
|--------------------------------------------------------------------------
| EMPTY CELL
|--------------------------------------------------------------------------
*/

interface EmptyCellProps {
  onClick: () => void;
}

const EmptyCell: React.FC<
  EmptyCellProps
> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full min-h-[130px] rounded-xl border border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex flex-col items-center justify-center group"
    >

      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-white">

        <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />

      </div>

      <span className="text-[9px] text-slate-400 group-hover:text-slate-700 font-semibold mt-2">
        Add Period
      </span>

    </button>
  );
};

/*
|--------------------------------------------------------------------------
| SMALL ACTION
|--------------------------------------------------------------------------
*/

interface SmallActionProps {
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

const SmallAction: React.FC<
  SmallActionProps
> = ({
  icon,
  onClick,
  danger,
}) => {
    return (
      <button
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        className={`w-6 h-6 rounded-md flex items-center justify-center ${danger
            ? 'text-red-400 hover:bg-red-100 hover:text-red-600'
            : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
          }`}
      >
        {React.cloneElement(
          icon as React.ReactElement,
          {
            className:
              'w-3 h-3',
          }
        )}
      </button>
    );
  };

/*
|--------------------------------------------------------------------------
| SELECT BOX
|--------------------------------------------------------------------------
*/

interface SelectBoxProps {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}

const SelectBox: React.FC<
  SelectBoxProps
> = ({
  label,
  value,
  options,
  onChange,
}) => {
    return (
      <div>

        <label className="field-label">
          {label}
        </label>

        <div className="relative">

          <select
            value={value}
            onChange={(e) =>
              onChange(
                e.target.value
              )
            }
            className="field-input appearance-none pr-8"
          >
            {options.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />

        </div>

      </div>
    );
  };

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  danger?: boolean;
}

const SummaryCard: React.FC<
  SummaryCardProps
> = ({
  icon,
  title,
  value,
  danger,
}) => {
    return (
      <div
        className={`bg-white border rounded-xl p-4 ${danger && value > 0
            ? 'border-red-200 bg-red-50/30'
            : 'border-slate-200'
          }`}
      >

        <div className="flex items-center justify-between">

          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger && value > 0
                ? 'bg-red-100 text-red-600'
                : 'bg-slate-100 text-slate-600'
              }`}
          >
            {React.cloneElement(
              icon as React.ReactElement,
              {
                className:
                  'w-4 h-4',
              }
            )}
          </div>

          <span
            className={`text-xl font-bold ${danger && value > 0
                ? 'text-red-600'
                : 'text-slate-900'
              }`}
          >
            {value}
          </span>

        </div>

        <p className="text-[10px] text-slate-500 mt-3">
          {title}
        </p>

      </div>
    );
  };

export default TimetableModule;
import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Banknote,
  Library,
  Bus,
  Bell,
  Award,
  Settings,
  ShieldCheck,
  QrCode,
  X
} from 'lucide-react';

export type ManagementModule =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'timetable'
  | 'exams'
  | 'fees'
  | 'payroll'
  | 'library'
  | 'transport'
  | 'notices'
  | 'events'
  | 'id-cards'
  | 'certificates'
  | 'settings'
  | 'audit-logs';

interface ManagementSidebarProps {
  activeModule: ManagementModule;
  setActiveModule: React.Dispatch<React.SetStateAction<ManagementModule>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ManagementSidebar: React.FC<ManagementSidebarProps> = ({
  activeModule,
  setActiveModule,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const navItems: {
    id: ManagementModule;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dashboard',
      label: 'Operations Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'students',
      label: 'Student Management',
      icon: GraduationCap
    },
    {
      id: 'teachers',
      label: 'Faculty & Staff',
      icon: Users
    },
    {
      id: 'classes',
      label: 'Classes & Structure',
      icon: BookOpen
    },
    {
      id: 'timetable',
      label: 'Master Timetable',
      icon: Clock
    },
    {
      id: 'exams',
      label: 'Exams & Question Papers',
      icon: FileText
    },
    {
      id: 'fees',
      label: 'Fee Accounts & Dues',
      icon: CreditCard
    },
    {
      id: 'payroll',
      label: 'Staff Payroll & Slips',
      icon: Banknote
    },
    {
      id: 'library',
      label: 'Central Library',
      icon: Library
    },
    {
      id: 'transport',
      label: 'Transport & Fleet',
      icon: Bus
    },
    {
      id: 'notices',
      label: 'Notices & Circulars',
      icon: Bell
    },
    {
      id: 'events',
      label: 'School Calendar',
      icon: Calendar
    },
    {
      id: 'id-cards',
      label: 'ID Card Studio',
      icon: QrCode
    },
    {
      id: 'certificates',
      label: 'Certificates & TC',
      icon: Award
    },
    {
      id: 'settings',
      label: 'School Settings',
      icon: Settings
    },
    {
      id: 'audit-logs',
      label: 'Security Audit Logs',
      icon: ShieldCheck
    }
  ];

  return (
    <aside
      className={`
        fixed md:static
        inset-y-0 left-0
        z-50
        w-72 md:w-64
        h-full
        bg-slate-950
        text-slate-300
        p-4
        shrink-0
        border-r border-slate-800

        transform
        transition-transform
        duration-300
        ease-in-out

        overflow-y-auto

        ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }
      `}
    >
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-between items-center pb-3 mb-2 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Navigation Menu
        </span>

        <button
          onClick={() => setMobileMenuOpen(false)}
          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2
                rounded-xl
                text-xs
                font-semibold
                transition
                cursor-pointer

                ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />

              <span className="truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
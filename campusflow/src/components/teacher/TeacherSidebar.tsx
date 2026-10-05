import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Users,
  FileSpreadsheet,
  Menu,
  X,
} from 'lucide-react';
import { TeacherTab } from './TeacherPortal';

interface Props {
  activeTab: TeacherTab;
  setActiveTab: React.Dispatch<React.SetStateAction<TeacherTab>>;
}

const tabs: Array<{
  id: TeacherTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Faculty Dashboard', icon: BookOpen },
  { id: 'attendance', label: 'Attendance (10-A)', icon: Users },
  { id: 'homework', label: 'Homework & Review', icon: FileText },
  {
    id: 'question-papers',
    label: 'Question Paper Creator',
    icon: FileSpreadsheet,
  },
  { id: 'marks', label: 'Exam Marks Entry', icon: BookOpen },
  { id: 'timetable', label: 'Teaching Schedule', icon: Clock },
  { id: 'leave', label: 'Leave Applications', icon: Calendar },
];

export const TeacherSidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: TeacherTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:block w-64 shrink-0 bg-slate-950 border-r border-slate-800 text-white min-h-full">
        <div className="p-4 border-b border-slate-800">
          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
            Faculty Workspace
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Academic control panel
          </p>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${
                  active
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />

                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 pt-4">
          <p className="text-[10px] text-slate-600">
            Use the top-level tabs on smaller screens.
          </p>
        </div>
      </aside>

      {/* ================= MOBILE / TABLET ================= */}
      <div className="lg:hidden w-full bg-slate-950 border-b border-slate-800 text-white">
        {/* Hamburger Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
              Faculty Workspace
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Academic control panel
            </p>
          </div>

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 transition"
            aria-label="Toggle teacher menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950">
            <nav className="p-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-left transition ${
                      active
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />

                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </>
  );
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolSettings, UserRole } from '../../types/school';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Building2,
  ArrowLeft,
  Lock,
  UserCheck,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  onBackToWebsite: () => void;
  onLoginSuccess: (role: UserRole) => void;
  initialRole?: UserRole | null;
}

export const LoginPage: React.FC<Props> = ({
  settings,
  onBackToWebsite,
  onLoginSuccess,
  initialRole = null
}) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When role changes, prefill demo ID
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setIdentifier('STU-2026-1042');
      setPassword('student123');
    } else if (role === 'teacher') {
      setIdentifier('EMP-T-108');
      setPassword('teacher123');
    } else if (role === 'management') {
      setIdentifier('admin@riversidepublic.edu.in');
      setPassword('admin123');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setErrorMsg('Please select your account role first');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = login(selectedRole, identifier, password);
      setIsLoading(false);
      if (success) {
        onLoginSuccess(selectedRole);
      } else {
        setErrorMsg('Invalid credentials. You may use the one-click demo credentials below.');
      }
    }, 400);
  };

  const handleQuickDemo = (role: UserRole) => {
    handleSelectRole(role);
    setIsLoading(true);
    setTimeout(() => {
      login(role, role === 'student' ? 'STU-2026-1042' : role === 'teacher' ? 'EMP-T-108' : 'admin@riversidepublic.edu.in', 'demo');
      setIsLoading(false);
      onLoginSuccess(role);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl border border-slate-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: School Heritage, Imagery & Welcome message */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background image overlay */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&auto=format&fit=crop&q=80')"
            }}
          ></div>
          <div className="absolute inset-0 bg-radial from-slate-900/60 to-slate-950/90 pointer-events-none"></div>

          {/* Top: School Brand */}
          <div className="relative z-10">
            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to School Website
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-serif font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
                R
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-white tracking-tight">
                  {settings.schoolName}
                </h1>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  {settings.motto}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official Operations Gateway
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white leading-snug">
                Welcome to CAMPUSFLOW Portal
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                A unified, authenticated operations platform for scholars, academic faculty, and school administration. Please identify your designated role to proceed.
              </p>
            </div>
          </div>

          {/* Bottom: Institutional Notice */}
          <div className="relative z-10 pt-8 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure 256-bit Institutional Encryption
            </p>
            <p>
              CBSE Affiliation No: {settings.affiliation.split('(')[1]?.replace(')', '') || '2130842'}
            </p>
            <p className="text-slate-500">
              For account access assistance, contact the RPS IT Department.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Role Cards & Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif text-slate-950 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your account role to continue into your dedicated workspace.
              </p>
            </div>

            {/* THREE LARGE ROLE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* CARD 1: Student */}
              <button
                type="button"
                onClick={() => handleSelectRole('student')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'student'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    selectedRole === 'student' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">Student</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-3">
                    Access your classes, timetable, attendance, homework and results.
                  </p>
                </div>
                <span className={`text-[10px] font-bold mt-3 block ${
                  selectedRole === 'student' ? 'text-amber-800' : 'text-slate-400'
                }`}>
                  {selectedRole === 'student' ? '✓ Selected' : 'Student Login →'}
                </span>
              </button>

              {/* CARD 2: Teacher */}
              <button
                type="button"
                onClick={() => handleSelectRole('teacher')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'teacher'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    selectedRole === 'teacher' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">Teacher</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-3">
                    Manage classes, attendance, homework, exams and student performance.
                  </p>
                </div>
                <span className={`text-[10px] font-bold mt-3 block ${
                  selectedRole === 'teacher' ? 'text-amber-800' : 'text-slate-400'
                }`}>
                  {selectedRole === 'teacher' ? '✓ Selected' : 'Teacher Login →'}
                </span>
              </button>

              {/* CARD 3: School Management */}
              <button
                type="button"
                onClick={() => handleSelectRole('management')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'management'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    selectedRole === 'management' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">School Management</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-3">
                    Manage students, teachers, fees, exams, timetable and the entire school.
                  </p>
                </div>
                <span className={`text-[10px] font-bold mt-3 block ${
                  selectedRole === 'management' ? 'text-amber-800' : 'text-slate-400'
                }`}>
                  {selectedRole === 'management' ? '✓ Selected' : 'Management Login →'}
                </span>
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedRole === 'student'
                    ? 'Student ID / Admission Number / Email'
                    : selectedRole === 'teacher'
                    ? 'Faculty Employee ID / Official Email'
                    : 'Administrator Email'}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'STU-2026-1042 or Aarav'
                        : selectedRole === 'teacher'
                        ? 'EMP-T-108 or Vikram'
                        : 'admin@riversidepublic.edu.in'
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account security key"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Remember my credentials</span>
                </label>
                <span className="text-[11px] text-slate-400">Session expires in 30 days</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {selectedRole ? `Enter ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard` : 'Login to Portal'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Switcher Strip for effortless evaluation */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant Demo Access:
              </span>
              <span className="text-[10px] text-slate-400">Click to test each role instantly</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="p-2 bg-slate-100 hover:bg-amber-100/70 border border-slate-200 rounded-lg text-left transition"
              >
                <span className="block font-bold text-slate-800 text-[11px]">Aarav Sharma</span>
                <span className="text-[10px] text-slate-500">Student (10-A)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="p-2 bg-slate-100 hover:bg-amber-100/70 border border-slate-200 rounded-lg text-left transition"
              >
                <span className="block font-bold text-slate-800 text-[11px]">Mr. V. Malhotra</span>
                <span className="text-[10px] text-slate-500">Teacher (Physics)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('management')}
                className="p-2 bg-slate-100 hover:bg-amber-100/70 border border-slate-200 rounded-lg text-left transition"
              >
                <span className="block font-bold text-slate-800 text-[11px]">Dr. A. Sharma</span>
                <span className="text-[10px] text-slate-500">Management (Principal)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

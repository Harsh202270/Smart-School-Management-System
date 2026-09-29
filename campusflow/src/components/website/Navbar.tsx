/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolSettings } from '../../types/school';
import { LogIn, Menu, X, Phone, Mail, Award, BookOpen, Clock } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<Props> = ({ settings, activeSection, onNavigate, onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'notices', label: 'Notice Board' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Campus Life' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Info Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Award className="w-3.5 h-3.5" /> CBSE Affiliated (School Code: {settings.schoolCode})
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5" /> {settings.phone}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5" /> {settings.email}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> School Hours: 07:45 AM - 02:15 PM
            </span>
            <span className="text-amber-400 font-semibold">
              Academic Session {settings.academicYear}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 h-20 min-w-0">
        {/* School Logo & Title */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-serif font-black text-xl sm:text-2xl shadow-sm transition group-hover:scale-105 shrink-0">
            H
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl lg:text-2xl font-black font-serif tracking-tight text-slate-950 group-hover:text-amber-800 transition leading-tight truncate">
                {settings.schoolName}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
              {settings.motto} • Estd. {settings.establishedYear}
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3.5 py-2 text-xs font-semibold tracking-wide rounded-md transition ${
                activeSection === item.id
                  ? 'text-amber-900 bg-amber-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Login CTA & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenLogin}
            className="hidden sm:flex items-center gap-2 px-3 lg:px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-semibold text-[10px] lg:text-xs tracking-wider uppercase rounded-lg shadow-sm border border-amber-500/30 transition transform hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>School Portal Login</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-slate-950 text-amber-400 border border-amber-500/30"
            aria-label="Open school portal login"
          >
            <LogIn className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-md transition ${
                activeSection === item.id
                  ? 'text-amber-900 bg-amber-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 bg-slate-900 text-amber-400 font-bold text-center text-sm rounded-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> School Portal Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

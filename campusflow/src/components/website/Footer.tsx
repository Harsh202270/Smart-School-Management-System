/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolSettings } from '../../types/school';
import { Award, Lock, ArrowUp } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  onNavigate: (section: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate, onOpenLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Crest */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-serif font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
                R
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                  {settings.schoolName}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  {settings.motto} • Estd. {settings.establishedYear}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An institution dedicated to academic distinction, scientific inquiry, moral fortitude, and holistic youth empowerment. Recognized under the Delhi Education Act and affiliated with the Central Board of Secondary Education.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.affiliation} • School Code: {settings.schoolCode}</span>
            </div>
          </div>

          {/* Quick Academic Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif">
              Academics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-amber-400 transition">
                  Primary Wing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-amber-400 transition">
                  Middle Wing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-amber-400 transition">
                  Secondary (IX & X)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-amber-400 transition">
                  Senior Secondary (XI & XII)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('facilities')} className="hover:text-amber-400 transition">
                  Laboratories & STEM
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Resources */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif">
              Campus Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('notices')} className="hover:text-amber-400 transition">
                  Notice Board
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-amber-400 transition">
                  Annual Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-amber-400 transition">
                  Campus Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('facilities')} className="hover:text-amber-400 transition">
                  Sports Complex
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition">
                  Admissions Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Operations & Portal */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif">
              Digital Operations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized students, teachers, and school administration can access internal academic records, attendance, timetables, and fee consoles.
            </p>

            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" /> Portal Login
            </button>

            <p className="text-[10px] text-slate-500 text-center">
              Powered by CAMPUSFLOW • Digital School Operations Platform
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.schoolName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>CBSE School Code: {settings.schoolCode}</span>
            <span>U-DISE No: 07090301412</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              Back to Top <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

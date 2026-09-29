/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolSettings } from '../../types/school';
import { ArrowRight, BookOpen, Sparkles, GraduationCap, Award, Users, CheckCircle } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  onNavigate: (section: string) => void;
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<Props> = ({ settings, onNavigate, onOpenLogin }) => {
  return (
    <section className="relative overflow-hidden bg-radial from-amber-50/50 via-slate-50 to-white py-12 lg:py-20 border-b border-slate-200">
      {/* Subtle school notebook paper background grid lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f2b48_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small handwritten-style accent & session badge */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Session {settings.academicYear} Admissions Open
              </span>
              <span className="text-[10px] sm:text-xs font-serif italic text-slate-500 underline decoration-amber-400">
                27+ Years of Academic Integrity
              </span>
            </div>

            {/* School Hero Heading */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-slate-950 tracking-tight leading-[1.05] sm:leading-[1.12]">
                Learning Today. <br />
                <span className="text-slate-800 underline decoration-amber-500 decoration-wavy decoration-3 underline-offset-8">
                  Building Tomorrow.
                </span>
              </h2>
              <p className="text-base sm:text-xl text-slate-600 font-sans max-w-xl pt-3 leading-relaxed">
                A place where curiosity, discipline, and moral purpose come together to shape future-ready scholars and responsible global citizens.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onNavigate('academics')}
                className="px-4 sm:px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition flex items-center gap-2 group"
              >
                <span>Explore Our School</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenLogin}
                className="px-4 sm:px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center gap-2 border border-amber-600/30"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            </div>

            {/* Small Principal Quote snippet on Left */}
            <div className="pt-4 border-t border-slate-200/80 max-w-lg">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <img
                    src="https://i.ibb.co/VYCpX7xg/upload.jpg"
                    alt={settings.principalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-700 italic font-serif leading-snug">
                    "Every child has a unique spark. Our duty is to provide the warmth, guidance, and rigor to let it flourish."
                  </p>
                  <p className="text-[11px] font-bold text-slate-900 mt-1">
                    — {settings.principalName}, <span className="font-normal text-slate-500">{settings.principalDesignation}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unique Handcrafted Multi-layered Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main photograph */}
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                  alt="Riverside Campus Main Building"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold">
                    Campus Heritage
                  </span>
                  <p className="text-sm font-semibold mt-1">Riverside Academic Central Wing & Botanical Quadrangle</p>
                </div>
              </div>

              {/* Floating Top Card: Academic Year Badge */}
              <div className="relative sm:absolute sm:-top-4 sm:-right-4 mt-4 sm:mt-0 bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3 max-w-[220px]">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Ranked #1 in Zone</p>
                  <p className="text-[10px] text-slate-500">Holistic Academic Excellence</p>
                </div>
              </div>

              {/* Floating Bottom Card: Real-time Stats Card */}
              <div className="relative sm:absolute sm:-bottom-6 sm:-left-6 mt-4 sm:mt-0 bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 flex items-center gap-4 max-w-[240px]">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-amber-400">98.6%</span>
                    <span className="text-[11px] text-slate-300">Board Pass</span>
                  </div>
                  <p className="text-[10px] text-slate-400">100% University Transition Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Statistics Strip (Human-crafted numbers) */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-3xl font-black text-slate-900 font-serif">1,450+</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">Active Students</span>
              <span className="text-[11px] text-slate-400">Nursery to Grade XII</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-3xl font-black text-slate-900 font-serif">88+</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">Expert Faculty</span>
              <span className="text-[11px] text-slate-400">1:16 Teacher-Student Ratio</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-3xl font-black text-slate-900 font-serif">27+</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">Years of Learning</span>
              <span className="text-[11px] text-slate-400">Founded in 1999</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-3xl font-black text-slate-900 font-serif">32+</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1 block">Specialized Labs</span>
              <span className="text-[11px] text-slate-400">Robotics, STEM & Arts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

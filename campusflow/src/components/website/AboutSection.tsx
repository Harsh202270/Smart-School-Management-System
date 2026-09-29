/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolSettings } from '../../types/school';
import { Compass, Target, HeartHandshake, Award } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
}

export const AboutSection: React.FC<Props> = ({ settings }) => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            About Our Institution
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            A Legacy of Purposeful Education
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Founded with a commitment to democratize progressive, values-based pedagogy, Riverside Public School blends academic rigor with moral consciousness.
          </p>
        </div>

        {/* History & Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Our Heritage</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Established in 1999 under the aegis of the Riverside Educational Society, our campus has evolved from a humble primary school to a premier K-12 institution nurturing thousands of accomplished alumni worldwide.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Our Mission</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              To cultivate inquisitive minds, compassionate hearts, and courageous leaders who utilize their intellectual and creative capabilities to address contemporary societal challenges.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Core Values</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Discipline, Integrity, Intellectual Humility, Empathy, and Environmental Stewardship form the moral bedrock of every classroom interaction and campus tradition.
            </p>
          </div>
        </div>

        {/* Principal's Message Section */}
        <div className="bg-radial from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Principal Photo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-48 h-56 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl relative bg-slate-800">
                <img
                  src="https://i.ibb.co/VYCpX7xg/upload.jpg"
                  alt={settings.principalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-amber-400 font-serif">{settings.principalName}</h4>
                <p className="text-xs text-slate-300 font-medium">M.Sc., M.Ed., Ph.D. in Education Leadership</p>
                <p className="text-[11px] text-amber-400/80 tracking-wider uppercase mt-1">22+ Years in Academic Administration</p>
              </div>
            </div>

            {/* Principal Message Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
                Message From The Principal
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight leading-snug">
                "We don't merely prepare children for examinations; we prepare them for the journey of life."
              </h3>

              <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  Dear Parents, Students, and Well-Wishers,
                </p>
                <p>
                  {settings.principalMessage}
                </p>
                <p>
                  In an era marked by rapid technological transformations, the fundamental role of education remains timeless: to anchor students in ethical clarity, encourage deep critical thinking, and inspire a habit of life-long inquiry. Our faculty members work tirelessly to ensure that our campus remains an inclusive, vibrant sanctum of discovery.
                </p>
                <p>
                  I invite you to explore our vibrant academic offerings, witness our students' creative triumphs, and partner with us in this noble mission of nation-building.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-serif italic text-2xl text-amber-400 font-semibold block">
                    Harsh Vardhan
                  </span>
                  <span className="text-xs text-slate-400">Dr. Harsh Vardhan, Principal</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider">{settings.schoolName}</span>
                  <span className="text-xs text-amber-400 font-semibold">{settings.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

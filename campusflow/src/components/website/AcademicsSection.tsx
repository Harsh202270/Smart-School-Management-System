/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, Microscope, Palette, Binary, Globe2 } from 'lucide-react';

export const AcademicsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'foundational' | 'primary' | 'middle' | 'secondary' | 'senior'>('foundational');

  const wings = [
    {
      id: 'foundational',
      title: 'Foundational Wing (Early Childhood)',
      subtitle: 'Nursery, LKG & UKG (Ages 3 - 5)',
      description: 'Play-based, child-centric early education cultivating emotional security, sensory perception, foundational phonics, and joy of discovery.',
      highlights: [
        'Montessori-inspired activity & sensory play corners',
        'Early phonics, listening skills & storytelling circles',
        'Kinesthetic motor skills, art, clay modeling & rhythm',
        'Safe, nurturing environment with specialized early educators'
      ],
      subjects: ['Phonics & Pre-Reading', 'Early Numeracy & Shapes', 'Rhymes & Expressive Speech', 'Art & Craft', 'Music & Movement']
    },
    {
      id: 'primary',
      title: 'Primary Wing',
      subtitle: 'Grades 1 to 5 (Ages 6 - 10)',
      description: 'Foundational literacy, numeracy, experiential exploration, and artistic discovery through joyful learning frameworks.',
      highlights: ['Activity-based thematic inquiry', 'Daily phonics & multilingual reading lab', 'Foundational mathematics & mental agility', 'Clay modeling, music & kinesthetic play'],
      subjects: ['English', 'Hindi / Regional', 'Mathematics', 'Environmental Studies (EVS)', 'Computer Literacy', 'Art & Craft']
    },
    {
      id: 'middle',
      title: 'Middle Wing',
      subtitle: 'Grades VI to VIII (Ages 11 - 13)',
      description: 'Transition from general concepts to structured academic disciplines, laboratory observation, and analytical debate.',
      highlights: ['Specialized Physics, Chem & Bio laboratories', 'Third language options: Sanskrit, French, German', 'Introduction to robotics & computational logic', 'Inter-house debating & environmental clubs'],
      subjects: ['English', 'Mathematics', 'General Science', 'Social Sciences (Hist, Civ, Geo)', 'Third Language', 'Coding & Robotics']
    },
    {
      id: 'secondary',
      title: 'Secondary Wing',
      subtitle: 'Grades IX & X (Ages 14 - 15)',
      description: 'Rigorous preparation for CBSE All India Secondary School Examination (AISSE) alongside comprehensive character development.',
      highlights: ['Comprehensive board exam syllabus mastery', 'Pre-board diagnostic test cycles & remedial mentoring', 'Scientific project exhibitions & Olympiad training', 'Career counseling & aptitude assessment'],
      subjects: ['English Language & Literature', 'Mathematics (Standard / Basic)', 'Integrated Science', 'Social Science', 'Information Technology', 'Second Language']
    },
    {
      id: 'senior',
      title: 'Senior Secondary',
      subtitle: 'Grades XI & XII (Ages 16 - 17)',
      description: 'Specialized stream-based academic immersion preparing scholars for competitive entrance exams (JEE, NEET, CUET, CLAT) and premier universities.',
      highlights: ['Science Stream (PCM / PCB with AI / Informatics)', 'Commerce Stream (Accountancy, Business Studies, Economics)', 'Humanities (History, Pol Science, Psychology, Sociology)', 'Dedicated university application & career portfolio cell'],
      subjects: ['Physics / Accounts / History', 'Chemistry / Business / Pol Sci', 'Maths / Biology / Economics', 'English Core', 'Computer Science / Informatics']
    }
  ];

  const currentWing = wings.find(w => w.id === activeTab)!;

  return (
    <section id="academics" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300">
            Curriculum & Pedagogy
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            Academic Excellence Across Wings
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            A progressive, CBSE-aligned academic pathway designed to foster deep conceptual clarity and lifelong scholarly curiosity.
          </p>
        </div>

        {/* Wing Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {wings.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveTab(w.id as any)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition border ${
                activeTab === w.id
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        {/* Selected Wing Detail Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-700 font-mono uppercase tracking-wider">
                  {currentWing.subtitle}
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                  {currentWing.title} Pedagogy
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {currentWing.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Pedagogical Highlights:
                </h4>
                <ul className="space-y-2">
                  {currentWing.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" /> Core Subjects & Electives
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {currentWing.subjects.map((sub, sIdx) => (
                  <div key={sIdx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>CBSE Board Alignment:</strong> Continuous and Comprehensive Evaluation (CCE) with periodic assessments, subject enrichment activities, and laboratory practicums.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Microscope, Monitor, BookOpen, Trophy, Bus, Music, Sparkles } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: 'Smart Interactive Classrooms',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      description: 'Ergonomically designed classrooms equipped with interactive 75-inch smart panels, dual audio systems, and high-speed campus fiber.'
    },
    {
      title: 'Advanced Science Laboratories',
      icon: Microscope,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      description: 'Dedicated high-spec Physics, Chemistry, and Biology laboratories compliant with national safety standards and research kits.'
    },
    {
      title: 'Robotics & Atal Tinkering Lab',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      description: 'Government-supported innovation workspace with 3D printers, Arduino & Raspberry Pi stations, sensors, and drone design modules.'
    },
    {
      title: 'Central Digitized Library',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
      description: 'Over 28,000 physical volumes, reference encyclopedias, international periodicals, and high-speed digital research terminals.'
    },
    {
      title: 'Olympic Sports & Athletics Complex',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
      description: 'Full-length 400m synthetic running track, all-weather basketball court, indoor badminton arena, and semi-Olympic swimming pool.'
    },
    {
      title: 'Safe Fleet Transportation',
      icon: Bus,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      description: 'Modern fleet of 24 school buses with real-time GPS tracking, speed governors, CCTV surveillance, and trained female attendants.'
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            World-Class Campus Facilities
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Thoughtfully planned physical and digital environments that stimulate learning, physical vitality, and artistic expression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="h-48 overflow-hidden relative bg-slate-800">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-slate-950/80 backdrop-blur text-amber-400 flex items-center justify-center border border-white/20">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

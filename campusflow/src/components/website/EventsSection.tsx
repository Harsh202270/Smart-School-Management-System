/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolEvent } from '../../types/school';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface Props {
  events: SchoolEvent[];
}

export const EventsSection: React.FC<Props> = ({ events }) => {
  return (
    <section id="events" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            School Calendar
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            Upcoming Events & Celebrations
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            From athletic championships to inter-school symposiums, discover the rich tapestry of campus life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300/50">
                    {evt.category}
                  </span>
                  <span className="font-mono text-slate-500 font-medium">
                    {evt.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-2">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{evt.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{evt.coordinator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

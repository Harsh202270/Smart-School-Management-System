/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Notice } from '../../types/school';
import { Bell, Calendar, ArrowRight, Eye, AlertCircle, FileText, Search } from 'lucide-react';

interface Props {
  notices: Notice[];
}

export const NoticeBoardSection: React.FC<Props> = ({ notices }) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Examination', 'Academic', 'Sports', 'Admission'];

  const filteredNotices = notices.filter(n => {
    const matchesCat = filter === 'All' || n.category === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                          n.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="notices" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300">
              Campus Communications
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight flex items-center gap-3">
              Official Notice Board <Bell className="w-6 h-6 text-amber-600 animate-bounce" />
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Stay informed with verified academic circulars, examination schedules, and institutional announcements.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === cat
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white hover:shadow-md flex flex-col justify-between ${
                notice.isImportant
                  ? 'border-l-4 border-l-amber-500 border-slate-200'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {notice.category}
                    </span>
                    {notice.isImportant && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Priority Circular
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> {notice.date}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 hover:text-amber-800 transition line-clamp-2">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium text-[11px] truncate max-w-[200px]">
                  Issued by: {notice.issuedBy}
                </span>
                <span className="text-amber-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Read Circular <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {selectedNotice.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Ref: {selectedNotice.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 font-serif leading-snug">
                    {selectedNotice.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-6 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                <p>{selectedNotice.content}</p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mt-4">
                  <strong>Intended Audience:</strong> {selectedNotice.targetAudience} • <strong>Published Date:</strong> {selectedNotice.date}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">
                  {selectedNotice.issuedBy}
                </span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg text-xs hover:bg-slate-800 transition"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

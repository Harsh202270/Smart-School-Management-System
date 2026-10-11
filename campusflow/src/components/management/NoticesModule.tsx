import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Notice } from '../../types/school';
import { storage } from '../../services/storageService';

export const NoticesModule: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(storage.getNotices());

  // New Notice state
  const [showAddNotice, setShowAddNotice] = useState(false);

  const [newNoticeData, setNewNoticeData] = useState({
    title: '',
    category: 'Academic' as const,
    targetAudience: 'All' as const,
    content: '',
    isImportant: false
  });

  // Keep notices updated whenever storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(
      'campusflow_notices',
      () => {
        setNotices(storage.getNotices());
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Publish Notice
  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();

    storage.addNotice({
      ...newNoticeData,
      date: new Date().toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Dr. Ananya Sharma (Principal)'
    });

    setNotices(storage.getNotices());

    setShowAddNotice(false);

    setNewNoticeData({
      title: '',
      category: 'Academic',
      targetAudience: 'All',
      content: '',
      isImportant: false
    });
  };

  return (
    <>
      {/* NOTICES MODULE */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Official Notice Board & Circular Broadcasts
            </h2>

            <p className="text-xs text-slate-500">
              Targeted circulars for Students, Parents, or All Faculty
            </p>
          </div>

          <button
            onClick={() => setShowAddNotice(true)}
            className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Publish New Notice
          </button>
        </div>

        {/* Notice List */}
        <div className="space-y-4">

          {notices.map((n) => (
            <div
              key={n.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2"
            >

              {/* Notice Meta */}
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-2">

                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                    {n.category}
                  </span>

                  <span className="text-slate-500 font-mono">
                    Date: {n.date}
                  </span>

                </div>

                <span className="text-slate-400">
                  Target: {n.targetAudience}
                </span>

              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900">
                {n.title}
              </h4>

              {/* Content */}
              <p className="text-slate-700 leading-relaxed">
                {n.content}
              </p>

              {/* Issued By */}
              <p className="text-[11px] text-slate-400 italic">
                Issued by: {n.issuedBy}
              </p>

            </div>
          ))}

          {/* Empty State */}
          {notices.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              No notices available.
            </div>
          )}

        </div>
      </div>

      {/* NEW NOTICE MODAL */}
      {showAddNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">

            {/* Modal Header */}
            <div className="flex justify-between items-start pb-2 border-b border-slate-200 mb-3">

              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif mb-0.5">
                  Broadcast Official Notice / Circular
                </h3>

                <p className="text-xs text-slate-500">
                  Published instantaneously to school homepage & portals.
                </p>
              </div>

              <button
                onClick={() => setShowAddNotice(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>

            </div>

            {/* Notice Form */}
            <form
              onSubmit={handlePublishNotice}
              className="space-y-3 text-xs"
            >

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Circular Title
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Winter Break 2026"
                  value={newNoticeData.title}
                  onChange={(e) =>
                    setNewNoticeData({
                      ...newNoticeData,
                      title: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Category + Audience */}
              <div className="grid grid-cols-2 gap-3">

                {/* Category */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>

                  <select
                    value={newNoticeData.category}
                    onChange={(e) =>
                      setNewNoticeData({
                        ...newNoticeData,
                        category: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option>Academic</option>
                    <option>Examination</option>
                    <option>Sports</option>
                    <option>Holiday</option>
                    <option>Admission</option>
                  </select>
                </div>

                {/* Audience */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Audience
                  </label>

                  <select
                    value={newNoticeData.targetAudience}
                    onChange={(e) =>
                      setNewNoticeData({
                        ...newNoticeData,
                        targetAudience: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option>All</option>
                    <option>Students</option>
                    <option>Teachers</option>
                    <option>Parents</option>
                  </select>
                </div>

              </div>

              {/* Content */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Circular Content
                </label>

                <textarea
                  rows={4}
                  required
                  placeholder="Detail the instructions, reporting timings, or dates..."
                  value={newNoticeData.content}
                  onChange={(e) =>
                    setNewNoticeData({
                      ...newNoticeData,
                      content: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setShowAddNotice(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Publish Notice
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const CampusGallerySection: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const photos = [
    {
      id: 1,
      title: 'Botanical Central Quadrangle',
      category: 'Campus',
      size: 'large', // spanning 2 columns
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Senior Chemistry Spectrometry Practice',
      category: 'Laboratory',
      size: 'normal',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Inter-House Basketball Championship',
      category: 'Sports',
      size: 'normal',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      title: 'Interactive Smart Math Workshop',
      category: 'Classrooms',
      size: 'normal',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      title: 'Annual Classical Orchestra Performance',
      category: 'Cultural',
      size: 'large',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      title: 'Atal Tinkering Drone Flight Trials',
      category: 'Laboratory',
      size: 'normal',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const categories = ['All', 'Campus', 'Laboratory', 'Sports', 'Classrooms', 'Cultural'];

  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter);

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300">
            Moments & Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            Life Across Our Campus
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Glimpses of daily rigor, athletic triumph, scientific inquiry, and cultural vibrance.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 ${
                item.size === 'large' ? 'md:col-span-2' : ''
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-300 transition">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

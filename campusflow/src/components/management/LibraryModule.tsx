import React from 'react';
import { LibraryBook } from '../../types/school';

interface LibraryModuleProps {
  books: LibraryBook[];
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({ books }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-slate-900">
          Central Digitized Library Catalog
        </h2>

        <p className="text-xs text-slate-500">
          Stock records, book tracking, racks, and circulation ledger
        </p>
      </div>

      {/* Books List */}
      <div className="space-y-3">
        {books.map((b) => (
          <div
            key={b.id}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs"
          >
            
            {/* Book Information */}
            <div>
              <h4 className="font-bold text-slate-900">
                {b.title}
              </h4>

              <p className="text-slate-600">
                Author: {b.author} • Category: {b.category}
              </p>

              <p className="text-[10px] font-mono text-slate-400">
                ISBN: {b.isbn} • Rack: {b.locationRack}
              </p>
            </div>

            {/* Availability */}
            <div className="text-right">
              <span className="font-bold text-slate-900 font-mono block">
                {b.availableCopies} / {b.totalCopies} Available
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, User, X } from 'lucide-react';
import { SchoolEvent } from '../../types/school';
import { storage } from '../../services/storageService';

interface EventsModuleProps {
  events: SchoolEvent[];
  setEvents: React.Dispatch<React.SetStateAction<SchoolEvent[]>>;
}

export const EventsModule: React.FC<EventsModuleProps> = ({
  events,
  setEvents
}) => {
  const [showAddEvent, setShowAddEvent] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Academic',
    description: '',
    coordinator: ''
  });

  const resetForm = () => {
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'Academic',
      description: '',
      coordinator: ''
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !eventForm.title.trim() ||
      !eventForm.date ||
      !eventForm.time.trim() ||
      !eventForm.location.trim() ||
      !eventForm.category.trim() ||
      !eventForm.description.trim() ||
      !eventForm.coordinator.trim()
    ) {
      return;
    }

    const newEvent = storage.addEvent({
      title: eventForm.title.trim(),
      date: eventForm.date,
      time: eventForm.time.trim(),
      location: eventForm.location.trim(),
      category: eventForm.category,
      description: eventForm.description.trim(),
      coordinator: eventForm.coordinator.trim()
    });

    setEvents((prev) => [newEvent, ...prev]);

    setShowAddEvent(false);
    resetForm();
  };

  const sortedEvents = [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">

        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            School Calendar & Events
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Manage school events, academic activities, cultural programs,
            sports events and other important calendar activities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddEvent(true);
          }}
          className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add School Event
        </button>

      </div>

      {/* Events */}
      {sortedEvents.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-300 rounded-2xl">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />

          <h3 className="font-bold text-slate-700">
            No Events Available
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Add a new school event to display it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                {/* Event Details */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                      {event.category}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {event.id}
                    </span>

                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">

                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />

                      <span>
                        <strong>Date:</strong>{' '}
                        {event.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />

                      <span>
                        <strong>Time:</strong>{' '}
                        {event.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />

                      <span>
                        <strong>Location:</strong>{' '}
                        {event.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />

                      <span>
                        <strong>Coordinator:</strong>{' '}
                        {event.coordinator}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-200 mb-4">

              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Add School Event
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Add a new event to the school calendar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddEvent(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleAddEvent}
              className="space-y-4 text-xs"
            >

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Event Title
                </label>

                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. Annual Sports Meet"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Date + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Event Date
                  </label>

                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        date: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>

                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        category: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Competition">Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </div>

              {/* Time */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time
                </label>

                <input
                  type="text"
                  required
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      time: e.target.value
                    })
                  }
                  placeholder="e.g. 08:00 AM - 04:00 PM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      location: e.target.value
                    })
                  }
                  placeholder="e.g. School Auditorium"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Coordinator */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Coordinator
                </label>

                <input
                  type="text"
                  required
                  value={eventForm.coordinator}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      coordinator: e.target.value
                    })
                  }
                  placeholder="e.g. Sports Department"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  rows={4}
                  required
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      description: e.target.value
                    })
                  }
                  placeholder="Enter event details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">

                <button
                  type="button"
                  onClick={() => {
                    setShowAddEvent(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Add Event
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default EventsModule;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolSettings } from '../../types/school';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
}

export const ContactSection: React.FC<Props> = ({ settings }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Admission Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', phone: '', type: 'Admission Inquiry', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Reach Out
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 mt-3 tracking-tight">
            Connect With Our Admissions & Administration
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            We welcome prospective parents, scholars, and educational partners to visit our campus or connect with our administrative team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information & Timings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 font-serif pb-2 border-b border-slate-200">
                School Information
              </h3>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Campus Address</strong>
                  <p>{settings.address}</p>
                  <p>{settings.city}, {settings.state} - {settings.pincode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Direct Telephones</strong>
                  <p>Admissions Desk: {settings.phone}</p>
                  <p>Emergency Helpdesk: {settings.altPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Email Inquiries</strong>
                  <p>Admissions: {settings.email}</p>
                  <p>General Secretariat: info@riversidepublic.edu.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Visiting & Office Timings</strong>
                  <p>Monday - Friday: 08:00 AM - 03:30 PM</p>
                  <p>Saturday: 08:00 AM - 01:00 PM (Closed on 2nd Saturdays & Sundays)</p>
                </div>
              </div>
            </div>

            {/* Realistic Campus Location Map Graphic / Visual */}
            <div className="h-48 rounded-2xl overflow-hidden border border-slate-300 relative bg-slate-100 flex items-center justify-center text-center p-4">
              <div className="absolute inset-0 bg-slate-900/10"></div>
              <div className="relative z-10 space-y-1">
                <MapPin className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-slate-900 font-serif">{settings.schoolName}</p>
                <p className="text-[10px] text-slate-500">Opposite Green Valley Metro Station, Gate No. 2</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white text-slate-800 text-[10px] font-semibold rounded-md shadow-xs border border-slate-200">
                  Open in Google Maps Navigation
                </span>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">
                Send an Official Inquiry
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Our Admissions Secretariat responds to all queries within one working day.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-white rounded-xl border border-emerald-300 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Inquiry Dispatched Successfully</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for contacting {settings.schoolName}. A verification SMS and email have been sent to your registered coordinates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Sen"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="parent@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98100-XXXXX"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nature of Inquiry</label>
                      <select
                        value={formState.type}
                        onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        <option>Admission Inquiry (Grades 1-5)</option>
                        <option>Admission Inquiry (Grades 6-10)</option>
                        <option>Admission Inquiry (Senior Secondary XI/XII)</option>
                        <option>School Transfer / TC Request</option>
                        <option>Transport / Bus Route Query</option>
                        <option>General Administration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Specific Questions</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please mention your child's current grade, previous school, or any specific questions..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Official Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

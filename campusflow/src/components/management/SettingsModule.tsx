import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { SchoolSettings } from '../../types/school';

interface SettingsModuleProps {
  settingsForm: SchoolSettings;
  setSettingsForm: React.Dispatch<React.SetStateAction<SchoolSettings>>;
}

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settingsForm,
  setSettingsForm
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [confirmationWord, setConfirmationWord] = useState('');
  const [enteredWord, setEnteredWord] = useState('');
  const [confirmationError, setConfirmationError] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  /*
   * ==========================================
   * LOAD SCHOOL SETTINGS FROM DATABASE
   * ==========================================
   */
  useEffect(() => {
    const loadSchoolSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/school-settings`
        );

        if (!response.ok) {
          throw new Error('Failed to load school settings');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setSettingsForm((current) => ({
            ...current,
            schoolName: result.data.schoolName ?? '',
            motto: result.data.motto ?? '',
            academicYear: result.data.academicYear ?? '',
            principalName: result.data.principalName ?? '',
            phone: result.data.phone ?? '',
            principalMessage: result.data.principalMessage ?? ''
          }));
        }
      } catch (error) {
        console.error('Error loading school settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchoolSettings();
  }, [setSettingsForm]);

  /*
   * ==========================================
   * GENERATE RANDOM CONFIRMATION WORD
   * ==========================================
   */
  const generateConfirmationWord = () => {
    const characters =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let word = '';

    for (let i = 0; i < 5; i++) {
      word += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setConfirmationWord(word);
  };

  /*
   * ==========================================
   * OPEN CONFIRMATION POPUP
   * ==========================================
   */
  const openConfirmation = () => {
    generateConfirmationWord();

    setEnteredWord('');
    setConfirmationError('');
    setSuccessMessage('');

    setShowConfirmation(true);
  };

  /*
   * ==========================================
   * CLOSE CONFIRMATION POPUP
   * ==========================================
   */
  const closeConfirmation = () => {
    if (saving) {
      return;
    }

    setShowConfirmation(false);
    setEnteredWord('');
    setConfirmationError('');
  };

  /*
   * ==========================================
   * UPDATE DATABASE
   * ==========================================
   */
  const confirmUpdate = async () => {
    /*
     * Check confirmation word
     */
    if (
      enteredWord.trim().toUpperCase() !==
      confirmationWord
    ) {
      setConfirmationError(
        'Incorrect confirmation word. Configuration was not updated.'
      );

      return;
    }

    try {
      setSaving(true);
      setConfirmationError('');
      setSuccessMessage('');

      /*
       * PUT API
       */
      const response = await fetch(
        `${API_URL}/school-settings`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            schoolName: settingsForm.schoolName,
            motto: settingsForm.motto,
            academicYear: settingsForm.academicYear,
            principalName: settingsForm.principalName,
            phone: settingsForm.phone,
            principalMessage:
              settingsForm.principalMessage
          })
        }
      );

      const result = await response.json();

      /*
       * API error
       */
      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.message ||
          'Failed to update school settings'
        );
      }

      /*
       * Update local form with database response
       */
      if (result.success && result.data) {
        setSettingsForm((current) => ({
          ...current,
          schoolName: result.data.schoolName ?? '',
          motto: result.data.motto ?? '',
          academicYear:
            result.data.academicYear ?? '',
          principalName:
            result.data.principalName ?? '',
          phone: result.data.phone ?? '',
          principalMessage:
            result.data.principalMessage ?? ''
        }));
      }

      /*
       * Close popup
       */
      setShowConfirmation(false);

      setEnteredWord('');
      setConfirmationError('');

      /*
       * Show success message
       */
      setSuccessMessage(
        'School configuration updated successfully in database.'
      );

    } catch (error) {
      console.error(
        'Error updating school settings:',
        error
      );

      setConfirmationError(
        error instanceof Error
          ? error.message
          : 'Failed to update school settings.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================
   * ENTER KEY
   * ==========================================
   */
  const handleConfirmationKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!saving) {
        confirmUpdate();
      }
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto">
        <div className="text-center text-sm text-slate-500">
          Loading school settings...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==========================================
          MAIN SETTINGS CARD
          ========================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            School Profile & Operational Identity
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Configure school name, motto, principal details,
            contact info and academic parameters
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />

            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            openConfirmation();
          }}
          className="space-y-4 text-xs"
        >

          {/* School Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              School Name
            </label>

            <input
              type="text"
              required
              value={settingsForm.schoolName}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  schoolName: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
            />
          </div>

          {/* Motto + Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Motto */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                School Motto
              </label>

              <input
                type="text"
                required
                value={settingsForm.motto}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    motto: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Academic Year
              </label>

              <input
                type="text"
                required
                value={settingsForm.academicYear}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    academicYear: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
              />
            </div>

          </div>

          {/* Principal + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Principal */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Principal Name
              </label>

              <input
                type="text"
                required
                value={settingsForm.principalName}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    principalName: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Contact Phone
              </label>

              <input
                type="text"
                required
                value={settingsForm.phone}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    phone: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
              />
            </div>

          </div>

          {/* Principal Message */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Principal Welcome Message
            </label>

            <textarea
              rows={3}
              required
              value={settingsForm.principalMessage}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  principalMessage: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Save Configuration
          </button>

        </form>
      </div>

      {/* ==========================================
          CONFIRMATION POPUP
          ========================================== */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200">

            {/* Popup Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirm Configuration Update
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Verification is required before updating.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={saving}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Popup Body */}
            <div className="p-5 space-y-4">

              <p className="text-sm text-slate-600">
                You are about to update the school configuration
                in the database.
              </p>

              <p className="text-xs text-slate-500">
                To confirm this action, type the following word exactly:
              </p>

              {/* Random Word */}
              <div className="flex justify-center">
                <div className="px-6 py-3 bg-slate-100 border border-slate-300 rounded-xl">
                  <span className="text-xl font-bold tracking-[0.35em] text-slate-900">
                    {confirmationWord}
                  </span>
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter confirmation word
                </label>

                <input
                  type="text"
                  autoFocus
                  disabled={saving}
                  value={enteredWord}
                  onChange={(e) => {
                    setEnteredWord(
                      e.target.value.toUpperCase()
                    );

                    setConfirmationError('');
                  }}
                  onKeyDown={handleConfirmationKeyDown}
                  placeholder="Type the word above"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-300 uppercase tracking-widest disabled:bg-slate-100"
                />
              </div>

              {/* Error */}
              {confirmationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                  {confirmationError}
                </div>
              )}

            </div>

            {/* Popup Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-slate-200">

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmUpdate}
                disabled={
                  !enteredWord.trim() || saving
                }
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {saving
                  ? 'Updating...'
                  : 'Confirm & Update'}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
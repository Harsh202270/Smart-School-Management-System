import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Copy,
  Check,
  KeyRound,
  IdCard,
  AlertTriangle
} from 'lucide-react';

interface TeacherCredentialsModalProps {
  isOpen: boolean;
  employeeCode: string;
  initialPassword: string;
  fullName: string;
  onClose: () => void;
}

const TeacherCredentialsModal: React.FC<
  TeacherCredentialsModalProps
> = ({
  isOpen,
  employeeCode,
  initialPassword,
  fullName,
  onClose
}) => {
  const [copied, setCopied] = useState<
    'employeeCode' | 'password' | 'all' | null
  >(null);

  if (!isOpen) {
    return null;
  }

  const copyText = async (
    text: string,
    type: 'employeeCode' | 'password' | 'all'
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const copyAll = () => {
    const credentials = `Faculty Employee ID: ${employeeCode}
Temporary Password: ${initialPassword}`;

    copyText(credentials, 'all');
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-slate-950/80
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          relative
          w-full max-w-lg
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  bg-emerald-500
                  text-white
                  shadow-lg
                "
              >
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Faculty Account Created
                </h2>

                <p className="mt-0.5 text-xs text-slate-300">
                  Login credentials generated successfully
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                p-2
                text-slate-400
                transition
                hover:bg-slate-800
                hover:text-white
              "
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Teacher name */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Faculty Member
            </p>

            <p className="mt-1 text-base font-bold text-slate-900">
              {fullName}
            </p>
          </div>

          {/* Employee ID */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Faculty Employee ID
            </label>

            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-slate-200
                bg-slate-50
                p-3
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                "
              >
                <IdCard className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-base font-bold text-slate-900">
                  {employeeCode}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    employeeCode,
                    'employeeCode'
                  )
                }
                className="
                  flex items-center gap-1.5
                  rounded-xl
                  bg-white
                  px-3 py-2
                  text-xs font-bold
                  text-slate-700
                  shadow-sm
                  ring-1 ring-slate-200
                  transition
                  hover:bg-slate-100
                "
              >
                {copied === 'employeeCode' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Temporary Password
            </label>

            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-amber-200
                bg-amber-50
                p-3
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-amber-100
                  text-amber-700
                "
              >
                <KeyRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-all font-mono text-base font-bold tracking-wide text-slate-900">
                  {initialPassword}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    initialPassword,
                    'password'
                  )
                }
                className="
                  flex items-center gap-1.5
                  rounded-xl
                  bg-white
                  px-3 py-2
                  text-xs font-bold
                  text-slate-700
                  shadow-sm
                  ring-1 ring-amber-200
                  transition
                  hover:bg-amber-100
                "
              >
                {copied === 'password' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning */}
          <div
            className="
              mb-5
              flex gap-3
              rounded-2xl
              border border-amber-200
              bg-amber-50
              p-4
            "
          >
            <AlertTriangle
              className="
                mt-0.5
                h-5 w-5
                shrink-0
                text-amber-600
              "
            />

            <div>
              <p className="text-xs font-bold text-amber-900">
                Save these credentials now
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                This temporary password is shown only after
                account creation. Keep it secure and ask the
                faculty member to change it after the first login.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={copyAll}
              className="
                flex flex-1
                items-center justify-center gap-2
                rounded-xl
                border border-slate-200
                bg-white
                px-4 py-3
                text-sm font-bold
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              {copied === 'all' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy All
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                rounded-xl
                bg-slate-900
                px-4 py-3
                text-sm font-bold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherCredentialsModal;
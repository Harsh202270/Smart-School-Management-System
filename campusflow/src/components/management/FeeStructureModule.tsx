
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ReceiptText,
  GraduationCap,
} from 'lucide-react';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/$/, '');

interface ClassOption {
  id: string | number;
  classNumber?: string | number;
  class_name?: string;
  name?: string;
  section?: string;
}

interface FeeStructure {
  id: string | number;
  class_id: string | number;
  fee_name: string;
  amount: number | string;
  frequency: string;
  academic_year: string;
  due_date?: string | null;
  description?: string | null;
}

interface FeeForm {
  class_id: string;
  fee_name: string;
  amount: string;
  frequency: string;
  academic_year: string;
  due_date: string;
  description: string;
}

interface FeeStructureModuleProps {
  classes: ClassOption[];
}

const CATEGORIES = [
  'Admission Fee',
  'Tuition Fee',
  'Examination Fee',
  'Annual Fee',
  'Transport Fee',
  'Library Fee',
  'Computer Fee',
  'Laboratory Fee',
  'Sports Fee',
  'Other Fee',
];

const FREQUENCIES = [
  'One Time',
  'Monthly',
  'Quarterly',
  'Half-Yearly',
  'Yearly',
];

const EMPTY_FORM: FeeForm = {
  class_id: '',
  fee_name: 'Tuition Fee',
  amount: '',
  frequency: 'Monthly',
  academic_year: '2026-2027',
  due_date: '',
  description: '',
};

function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getClassLabel(item: ClassOption): string {
  const className =
    item.classNumber ?? item.class_name ?? item.name ?? 'Class';

  return item.section
    ? `${className} - Section ${item.section}`
    : String(className);
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === 'object') {
      const data = body as {
        detail?: unknown;
        message?: unknown;
      };

      if (typeof data.detail === 'string') {
        return data.detail;
      }

      if (typeof data.message === 'string') {
        return data.message;
      }

      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item: { msg?: string }) => item?.msg ?? '')
          .filter(Boolean)
          .join(', ');
      }
    }
  } catch {
    // The server did not return a JSON response.
  }

  return `Request failed with status ${response.status}.`;
}

function getListFromResponse(body: unknown): FeeStructure[] {
  let result: unknown = body;

  if (result && typeof result === 'object' && 'data' in result) {
    result = (result as { data: unknown }).data;
  }

  if (result && typeof result === 'object' && 'items' in result) {
    result = (result as { items: unknown }).items;
  }

  if (!Array.isArray(result)) {
    throw new Error(
      'The fee API did not return a list. Check the GET /fee-structures response.'
    );
  }

  return result as FeeStructure[];
}

export const FeeStructureModule: React.FC<FeeStructureModuleProps> = ({
  classes,
}) => {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [search, setSearch] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [form, setForm] = useState<FeeForm>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (classes.length === 0) {
      setSelectedClassId('');
      return;
    }

    const selectedExists = classes.some(
      (item) => String(item.id) === selectedClassId
    );

    if (!selectedExists) {
      setSelectedClassId(String(classes[0].id));
    }
  }, [classes, selectedClassId]);

  const loadFees = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/fee-structures`);

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const body: unknown = await response.json();
      setFees(getListFromResponse(body));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load fee structures.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFees();
  }, [loadFees]);

  const classFees = useMemo(
    () =>
      fees.filter(
        (fee) => String(fee.class_id) === selectedClassId
      ),
    [fees, selectedClassId]
  );

  const visibleFees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classFees.filter((fee) => {
      const matchesSearch =
        !query ||
        String(fee.fee_name ?? '').toLowerCase().includes(query) ||
        String(fee.description ?? '').toLowerCase().includes(query);

      const matchesFrequency =
        frequencyFilter === 'All' ||
        fee.frequency === frequencyFilter;

      return matchesSearch && matchesFrequency;
    });
  }, [classFees, search, frequencyFilter]);

  const totalAmount = useMemo(
    () =>
      classFees.reduce(
        (total, fee) => total + (Number(fee.amount) || 0),
        0
      ),
    [classFees]
  );

  const selectedClass = classes.find(
    (item) => String(item.id) === selectedClassId
  );

  function openAddModal() {
    setEditingFee(null);
    setForm({
      ...EMPTY_FORM,
      class_id: selectedClassId,
    });
    setError('');
    setSuccess('');
    setModalOpen(true);
  }

  function openEditModal(fee: FeeStructure) {
    setEditingFee(fee);

    setForm({
      class_id: String(fee.class_id),
      fee_name: fee.fee_name ?? 'Tuition Fee',
      amount: String(fee.amount ?? ''),
      frequency: FREQUENCIES.includes(fee.frequency)
        ? fee.frequency
        : 'Monthly',
      academic_year: fee.academic_year ?? '2026-2027',
      due_date: fee.due_date
        ? String(fee.due_date).slice(0, 10)
        : '',
      description: fee.description ?? '',
    });

    setError('');
    setSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingFee(null);
    setError('');
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.class_id) {
      setError('Please select a class.');
      return;
    }

    if (!form.fee_name.trim()) {
      setError('Please select a fee category.');
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    if (!form.academic_year.trim()) {
      setError('Please enter the academic year.');
      return;
    }

    const classId = Number(form.class_id);

    if (!Number.isInteger(classId) || classId <= 0) {
      setError(
        'The selected class ID must be a positive number. Check your classes API.'
      );
      return;
    }

    const payload = {
      class_id: classId,
      fee_name: form.fee_name.trim(),
      amount,
      frequency: form.frequency,
      academic_year: form.academic_year.trim(),
      due_date: form.due_date || null,
      description: form.description.trim() || null,
    };

    setSaving(true);

    try {
      const url = editingFee
        ? `${API_URL}/fee-structures/${editingFee.id}`
        : `${API_URL}/fee-structures`;

      const response = await fetch(url, {
        method: editingFee ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const wasEditing = Boolean(editingFee);

      setModalOpen(false);
      setEditingFee(null);
      setForm({
        ...EMPTY_FORM,
        class_id: selectedClassId,
      });

      setSuccess(
        wasEditing
          ? 'Fee structure updated successfully.'
          : 'Fee structure saved successfully.'
      );

      await loadFees();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save the fee structure.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(fee: FeeStructure) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${fee.fee_name}?`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${API_URL}/fee-structures/${fee.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setSuccess(`${fee.fee_name} deleted successfully.`);
      await loadFees();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete this fee.'
      );
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Wallet size={17} />
            Finance Management
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Fee Structure
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage fees separately for every class and section.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadFees()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            disabled={classes.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={17} />
            Add Fee
          </button>
        </div>
      </div>

      {/* Error notification */}
      {error && !modalOpen && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Success notification */}
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={19} className="shrink-0" />
          <span className="flex-1">{success}</span>
          <button
            type="button"
            onClick={() => setSuccess('')}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Class selector */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <GraduationCap size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Select Class
            </h2>
            <p className="text-sm text-slate-500">
              Choose a class to view its fee structure.
            </p>
          </div>
        </div>

        {classes.length === 0 ? (
          <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            No classes found. Add classes first.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="fee-class-select"
                className="mb-2 block text-sm font-medium"
              >
                Class and Section
              </label>

              <select
                id="fee-class-select"
                value={selectedClassId}
                onChange={(event) => {
                  setSelectedClassId(event.target.value);
                  setSearch('');
                  setFrequencyFilter('All');
                  setError('');
                  setSuccess('');
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {classes.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {getClassLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4">
              <p className="text-xs font-medium text-indigo-600">
                Selected Class
              </p>
              <p className="mt-1 font-semibold text-indigo-950">
                {selectedClass
                  ? getClassLabel(selectedClass)
                  : 'No class selected'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Configured Fees
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(totalAmount)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Sum of configured fee entries for this class
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Fee Categories</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {classFees.length}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            For the selected class
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Academic Year</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {classFees[0]?.academic_year || '2026-2027'}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Academic year of the first configured fee
          </p>
        </div>
      </div>

      {/* Fee details */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Fee Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add, edit, or remove fee categories.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search fees..."
                aria-label="Search fee categories"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 sm:w-52"
              />
            </div>

            <select
              value={frequencyFilter}
              onChange={(event) =>
                setFrequencyFilter(event.target.value)
              }
              aria-label="Filter by frequency"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Frequencies</option>
              {FREQUENCIES.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3">
            <RefreshCw
              size={26}
              className="animate-spin text-indigo-600"
            />
            <p className="text-sm text-slate-500">
              Loading fee structures...
            </p>
          </div>
        ) : visibleFees.length === 0 ? (
          <div className="p-10 text-center">
            <ReceiptText
              size={36}
              className="mx-auto mb-3 text-slate-300"
            />
            <h3 className="font-semibold text-slate-800">
              No fee structures found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {classFees.length === 0
                ? 'Add the first fee for this class.'
                : 'Try a different search or frequency filter.'}
            </p>

            {classFees.length === 0 && classes.length > 0 && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={17} />
                Add First Fee
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                    <th className="px-5 py-4 font-semibold">
                      Fee Category
                    </th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">
                      Frequency
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Academic Year
                    </th>
                    <th className="px-5 py-4 font-semibold">Due Date</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                            <ReceiptText size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {fee.fee_name}
                            </p>
                            {fee.description && (
                              <p className="mt-1 max-w-52 truncate text-xs text-slate-500">
                                {fee.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {formatCurrency(fee.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {fee.frequency}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {fee.academic_year}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {fee.due_date
                          ? new Date(
                              `${String(fee.due_date).slice(0, 10)}T00:00:00`
                            ).toLocaleDateString('en-IN')
                          : 'Not set'}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(fee)}
                            title="Edit fee"
                            aria-label={`Edit ${fee.fee_name}`}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(fee)}
                            title="Delete fee"
                            aria-label={`Delete ${fee.fee_name}`}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing {visibleFees.length} of {classFees.length} fee
                entries
              </p>
              <p className="text-sm font-semibold text-slate-800">
                Displayed total:{' '}
                {formatCurrency(
                  visibleFees.reduce(
                    (sum, fee) => sum + (Number(fee.amount) || 0),
                    0
                  )
                )}
              </p>
            </div>
          </>
        )}
      </section>

      {/* Add/Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fee-modal-heading"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Wallet size={22} />
                </div>

                <div>
                  <h2
                    id="fee-modal-heading"
                    className="font-bold text-slate-900"
                  >
                    {editingFee ? 'Edit Fee' : 'Add Fee'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the fee information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fee-form-class"
                      className="mb-2 block text-sm font-medium"
                    >
                      Class and Section *
                    </label>

                    <select
                      id="fee-form-class"
                      required
                      value={form.class_id}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          class_id: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="">Select class</option>
                      {classes.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {getClassLabel(item)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="fee-form-category"
                      className="mb-2 block text-sm font-medium"
                    >
                      Fee Category *
                    </label>

                    <select
                      id="fee-form-category"
                      required
                      value={form.fee_name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          fee_name: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="fee-form-amount"
                      className="mb-2 block text-sm font-medium"
                    >
                      Amount (₹) *
                    </label>

                    <input
                      id="fee-form-amount"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          amount: event.target.value,
                        })
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fee-form-frequency"
                      className="mb-2 block text-sm font-medium"
                    >
                      Frequency *
                    </label>

                    <select
                      id="fee-form-frequency"
                      required
                      value={form.frequency}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          frequency: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      {FREQUENCIES.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {frequency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="fee-form-year"
                      className="mb-2 block text-sm font-medium"
                    >
                      Academic Year *
                    </label>

                    <input
                      id="fee-form-year"
                      required
                      type="text"
                      value={form.academic_year}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          academic_year: event.target.value,
                        })
                      }
                      placeholder="2026-2027"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fee-form-date"
                      className="mb-2 block text-sm font-medium"
                    >
                      Due Date
                    </label>

                    <input
                      id="fee-form-date"
                      type="date"
                      value={form.due_date}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          due_date: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fee-form-description"
                      className="mb-2 block text-sm font-medium"
                    >
                      Description
                    </label>

                    <textarea
                      id="fee-form-description"
                      rows={3}
                      value={form.description}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          description: event.target.value,
                        })
                      }
                      placeholder="Optional fee details..."
                      className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  Monthly or quarterly fees are shown as individual
                  configured amounts. They are not automatically
                  multiplied into yearly totals.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || classes.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? 'Saving...'
                    : editingFee
                      ? 'Update Fee'
                      : 'Save Fee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructureModule;

import React, { useMemo, useState } from 'react';
import type { FeeInvoice, FeePayment } from '../../types/school';
import {
  Search,
  Filter,
  Receipt,
  Wallet,
  FileText,
  Clock,
  AlertTriangle,
  CalendarDays,
  Eye,
  X,
  CreditCard,
  Banknote,
  CheckCircle2,
  History,
  IndianRupee,
  RotateCcw,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeesModuleProps {
  invoices: FeeInvoice[];
  payments: FeePayment[];
}

type InvoiceStatus = 'All' | 'Paid' | 'Pending' | 'Partial' | 'Overdue';

type ExtraFields = Record<string, unknown>;

const getExtraField = (
  item: unknown,
  ...keys: string[]
): unknown => {
  if (!item || typeof item !== 'object') return undefined;

  const record = item as ExtraFields;

  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }

  return undefined;
};

const getText = (value: unknown): string => {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  return String(value);
};

const money = (value: unknown): string => {
  const amount = Number(value ?? 0);

  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString(
    'en-IN',
    { maximumFractionDigits: 2 }
  )}`;
};

const formatDate = (value: unknown): string => {
  if (!value) return '—';

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatus = (invoice: FeeInvoice): Exclude<InvoiceStatus, 'All'> => {
  const balance = Number(invoice.balanceAmount ?? 0);

  if (balance <= 0) return 'Paid';

  const originalStatus = String(invoice.status ?? '').toLowerCase();

  if (originalStatus === 'cancelled' || originalStatus === 'canceled') {
    return 'Pending';
  }

  const dueDateValue = getExtraField(invoice, 'dueDate', 'due_date');

  if (dueDateValue) {
    const dueDate = new Date(String(dueDateValue));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate < today
    ) {
      return 'Overdue';
    }
  }

  if (
    originalStatus === 'partial' ||
    originalStatus === 'partially paid' ||
    Number(invoice.amount ?? 0) > balance
  ) {
    return 'Partial';
  }

  return 'Pending';
};

const statusStyle = (status: string): string => {
  switch (status) {
    case 'Paid':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'Partial':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'Overdue':
      return 'border-red-200 bg-red-50 text-red-700';
    default:
      return 'border-amber-200 bg-amber-50 text-amber-700';
  }
};

const getPaymentMethod = (payment: FeePayment): string =>
  getText(getExtraField(payment, 'paymentMethod', 'payment_method'));

const getPaymentDate = (payment: FeePayment): unknown =>
  getExtraField(payment, 'paymentDate', 'payment_date', 'createdAt', 'created_at');

const getReceiptNumber = (payment: FeePayment): string =>
  getText(getExtraField(payment, 'receiptNumber', 'receipt_number'));

const getTransactionReference = (payment: FeePayment): string =>
  getText(getExtraField(payment, 'transactionReference', 'transaction_reference'));

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  color,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 break-words text-2xl font-bold text-slate-900">
          {money(amount)}
        </p>
      </div>
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={21} />
      </div>
    </div>
    <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
      {subtitle}
    </p>
  </div>
);

interface DetailProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailProps> = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 p-3">
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
      {value}
    </p>
  </div>
);

export const FeesModule: React.FC<FeesModuleProps> = ({
  invoices,
  payments,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus>('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<FeeInvoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] =
    useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [transactionReference, setTransactionReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const academicYears = useMemo(() => {
    const years = invoices
      .map((invoice) =>
        getText(getExtraField(invoice, 'academicYear', 'academic_year'))
      )
      .filter((year) => year !== '—');

    return Array.from(new Set(years)).sort().reverse();
  }, [invoices]);

  const totalInvoiced = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) => total + Number(invoice.amount ?? 0),
        0
      ),
    [invoices]
  );

  const totalCollected = useMemo(
    () =>
      payments.reduce(
        (total, payment) => total + Number(payment.amount ?? 0),
        0
      ),
    [payments]
  );

  const totalPending = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) =>
          total + Math.max(Number(invoice.balanceAmount ?? 0), 0),
        0
      ),
    [invoices]
  );

  const totalOverdue = useMemo(
    () =>
      invoices.reduce(
        (total, invoice) =>
          getStatus(invoice) === 'Overdue'
            ? total + Math.max(Number(invoice.balanceAmount ?? 0), 0)
            : total,
        0
      ),
    [invoices]
  );

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const invoiceNumber = String(invoice.invoiceNumber ?? '');
      const studentName = String(invoice.studentName ?? '');
      const studentId = String(
        getExtraField(invoice, 'studentId', 'student_id') ?? ''
      );

      const matchesSearch =
        !query ||
        invoiceNumber.toLowerCase().includes(query) ||
        studentName.toLowerCase().includes(query) ||
        studentId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' || getStatus(invoice) === statusFilter;

      const academicYear = getText(
        getExtraField(invoice, 'academicYear', 'academic_year')
      );

      const matchesYear =
        yearFilter === 'All' || academicYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [invoices, search, statusFilter, yearFilter]);

  const getInvoicePayments = (invoice: FeeInvoice): FeePayment[] => {
    return payments.filter((payment) => {
      const paymentInvoiceId = getExtraField(
        payment,
        'invoiceId',
        'invoice_id'
      );

      return (
        paymentInvoiceId !== undefined &&
        String(paymentInvoiceId) === String(invoice.id)
      );
    });
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setYearFilter('All');
  };

  const openPaymentForm = (invoice: FeeInvoice) => {
    setPaymentInvoice(invoice);
    setPaymentAmount(String(Math.max(Number(invoice.balanceAmount ?? 0), 0)));
    setPaymentMethod('Cash');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setTransactionReference('');
    setPaymentNotes('');
    setFormMessage('');
  };

  const validatePayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage('');

    if (!paymentInvoice) return;

    const amount = Number(paymentAmount);
    const balance = Number(paymentInvoice.balanceAmount ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormMessage('Enter a valid payment amount greater than zero.');
      return;
    }

    if (amount > balance) {
      setFormMessage(
        `The payment cannot exceed the outstanding balance of ${money(balance)}.`
      );
      return;
    }

    if (!paymentDate) {
      setFormMessage('Please select a payment date.');
      return;
    }

    setFormMessage(
      'The details are valid. To save this payment, connect this form to your FastAPI payment endpoint.'
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            <Receipt size={16} />
            Finance Management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Fees &amp; Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor invoices, collected fees, and outstanding student dues.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <CalendarDays size={17} className="text-indigo-600" />
          {yearFilter === 'All' ? 'All academic years' : yearFilter}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Invoiced"
          amount={totalInvoiced}
          subtitle={`${invoices.length} invoice(s)`}
          icon={FileText}
          color="bg-indigo-50 text-indigo-700"
        />
        <SummaryCard
          title="Total Collected"
          amount={totalCollected}
          subtitle={`${payments.length} payment record(s)`}
          icon={Wallet}
          color="bg-emerald-50 text-emerald-700"
        />
        <SummaryCard
          title="Pending Dues"
          amount={totalPending}
          subtitle="Outstanding invoice balances"
          icon={Clock}
          color="bg-amber-50 text-amber-700"
        />
        <SummaryCard
          title="Overdue Dues"
          amount={totalOverdue}
          subtitle="Past due date with balance remaining"
          icon={AlertTriangle}
          color="bg-red-50 text-red-700"
        />
      </div>

      {/* Invoices */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Invoice Register
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search invoices, filter by status, and inspect details.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student or invoice..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Payment Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as InvoiceStatus)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="All">All statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partially paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Academic Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="All">All academic years</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <RotateCcw size={15} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing <strong className="text-slate-800">{filteredInvoices.length}</strong>{' '}
            of <strong className="text-slate-800">{invoices.length}</strong> invoices
          </span>
          <span>
            Outstanding:{' '}
            <strong className="font-mono text-red-700">
              {money(
                filteredInvoices.reduce(
                  (sum, invoice) =>
                    sum + Math.max(Number(invoice.balanceAmount ?? 0), 0),
                  0
                )
              )}
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4 font-bold">Invoice / Student</th>
                <th className="px-4 py-4 font-bold">Quarter</th>
                <th className="px-4 py-4 font-bold">Academic Year</th>
                <th className="px-4 py-4 text-right font-bold">Amount</th>
                <th className="px-4 py-4 text-right font-bold">Paid</th>
                <th className="px-4 py-4 text-right font-bold">Balance</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-center font-bold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => {
                const status = getStatus(invoice);
                const amount = Number(invoice.amount ?? 0);
                const balance = Math.max(
                  Number(invoice.balanceAmount ?? 0),
                  0
                );
                const paid = Math.max(amount - balance, 0);

                return (
                  <tr
                    key={invoice.id}
                    className="transition hover:bg-indigo-50/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold text-indigo-700">
                        {invoice.invoiceNumber || `INV-${invoice.id}`}
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {invoice.studentName || 'Unknown student'}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Student ID:{' '}
                        {getText(
                          getExtraField(invoice, 'studentId', 'student_id')
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {getText(
                        getExtraField(invoice, 'quarter', 'feePeriod', 'fee_period')
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {getText(
                        getExtraField(invoice, 'academicYear', 'academic_year')
                      )}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-slate-700">
                      {money(amount)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono font-semibold text-emerald-700">
                      {money(paid)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono font-bold text-red-700">
                      {money(balance)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle(status)}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="View invoice details"
                          onClick={() => setSelectedInvoice(invoice)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Eye size={16} />
                        </button>

                        {balance > 0 && (
                          <button
                            type="button"
                            title="Record payment"
                            onClick={() => openPaymentForm(invoice)}
                            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700"
                          >
                            <IndianRupee size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <Receipt
                      size={26}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 font-semibold text-slate-700">
                      No invoices found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or clear the filters.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Payments */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <History size={19} className="text-indigo-600" />
            Recent Payment Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Payment information currently available in the application.
          </p>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Receipt</th>
                  <th className="px-4 py-3 font-bold">Invoice ID</th>
                  <th className="px-4 py-3 font-bold">Payment Date</th>
                  <th className="px-4 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 10).map((payment, index) => {
                  const method = getPaymentMethod(payment);
                  const MethodIcon =
                    method.toLowerCase() === 'cash'
                      ? Banknote
                      : CreditCard;

                  return (
                    <tr
                      key={
                        getExtraField(payment, 'id') !== undefined
                          ? String(getExtraField(payment, 'id'))
                          : `payment-${index}`
                      }
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {getReceiptNumber(payment) !== '—'
                            ? getReceiptNumber(payment)
                            : `Payment #${index + 1}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Ref: {getTransactionReference(payment)}
                        </p>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-slate-600">
                        {getText(
                          getExtraField(payment, 'invoiceId', 'invoice_id')
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(getPaymentDate(payment))}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                          <MethodIcon size={14} />
                          {method}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-bold text-emerald-700">
                        {money(payment.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <Wallet size={26} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No payment records available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Payment records will appear here when available.
            </p>
          </div>
        )}
      </section>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInvoice(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fee-invoice-modal-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="fee-invoice-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Invoice Details
                </h2>
                <p className="mt-1 font-mono text-xs text-indigo-600">
                  {selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                aria-label="Close invoice details"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="rounded-xl bg-white p-2.5 text-indigo-700">
                  <UserRound size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">
                    {selectedInvoice.studentName || 'Unknown student'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Student ID:{' '}
                    {getText(
                      getExtraField(selectedInvoice, 'studentId', 'student_id')
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Academic Year:{' '}
                    {getText(
                      getExtraField(
                        selectedInvoice,
                        'academicYear',
                        'academic_year'
                      )
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle(getStatus(selectedInvoice))}`}
                >
                  {getStatus(selectedInvoice)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Invoice Number"
                  value={getText(selectedInvoice.invoiceNumber)}
                />
                <DetailItem
                  label="Invoice ID"
                  value={String(selectedInvoice.id)}
                />
                <DetailItem
                  label="Invoice Date"
                  value={formatDate(
                    getExtraField(
                      selectedInvoice,
                      'invoiceDate',
                      'invoice_date',
                      'createdAt',
                      'created_at'
                    )
                  )}
                />
                <DetailItem
                  label="Due Date"
                  value={formatDate(
                    getExtraField(selectedInvoice, 'dueDate', 'due_date')
                  )}
                />
                <DetailItem
                  label="Quarter / Fee Period"
                  value={getText(
                    getExtraField(
                      selectedInvoice,
                      'quarter',
                      'feePeriod',
                      'fee_period'
                    )
                  )}
                />
                <DetailItem
                  label="Notes"
                  value={getText(getExtraField(selectedInvoice, 'notes'))}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <AmountDetail
                  label="Total Amount"
                  amount={Number(selectedInvoice.amount ?? 0)}
                  color="slate"
                />
                <AmountDetail
                  label="Paid Amount"
                  amount={Math.max(
                    Number(selectedInvoice.amount ?? 0) -
                      Number(selectedInvoice.balanceAmount ?? 0),
                    0
                  )}
                  color="green"
                />
                <AmountDetail
                  label="Outstanding"
                  amount={Math.max(
                    Number(selectedInvoice.balanceAmount ?? 0),
                    0
                  )}
                  color="red"
                />
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                  <History size={17} className="text-indigo-600" />
                  Payment History
                </h3>

                {getInvoicePayments(selectedInvoice).length > 0 ? (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {getInvoicePayments(selectedInvoice).map(
                      (payment, index) => (
                        <div
                          key={
                            getExtraField(payment, 'id') !== undefined
                              ? String(getExtraField(payment, 'id'))
                              : `invoice-payment-${index}`
                          }
                          className="flex items-center justify-between gap-3 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {getReceiptNumber(payment) !== '—'
                                ? getReceiptNumber(payment)
                                : `Payment #${index + 1}`}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(getPaymentDate(payment))} ·{' '}
                              {getPaymentMethod(payment)}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono font-bold text-emerald-700">
                            {money(payment.amount)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                    No payment history available for this invoice.
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                {Number(selectedInvoice.balanceAmount ?? 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const invoice = selectedInvoice;
                      setSelectedInvoice(null);
                      openPaymentForm(invoice);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <IndianRupee size={16} />
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentInvoice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPaymentInvoice(null);
              setFormMessage('');
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-fee-payment-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="record-fee-payment-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Record Payment
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Invoice: {paymentInvoice.invoiceNumber || paymentInvoice.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPaymentInvoice(null);
                  setFormMessage('');
                }}
                aria-label="Close payment form"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={validatePayment} className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Student</p>
                <p className="mt-1 font-bold text-slate-900">
                  {paymentInvoice.studentName || 'Unknown student'}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600">
                    Outstanding Balance
                  </span>
                  <span className="font-mono text-lg font-bold text-red-700">
                    {money(paymentInvoice.balanceAmount)}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="fee-payment-amount"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Payment Amount (₹) *
                </label>
                <input
                  id="fee-payment-amount"
                  type="number"
                  min="0.01"
                  max={Math.max(
                    Number(paymentInvoice.balanceAmount ?? 0),
                    0
                  )}
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter amount"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fee-payment-method"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Payment Method *
                  </label>
                  <select
                    id="fee-payment-method"
                    required
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fee-payment-date"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Payment Date *
                  </label>
                  <input
                    id="fee-payment-date"
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="fee-transaction-reference"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Transaction Reference
                </label>
                <input
                  id="fee-transaction-reference"
                  value={transactionReference}
                  onChange={(event) =>
                    setTransactionReference(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400"
                  placeholder="UPI ID, cheque number, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="fee-payment-notes"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Notes
                </label>
                <textarea
                  id="fee-payment-notes"
                  rows={2}
                  value={paymentNotes}
                  onChange={(event) => setPaymentNotes(event.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-400"
                  placeholder="Optional notes..."
                />
              </div>

              {formMessage && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {formMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentInvoice(null);
                    setFormMessage('');
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <CheckCircle2 size={16} />
                  Validate Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface AmountDetailProps {
  label: string;
  amount: number;
  color: 'slate' | 'green' | 'red';
}

const AmountDetail: React.FC<AmountDetailProps> = ({
  label,
  amount,
  color,
}) => {
  const colors = {
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-800',
    red: 'border-red-100 bg-red-50 text-red-800',
  };

  return (
    <div className={`rounded-xl border p-3.5 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="mt-2 break-words font-mono text-lg font-bold">
        {money(amount)}
      </p>
    </div>
  );
};
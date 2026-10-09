
import React, { useCallback, useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

type RouteStatus = "Active" | "Inactive";

interface RouteStop {
  id?: number;
  stopName: string;
  stopOrder?: number;
  pickupTime: string;
  dropTime: string;
}

interface TransportRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  vehicleId: string | null;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  capacity: number;
  routeStatus: RouteStatus;
  vehicleStatus: RouteStatus;
  startPoint: string;
  endPoint: string;
  stops: RouteStop[];
}

interface RouteForm {
  routeNumber: string;
  routeName: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  capacity: number;
  routeStatus: RouteStatus;
  vehicleStatus: RouteStatus;
  startPoint: string;
  endPoint: string;
  stops: RouteStop[];
}

interface TransportModuleProps {
  routes?: TransportRoute[];
}

const newStop = (): RouteStop => ({
  stopName: "",
  pickupTime: "",
  dropTime: "",
});

const newForm = (): RouteForm => ({
  routeNumber: "",
  routeName: "",
  vehicleNumber: "",
  vehicleType: "Bus",
  driverName: "",
  driverPhone: "",
  conductorName: "",
  conductorPhone: "",
  capacity: 40,
  routeStatus: "Active",
  vehicleStatus: "Active",
  startPoint: "",
  endPoint: "",
  stops: [newStop()],
});

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

function getErrorMessage(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof data.detail === "string"
  ) {
    return data.detail;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { detail: text };
  }
}

function normalizeRoute(value: unknown): TransportRoute {
  const route = value as Partial<TransportRoute>;

  return {
    id: String(route.id ?? ""),
    routeNumber: route.routeNumber ?? "",
    routeName: route.routeName ?? "",
    vehicleId: route.vehicleId ?? null,
    vehicleNumber: route.vehicleNumber ?? "",
    vehicleType: route.vehicleType ?? "Bus",
    driverName: route.driverName ?? "",
    driverPhone: route.driverPhone ?? "",
    conductorName: route.conductorName ?? "",
    conductorPhone: route.conductorPhone ?? "",
    capacity: Number(route.capacity ?? 0),
    routeStatus: route.routeStatus ?? "Active",
    vehicleStatus: route.vehicleStatus ?? "Active",
    startPoint: route.startPoint ?? "",
    endPoint: route.endPoint ?? "",
    stops: Array.isArray(route.stops)
      ? route.stops.map((stop) => ({
        id: stop.id,
        stopName: stop.stopName ?? "",
        stopOrder: stop.stopOrder,
        pickupTime: stop.pickupTime ?? "",
        dropTime: stop.dropTime ?? "",
      }))
      : [],
  };
}

export const TransportModule: React.FC<TransportModuleProps> = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RouteForm>(newForm());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/transport-routes`);
      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to load transport routes.")
        );
      }

      const body = result as {
        data?: unknown[];
        items?: unknown[];
      };

      const list = Array.isArray(result)
        ? result
        : Array.isArray(body.data)
          ? body.data
          : Array.isArray(body.items)
            ? body.items
            : [];

      setRoutes(list.map(normalizeRoute));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoutes();
  }, [loadRoutes]);

  const openAdd = () => {
    setEditingId(null);
    setForm(newForm());
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEdit = (route: TransportRoute) => {
    setEditingId(route.id);

    setForm({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      vehicleNumber: route.vehicleNumber,
      vehicleType: route.vehicleType,
      driverName: route.driverName,
      driverPhone: route.driverPhone,
      conductorName: route.conductorName,
      conductorPhone: route.conductorPhone,
      capacity: route.capacity || 40,
      routeStatus: route.routeStatus,
      vehicleStatus: route.vehicleStatus,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      stops: route.stops.length
        ? route.stops.map((stop) => ({ ...stop }))
        : [newStop()],
    });

    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const changeField = (
    field: keyof RouteForm,
    value: string | number
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const changeStop = (
    index: number,
    field: keyof RouteStop,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      stops: current.stops.map((stop, i) =>
        i === index ? { ...stop, [field]: value } : stop
      ),
    }));
  };

  const addStop = () => {
    setForm((current) => ({
      ...current,
      stops: [...current.stops, newStop()],
    }));
  };

  const removeStop = (index: number) => {
    setForm((current) => ({
      ...current,
      stops: current.stops.filter((_, i) => i !== index),
    }));
  };

  const saveRoute = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      routeNumber: form.routeNumber.trim(),
      routeName: form.routeName.trim(),
      vehicleNumber: form.vehicleNumber.trim(),
      driverName: form.driverName.trim(),
      driverPhone: form.driverPhone.trim(),
      stops: form.stops
        .filter((stop) => stop.stopName.trim())
        .map((stop) => ({
          stopName: stop.stopName.trim(),
          pickupTime: stop.pickupTime || null,
          dropTime: stop.dropTime || null,
        })),
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/transport-routes/${encodeURIComponent(editingId)}`
          : `${API_URL}/transport-routes`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(result, "Unable to save route."));
      }

      setModalOpen(false);
      setNotice(
        editingId
          ? "Route updated successfully."
          : "Route added successfully."
      );

      await loadRoutes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save route."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRoute = async (route: TransportRoute) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${route.routeName}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/transport-routes/${encodeURIComponent(route.id)}`,
        { method: "DELETE" }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(result, "Unable to delete route."));
      }

      setRoutes((current) =>
        current.filter((item) => item.id !== route.id)
      );
      setNotice("Route deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete route."
      );
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const query = search.toLowerCase().trim();

    const matchesSearch = [
      route.routeNumber,
      route.routeName,
      route.vehicleNumber,
      route.driverName,
      route.driverPhone,
      route.conductorName,
      route.startPoint,
      route.endPoint,
    ].some((value) => String(value ?? "").toLowerCase().includes(query));

    return (
      matchesSearch &&
      (filter === "All" || route.routeStatus === filter)
    );
  });

  const activeCount = routes.filter(
    (route) => route.routeStatus === "Active"
  ).length;

  const totalStops = routes.reduce(
    (total, route) => total + route.stops.length,
    0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            School Operations
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Transport & Fleet Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage buses, drivers, routes and scheduled stops.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          + Add Bus Route
        </button>
      </header>

      {notice && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {notice}
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadRoutes()}
            className="font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Routes", value: routes.length },
          { label: "Active Routes", value: activeCount },
          { label: "Scheduled Stops", value: totalStops },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search route, bus or driver..."
          className={inputClass}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className={`${inputClass} sm:max-w-48`}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active routes</option>
          <option value="Inactive">Inactive routes</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-sm text-slate-500">
          Loading transport details...
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-semibold text-slate-700">No bus routes found</p>
          <p className="mt-1 text-sm text-slate-500">
            Add a route or try another search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredRoutes.map((route) => (
            <article
              key={route.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Route {route.routeNumber}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {route.routeName}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {route.startPoint || "Start not set"} →{" "}
                    {route.endPoint || "Destination not set"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${route.routeStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  {route.routeStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Bus Number</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {route.vehicleNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Vehicle Type</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {route.vehicleType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Capacity</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {route.capacity} seats
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Driver</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {route.driverName || "Not assigned"}
                  </p>
                  <p className="text-xs text-slate-500">{route.driverPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Conductor</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {route.conductorName || "Not assigned"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {route.conductorPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Bus Status</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {route.vehicleStatus}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 py-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Route Stops ({route.stops.length})
                </h4>

                {route.stops.length === 0 ? (
                  <p className="text-sm text-slate-400">No stops added.</p>
                ) : (
                  <div className="space-y-3">
                    {route.stops.map((stop, index) => (
                      <div
                        key={stop.id ?? `${stop.stopName}-${index}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                            {index + 1}
                          </span>
                          <span className="font-medium text-slate-700">
                            {stop.stopName}
                          </span>
                        </div>
                        <span className="text-right text-xs text-slate-500">
                          Pickup: {stop.pickupTime || "—"}
                          <br />
                          Drop: {stop.dropTime || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
                <button
                  type="button"
                  onClick={() => openEdit(route)}
                  className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteRoute(route)}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}


      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-6">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Bus Route" : "Add Bus Route"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Bus, driver and route details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveRoute} className="space-y-6 p-5">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Route Details */}
              <section>
                <h4 className="mb-3 font-bold text-slate-800">
                  Route Details
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Route Number *</span>
                    <input
                      required
                      maxLength={50}
                      value={form.routeNumber ?? ""}
                      onChange={(e) =>
                        changeField("routeNumber", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Route Name *</span>
                    <input
                      required
                      maxLength={150}
                      value={form.routeName ?? ""}
                      onChange={(e) =>
                        changeField("routeName", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Start Point</span>
                    <input
                      value={form.startPoint ?? ""}
                      onChange={(e) =>
                        changeField("startPoint", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>End Point</span>
                    <input
                      value={form.endPoint ?? ""}
                      onChange={(e) =>
                        changeField("endPoint", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Route Status</span>
                    <select
                      value={form.routeStatus ?? "Active"}
                      onChange={(e) =>
                        changeField(
                          "routeStatus",
                          e.target.value as "Active" | "Inactive"
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* Bus and Driver Details */}
              <section className="border-t pt-5">
                <h4 className="mb-3 font-bold text-slate-800">
                  Bus &amp; Driver
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Bus Number *</span>
                    <input
                      required
                      maxLength={50}
                      value={form.vehicleNumber ?? ""}
                      onChange={(e) =>
                        changeField("vehicleNumber", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Vehicle Type</span>
                    <select
                      value={form.vehicleType ?? "Bus"}
                      onChange={(e) =>
                        changeField("vehicleType", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Mini Bus">Mini Bus</option>
                      <option value="Van">Van</option>
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>Capacity *</span>
                    <input
                      required
                      type="number"
                      min={1}
                      max={200}
                      value={form.capacity ?? 40}
                      onChange={(e) =>
                        changeField("capacity", Number(e.target.value))
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Bus Status</span>
                    <select
                      value={form.vehicleStatus ?? "Active"}
                      onChange={(e) =>
                        changeField(
                          "vehicleStatus",
                          e.target.value as "Active" | "Inactive"
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>

                  <label>
                    <span className={labelClass}>Driver Name *</span>
                    <input
                      required
                      value={form.driverName ?? ""}
                      onChange={(e) =>
                        changeField("driverName", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Driver Phone *</span>
                    <input
                      required
                      type="tel"
                      value={form.driverPhone ?? ""}
                      onChange={(e) =>
                        changeField("driverPhone", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Conductor Name</span>
                    <input
                      value={form.conductorName ?? ""}
                      onChange={(e) =>
                        changeField("conductorName", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label>
                    <span className={labelClass}>Conductor Phone</span>
                    <input
                      type="tel"
                      value={form.conductorPhone ?? ""}
                      onChange={(e) =>
                        changeField("conductorPhone", e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              {/* Scheduled Stops */}
              <section className="border-t pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-bold text-slate-800">
                    Scheduled Stops
                  </h4>

                  <button
                    type="button"
                    onClick={addStop}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    + Add Stop
                  </button>
                </div>

                <div className="space-y-3">
                  {(form.stops ?? []).map((stop, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4"
                    >
                      <label>
                        <span className={labelClass}>Stop Name *</span>
                        <input
                          required
                          value={stop.stopName ?? ""}
                          onChange={(e) =>
                            changeStop(index, "stopName", e.target.value)
                          }
                          className={inputClass}
                          placeholder="e.g. Main Market"
                        />
                      </label>

                      <label>
                        <span className={labelClass}>Pickup Time</span>
                        <input
                          type="time"
                          value={stop.pickupTime ?? ""}
                          onChange={(e) =>
                            changeStop(index, "pickupTime", e.target.value)
                          }
                          className={inputClass}
                        />
                      </label>

                      <label>
                        <span className={labelClass}>Drop Time</span>
                        <input
                          type="time"
                          value={stop.dropTime ?? ""}
                          onChange={(e) =>
                            changeStop(index, "dropTime", e.target.value)
                          }
                          className={inputClass}
                        />
                      </label>

                      <button
                        type="button"
                        disabled={(form.stops ?? []).length <= 1}
                        onClick={() => removeStop(index)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Route"
                      : "Save Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportModule;
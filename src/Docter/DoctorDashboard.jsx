import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const appointmentsPerPage = 10;

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setLoading(true);

      const response = await axios.get(
        "https://medicare-backend-3tkw.onrender.com/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 1,
            limit: 1000,
          },
        },
      );

      if (response.data.success) {
        const allData = response.data.appointments || [];
        setAllAppointments(allData);
        setTotalAppointments(allData.length);
      }
    } catch (error) {
      console.error("Appointment Error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Doctor login expired. Please login again.");
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login", { replace: true });
        return;
      }

      alert(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Load and refresh appointments
  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchAppointments();

    const interval = setInterval(
      () => {
        fetchAppointments();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  // Update appointment status
  const updateAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setUpdatingId(id);

      const response = await axios.put(
        `https://medicare-backend-3tkw.onrender.com/api/appointment/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert(
          status === "Accepted"
            ? "Appointment accepted successfully"
            : status === "Declined"
              ? "Appointment declined successfully"
              : "Appointment completed successfully",
        );

        await fetchAppointments();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Doctor login expired. Please login again.");
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login", { replace: true });
        return;
      }

      alert(error.response?.data?.message || "Unable to update appointment");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAccept = (id) => {
    updateAppointmentStatus(id, "Accepted");
  };

  const handleDecline = (id) => {
    updateAppointmentStatus(id, "Declined");
  };

  const handleComplete = (id) => {
    updateAppointmentStatus(id, "Completed");
  };

  // Appointment statistics
  const pendingAppointments = allAppointments.filter(
    (appointment) => !appointment.status || appointment.status === "Pending",
  );

  const acceptedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Accepted",
  );

  const declinedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Declined",
  );

  const completedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Completed",
  );

  const pendingCount = pendingAppointments.length;

  // Filter appointments
  const filteredAllAppointments = allAppointments.filter((appointment) => {
    const appointmentStatus = appointment.status || "Pending";

    const statusMatch =
      statusFilter === "All" || appointmentStatus === statusFilter;

    if (!appointment.date) {
      return statusMatch;
    }

    const appointmentDate = new Date(appointment.date);

    if (isNaN(appointmentDate.getTime())) {
      return statusMatch;
    }

    const monthMatch =
      monthFilter === "" ||
      appointmentDate.getMonth() + 1 === Number(monthFilter);

    const yearMatch =
      yearFilter === "" || appointmentDate.getFullYear() === Number(yearFilter);

    return statusMatch && monthMatch && yearMatch;
  });

  const availableYears = [
    ...new Set(
      allAppointments
        .filter((appointment) => appointment.date)
        .map((appointment) => {
          const date = new Date(appointment.date);

          if (!isNaN(date.getTime())) {
            return date.getFullYear();
          }

          return null;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => b - a);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAllAppointments.length / appointmentsPerPage),
  );

  const startIndex = (count - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;

  const filteredAppointments = filteredAllAppointments.slice(
    startIndex,
    endIndex,
  );

  useEffect(() => {
    setCount(1);
  }, [statusFilter, monthFilter, yearFilter]);

  useEffect(() => {
    if (count > totalPages) {
      setCount(totalPages);
    }
  }, [count, totalPages]);

  const handleIncrement = () => {
    setCount((previousCount) =>
      previousCount < totalPages ? previousCount + 1 : previousCount,
    );
  };

  const handleDecrement = () => {
    setCount((previousCount) => (previousCount > 1 ? previousCount - 1 : 1));
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Declined") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex w-full overflow-x-hidden">
      {/* Reusable Sidebar */}
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 min-w-0 w-full lg:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition shrink-0"
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Doctor Administration
              </p>

              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">
                Welcome, Dr.Joseph
              </h1>
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-11 h-11 rounded-xl overflow-hidden">
                <img
                  src={doctorImage}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Dr.Joseph
                </p>

                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-3 sm:p-6 lg:p-10 min-w-0">
          {/* Hero */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 rounded-[2rem] p-5 sm:p-7 lg:p-10 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
              <div className="min-w-0">
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
                  Doctor Dashboard
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-5">
                  Welcome back, Dr.Joseph
                </h2>

                <p className="text-blue-100 leading-7 mt-3 max-w-2xl text-sm sm:text-base">
                  Manage your appointments, review patient requests, and keep
                  track of your healthcare activities.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 lg:min-w-[180px]">
                <p className="text-blue-100 text-sm">New Requests</p>

                <p className="text-4xl font-bold mt-2">{pendingCount}</p>

                <p className="text-blue-100 text-sm mt-1">
                  Pending appointments
                </p>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 mt-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Total Appointments</p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {totalAppointments}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Pending</p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                {pendingAppointments.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Accepted</p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {acceptedAppointments.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Declined</p>

              <h3 className="text-3xl font-bold text-red-500 mt-2">
                {declinedAppointments.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Completed</p>

              <h3 className="text-3xl font-bold text-sky-500 mt-2">
                {completedAppointments.length}
              </h3>
            </div>
          </section>

          {/* Appointments */}
          <section className="mt-8 sm:mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                  Appointment Requests
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  All Patient Appointments
                </h2>

                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  View complete appointment details and manage patient requests.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchAppointments}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-md"
              >
                Refresh
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Appointment Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Appointments</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Month
                  </label>

                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Year
                  </label>

                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>

                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(statusFilter !== "All" ||
                monthFilter !== "" ||
                yearFilter !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("All");
                    setMonthFilter("");
                    setYearFilter("");
                  }}
                  className="mt-4 text-sm text-red-600 font-semibold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Appointment List */}
            {loading ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 mt-6 text-center">
                <div className="text-4xl animate-pulse">📅</div>

                <p className="text-gray-500 mt-4">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 mt-6 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  📅
                </div>

                <h3 className="text-xl font-bold text-slate-800 mt-5">
                  No Appointments Found
                </h3>

                <p className="text-gray-500 mt-2">
                  No appointments match the selected filters.
                </p>
              </div>
            ) : (
              <div className="space-y-5 mt-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition min-w-0"
                  >
                    {/* Patient Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-6">
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                          {appointment.userId?.image ? (
                            <img
                              src={`https://res.cloudinary.com/djmsizzc/image/upload/${appointment.userId.image}`}
                              alt="Patient"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                              {appointment.userId?.name ||
                                appointment.name ||
                                "Patient"}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status || "Pending"}
                            </span>
                          </div>

                          <p className="text-gray-500 mt-1 text-sm sm:text-base break-all">
                            {appointment.userId?.email || "Patient appointment"}
                          </p>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-blue-50 rounded-xl px-4 py-3 flex-1 sm:flex-none min-w-0">
                          <p className="text-xs text-gray-500">Date</p>

                          <p className="font-semibold text-blue-700 mt-1 break-words">
                            {appointment.date}
                          </p>
                        </div>

                        <div className="bg-cyan-50 rounded-xl px-4 py-3 flex-1 sm:flex-none min-w-0">
                          <p className="text-xs text-gray-500">Time</p>

                          <p className="font-semibold text-cyan-700 mt-1 break-words">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-2xl p-4 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Contact
                        </p>

                        <p className="text-slate-700 font-medium mt-2 break-all">
                          {appointment.contact || "Not provided"}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Email
                        </p>

                        <p className="text-slate-700 font-medium mt-2 break-all">
                          {appointment.userId?.email ||
                            appointment.email ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 md:col-span-2 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Patient Description
                        </p>

                        <p className="text-slate-700 mt-2 leading-6 whitespace-pre-wrap break-words">
                          {appointment.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Pending Appointment Actions */}
                    {(!appointment.status ||
                      appointment.status === "Pending") && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleAccept(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 px-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✓ Accept Appointment"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDecline(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 px-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✕ Decline Appointment"}
                        </button>
                      </div>
                    )}

                    {/* Accepted Appointment */}
                    {appointment.status === "Accepted" && (
                      <div className="mt-5 bg-green-50 border border-green-100 rounded-xl px-4 sm:px-5 py-4">
                        <p className="text-green-700 font-semibold">
                          ✓ This appointment has been accepted.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleComplete(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✓ Complete Appointment"}
                        </button>
                      </div>
                    )}

                    {/* Declined Appointment */}
                    {appointment.status === "Declined" && (
                      <div className="mt-5 bg-red-50 border border-red-100 rounded-xl px-4 sm:px-5 py-4">
                        <p className="text-red-700 font-semibold">
                          ✕ This appointment has been declined.
                        </p>
                      </div>
                    )}

                    {/* Completed Appointment and Feedback */}
                    {appointment.status === "Completed" && (
                      <>
                        {appointment.feedback && (
                          <div className="mt-5 bg-slate-50 rounded-2xl p-4 min-w-0">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                              Patient Feedback
                            </p>

                            <div className="flex flex-wrap items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={
                                    star <= appointment.feedback.rating
                                      ? "text-yellow-400 text-xl"
                                      : "text-gray-300 text-xl"
                                  }
                                >
                                  ★
                                </span>
                              ))}

                              <span className="ml-2 font-semibold text-slate-700">
                                {appointment.feedback.rating}/5
                              </span>
                            </div>

                            {appointment.feedback.comment && (
                              <p className="text-slate-700 mt-2 leading-6 whitespace-pre-wrap break-words">
                                {appointment.feedback.comment}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 sm:px-5 py-4">
                          <p className="text-blue-700 font-semibold">
                            ✓ This appointment has been completed.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredAllAppointments.length > 0 && (
              <div className="w-full flex items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count === 1}
                  aria-label="Previous page"
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ←
                </button>

                <div className="min-w-10 h-10 px-3 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
                  {count}
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
                  aria-label="Next page"
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  →
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import doctorImage from "../assets/doctor.jpg";
import logo from "../assets/logo.png";
import diseaseIcon from "../assets/virus.png";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const appointmentsPerPage = 10;

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    navigate("/doctor/login", { replace: true });
  };

  // FETCH APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setLoading(true);

      const response = await axios.get(
        "https://medicare-backend-hajh.onrender.com/api/appointments",
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

  // FETCH ON LOAD
  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchAppointments();
  }, []);

  // FETCH EVERY 5 MINUTES
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchAppointments();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  // UPDATE APPOINTMENT STATUS
  const updateAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setUpdatingId(id);

      const response = await axios.put(
        `https://medicare-backend-hajh.onrender.com/api/appointment/${id}/status`,
        {
          status,
        },
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

  // ACCEPT
  const handleAccept = (id) => {
    updateAppointmentStatus(id, "Accepted");
  };

  // DECLINE
  const handleDecline = (id) => {
    updateAppointmentStatus(id, "Declined");
  };

  // COMPLETE
  const handleComplete = (id) => {
    updateAppointmentStatus(id, "Completed");
  };

  // APPOINTMENT STATISTICS
  const pendingAppointments = allAppointments.filter(
    (appointment) => !appointment.status || appointment.status === "Pending",
  );

  const acceptedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Accepted",
  );

  const declinedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Declined",
  );

  const CompletedAppointments = allAppointments.filter(
    (appointment) => appointment.status === "Completed",
  );

  const pendingCount = pendingAppointments.length;

  // FILTER ALL APPOINTMENTS BEFORE PAGINATION
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

  // AVAILABLE YEARS
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

  // PAGINATION
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

  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCount(1);
  }, [statusFilter, monthFilter, yearFilter]);

  // KEEP PAGE NUMBER VALID
  useEffect(() => {
    if (count > totalPages) {
      setCount(totalPages);
    }
  }, [count, totalPages]);

  // PAGINATION BUTTONS
  const handleIncrement = () => {
    setCount((prevCount) =>
      prevCount < totalPages ? prevCount + 1 : prevCount,
    );
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#020617] fixed left-0 top-0 bottom-0 hidden lg:flex flex-col z-50">
        {/* LOGO */}
        <div className="p-7 border-b border-slate-800">
          <Link to="/doctor/dashboard" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-1">
              <img
                src={logo}
                alt="MediCare Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">MediCare</h1>

              <p className="text-xs text-slate-400">Doctor Administration</p>
            </div>
          </Link>
        </div>

        {/* MENU */}
        <div className="px-4 mt-8">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider px-2 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2">
            {/* DASHBOARD */}
            <NavLink
              to="/doctor/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">⌂</span>

              <span>Dashboard</span>
            </NavLink>

            {/* APPOINTMENTS */}
            {/*
            <NavLink
              to="/doctor/appointment"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">
                ▣
              </span>

              <span>Appointments</span>

              {pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </NavLink>
            */}

            {/* PATIENTS */}
            <NavLink
              to="/doctor/patients"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">♙</span>

              <span>Patients</span>
            </NavLink>

            {/* USER MANAGEMENT */}
            <NavLink
              to="/doctor/users"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">♟</span>

              <span>User Management</span>
            </NavLink>

            {/* DISEASES */}
            <NavLink
              to="/doctor/diseases"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center flex items-center justify-center">
                <img
                  src={diseaseIcon}
                  alt="Disease"
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </span>

              <span>Diseases</span>
            </NavLink>

            {/* CONTACT MESSAGES */}

            <NavLink
              to="/doctor/contacts"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">✉</span>

              <span>Contact Messages</span>
            </NavLink>

            {/* PROFILE */}
            <NavLink
              to="/doctor/profile"
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span className="text-xl w-6 text-center">◉</span>

              <span>Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="mt-auto px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5 transition"
          >
            <span className="text-xl w-6 text-center">⇥</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-72">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doctor Administration</p>

              <h1 className="text-2xl font-bold text-slate-800 mt-1">
                Welcome, Dr.Joseph
              </h1>
            </div>

            <div className="flex items-center gap-4">
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
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-6 lg:p-10">
          {/* HERO */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 rounded-[2rem] p-7 lg:p-10 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
                  Doctor Dashboard
                </span>

                <h2 className="text-3xl lg:text-4xl font-bold mt-5">
                  Welcome back, Dr.Joseph
                </h2>

                <p className="text-blue-100 leading-7 mt-3 max-w-2xl">
                  Manage your appointments, review patient requests, and keep
                  track of your healthcare activities.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 min-w-[180px]">
                <p className="text-blue-100 text-sm">New Requests</p>

                <p className="text-4xl font-bold mt-2">{pendingCount}</p>

                <p className="text-blue-100 text-sm mt-1">
                  Pending appointments
                </p>
              </div>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">
            {/* TOTAL */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Total Appointments</p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {totalAppointments}
              </h3>
            </div>

            {/* PENDING */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Pending</p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                {pendingAppointments.length}
              </h3>
            </div>

            {/* ACCEPTED */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Accepted</p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {acceptedAppointments.length}
              </h3>
            </div>

            {/* DECLINED */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Declined</p>

              <h3 className="text-3xl font-bold text-red-500 mt-2">
                {declinedAppointments.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <p className="text-gray-500 text-sm">Completed</p>

              <h3 className="text-3xl font-bold text-sky-500 mt-2">
                {CompletedAppointments.length}
              </h3>
            </div>
          </section>

          {/* APPOINTMENTS */}
          <section className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                  Appointment Requests
                </span>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  All Patient Appointments
                </h2>

                <p className="text-gray-500 mt-1">
                  View complete appointment details and manage patient requests.
                </p>
              </div>

              <button
                onClick={fetchAppointments}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-md"
              >
                Refresh
              </button>
            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* STATUS */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Appointment Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Appointments</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* MONTH */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Month
                  </label>

                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* YEAR */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Year
                  </label>

                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* CLEAR FILTER */}
              {(statusFilter !== "All" ||
                monthFilter !== "" ||
                yearFilter !== "") && (
                <button
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

            {/* APPOINTMENT CONTENT */}
            {loading ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 mt-6 text-center">
                <div className="text-4xl animate-pulse">📅</div>

                <p className="text-gray-500 mt-4">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 mt-6 text-center">
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
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
                  >
                    {/* PATIENT HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex gap-4">
                        {/* PATIENT IMAGE */}
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                          {appointment.userId?.image ? (
                            <img
                              src={`https://res.cloudinary.com/djmsizzc/image/upload/${appointment.userId.image}`}
                              alt="Patient"
                              className="w-14 h-14 rounded-2xl object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>

                        {/* PATIENT INFO */}
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-800">
                              {appointment.userId?.name ||
                                appointment.name ||
                                "Patient"}
                            </h3>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                appointment.status === "Accepted"
                                  ? "bg-green-100 text-green-700"
                                  : appointment.status === "Declined"
                                    ? "bg-red-100 text-red-700"
                                    : appointment.status === "Completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {appointment.status || "Pending"}
                            </span>
                          </div>

                          <p className="text-gray-500 mt-1">
                            {appointment.userId?.email || "Patient appointment"}
                          </p>
                        </div>
                      </div>

                      {/* DATE AND TIME */}
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-blue-50 rounded-xl px-4 py-3">
                          <p className="text-xs text-gray-500">Date</p>

                          <p className="font-semibold text-blue-700 mt-1">
                            {appointment.date}
                          </p>
                        </div>

                        <div className="bg-cyan-50 rounded-xl px-4 py-3">
                          <p className="text-xs text-gray-500">Time</p>

                          <p className="font-semibold text-cyan-700 mt-1">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* COMPLETE DETAILS */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {/* CONTACT */}
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Contact
                        </p>

                        <p className="text-slate-700 font-medium mt-2">
                          {appointment.contact || "Not provided"}
                        </p>
                      </div>

                      {/* EMAIL */}
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Email
                        </p>

                        <p className="text-slate-700 font-medium mt-2">
                          {appointment.userId?.email ||
                            appointment.email ||
                            "Not provided"}
                        </p>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="bg-slate-50 rounded-2xl p-4 md:col-span-2">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Patient Description
                        </p>

                        <p className="text-slate-700 mt-2 leading-6">
                          {appointment.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* ACCEPT AND DECLINE */}
                    {(!appointment.status ||
                      appointment.status === "Pending") && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-slate-100">
                        <button
                          onClick={() => handleAccept(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✓ Accept Appointment"}
                        </button>

                        <button
                          onClick={() => handleDecline(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✕ Decline Appointment"}
                        </button>
                      </div>
                    )}

                    {/* ACCEPTED */}
                    {appointment.status === "Accepted" && (
                      <div className="mt-5 bg-green-50 border border-green-100 rounded-xl px-5 py-4">
                        <p className="text-green-700 font-semibold">
                          ✓ This appointment has been accepted.
                        </p>

                        <button
                          onClick={() => handleComplete(appointment._id)}
                          disabled={updatingId === appointment._id}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition shadow-sm"
                        >
                          {updatingId === appointment._id
                            ? "Updating..."
                            : "✓ Complete Appointment"}
                        </button>
                      </div>
                    )}

                    {/* DECLINED */}
                    {appointment.status === "Declined" && (
                      <div className="mt-5 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                        <p className="text-red-700 font-semibold">
                          ✕ This appointment has been declined.
                        </p>
                      </div>
                    )}

                    {/* COMPLETED */}
                    {/* COMPLETED */}
                    {appointment.status === "Completed" && (
                      <>
                        {/* PATIENT FEEDBACK */}
                        {appointment.feedback && (
                          <div className="mt-5 bg-slate-50 rounded-2xl p-4 md:col-span-2">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                              Patient Feedback
                            </p>

                            {/* RATING */}
                            <div className="flex items-center gap-1 mt-2">
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

                            {/* COMMENT */}
                            {appointment.feedback.comment && (
                              <p className="text-slate-700 mt-2 leading-6">
                                {appointment.feedback.comment}
                              </p>
                            )}
                          </div>
                        )}

                        {/* COMPLETED MESSAGE */}
                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
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

            {/* PAGINATION */}
            {!loading && filteredAllAppointments.length > 0 && (
              <div className="w-full flex items-center justify-center gap-2 mt-8">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleDecrement}
                  disabled={count === 1}
                >
                  ←
                </button>

                <div className="min-w-10 h-10 px-3 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
                  {count}
                </div>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
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

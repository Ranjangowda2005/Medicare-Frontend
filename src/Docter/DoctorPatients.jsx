import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import doctorImage from "../assets/doctor.jpg";
import diseaseIcon from "../assets/virus.png";
import logo from "../assets/logo.png";

const DoctorPatients = () => {
  const navigate = useNavigate();

  // Pagination state
  const [count, setCount] = useState(1);

  // Patient data
  const [allPatients, setAllPatients] = useState([]);

  // Search and loading state
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Number of patients displayed on each page
  const patientsPerPage = 10;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    navigate("/doctor/login", { replace: true });
  };

  // =====================================================
  // FETCH PATIENTS
  // =====================================================

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("doctorToken");

      // Check doctor authentication
      if (!token) {
        navigate("/doctor/login");
        return;
      }

      // Fetch all appointments
      const response = await axios.get(
        "http://localhost:5000/api/appointments",
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

      console.log(response);

      if (response.data.success) {
        const appointments = response.data.appointments || [];

        // Map is used to remove duplicate patients
        const patientMap = new Map();

        appointments.forEach((appointment) => {
          /*
           * Use the registered user's ID as the unique patient ID.
           * Fallback values are used if userId is not available.
           */
          const patientId =
            appointment.userId?._id ||
            appointment.userId ||
            appointment.contact ||
            appointment._id;

          // Add only unique patients
          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, appointment);
          }
        });

        // Convert Map values into an array
        const uniquePatients = Array.from(patientMap.values());

        setAllPatients(uniquePatients);
      }
    } catch (error) {
      console.error("Fetch Patients Error:", error);

      // Handle expired or invalid doctor token
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Doctor login expired. Please login again.");

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        navigate("/doctor/login", { replace: true });
        return;
      }

      // Handle other errors
      alert(error.response?.data?.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH PATIENTS WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchPatients();
  }, []);

  // =====================================================
  // SEARCH PATIENTS
  // =====================================================

  const filteredPatients = allPatients.filter((patient) => {
    // Get patient name
    const name = String(
      patient.userId?.name || patient.name || "",
    ).toLowerCase();

    // Get patient email
    const email = String(patient.userId?.email || "").toLowerCase();

    // Get patient contact
    const contact = String(patient.contact || "").toLowerCase();

    // Convert search text to lowercase
    const searchValue = search.toLowerCase().trim();

    // Match search value with name, email, or contact
    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      contact.includes(searchValue)
    );
  });

  // =====================================================
  // TOTAL NUMBER OF PAGES
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / patientsPerPage),
  );

  // =====================================================
  // PAGINATION
  // =====================================================

  const startIndex = (count - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // =====================================================
  // RESET TO PAGE 1 WHEN SEARCH CHANGES
  // =====================================================

  useEffect(() => {
    setCount(1);
  }, [search]);

  // =====================================================
  // KEEP PAGE NUMBER VALID
  // =====================================================

  useEffect(() => {
    if (count > totalPages) {
      setCount(totalPages);
    }
  }, [count, totalPages]);

  // =====================================================
  // ACTIVE PATIENT COUNT
  // =====================================================

  const acceptedCount = allPatients.filter(
    (patient) => patient.status === "Accepted",
  ).length;

  // =====================================================
  // PAGINATION CONTROLS
  // =====================================================

  const handleIncrement = () => {
    setCount((previousCount) =>
      previousCount < totalPages ? previousCount + 1 : previousCount,
    );
  };

  const handleDecrement = () => {
    setCount((previousCount) => (previousCount > 1 ? previousCount - 1 : 1));
  };

  // =====================================================
  // COMPONENT UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* =================================================
          SIDEBAR
      ================================================= */}

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
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5 transition"
          >
            <span className="text-xl w-6 text-center">⇥</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-1 lg:ml-72">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doctor Administration</p>

              <h1 className="text-2xl font-bold text-slate-800 mt-1">
                Patients
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

        {/* PAGE CONTENT */}
        <div className="p-6 lg:p-10">
          {/* =================================================
              STATISTICS CARDS
          ================================================= */}

          <section className="grid md:grid-cols-3 gap-6">
            {/* TOTAL PATIENTS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <p className="text-gray-500 mt-6">Total Patients</p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {allPatients.length}
              </h2>
            </div>

            {/* ACTIVE PATIENTS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <p className="text-gray-500 mt-6">Active Patients</p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {acceptedCount}
              </h2>
            </div>

            {/* RECENT VISITS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <p className="text-gray-500 mt-6">Recent Visits</p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {acceptedCount}
              </h2>
            </div>
          </section>

          {/* =================================================
              PATIENT LIST SECTION
          ================================================= */}

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 overflow-hidden">
            {/* SECTION HEADER */}
            <div className="p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Patient List
                </h2>

                <p className="text-gray-500 mt-2">
                  Patient records from your appointments.
                </p>
              </div>

              {/* SEARCH AND REFRESH */}
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-72 px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchPatients}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* =================================================
                PATIENT TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="w-full">
                {/* TABLE HEADER */}
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr className="text-left text-sm text-gray-500 uppercase tracking-wider">
                    <th className="px-7 py-5">Patient</th>

                    <th className="px-7 py-5">Contact</th>

                    <th className="px-7 py-5">Last Visit</th>

                    <th className="px-7 py-5">Status</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {loading ? (
                    // LOADING STATE
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-16 text-gray-500"
                      >
                        Loading patient details...
                      </td>
                    </tr>
                  ) : paginatedPatients.length === 0 ? (
                    // EMPTY STATE
                    <tr>
                      <td colSpan="4" className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center text-4xl">
                          👥
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mt-5">
                          No Patients Found
                        </h3>

                        <p className="text-gray-500 mt-2">
                          Patients will appear here after appointments are
                          created.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    // PATIENT ROWS
                    paginatedPatients.map((patient) => {
                      const name =
                        patient.userId?.name || patient.name || "Patient";

                      const email =
                        patient.userId?.email || "Email unavailable";

                      const status = patient.status || "Pending";

                      return (
                        <tr
                          key={patient._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition"
                        >
                          {/* PATIENT DETAILS */}
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                👤
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {name}
                                </p>

                                <p className="text-sm text-gray-500">{email}</p>
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}
                          <td className="px-7 py-5 text-gray-600">
                            {patient.contact || "—"}
                          </td>

                          {/* LAST VISIT */}
                          <td className="px-7 py-5 text-gray-600">
                            {patient.date || "—"}
                          </td>

                          {/* STATUS */}
                          <td className="px-7 py-5">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                status === "Accepted"
                                  ? "bg-green-100 text-green-700"
                                  : status === "Declined"
                                    ? "bg-red-100 text-red-700"
                                    : status === "Completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {!loading && filteredPatients.length > 0 && (
                <div className="flex items-center justify-center gap-4 px-6 py-6 border-t border-slate-100">
                  {/* PREVIOUS PAGE */}
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={count === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    −
                  </button>

                  {/* PAGE INFORMATION */}
                  <div className="min-w-[110px] text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      Page {count} of {totalPages}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {filteredPatients.length} patients
                    </p>
                  </div>

                  {/* NEXT PAGE */}
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={count >= totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorPatients;

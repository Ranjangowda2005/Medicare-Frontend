
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const DoctorPatients = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [allPatients, setAllPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const patientsPerPage = 10;

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

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
        }
      );

      if (response.data.success) {
        const appointments = response.data.appointments || [];
        const patientMap = new Map();

        appointments.forEach((appointment) => {
          const patientId =
            appointment.userId?._id ||
            appointment.userId ||
            appointment.contact ||
            appointment._id;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, appointment);
          }
        });

        const uniquePatients = Array.from(patientMap.values());
        setAllPatients(uniquePatients);
      }
    } catch (error) {
      console.error("Fetch Patients Error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert("Doctor login expired. Please login again.");

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        navigate("/doctor/login", { replace: true });
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchPatients();
  }, []);

  // Search and pagination
  const filteredPatients = allPatients.filter((patient) => {
    const name = String(
      patient.userId?.name || patient.name || ""
    ).toLowerCase();

    const email = String(
      patient.userId?.email || ""
    ).toLowerCase();

    const contact = String(
      patient.contact || ""
    ).toLowerCase();

    const searchValue = search.toLowerCase().trim();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      contact.includes(searchValue)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / patientsPerPage)
  );

  const startIndex = (count - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  const paginatedPatients = filteredPatients.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCount(1);
  }, [search]);

  useEffect(() => {
    if (count > totalPages) {
      setCount(totalPages);
    }
  }, [count, totalPages]);

  const acceptedCount = allPatients.filter(
    (patient) => patient.status === "Accepted"
  ).length;

  const handleIncrement = () => {
    setCount((previousCount) =>
      previousCount < totalPages
        ? previousCount + 1
        : previousCount
    );
  };

  const handleDecrement = () => {
    setCount((previousCount) =>
      previousCount > 1 ? previousCount - 1 : 1
    );
  };

  // Patient display helpers
  const getPatientName = (patient) => {
    return patient.userId?.name || patient.name || "Patient";
  };

  const getPatientEmail = (patient) => {
    return patient.userId?.email || "Email unavailable";
  };

  const getPatientStatus = (patient) => {
    return patient.status || "Pending";
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
    <div className="min-h-screen bg-slate-50 flex w-full overflow-x-hidden">
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
                Patients
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

                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-3 sm:p-6 lg:p-10 min-w-0">
          {/* Statistics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500 mt-2 sm:mt-6">
                Total Patients
              </p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {allPatients.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500 mt-2 sm:mt-6">
                Active Patients
              </p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {acceptedCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500 mt-2 sm:mt-6">
                Recent Visits
              </p>

              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {acceptedCount}
              </h2>
            </div>
          </section>

          {/* Patient List */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 overflow-hidden min-w-0">
            <div className="p-4 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Patient List
                </h2>

                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  Patient records from your appointments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-w-0 md:w-72 px-4 sm:px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={fetchPatients}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  aria-label="Refresh patients"
                >
                  <span className="sm:hidden">
                    Refresh
                  </span>
                  <span className="hidden sm:inline">
                    🔄
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Patient Cards */}
            <div className="md:hidden p-3 sm:p-4 space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading patient details...
                </div>
              ) : paginatedPatients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center text-3xl">
                    👥
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mt-4">
                    No Patients Found
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm">
                    Patients will appear here after appointments
                    are created.
                  </p>
                </div>
              ) : (
                paginatedPatients.map((patient) => {
                  const name = getPatientName(patient);
                  const email = getPatientEmail(patient);
                  const status = getPatientStatus(patient);

                  return (
                    <div
                      key={patient._id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                            👤
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 break-words">
                              {name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1 break-all">
                              {email}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-3">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Contact
                          </p>

                          <p className="text-sm text-slate-700 mt-1 break-all">
                            {patient.contact || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Last Visit
                          </p>

                          <p className="text-sm text-slate-700 mt-1">
                            {patient.date || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Status
                          </p>

                          <span
                            className={`inline-flex mt-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Patient Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr className="text-left text-sm text-gray-500 uppercase tracking-wider">
                    <th className="px-7 py-5">Patient</th>
                    <th className="px-7 py-5">Contact</th>
                    <th className="px-7 py-5">Last Visit</th>
                    <th className="px-7 py-5">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-16 text-gray-500"
                      >
                        Loading patient details...
                      </td>
                    </tr>
                  ) : paginatedPatients.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-20"
                      >
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center text-4xl">
                          👥
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mt-5">
                          No Patients Found
                        </h3>

                        <p className="text-gray-500 mt-2">
                          Patients will appear here after
                          appointments are created.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPatients.map((patient) => {
                      const name = getPatientName(patient);
                      const email = getPatientEmail(patient);
                      const status = getPatientStatus(patient);

                      return (
                        <tr
                          key={patient._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition"
                        >
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                                👤
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800">
                                  {name}
                                </p>

                                <p className="text-sm text-gray-500 break-all">
                                  {email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-7 py-5 text-gray-600">
                            {patient.contact || "—"}
                          </td>

                          <td className="px-7 py-5 text-gray-600">
                            {patient.date || "—"}
                          </td>

                          <td className="px-7 py-5">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
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
            </div>

            {/* Pagination */}
            {!loading && filteredPatients.length > 0 && (
              <div className="flex items-center justify-center gap-4 px-3 sm:px-6 py-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count === 1}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  −
                </button>

                <div className="min-w-[110px] text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Page {count} of {totalPages}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {filteredPatients.length} patients
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  +
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorPatients;

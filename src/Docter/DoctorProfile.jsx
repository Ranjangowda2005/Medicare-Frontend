import { Link, NavLink, useNavigate } from "react-router-dom";
import doctorImage from "../assets/doctor.jpg";
import diseaseIcon from "../assets/virus.png";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctorRating, setDoctorRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const doctor = {
    name: "Dr. Joseph",
    email: "joseph@gmail.com",
    specialization: "General Physician",
    qualification: "MBBS, MD",
    experience: "10+ Years",
    contact: "+91 99024 76568",
    patients: "5K+",
    description:
      "Dr. Joseph is an experienced healthcare professional dedicated to providing reliable medical consultation, diagnosis, and personalized treatment for every patient.",
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    navigate("/doctor/login", { replace: true });
  };

  useEffect(() => {
    const fetchDoctorRating = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctor-rating",
        );

        if (response.data.success) {
          setDoctorRating(response.data.averageRating);
          setTotalRatings(response.data.totalRatings);
        }
      } catch (error) {
        console.error("Rating Fetch Error:", error);
      }
    };

    // Fetch rating when page loads
    fetchDoctorRating();

    // Update rating when localStorage changes
    const handleStorageChange = () => {
      fetchDoctorRating();
    };

    window.addEventListener("storage", handleStorageChange);

    // Refresh rating every 5 seconds
    const interval = setInterval(() => {
      fetchDoctorRating();
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ================= SIDEBAR ================= */}

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
              <span className="text-xl w-6 text-center">▣</span>

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
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5 transition"
          >
            <span className="text-xl w-6 text-center">⇥</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 lg:ml-72">
        {/* HEADER */}

        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doctor Administration</p>

              <h1 className="text-2xl font-bold text-slate-800 mt-1">
                Doctor Profile
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* DOCTOR IMAGE */}

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

        {/* ================= PAGE CONTENT ================= */}

        <main className="p-5 sm:p-8">
          {/* PROFILE HERO */}

          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-[2rem] p-7 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-7">
              {/* DOCTOR IMAGE */}

              <div className="w-28 h-28 bg-white/15 border border-white/20 rounded-3xl flex items-center justify-center overflow-hidden">
                <img
                  src={doctorImage}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DOCTOR INFORMATION */}

              <div>
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Doctor Profile
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold mt-4">
                  {doctor.name}
                </h1>

                <p className="text-blue-100 mt-2">{doctor.specialization}</p>

                {/* RATING */}

                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">
                    Rating{" "}
                    {doctorRating > 0 ? `${doctorRating.toFixed(1)}` : "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}

          <section className="grid xl:grid-cols-3 gap-7 mt-7">
            {/* PROFESSIONAL INFORMATION */}

            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                  Professional Information
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  Doctor Details
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Information associated with your doctor account.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* FULL NAME */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Full Name
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {doctor.name}
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Email Address
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2 break-all">
                      {doctor.email}
                    </p>
                  </div>

                  {/* SPECIALIZATION */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Specialization
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {doctor.specialization}
                    </p>
                  </div>

                  {/* QUALIFICATION */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Qualification
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {doctor.qualification}
                    </p>
                  </div>

                  {/* EXPERIENCE */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Experience
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {doctor.experience}
                    </p>
                  </div>

                  {/* CONTACT */}

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Contact Number
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-2">
                      {doctor.contact}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="bg-slate-50 rounded-2xl p-5 mt-5">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Professional Description
                  </p>

                  <p className="text-gray-600 leading-7 mt-3">
                    {doctor.description}
                  </p>
                </div>
              </div>
            </div>

            {/* STATISTICS + SECURITY */}

            <div className="space-y-7">
              {/* STATISTICS */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                  Overview
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  Doctor Statistics
                </h2>

                <div className="grid grid-cols-2 gap-4 mt-7">
                  {/* PATIENTS */}

                  <div className="bg-blue-50 rounded-2xl p-5">
                    <p className="text-2xl font-bold text-blue-600">
                      {doctor.patients}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">Patients</p>
                  </div>

                  {/* RATING */}

                  <div className="bg-blue-50 rounded-2xl p-5">
                    <p className="text-2xl font-bold text-yellow-500">
                      {doctorRating > 0 ? `${doctorRating.toFixed(1)}` : "0.0"}
                    </p>

                    <p className="text-gray-500 mt-2">
                      {totalRatings === 1 ? "1 Review" : ` Reviews`}
                    </p>
                  </div>

                  {/* QUALIFICATION */}

                  <div className="bg-cyan-50 rounded-2xl p-5">
                    <p className="text-lg font-bold text-cyan-600">
                      {doctor.qualification}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">Qualification</p>
                  </div>

                  {/* ACCOUNT */}

                  <div className="bg-emerald-50 rounded-2xl p-5">
                    <p className="text-lg font-bold text-emerald-600">Active</p>

                    <p className="text-sm text-gray-500 mt-1">Account</p>
                  </div>
                </div>
              </div>

              {/* SECURITY */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
                <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest">
                  Security
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-2">
                  Account Security
                </h2>

                <div className="bg-slate-50 rounded-2xl p-5 mt-6">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Protected Account
                    </h3>

                    <p className="text-sm text-gray-500 leading-6 mt-1">
                      Your doctor account is protected by secure authentication.
                    </p>
                  </div>
                </div>

                {/* ACCOUNT STATUS */}

                <div className="flex items-center justify-between mt-5 bg-emerald-50 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Account Status
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Doctor portal access
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-emerald-600">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </main>
    </div>
  );
};

export default DoctorProfile;

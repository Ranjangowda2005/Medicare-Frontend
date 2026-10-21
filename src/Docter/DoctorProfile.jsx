import { useEffect, useState } from "react";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const DoctorProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Fetch doctor rating and refresh automatically
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

    fetchDoctorRating();

    const handleStorageChange = () => {
      fetchDoctorRating();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      fetchDoctorRating();
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex w-full overflow-x-hidden">
      {/* Reusable responsive sidebar */}
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
                Doctor Profile
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

        {/* Profile Content */}
        <div className="p-3 sm:p-8 min-w-0">
          {/* Profile Hero */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-[2rem] p-5 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-7">
              <div className="w-28 h-28 shrink-0 bg-white/15 border border-white/20 rounded-3xl flex items-center justify-center overflow-hidden">
                <img
                  src={doctorImage}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Doctor Profile
                </span>

                <h1 className="text-2xl sm:text-4xl font-bold mt-4 break-words">
                  {doctor.name}
                </h1>

                <p className="text-blue-100 mt-2">{doctor.specialization}</p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">
                    Rating {doctorRating > 0 ? doctorRating.toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Doctor Details and Statistics */}
          <section className="grid xl:grid-cols-3 gap-5 sm:gap-7 mt-7">
            {/* Professional Information */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
              <div className="p-4 sm:p-8 border-b border-slate-100">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                  Professional Information
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  Doctor Details
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Information associated with your doctor account.
                </p>
              </div>

              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Full Name
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 break-words">
                      {doctor.name}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Email Address
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 break-all">
                      {doctor.email}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Specialization
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 break-words">
                      {doctor.specialization}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Qualification
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 break-words">
                      {doctor.qualification}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Experience
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2">
                      {doctor.experience}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Contact Number
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 break-words">
                      {doctor.contact}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mt-5">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Professional Description
                  </p>
                  <p className="text-gray-600 leading-7 mt-3 break-words">
                    {doctor.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics and Security */}
            <div className="space-y-7 min-w-0">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                  Overview
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  Doctor Statistics
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-7">
                  <div className="bg-blue-50 rounded-2xl p-3 sm:p-5 min-w-0">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {doctor.patients}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Patients</p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-3 sm:p-5 min-w-0">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                      {doctorRating > 0 ? doctorRating.toFixed(1) : "0.0"}
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                      {totalRatings === 1
                        ? "1 Review"
                        : `${totalRatings} Reviews`}
                    </p>
                  </div>

                  <div className="bg-cyan-50 rounded-2xl p-3 sm:p-5 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-cyan-600 break-words">
                      {doctor.qualification}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Qualification</p>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-3 sm:p-5 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-emerald-600">
                      Active
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Account</p>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7">
                <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest">
                  Security
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  Account Security
                </h2>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mt-6">
                  <h3 className="font-semibold text-slate-800">
                    Protected Account
                  </h3>
                  <p className="text-sm text-gray-500 leading-6 mt-1">
                    Your doctor account is protected by secure authentication.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 mt-5 bg-emerald-50 rounded-xl p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Account Status
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Doctor portal access
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-emerald-600 shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;

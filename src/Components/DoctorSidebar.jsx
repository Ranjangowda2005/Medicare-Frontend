import { Link, NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import diseaseIcon from "../assets/virus.png";

const DoctorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    navigate("/doctor/login", { replace: true });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          w-72 max-w-[85vw] bg-[#020617]
          fixed left-0 top-0 bottom-0
          flex flex-col z-50
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* MOBILE CLOSE BUTTON */}
        <button
          type="button"
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 text-white text-2xl z-10"
          aria-label="Close sidebar"
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="p-7 border-b border-slate-800">
          <Link
            to="/doctor/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-1">
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
        <div className="px-4 mt-8 flex-1 overflow-y-auto">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider px-2 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2">
            {/* DASHBOARD */}
            <NavLink
              to="/doctor/dashboard"
              onClick={closeSidebar}
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

            {/* PATIENTS */}
            <NavLink
              to="/doctor/patients"
              onClick={closeSidebar}
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
              onClick={closeSidebar}
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
              onClick={closeSidebar}
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
              onClick={closeSidebar}
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
              onClick={closeSidebar}
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
        <div className="px-4 pb-6 pt-3">
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
    </>
  );
};

export default DoctorSidebar;

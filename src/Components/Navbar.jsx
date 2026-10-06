import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.log("Unable to read user data:", error);
      return null;
    }
  });

  const token = localStorage.getItem("token");

  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);
    setMenuOpen(false);

    window.location.href = "/";
  };

  const navLinkClass = ({ isActive }) =>
    `relative transition duration-200 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-slate-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white sm:h-16 sm:w-16">
            <img
              src={logo}
              alt="MediCare Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              MediCare
            </h1>

            <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-500 sm:text-xs">
              Doctor Appointment
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/doctors" className={navLinkClass}>
            Doctors
          </NavLink>

          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* DESKTOP RIGHT SECTION */}
        <div className="hidden items-center gap-3 lg:flex">
          {!token ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => setProfileOpen((previous) => !previous)}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition ${
                  profileOpen
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <div className="h-10 w-10 overflow-hidden rounded-xl border-2 border-blue-100 bg-blue-100">
                  {user?.image ? (
                    <img
                      src={`https://res.cloudinary.com/djmsizzc/image/upload/${user.image}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg">
                      👤
                    </div>
                  )}
                </div>

                <div className="hidden text-left xl:block">
                  <p className="max-w-[130px] truncate text-sm font-bold text-slate-800">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-slate-500">My Account</p>
                </div>

                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                  {/* USER INFORMATION */}
                  <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 to-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-blue-100 shadow-sm">
                        {user?.image ? (
                          <img
                            src={`https://res.cloudinary.com/djmsizzc/image/upload/${user.image}`}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            👤
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user?.name || "User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user?.email || "Email unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DROPDOWN OPTIONS */}
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-8"
                          />
                        </svg>
                      </span>

                      <span>
                        <span className="block font-semibold">Dashboard</span>
                        <span className="block text-xs text-slate-500">
                          View your appointments
                        </span>
                      </span>

                      <svg
                        className="ml-auto h-4 w-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9 18 6-6-6-6"
                        />
                      </svg>
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H3m0 0 4-4m-4 4 4 4M13 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1"
                          />
                        </svg>
                      </span>

                      <span>
                        <span className="block font-semibold">Logout</span>
                        <span className="block text-xs text-red-400">
                          Sign out of your account
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 lg:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
          <nav className="space-y-1">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </NavLink>

            <NavLink
              to="/doctors"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Doctors
            </NavLink>

            <NavLink
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Services
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Contact
            </NavLink>
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {!token ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-blue-600 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* MOBILE USER INFORMATION */}
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-blue-100 bg-blue-100">
                    {user?.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${user.image}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">
                        👤
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.name || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "Email unavailable"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

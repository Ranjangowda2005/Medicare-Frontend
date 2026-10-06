import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CalendarCheck, LockKeyhole, Mail, User } from 'lucide-react';


const DoctorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/doctor/login",
        formData,
      );

      if (response.data.success) {
        localStorage.setItem("doctorToken", response.data.token);

        localStorage.setItem("doctor", JSON.stringify(response.data.doctor));

        // Direct login — no success alert
        navigate("/doctor/dashboard");
      } else {
        // Error from backend
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Doctor Login Error:", error);

      // Error alert only
      alert(error.response?.data?.message || "Doctor login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 flex items-center justify-center p-5">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white p-12 flex-col justify-between min-h-[680px]">
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center text-2xl">
                  🏥
                </div>

                <div>
                  <h1 className="text-2xl font-bold">MediCare</h1>

                  <p className="text-blue-100 text-xs">Healthcare Platform</p>
                </div>
              </Link>
            </div>

            <div>
              <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
                Doctor Portal
              </span>

              <h2 className="text-5xl font-bold leading-tight mt-7">
                Welcome to your
                <span className="block text-cyan-200">secure workspace.</span>
              </h2>

              <p className="text-blue-100 leading-8 mt-6 max-w-md">
                Manage appointments, view patient records, and access your
                professional information through the MediCare doctor portal.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl"><CalendarCheck/></div>

                  <p className="text-sm font-semibold mt-3">Appointments</p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl"><User /></div>

                  <p className="text-sm font-semibold mt-3">Patients</p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl"><LockKeyhole /></div>

                  <p className="text-sm font-semibold mt-3">Secure</p>
                </div>
              </div>
            </div>

            <p className="text-blue-200 text-sm">
              © 2026 MediCare. Doctor Administration Portal.
            </p>
          </div>

          <div className="p-7 sm:p-10 lg:p-14 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="lg:hidden mb-10">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl">
                    🏥
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-slate-800">
                      MediCare
                    </h1>

                    <p className="text-xs text-gray-500">Doctor Portal</p>
                  </div>
                </Link>
              </div>

              <div>
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                  Doctor Login
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-4">
                  Welcome Back, Doctor
                </h1>

                <p className="text-gray-500 leading-7 mt-3">
                  Sign in to access your MediCare administration dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Doctor Email
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail />
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <LockKeyhole />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      {showPassword ? "◉" : "○"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 accent-blue-600"
                  />

                  <label htmlFor="remember" className="text-sm text-gray-500">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all duration-300"
                >
                  {loading ? "Signing In..." : "Sign In to Doctor Portal"}
                </button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-slate-200 flex-1"></div>

                <span className="text-xs text-gray-400">AUTHORIZED ACCESS</span>

                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <LockKeyhole/>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Doctor-only access
                    </h3>

                    <p className="text-sm text-gray-500 leading-6 mt-1">
                      This portal is intended only for authorized MediCare
                      doctors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;

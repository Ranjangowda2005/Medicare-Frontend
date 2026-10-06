import { Link } from "react-router-dom";
import { MapPinCheck,Phone,Mail } from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-lg">
                🏥
              </div>

              <div>
                <h2 className="text-2xl font-bold">MediCare</h2>

                <p className="text-xs text-slate-400">Doctor Appointment</p>
              </div>
            </Link>

            <p className="text-slate-400 leading-7 mt-6 max-w-sm">
              Your trusted healthcare platform for simple, secure, and
              convenient doctor appointments. Take care of your health with
              MediCare.
            </p>

            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
              >
                f
              </a>

              <a
                href="https://x.com/"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
              >
                𝕏
              </a>

              <a
                href="https://in.linkedin.com/"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
              >
                in
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="w-10 h-1 bg-blue-600 rounded-full mt-3 mb-6"></div>

            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/doctors"
                  className="text-slate-400 hover:text-white transition"
                >
                  Doctors
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-white transition"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Services</h3>

            <div className="w-10 h-1 bg-cyan-500 rounded-full mt-3 mb-6"></div>

            <ul className="space-y-4">
              <li className="text-slate-400">Doctor Consultation</li>

              <li className="text-slate-400">Online Appointment</li>

              <li className="text-slate-400">Health Checkup</li>

              <li className="text-slate-400">Medical Consultation</li>

              <li className="text-slate-400">Patient Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>

            <div className="w-10 h-1 bg-emerald-500 rounded-full mt-3 mb-6"></div>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center">
                  <MapPinCheck/>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Address</p>

                  <p className="text-slate-300 mt-1">
                    Mangalore, Karnataka, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Phone/>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Phone</p>

                  <a
                    href="tel:+919876543210"
                    className="text-slate-300 hover:text-white transition mt-1 block"
                  >
                    +91 99024 76568
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Mail/>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>

                  <a
                    href="mailto:joseph@gmail.com"
                    className="text-slate-300 hover:text-white transition mt-1 block"
                  >
                    joseph@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              © 2026 MediCare. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-slate-500 hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-slate-500 hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

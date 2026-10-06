import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { HeartPulse, ShieldCheck, Zap } from "lucide-react";
import logo from "../assets/logo.png";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block bg-white/15 border border-white/20 px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
              About MediCare
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mt-6">
              Healthcare That Puts You First
            </h1>

            <p className="max-w-3xl mx-auto text-blue-100 text-lg leading-8 mt-6">
              MediCare is a doctor appointment platform designed to make
              healthcare consultation simple, convenient, and accessible.
            </p>

            <Link
              to="/login"
              className="inline-block mt-8 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all duration-300"
            >
              Book Appointment
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <span className="text-blue-600 font-semibold uppercase tracking-widest">
                  Who We Are
                </span>

                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">
                  Making Doctor Appointments Easier
                </h2>

                <p className="text-gray-600 leading-8 mt-6">
                  MediCare is built to provide a simple way for patients to
                  connect with healthcare professionals and schedule medical
                  appointments without unnecessary complexity.
                </p>

                <p className="text-gray-600 leading-8 mt-4">
                  Our platform allows users to create an account, securely log
                  in, and book appointments by providing their preferred date,
                  time, contact information, and health-related details.
                </p>

                <div className="flex flex-wrap gap-4 mt-7">
                  <Link
                    to="/services"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  >
                    Explore Our Services
                  </Link>

                  <a
                    href="https://www.codelabsystems.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-7 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Visit CodeLab Systems
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-60"></div>

                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-8 shadow-xl">
                  <div className="bg-white rounded-3xl p-8 shadow-md">
                    <div className="flex h-30 w-30 items-center justify-center overflow-hidden rounded-2xl bg-white sm:h-16 sm:w-16">
                      <img
                        src={logo}
                        alt="MediCare Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-slate-800 mt-7">
                      Trusted Healthcare
                    </h3>

                    <p className="text-gray-500 leading-7 mt-4">
                      A simple and secure platform designed around the needs of
                      patients and convenient healthcare access.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-blue-50 rounded-2xl p-5">
                        <p className="text-3xl font-bold text-blue-600">10+</p>

                        <p className="text-gray-500 mt-2">Years Experience</p>
                      </div>

                      <div className="bg-cyan-50 rounded-2xl p-5">
                        <p className="text-3xl font-bold text-cyan-600">5K+</p>

                        <p className="text-gray-500 mt-2">Patients</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-blue-600 font-semibold uppercase tracking-widest">
                Our Values
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">
                What We Believe In
              </h2>

              <p className="text-gray-500 leading-7 mt-5">
                Our platform is designed around a few important principles that
                help create a better healthcare experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  <HeartPulse />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mt-7">
                  Patient First
                </h3>

                <p className="text-gray-500 leading-7 mt-4">
                  We focus on creating a convenient experience that keeps
                  patient needs at the center of the platform.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center text-3xl">
                  <ShieldCheck />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mt-7">
                  Privacy & Security
                </h3>

                <p className="text-gray-500 leading-7 mt-4">
                  Secure authentication helps protect user accounts and
                  appointment information throughout the platform.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
                  <Zap />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mt-7">
                  Simple & Fast
                </h3>

                <p className="text-gray-500 leading-7 mt-4">
                  From registration to appointment booking, we keep the process
                  straightforward and easy to understand.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[2rem] p-8 md:p-14 text-white text-center shadow-xl">
              <div className="max-w-3xl mx-auto">
                <span className="text-blue-100 font-semibold uppercase tracking-widest">
                  Start Your Healthcare Journey
                </span>

                <h2 className="text-3xl md:text-5xl font-bold mt-5">
                  Take the Next Step Towards Better Healthcare
                </h2>

                <p className="text-blue-100 leading-7 mt-5">
                  Create your account and book your doctor appointment through
                  MediCare today.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link
                    to="/register"
                    className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    Create Account
                  </Link>

                  <Link
                    to="/doctors"
                    className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
                  >
                    Meet Our Doctor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

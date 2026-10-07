import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  Stethoscope,
  CalendarDays,
  HeartPulse,
  ClipboardPlus,
  ShieldCheck,
  HandHeart,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: Stethoscope,
    title: "Doctor Consultation",
    description:
      "Get professional medical consultation from our experienced doctor and receive personalized healthcare guidance.",
  },
  {
    id: 2,
    icon: CalendarDays,
    title: "Online Appointment",
    description:
      "Book your doctor appointment easily by selecting a convenient date and time from anywhere.",
  },
  {
    id: 3,
    icon: HeartPulse,
    title: "Medical Consultation",
    description:
      "Discuss your health concerns and get reliable medical advice based on your individual needs.",
  },
  {
    id: 4,
    icon: ClipboardPlus,
    title: "Health Checkup",
    description:
      "Take care of your health with professional consultation and regular medical checkup support.",
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: "Secure Patient Data",
    description:
      "Your account and appointment information are handled through secure authentication and protected access.",
  },
  {
    id: 6,
    icon: HandHeart,
    title: "Patient Support",
    description:
      "Get assistance with appointments and healthcare-related questions through our patient support system.",
  },
];

const Services = () => {
  const [doctorRating, setDoctorRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchDoctorRating = async () => {
      try {
        const response = await axios.get(
          "https://medicare-backend-hajh.onrender.com/api/doctor-rating",
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block bg-white/15 border border-white/20 px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
              Our Services
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mt-6">
              Healthcare Made Simple
            </h1>

            <p className="max-w-2xl mx-auto text-blue-100 text-lg leading-8 mt-6">
              MediCare provides simple and convenient healthcare services
              designed to make doctor consultation and appointment booking
              easier for every patient.
            </p>

            <Link
              to="/appointment"
              className="inline-block mt-8 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all duration-300"
            >
              Book Appointment
            </Link>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-blue-600 font-semibold uppercase tracking-widest">
                What We Offer
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">
                Healthcare Services For You
              </h2>

              <p className="text-gray-500 leading-7 mt-5">
                From booking an appointment to getting professional medical
                consultation, MediCare makes your healthcare journey easier.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
                    <span>
                      <service.icon size={28} />
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mt-7">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 leading-7 mt-4">
                    {service.description}
                  </p>

                  <Link
                    to="/appointment"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-6 hover:text-blue-800 transition"
                  >
                    Get Started
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-8 md:p-14 shadow-xl">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-blue-600 font-semibold uppercase tracking-widest">
                    Easy Healthcare
                  </span>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4">
                    Your Health Is Our Priority
                  </h2>

                  <p className="text-gray-600 leading-7 mt-5">
                    With MediCare, you can easily connect with our doctor,
                    schedule appointments, and manage your healthcare needs from
                    one convenient platform.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-3xl font-bold text-blue-600">10+</p>

                    <p className="text-gray-500 mt-2">Years Experience</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-3xl font-bold text-cyan-600">5K+</p>

                    <p className="text-gray-500 mt-2">Patients</p>
                  </div>

                  {/* RATING */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-3xl font-bold text-yellow-500">
                      {doctorRating > 0 ? `${doctorRating.toFixed(1)}` : "0.0"}
                    </p>

                    <p className="text-gray-500 mt-2">
                      {totalRatings === 1
                        ? "1 Review"
                        : `${totalRatings} Reviews`}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-3xl font-bold text-indigo-600">24/7</p>

                    <p className="text-gray-500 mt-2">Support</p>
                  </div>
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

export default Services;

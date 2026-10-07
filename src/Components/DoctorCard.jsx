import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import doctorImage from "../assets/doctor.jpg";

const DoctorCard = () => {
  const [doctorAvailable, setDoctorAvailable] = useState(false);
  const [doctorRating, setDoctorRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const checkDoctorLogin = () => {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        setDoctorAvailable(false);
        return;
      }

      try {
        const tokenParts = token.split(".");

        if (tokenParts.length !== 3) {
          setDoctorAvailable(false);
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("doctorToken");
          localStorage.removeItem("doctor");
          setDoctorAvailable(false);
          return;
        }

        setDoctorAvailable(payload.role === "doctor");
      } catch (error) {
        console.error("Doctor token error:", error);
        setDoctorAvailable(false);
      }
    };

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

    checkDoctorLogin();
    fetchDoctorRating();

    const handleStorageChange = () => {
      checkDoctorLogin();
      fetchDoctorRating();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      checkDoctorLogin();
      fetchDoctorRating();
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Meet Our Doctor
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">
            Your Trusted Healthcare Partner
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mt-4 leading-7">
            Get professional healthcare from an experienced doctor and book your
            appointment quickly through MediCare.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-6 md:p-10 shadow-xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-60"></div>

              <div className="relative bg-white rounded-3xl p-5 shadow-lg">
                <div className="h-80 md:h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-[9rem]">
                    <img
                      src={doctorImage}
                      alt="Doctor"
                      className="relative w-full max-w-md object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5">
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>

                    {doctorAvailable ? (
                      <p className="text-green-600 font-semibold mt-1">
                        ● Available Today
                      </p>
                    ) : (
                      <p className="text-red-500 font-semibold mt-1">
                        ● Not Available
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="text-yellow-500 font-semibold mt-1">
                      ★{" "}
                      {doctorRating > 0
                        ? doctorRating.toFixed(1)
                        : "No ratings"}
                    </p>

                    {totalRatings > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {totalRatings}{" "}
                        {totalRatings === 1 ? "review" : "reviews"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                General Physician
              </span>

              <h3 className="text-4xl font-bold text-slate-800 mt-5">
                Dr. joseph
              </h3>

              <p className="text-blue-600 font-medium mt-2">MBBS, MD</p>

              <p className="text-gray-600 leading-7 mt-6">
                Dr. joseph is an experienced healthcare professional dedicated
                to providing reliable medical consultation, diagnosis, and
                personalized treatment for every patient.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-gray-500 text-sm">Experience</p>

                  <p className="text-2xl font-bold text-slate-800 mt-2">
                    10+ Years
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-gray-500 text-sm">Patients</p>

                  <p className="text-2xl font-bold text-slate-800 mt-2">5K+</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/appointment"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorCard;

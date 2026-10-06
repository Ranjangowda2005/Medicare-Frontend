import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import doctorImage from "../assets/doctor.jpg";

const Hero = () => {
  const doctorRef = useRef(null);

  // GSAP animation for doctor image
  useEffect(() => {
    gsap.fromTo(
      doctorRef.current,
      {
        x: 250,
        opacity: 0,
        scale: 0.9,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
      },  
    );
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Trusted Healthcare Platform
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 mt-6 leading-tight">
              Book Your
              <span className="text-blue-600"> Doctor Appointment</span>
              <br />
              In Minutes
            </h1>

            <p className="text-gray-600 text-lg mt-6 leading-8">
              Connect with experienced doctors, schedule appointments quickly,
              and receive quality healthcare with a simple, secure, and
              user-friendly appointment system.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/appointment"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 shadow-lg"
              >
                Book Appointment
              </Link>

              <Link
                to="/about"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition duration-300"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-14">
              <div className="bg-white rounded-2xl shadow-md p-5 text-center">
                <h2 className="text-3xl font-bold text-blue-600">10+</h2>

                <p className="text-gray-600 mt-2">Years Experience</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5 text-center">
                <h2 className="text-3xl font-bold text-green-600">5K+</h2>

                <p className="text-gray-600 mt-2">Happy Patients</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5 text-center">
                <h2 className="text-3xl font-bold text-cyan-600">24/7</h2>

                <p className="text-gray-600 mt-2">Support</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-50"></div>

            <img
              ref={doctorRef}
              src={doctorImage}
              alt="Doctor"
              className="relative w-full max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

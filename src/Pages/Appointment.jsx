import { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    contact: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // GET TODAY'S DATE IN YYYY-MM-DD FORMAT
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    // PREVENT SUNDAY SELECTION
    if (name === "date" && value) {
      const selectedDate = new Date(`${value}T00:00:00`);
      const day = selectedDate.getDay();

      if (day === 0) {
        alert("Appointments are not available on Sundays.");
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // CHECK WHETHER TIME IS WITHIN AVAILABLE WORKING HOURS
  const isValidAppointmentTime = (time) => {
    if (!time) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    const morningStart = 9 * 60; // 09:00
    const morningEnd = 13 * 60 + 15;//1:30

    const eveningStart = 15 * 60; // 15:00
    const eveningEnd = 18 * 60; // 18:00

    const isMorningSlot =
      totalMinutes >= morningStart && totalMinutes <= morningEnd;

    const isEveningSlot =
      totalMinutes >= eveningStart && totalMinutes <= eveningEnd;

    return isMorningSlot || isEveningSlot;
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // CHECK LOGIN
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // CHECK DATE
    if (!formData.date) {
      alert("Please select an appointment date.");
      return;
    }

    const selectedDate = new Date(`${formData.date}T00:00:00`);

    // CHECK SUNDAY
    if (selectedDate.getDay() === 0) {
      alert("Appointments are not available on Sundays.");
      return;
    }

    // CHECK TIME
    if (!isValidAppointmentTime(formData.time)) {
      alert(
        "Please select a time between 9:00 AM and 1:30 PM or between 3:00 PM and 6:00 PM.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/appointment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert(response.data.message || "Appointment booked successfully.");

        setFormData({
          date: "",
          time: "",
          contact: "",
          description: "",
        });

        // NAVIGATE TO DASHBOARD AFTER SUCCESSFUL BOOKING
        navigate("/dashboard");
      } else {
        alert(response.data.message || "Unable to book appointment.");
      }
    } catch (error) {
      console.log("Appointment Error:", error);

      alert(error.response?.data?.message || "Appointment booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <span className="inline-block rounded-full border border-white/20 bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-wider">
              Appointment
            </span>

            <h1 className="mt-6 text-4xl font-bold md:text-6xl">
              Book Your Doctor Appointment
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Choose your preferred date and time and provide your contact
              details to book an appointment with our doctor.
            </p>
          </div>
        </section>

        {/* APPOINTMENT SECTION */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-5">
              {/* LEFT INFORMATION CARD */}
              <div className="lg:col-span-2">
                <div className="h-full rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white shadow-xl">
                  <span className="text-sm font-semibold uppercase tracking-widest text-blue-100">
                    MediCare
                  </span>

                  <h2 className="mt-5 text-3xl font-bold">
                    Schedule Your Consultation
                  </h2>

                  <p className="mt-5 leading-7 text-blue-100">
                    Book an appointment with our experienced doctor through our
                    simple and secure healthcare platform.
                  </p>

                  <div className="mt-10 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
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
                            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-semibold">Dr. Joseph</p>
                        <p className="text-sm text-blue-100">
                          General Physician
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
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
                            d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-semibold">Available Hours</p>
                        <p className="text-sm text-blue-100">9:00 AM–1:30 PM</p>
                        <p className="text-sm text-blue-100">3:00 PM–6:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
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
                            d="M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.5 12 1.7 1.7 3.5-3.5"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-semibold">Secure Booking</p>
                        <p className="text-sm text-blue-100">
                          Your appointment is securely stored
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-sm text-blue-100">Important Notice</p>

                    <p className="mt-1 font-semibold">
                      Sundays and lunch hours are unavailable.
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM CARD */}
              <div className="lg:col-span-3">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl md:p-10">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                      Appointment Details
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                      Book an Appointment
                    </h2>

                    <p className="mt-3 text-gray-500">
                      Enter your appointment information below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      {/* DATE */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Appointment Date
                        </label>

                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={getTodayDate()}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                          Sundays are not available for appointments.
                        </p>
                      </div>

                      {/* TIME */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Appointment Time
                        </label>

                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          min="09:00"
                          max="18:00"
                          step="900"
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                          Available: 9:00 AM–1:30 PM and 3:00 PM–6:00 PM.
                        </p>
                      </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Health Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your health concern..."
                        rows="5"
                        required
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      ></textarea>
                    </div>

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {loading ? "Booking Appointment..." : "Book Appointment"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/"
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Back to Home
                    </Link>
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

export default Appointment;

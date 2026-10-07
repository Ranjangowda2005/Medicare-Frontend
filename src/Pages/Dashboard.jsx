import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import doctorImage from "../assets/doctor.jpg";
import Footer from "../Components/Footer";
import { CalendarCheck, Hospital, Star } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState(null);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const [doctorRating, setDoctorRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchMyAppointments = useCallback(async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://medicare-backend-hajh.onrender.com/api/my-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.log("Appointment Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(error.response?.data?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const fetchDoctorRating = useCallback(async () => {
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
  }, []);

  const fetchMyFeedbacks = useCallback(async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        "https://medicare-backend-hajh.onrender.com/api/my-feedbacks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const submitted = {};
        const userRatings = {};
        const userFeedbacks = {};

        response.data.feedbacks.forEach((feedback) => {
          const appointmentId =
            typeof feedback.appointmentId === "object"
              ? feedback.appointmentId._id
              : feedback.appointmentId;

          submitted[appointmentId] = true;
          userRatings[appointmentId] = feedback.rating;
          userFeedbacks[appointmentId] = feedback.comment || "";
        });

        setSubmittedFeedbacks(submitted);
        setRatings(userRatings);
        setFeedbacks(userFeedbacks);
      }
    } catch (error) {
      console.error("Feedback Fetch Error:", error);
    }
  }, [token]);
  useEffect(() => {
    fetchMyAppointments();
    fetchDoctorRating();
    fetchMyFeedbacks();

    const interval = setInterval(() => {
      fetchMyAppointments();
      fetchDoctorRating();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchMyAppointments, fetchDoctorRating, fetchMyFeedbacks]);

  const latestAppointment = appointments[0];
  const previousAppointments = appointments.slice(1);

  const totalAppointments = appointments.length;

  const upcomingAppointments = appointments.filter(
    (item) =>
      !item.status || item.status === "Pending" || item.status === "Accepted",
  );

  const doctorName = "Dr. Joseph";

  const getStatusText = (status) => {
    if (!status) return "Pending";
    return status;
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Declined") {
      return "bg-red-100 text-red-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  const handleRatingChange = (appointmentId, star) => {
    if (submittedFeedbacks[appointmentId]) {
      return;
    }

    setRatings((prev) => ({
      ...prev,
      [appointmentId]: star,
    }));
  };

  const handleFeedbackChange = (appointmentId, value) => {
    if (submittedFeedbacks[appointmentId]) {
      return;
    }

    setFeedbacks((prev) => ({
      ...prev,
      [appointmentId]: value,
    }));
  };

  const handleFeedbackSubmit = async (appointmentId) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const selectedRating = ratings[appointmentId];
      const comment = feedbacks[appointmentId] || "";

      if (!selectedRating) {
        alert("Please select a star rating.");
        return;
      }

      setSubmittingFeedback(appointmentId);

      const response = await axios.post(
        "https://medicare-backend-hajh.onrender.com/api/feedback",
        {
          appointmentId: appointmentId,
          rating: Number(selectedRating),
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setSubmittedFeedbacks((prev) => ({
          ...prev,
          [appointmentId]: true,
        }));

        await fetchDoctorRating();
        await fetchMyFeedbacks();

        alert("Feedback submitted successfully.");
      }
    } catch (error) {
      console.error("Feedback Error:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setSubmittingFeedback(null);
    }
  };

  const renderStatus = (status) => (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
        status,
      )}`}
    >
      ● {getStatusText(status)}
    </span>
  );

  const renderSmallAppointment = (item) => (
    <div
      key={item._id}
      className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden">
            <img
              src={doctorImage}
              alt="Dr. Joseph"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="font-bold text-slate-800">Dr. Joseph</h3>

            <p className="text-sm text-blue-600 mt-1">General Physician</p>
          </div>
        </div>

        {renderStatus(item.status)}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-semibold text-slate-800 mt-1">{item.date}</p>
        </div>

        <div className="bg-cyan-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Time</p>
          <p className="font-semibold text-slate-800 mt-1">{item.time}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 mt-3">
        <p className="text-xs text-gray-500">Description</p>
        <p className="text-sm font-medium text-slate-700 mt-1">
          {item.description || "No description provided."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                  Patient Dashboard
                </span>

                <h1 className="text-4xl md:text-5xl font-bold mt-5">
                  Welcome Back
                </h1>

                <p className="text-blue-100 text-lg mt-4 leading-7">
                  Manage your appointments and healthcare journey from one
                  convenient place.
                </p>
              </div>

              <Link
                to="/appointment"
                className="self-start md:self-auto bg-white text-blue-700 px-7 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all duration-300"
              >
                + Book Appointment
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <CalendarCheck />
                  </div>

                  <span className="text-blue-600 text-3xl font-bold">
                    {String(totalAppointments).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-gray-500 mt-5">Total Appointments</h3>

                <p className="text-slate-800 font-bold text-xl mt-1">
                  Appointments
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center">
                    <Hospital />
                  </div>

                  <span className="text-cyan-600 text-3xl font-bold">
                    {latestAppointment ? "01" : "00"}
                  </span>
                </div>

                <h3 className="text-gray-500 mt-5">Doctor</h3>

                <p className="text-slate-800 font-bold text-xl mt-1">
                  {latestAppointment ? doctorName : "No Doctor"}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
                    ✓
                  </div>

                  <span className="text-emerald-600 text-3xl font-bold">
                    {String(upcomingAppointments.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-gray-500 mt-5">Upcoming</h3>

                <p className="text-slate-800 font-bold text-xl mt-1">
                  Appointment
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <Star />
                  </div>

                  <span className="text-yellow-500 text-3xl font-bold">
                    ★{" "}
                    {doctorRating > 0 ? doctorRating.toFixed(1) : "No ratings"}
                  </span>
                </div>

                <h3 className="text-gray-500 mt-5">Doctor Rating</h3>

                <p className="text-slate-800 font-bold text-xl mt-1">
                  {totalRatings > 0
                    ? `${totalRatings} Rating${totalRatings > 1 ? "s" : ""}`
                    : "No Ratings"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
                <CalendarCheck className="mx-auto" size={45} />

                <p className="text-gray-500 mt-4">
                  Loading your appointments...
                </p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                  <CalendarCheck size={40} />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mt-5">
                  No Appointment Yet
                </h2>

                <p className="text-gray-500 mt-2">
                  You haven't booked an appointment yet.
                </p>

                <Link
                  to="/appointment"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold mt-6"
                >
                  + Book Appointment
                </Link>
              </div>
            ) : (
              <>
                {latestAppointment && (
                  <div className="bg-white rounded-[2rem] shadow-xl border-2 border-blue-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 md:p-8 text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                            ⭐ Latest Appointment
                          </span>

                          <h2 className="text-3xl font-bold mt-4">
                            Your Latest Appointment
                          </h2>

                          <p className="text-blue-100 mt-2">
                            Most recently booked appointment
                          </p>
                        </div>

                        {renderStatus(latestAppointment.status)}
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden">
                          <img
                            src={doctorImage}
                            alt="Dr. Joseph"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-800">
                            Dr. Joseph
                          </h2>

                          <p className="text-blue-600 text-lg mt-1">
                            General Physician
                          </p>

                          <p className="text-gray-500 mt-1">
                            MBBS, MD • 10+ Years Experience
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <div className="bg-blue-50 rounded-2xl p-5">
                          <p className="text-sm text-gray-500">
                            Appointment Date
                          </p>

                          <p className="font-bold text-slate-800 mt-2">
                            {latestAppointment.date}
                          </p>
                        </div>

                        <div className="bg-cyan-50 rounded-2xl p-5">
                          <p className="text-sm text-gray-500">
                            Appointment Time
                          </p>

                          <p className="font-bold text-slate-800 mt-2">
                            {latestAppointment.time}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5">
                          <p className="text-sm text-gray-500">
                            Contact Number
                          </p>

                          <p className="font-bold text-slate-800 mt-2">
                            {latestAppointment.contact}
                          </p>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-5">
                          <p className="text-sm text-gray-500">Status</p>

                          <p
                            className={`font-bold mt-2 ${
                              latestAppointment.status === "Accepted"
                                ? "text-emerald-600"
                                : latestAppointment.status === "Completed"
                                  ? "text-blue-600"
                                  : latestAppointment.status === "Declined"
                                    ? "text-red-600"
                                    : "text-orange-600"
                            }`}
                          >
                            {latestAppointment.status === "Accepted"
                              ? "✓ Accepted"
                              : latestAppointment.status === "Completed"
                                ? "✓ Completed"
                                : latestAppointment.status === "Declined"
                                  ? "✕ Declined"
                                  : "● Pending"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 mt-4">
                        <p className="text-sm text-gray-500">Description</p>

                        <p className="font-medium text-slate-800 mt-2 leading-7">
                          {latestAppointment.description ||
                            "No description provided."}
                        </p>
                      </div>

                      {latestAppointment.status === "Completed" && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          {submittedFeedbacks[latestAppointment._id] ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                              <p className="text-green-700 font-semibold">
                                ✓ Thank you! Your feedback has been submitted.
                              </p>

                              <div className="flex gap-1 mt-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-2xl ${
                                      star <=
                                      (ratings[latestAppointment._id] || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-slate-800 mb-3">
                                Rate your doctor
                              </p>

                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      handleRatingChange(
                                        latestAppointment._id,
                                        star,
                                      )
                                    }
                                    className={`text-3xl transition ${
                                      star <=
                                      (ratings[latestAppointment._id] || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    } hover:text-yellow-400`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>

                              {ratings[latestAppointment._id] > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                  You selected{" "}
                                  <span className="font-semibold text-yellow-500">
                                    {ratings[latestAppointment._id]} / 5
                                  </span>
                                </p>
                              )}

                              <textarea
                                value={feedbacks[latestAppointment._id] || ""}
                                onChange={(e) =>
                                  handleFeedbackChange(
                                    latestAppointment._id,
                                    e.target.value,
                                  )
                                }
                                placeholder="Write your feedback about the doctor (optional)"
                                rows="4"
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleFeedbackSubmit(latestAppointment._id)
                                }
                                disabled={
                                  submittingFeedback === latestAppointment._id
                                }
                                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
                              >
                                {submittingFeedback === latestAppointment._id
                                  ? "Submitting..."
                                  : "Submit Feedback"}
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                          to="/appointment"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
                        >
                          Book Another
                        </Link>

                        <Link
                          to="/doctors"
                          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                          View Doctor
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {previousAppointments.length > 0 && (
                  <div className="mt-10">
                    <div className="mb-6">
                      <span className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
                        History
                      </span>

                      <h2 className="text-3xl font-bold text-slate-800 mt-2">
                        Previous Appointments
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Your previously booked appointments
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {previousAppointments.map((item) =>
                        renderSmallAppointment(item),
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-8 md:p-10">
              <div className="text-center">
                <span className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
                  Healthcare Journey
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">
                  Manage Your Healthcare Easily
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-10">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                    1
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mt-4">
                    Book
                  </h3>

                  <p className="text-gray-500 text-sm leading-6 mt-2">
                    Choose a convenient date and time for your doctor
                    appointment.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 mx-auto bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xl">
                    2
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mt-4">
                    Consult
                  </h3>

                  <p className="text-gray-500 text-sm leading-6 mt-2">
                    Meet your doctor and discuss your health concerns.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                    3
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mt-4">
                    Stay Healthy
                  </h3>

                  <p className="text-gray-500 text-sm leading-6 mt-2">
                    Continue taking care of your health with professional
                    guidance.
                  </p>
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

export default Dashboard;

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import diseaseIcon from "../assets/virus.png";
import logo from "../assets/logo.png";

const DoctorDisease = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    overview: "",
    symptoms: "",
    causes: "",
    prevention: "",
    treatment: "",
  });

  const [diseases, setDiseases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [count, setCount] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("doctorToken");

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    navigate("/doctor/login", { replace: true });
  };

  useEffect(() => {
    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchPendingAppointments();
    fetchDiseases();
  }, [token, navigate]);

  const fetchPendingAppointments = async () => {
    try {
      const response = await axios.get(
        "https://medicare-backend-hajh.onrender.com/api/appointments?page=1&limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const appointments = response.data.appointments || [];

        const pending = appointments.filter(
          (appointment) =>
            !appointment.status || appointment.status === "Pending",
        );

        setPendingCount(pending.length);
      }
    } catch (error) {
      console.log("Pending Appointment Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        navigate("/doctor/login", { replace: true });
      }
    }
  };

  const fetchDiseases = async (page = count) => {
    try {
      const response = await axios.get(
        `https://medicare-backend-hajh.onrender.com/api/diseases?page=${page}&limit=1`,
      );

      if (response.data.success) {
        setDiseases(response.data.diseases || []);

        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.log("Get Diseases Error:", error);
      alert(error.response?.data?.message || "Unable to load diseases");
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newPage = count - 1;

      setCount(newPage);
      fetchDiseases(newPage);
    }
  };

  const handleIncrement = () => {
    if (count < totalPages) {
      const newPage = count + 1;

      setCount(newPage);
      fetchDiseases(newPage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      overview: "",
      symptoms: "",
      causes: "",
      prevention: "",
      treatment: "",
    });

    setImage(null);
    setImagePreview("");
    setEditingId(null);

    const fileInput = document.getElementById("diseaseImage");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleAddDisease = () => {
    clearForm();
    setShowForm(true);
  };

  const handleEdit = (disease) => {
    setEditingId(disease._id);

    setFormData({
      title: disease.title || "",
      shortDescription: disease.shortDescription || "",
      overview: disease.overview || "",
      symptoms: disease.symptoms?.[0] || "",
      causes: disease.causes?.[0] || "",
      prevention: disease.prevention?.[0] || "",
      treatment: disease.treatment?.[0] || "",
    });

    setImage(null);

    if (disease.image) {
      setImagePreview(
        `https://res.cloudinary.com/djmsizzc/image/upload/${disease.image}`,
      );
    } else {
      setImagePreview("");
    }

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this disease?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://medicare-backend-hajh.onrender.com/api/disease/${id}`,
      );

      if (response.data.success) {
        alert("Disease deleted successfully");

        if (editingId === id) {
          clearForm();
          setShowForm(false);
        }

        fetchDiseases();
      } else {
        alert(response.data.message || "Unable to delete disease");
      }
    } catch (error) {
      console.log("Delete Disease Error:", error);

      alert(error.response?.data?.message || "Unable to delete disease");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !image) {
      alert("Please select a disease image");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter disease name");
      return;
    }

    if (!formData.shortDescription.trim()) {
      alert("Please enter short description");
      return;
    }

    if (!formData.overview.trim()) {
      alert("Please enter complete description");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      if (image) {
        data.append("image", image);
      }

      data.append("title", formData.title);
      data.append("shortDescription", formData.shortDescription);
      data.append("overview", formData.overview);
      data.append("symptoms", formData.symptoms);
      data.append("causes", formData.causes);
      data.append("prevention", formData.prevention);
      data.append("treatment", formData.treatment);

      let response;

      if (editingId) {
        response = await axios.put(
          `https://medicare-backend-hajh.onrender.com/api/disease/${editingId}`,
          data,
        );
      } else {
        response = await axios.post(
          "https://medicare-backend-hajh.onrender.com/api/disease",
          data,
        );
      }

      if (response.data.success) {
        alert(
          editingId
            ? "Disease updated successfully"
            : "Disease added successfully",
        );

        clearForm();
        setShowForm(false);
        fetchDiseases();
      } else {
        alert(
          response.data.message ||
            (editingId ? "Unable to update disease" : "Unable to add disease"),
        );
      }
    } catch (error) {
      console.log("Disease Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save disease. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-[#020617] fixed left-0 top-0 bottom-0 hidden lg:flex flex-col z-50">
        <div className="p-7 border-b border-slate-800">
          <Link to="/doctor/dashboard" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-1">
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

        <div className="px-4 mt-8">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider px-2 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2">
            <NavLink
              to="/doctor/dashboard"
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

            <NavLink
              to="/doctor/patients"
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

            <NavLink
              to="/doctor/diseases"
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
                  className="w-5 h-5 object-contain"
                />
              </span>

              <span>Diseases</span>
            </NavLink>

            {/* CONTACT MESSAGES */}

            <NavLink
              to="/doctor/contacts"
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

            <NavLink
              to="/doctor/profile"
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

        <div className="mt-auto px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5 transition"
          >
            <span className="text-xl w-6 text-center">⇥</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72">
        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doctor Administration</p>

              <h1 className="text-2xl font-bold text-slate-800 mt-1">
                Disease Information
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-11 h-11 rounded-xl overflow-hidden">
                  <img
                    src={doctorImage}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Dr.Joseph
                  </p>

                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                Medical Information
              </span>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                Diseases
              </h2>

              <p className="text-gray-500 mt-2">
                Manage disease information displayed to users.
              </p>
            </div>

            {!showForm && (
              <button
                onClick={handleAddDisease}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                + Add Disease
              </button>
            )}
          </section>

          {!showForm && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-7 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800">
                  Existing Diseases
                </h2>

                <p className="text-gray-500 mt-2">
                  View and manage all disease information.
                </p>
              </div>

              {diseases.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl">🩺</div>

                  <h3 className="text-xl font-bold text-slate-800 mt-5">
                    No Diseases Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Add your first disease information.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {diseases.map((disease) => (
                    <div
                      key={disease._id}
                      className="p-7 flex flex-col md:flex-row gap-6"
                    >
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={`https://res.cloudinary.com/djmsizzc/image/upload/${disease.image}`}
                          alt={disease.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800">
                          {disease.title}
                        </h3>

                        <p className="text-gray-500 mt-2">
                          {disease.shortDescription}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                          Created:{" "}
                          {disease.createdAt
                            ? new Date(disease.createdAt).toLocaleDateString()
                            : "—"}
                        </p>

                        <div className="flex gap-3 mt-5">
                          <button
                            onClick={() => handleEdit(disease)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                          >
                            Update
                          </button>

                          <button
                            onClick={() => handleDelete(disease._id)}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full flex items-center justify-center gap-2 mt-8">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleDecrement}
                  disabled={count === 1}
                >
                  ←
                </button>

                <div className="min-w-10 h-10 px-3 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
                  {count}
                </div>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
                >
                  →
                </button>
              </div>
            </section>
          )}

          {showForm && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingId ? "Update Disease" : "Add Disease"}
                </h2>

                <p className="text-gray-500 mt-2">
                  {editingId
                    ? "Update the disease information."
                    : "Add disease information that will be displayed to users."}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Disease Image
                  </label>

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-40 h-40 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Disease Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl">🖼️</div>

                          <p className="text-xs text-gray-400 mt-2">
                            Image Preview
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        id="diseaseImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 
                        file:mr-4 file:py-3 file:px-5 
                        file:rounded-xl file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-blue-50 file:text-blue-700 
                        hover:file:bg-blue-100"
                      />

                      <p className="text-xs text-gray-400 mt-3">
                        {editingId
                          ? "Select a new image only if you want to replace the existing image."
                          : "Upload an image related to this disease."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Disease Name
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Cancer"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Short Description
                  </label>

                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter a short description of the disease..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Complete Description
                  </label>

                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Enter complete information about the disease..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Symptoms
                  </label>

                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter symptoms..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Causes
                  </label>

                  <textarea
                    name="causes"
                    value={formData.causes}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter causes..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Prevention
                  </label>

                  <textarea
                    name="prevention"
                    value={formData.prevention}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter prevention methods..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Treatment
                  </label>

                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter treatment options..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-semibold transition shadow-sm"
                  >
                    {loading
                      ? editingId
                        ? "Updating..."
                        : "Uploading..."
                      : editingId
                        ? "Update Disease"
                        : "Add Disease"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      clearForm();
                      setShowForm(false);
                    }}
                    className="sm:w-40 border border-slate-300 text-slate-700 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDisease;

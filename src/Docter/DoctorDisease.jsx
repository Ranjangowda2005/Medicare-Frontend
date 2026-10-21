import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const DoctorDisease = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Fetch appointments and diseases
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
        "http://localhost:5000/api/appointments?page=1&limit=10",
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

  // Fetch diseases with pagination
  const fetchDiseases = async (page = count) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/diseases?page=${page}&limit=1`,
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

  // Form and image handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

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

  // Delete disease
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this disease?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/disease/${id}`,
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

  // Add or update disease
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
          `http://localhost:5000/api/disease/${editingId}`,
          data,
        );
      } else {
        response = await axios.post("http://localhost:5000/api/disease", data);
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
    <div className="min-h-screen bg-slate-50 flex w-full overflow-x-hidden">
      {/* Reusable Sidebar */}
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 min-w-0 w-full lg:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition shrink-0"
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">
                Doctor Administration
              </p>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">
                Disease Information
              </h1>
            </div>

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
        </header>

        {/* Page Content */}
        <div className="p-3 sm:p-6 lg:p-10 min-w-0">
          <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                Medical Information
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                Diseases
              </h2>

              <p className="text-gray-500 mt-2">
                Manage disease information displayed to users.
              </p>
            </div>

            {!showForm && (
              <button
                type="button"
                onClick={handleAddDisease}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                + Add Disease
              </button>
            )}
          </section>

          {/* Disease List */}
          {!showForm && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
              <div className="p-4 sm:p-7 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Existing Diseases
                </h2>
                <p className="text-gray-500 mt-2">
                  View and manage all disease information.
                </p>
              </div>

              {diseases.length === 0 ? (
                <div className="text-center py-16 sm:py-20 px-4">
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
                      className="p-4 sm:p-7 flex flex-col md:flex-row gap-5 sm:gap-6"
                    >
                      <div className="w-full h-48 sm:w-40 sm:h-40 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={`https://res.cloudinary.com/djmsizzc/image/upload/${disease.image}`}
                          alt={disease.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 break-words">
                          {disease.title}
                        </h3>

                        <p className="text-gray-500 mt-2 break-words">
                          {disease.shortDescription}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                          Created:{" "}
                          {disease.createdAt
                            ? new Date(disease.createdAt).toLocaleDateString()
                            : "—"}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-5">
                          <button
                            type="button"
                            onClick={() => handleEdit(disease)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(disease._id)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="w-full flex items-center justify-center gap-2 py-6 px-4 border-t border-slate-100">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleDecrement}
                  disabled={count === 1}
                  aria-label="Previous disease"
                >
                  ←
                </button>

                <div className="min-w-10 h-10 px-3 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
                  {count}
                </div>

                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
                  aria-label="Next disease"
                >
                  →
                </button>
              </div>
            </section>
          )}

          {/* Add / Update Disease Form */}
          {showForm && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 min-w-0">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
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
                  <label
                    htmlFor="diseaseImage"
                    className="block text-sm font-semibold text-slate-700 mb-3"
                  >
                    Disease Image
                  </label>

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-40 h-40 shrink-0 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
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

                    <div className="w-full min-w-0">
                      <input
                        id="diseaseImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full max-w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Disease Name
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Cancer"
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="shortDescription"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Short Description
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter a short description of the disease..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="overview"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Complete Description
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter complete information about the disease..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="symptoms"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter symptoms..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="causes"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Causes
                  </label>
                  <textarea
                    id="causes"
                    name="causes"
                    value={formData.causes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter causes..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="prevention"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Prevention
                  </label>
                  <textarea
                    id="prevention"
                    name="prevention"
                    value={formData.prevention}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter prevention methods..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="treatment"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Treatment
                  </label>
                  <textarea
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter treatment options..."
                    className="w-full min-w-0 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                    className="w-full sm:w-40 border border-slate-300 text-slate-700 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition"
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

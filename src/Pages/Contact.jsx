import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapPinCheck, Phone, Mail } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "https://medicare-backend-hajh.onrender.com/api/contact",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      );

      if (response.data.success) {
        alert("Your message has been sent successfully.");
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact Form Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block bg-white/15 border border-white/20 px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
              Contact Us
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mt-6">
              We're Here To Help
            </h1>

            <p className="max-w-2xl mx-auto text-blue-100 text-lg leading-8 mt-6">
              Have a question about MediCare or need help with your appointment?
              Get in touch with our support team.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <span className="text-blue-600 font-semibold uppercase tracking-widest">
                    Get In Touch
                  </span>

                  <h2 className="text-4xl font-bold text-slate-800 mt-4">
                    Contact Information
                  </h2>

                  <p className="text-gray-500 leading-7 mt-5">
                    Reach out to us for appointment support, general questions,
                    or any assistance you need.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 shrink-0 bg-blue-100 rounded-2xl flex items-center justify-center text-xl">
                      <MapPinCheck />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">Address</h3>

                      <p className="text-gray-500 mt-1 leading-6">
                        Mangalore, Karnataka, India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 shrink-0 bg-cyan-100 rounded-2xl flex items-center justify-center text-xl">
                      <Phone />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">Phone</h3>

                      <a
                        href="tel:+91 9902476568"
                        className="text-gray-500 hover:text-blue-600 transition mt-1 block"
                      >
                        +91 99024 76568
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl">
                      <Mail />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">Email</h3>

                      <a
                        href="mailto:joseph@gmail.com"
                        className="text-gray-500 hover:text-blue-600 transition mt-1 block"
                      >
                        joseph@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-7 text-white shadow-lg">
                  <h3 className="text-xl font-bold">Need an Appointment?</h3>

                  <p className="text-blue-100 leading-6 mt-3">
                    Book an appointment with our doctor quickly and
                    conveniently.
                  </p>

                  <a
                    href="/appointment"
                    className="inline-block bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold mt-5 hover:bg-blue-50 transition"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-slate-100">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">
                      Send Us a Message
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Fill out the form below and we'll get back to you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your Phone No"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject
                      </label>

                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is your message about?"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                      />
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Message
                      </label>

                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        rows="6"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold shadow-lg mt-7 transition-all duration-300"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[2rem] shadow-lg p-8 md:p-12 text-center border border-slate-100">
              <span className="text-blue-600 font-semibold uppercase tracking-widest">
                Support
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4">
                Your Health Matters to Us
              </h2>

              <p className="text-gray-500 max-w-2xl mx-auto leading-7 mt-4">
                Whether you need help booking an appointment or have questions
                about our services, we're always happy to help.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-7">
                <a
                  href="tel:+919876543210"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition"
                >
                  Call Us
                </a>

                <a
                  href="mailto:medicare@example.com"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-7 py-3 rounded-xl font-semibold transition"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

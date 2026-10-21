import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const DoctorContacts = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [count, setCount] = useState(1);

  const contactsPerPage = 10;

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/contact/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setContacts(response.data.contacts || []);
      }
    } catch (error) {
      console.error("Fetch Contacts Error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Doctor login expired. Please login again.");
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login", { replace: true });
        return;
      }

      alert(error.response?.data?.message || "Unable to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const name = String(contact.name || "").toLowerCase();
    const email = String(contact.email || "").toLowerCase();
    const subject = String(contact.subject || "").toLowerCase();
    const phone = String(contact.phone || "").toLowerCase();
    const message = String(contact.message || "").toLowerCase();
    const searchValue = search.toLowerCase().trim();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      subject.includes(searchValue) ||
      phone.includes(searchValue) ||
      message.includes(searchValue)
    );
  });

  const newCount = contacts.filter(
    (contact) => contact.status === "new",
  ).length;

  const readCount = contacts.filter(
    (contact) => contact.status === "read",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / contactsPerPage),
  );

  const startIndex = (count - 1) * contactsPerPage;
  const endIndex = startIndex + contactsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  useEffect(() => {
    setCount(1);
  }, [search]);

  useEffect(() => {
    if (count > totalPages) {
      setCount(totalPages);
    }
  }, [count, totalPages]);

  const handleIncrement = () => {
    setCount((previousCount) =>
      previousCount < totalPages ? previousCount + 1 : previousCount,
    );
  };

  const handleDecrement = () => {
    setCount((previousCount) => (previousCount > 1 ? previousCount - 1 : 1));
  };

  const handleMarkAsRead = async (contact) => {
    try {
      const token = localStorage.getItem("doctorToken");

      await axios.put(
        `http://localhost:5000/api/contact/${contact._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContacts((previousContacts) =>
        previousContacts.map((item) =>
          item._id === contact._id ? { ...item, status: "read" } : item,
        ),
      );

      setSelectedContact((previous) =>
        previous ? { ...previous, status: "read" } : null,
      );
    } catch (error) {
      console.error("Mark Contact Read Error:", error);

      alert(error.response?.data?.message || "Unable to update message status");
    }
  };

  const handleDelete = async (contactId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact message?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("doctorToken");

      await axios.delete(`http://localhost:5000/api/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts((previousContacts) =>
        previousContacts.filter((contact) => contact._id !== contactId),
      );

      setSelectedContact(null);
    } catch (error) {
      console.error("Delete Contact Error:", error);

      alert(
        error.response?.data?.message || "Unable to delete contact message",
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleView = (contact) => {
    setSelectedContact(contact);

    if (contact.status === "new") {
      handleMarkAsRead(contact);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex w-full overflow-x-hidden">
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 min-w-0 w-full lg:ml-72">
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
                Contact Messages
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

        <div className="p-3 sm:p-6 lg:p-10 min-w-0">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500">Total Messages</p>
              <h2 className="text-4xl font-bold text-slate-800 mt-3">
                {contacts.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500">New Messages</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-3">
                {newCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
              <p className="text-gray-500">Read Messages</p>
              <h2 className="text-4xl font-bold text-emerald-600 mt-3">
                {readCount}
              </h2>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 overflow-hidden min-w-0">
            <div className="p-4 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Contact Messages
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  Messages submitted through the public contact form.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-w-0 md:w-72 px-4 sm:px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
                <button
                  type="button"
                  onClick={fetchContacts}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="md:hidden p-3 sm:p-4 space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading contact messages...
                </div>
              ) : paginatedContacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-3xl text-blue-600">
                    —
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mt-4">
                    No Messages Found
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Contact messages will appear here.
                  </p>
                </div>
              ) : (
                paginatedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 break-words">
                          {contact.name || "—"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {contact.email || "—"}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                          contact.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {contact.status === "new" ? "New" : "Read"}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">
                          SUBJECT
                        </p>
                        <p className="text-sm text-slate-700 mt-1 break-words">
                          {contact.subject || "No subject"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">
                          PHONE
                        </p>
                        <p className="text-sm text-slate-700 mt-1 break-all">
                          {contact.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">
                          DATE
                        </p>
                        <p className="text-sm text-slate-700 mt-1">
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleView(contact)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      View Message
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr className="text-left text-sm text-gray-500 uppercase tracking-wider">
                    <th className="px-7 py-5">Name</th>
                    <th className="px-7 py-5">Email</th>
                    <th className="px-7 py-5">Subject</th>
                    <th className="px-7 py-5">Date</th>
                    <th className="px-7 py-5">Status</th>
                    <th className="px-7 py-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-16 text-gray-500"
                      >
                        Loading contact messages...
                      </td>
                    </tr>
                  ) : paginatedContacts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-3xl text-blue-600">
                          —
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mt-5">
                          No Messages Found
                        </h3>
                        <p className="text-gray-500 mt-2">
                          Contact messages will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedContacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-7 py-5">
                          <p className="font-semibold text-slate-800">
                            {contact.name || "—"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contact.phone || "—"}
                          </p>
                        </td>
                        <td className="px-7 py-5 text-gray-600 break-all">
                          {contact.email || "—"}
                        </td>
                        <td className="px-7 py-5 text-gray-600">
                          {contact.subject || "No subject"}
                        </td>
                        <td className="px-7 py-5 text-gray-600">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-7 py-5">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              contact.status === "new"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {contact.status === "new" ? "New" : "Read"}
                          </span>
                        </td>
                        <td className="px-7 py-5">
                          <button
                            type="button"
                            onClick={() => handleView(contact)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredContacts.length > 0 && (
              <div className="flex items-center justify-center gap-4 px-3 sm:px-6 py-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count === 1}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  −
                </button>

                <div className="min-w-[110px] text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Page {count} of {totalPages}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {filteredContacts.length} messages
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={count >= totalPages}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white text-2xl font-semibold transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedContact && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-3 sm:p-5">
          <div className="bg-white w-full max-w-2xl max-h-[90dvh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto overscroll-contain">
            <div className="p-4 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                  Contact Message
                </p>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mt-2 break-words">
                  {selectedContact.subject || "No Subject"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                aria-label="Close message"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-7 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Name
                  </p>
                  <p className="font-semibold text-slate-800 mt-2 break-words">
                    {selectedContact.name}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Phone
                  </p>
                  <p className="font-semibold text-slate-800 mt-2 break-all">
                    {selectedContact.phone || "—"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 md:col-span-2 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Email
                  </p>
                  <p className="font-semibold text-slate-800 mt-2 break-all">
                    {selectedContact.email}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 min-w-0">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Message
                </p>
                <p className="text-gray-600 leading-7 mt-3 whitespace-pre-wrap break-words">
                  {selectedContact.message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span
                  className={`self-start px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedContact.status === "new"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {selectedContact.status === "new" ? "New Message" : "Read"}
                </span>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedContact._id)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorContacts;

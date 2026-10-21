import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.jpg";
import DoctorSidebar from "../Components/DoctorSidebar";

const UserManagement = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setLoading(true);

      const response = await axios.get(
        "https://medicare-backend-3tkw.onrender.com/api/all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
        setCurrentPage(1);
      } else {
        console.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login", { replace: true });
        return;
      }

      console.error(error.response?.data?.message || "Failed to load users");
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

    fetchUsers();
  }, []);

  // Block or unblock selected user
  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      setUpdatingId(userId);

      const endpoint =
        status === "Blocked"
          ? `https://medicare-backend-3tkw.onrender.com/api/block-user/${userId}`
          : `https://medicare-backend-3tkw.onrender.com/api/unblock-user/${userId}`;

      const response = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setUsers((previousUsers) =>
          previousUsers.map((user) =>
            user._id === userId ? { ...user, status } : user,
          ),
        );
      } else {
        console.error(response.data.message || "Unable to update user status");
      }
    } catch (error) {
      console.error("Update User Status Error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login", { replace: true });
        return;
      }

      console.error(
        error.response?.data?.message || "Unable to update user status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((previousPage) =>
      previousPage > 1 ? previousPage - 1 : previousPage,
    );
  };

  const handleNext = () => {
    setCurrentPage((previousPage) =>
      previousPage < totalPages ? previousPage + 1 : previousPage,
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex w-full overflow-x-hidden">
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
                User Management
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

        {/* Page Content */}
        <div className="p-3 sm:p-6 lg:p-10 min-w-0">
          {/* Page Introduction */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 rounded-[2rem] p-5 sm:p-7 lg:p-10 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
              <div className="min-w-0">
                <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
                  User Management
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-5">
                  Registered Users
                </h2>

                <p className="text-blue-100 leading-7 mt-3 max-w-2xl text-sm sm:text-base">
                  View all registered users and manage their account access from
                  the Doctor Administration panel.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 w-full sm:w-auto sm:min-w-[180px]">
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-4xl font-bold mt-2">{users.length}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Registered accounts
                </p>
              </div>
            </div>
          </section>

          {/* User List */}
          <section className="mt-6 sm:mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                  User Administration
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  All Registered Users
                </h2>

                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Manage registered user accounts and access status.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchUsers}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-md"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 mt-6 text-center">
                <div className="text-4xl animate-pulse">👥</div>
                <p className="text-gray-500 mt-4">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 mt-6 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  👥
                </div>

                <h3 className="text-xl font-bold text-slate-800 mt-5">
                  No Registered Users
                </h3>

                <p className="text-gray-500 mt-2">
                  No users have registered yet.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 mt-6 overflow-hidden min-w-0">
                {/* Mobile User Cards */}
                <div className="md:hidden p-3 sm:p-4 space-y-4">
                  {paginatedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden">
                          {user.image ? (
                            <img
                              src={`https://res.cloudinary.com/djmsizzc/image/upload/${user.image}`}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 break-words">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 break-all">
                            {user.email}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                            user.status === "Blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.status || "Active"}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-4 space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                            User ID
                          </p>
                          <p className="text-xs text-slate-600 mt-1 break-all">
                            {user._id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                            Registered Date
                          </p>
                          <p className="text-sm text-slate-700 mt-1">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        {user.status === "Blocked" ? (
                          <button
                            type="button"
                            onClick={() => updateUserStatus(user._id, "Active")}
                            disabled={updatingId === user._id}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-3 rounded-xl text-sm font-semibold transition"
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : "Unblock"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              updateUserStatus(user._id, "Blocked")
                            }
                            disabled={updatingId === user._id}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-3 rounded-xl text-sm font-semibold transition"
                          >
                            {updatingId === user._id ? "Updating..." : "Block"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop User Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-6 py-5 text-sm font-semibold text-slate-600">
                          User
                        </th>
                        <th className="text-left px-6 py-5 text-sm font-semibold text-slate-600">
                          Email
                        </th>
                        <th className="text-left px-6 py-5 text-sm font-semibold text-slate-600">
                          Registered Date
                        </th>
                        <th className="text-left px-6 py-5 text-sm font-semibold text-slate-600">
                          Status
                        </th>
                        <th className="text-center px-6 py-5 text-sm font-semibold text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden">
                                {user.image ? (
                                  <img
                                    src={`https://res.cloudinary.com/djmsizzc/image/upload/${user.image}`}
                                    alt={user.name}
                                    className="w-12 h-12 object-cover"
                                  />
                                ) : (
                                  "👤"
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  User ID: {user._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                user.status === "Blocked"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {user.status || "Active"}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-center">
                            {user.status === "Blocked" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  updateUserStatus(user._id, "Active")
                                }
                                disabled={updatingId === user._id}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                              >
                                {updatingId === user._id
                                  ? "Updating..."
                                  : "Unblock"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  updateUserStatus(user._id, "Blocked")
                                }
                                disabled={updatingId === user._id}
                                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                              >
                                {updatingId === user._id
                                  ? "Updating..."
                                  : "Block"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-slate-100 px-3 sm:px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500 text-center sm:text-left">
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-700">
                      {Math.min(endIndex, users.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {users.length}
                    </span>{" "}
                    users
                  </p>

                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15 18-6-6 6-6"
                        />
                      </svg>
                      Previous
                    </button>

                    <div className="flex h-10 min-w-[80px] sm:min-w-[90px] items-center justify-center rounded-xl bg-blue-600 px-2 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-sm">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      Next
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9 18 6-6-6-6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const UserStatusChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isLoggingOut = false;

    // --------------------------------------------------
    // DO NOT CHECK USER STATUS ON DOCTOR PAGES
    // --------------------------------------------------
    if (location.pathname.startsWith("/doctor")) {
      return;
    }

    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");

      // If user is not logged in, do nothing
      if (!token || isLoggingOut) {
        return;
      }

      try {
        await axios.get("http://localhost:5000/api/user-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        // --------------------------------------------------
        // USER HAS BEEN BLOCKED
        // --------------------------------------------------
        if (error.response?.status === 403) {
          isLoggingOut = true;

          alert(
            "Your account has been blocked. Please contact the administrator.",
          );

          // Remove user login information
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect user to login page
          navigate("/", { replace: true });
        }
      }
    };

    // Check immediately
    checkUserStatus();

    // Check every 3 seconds
    const interval = setInterval(checkUserStatus, 3000);

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return null;
};

export default UserStatusChecker;

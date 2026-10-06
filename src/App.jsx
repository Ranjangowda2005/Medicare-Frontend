import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Features from "./components/Features";
import Docters from "./Pages/Docters";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import Appointment from "./Pages/Appointment";
import DoctorLogin from "./Docter/DoctorLogin";
import DoctorDashboard from "./Docter/DoctorDashboard";
// import DoctorAppointments from "./Docter/DoctorAppointments";
import DoctorPatients from "./Docter/DoctorPatients";
import DoctorProfile from "./Docter/DoctorProfile";
import DoctorProtectedRoute from "./Components/DoctorProtectedRoute";
import DoctorDisease from "./Pages/DoctorDisease";
import DiseaseDetails from "./Pages/DiseaseDetails";
import UserManagement from "./Docter/UserManagement";
import UserStatusChecker from "./Components/UserStatusChecker";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import DoctorContacts from "./Docter/DoctorContacts";

function App() {
  return (
    <BrowserRouter>
      <UserStatusChecker />
      <Routes>
        {/* Root path redirects to the login page */}
        <Route path="/" element={<Home />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Docters />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/disease/:id" element={<DiseaseDetails />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route element={<DoctorProtectedRoute />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/users" element={<UserManagement />} />
          {/* <Route path="/doctor/appointment" element={<DoctorAppointments />} /> */}
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/diseases" element={<DoctorDisease />} />
          <Route path="/doctor/contacts" element={<DoctorContacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

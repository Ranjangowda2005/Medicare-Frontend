import DoctorCard from "../Components/DoctorCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Docters = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <DoctorCard />
      </main>
      <Footer />
    </div>
  );
};

export default Docters;

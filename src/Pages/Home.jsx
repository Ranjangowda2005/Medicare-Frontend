import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Features from "../components/Features";
import Footer from "../Components/Footer";
import DiseaseCards from "../Components/DiseaseCards";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <DiseaseCards />

        <Features />

      </main>

      <Footer />
    </div>
  );
};

export default Home;


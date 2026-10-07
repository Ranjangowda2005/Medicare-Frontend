import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DiseaseCards = () => {
  const navigate = useNavigate();

  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiseases = async () => {
    try {
      const response = await axios.get(
        "https://medicare-backend-hajh.onrender.com/api/diseases",
      );

      console.log("Disease API Response:", response.data);

      if (response.data.success) {
        setDiseases(response.data.diseases || []);
      } else {
        console.log("Disease API Error:", response.data.message);
      }
    } catch (error) {
      console.log("Get Diseases Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
      } else {
        console.log("Error Message:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDiseases = async () => {
      await fetchDiseases();
    };
    loadDiseases();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500">Loading diseases...</p>
        </div>
      </section>
    );
  }

  if (diseases.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITLE */}

        <div className="mb-8">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
            Health Information
          </span>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Common Diseases
          </h2>

          <p className="text-gray-500 mt-2">
            Learn more about diseases, symptoms, prevention and treatment.
          </p>
        </div>

        {/* HORIZONTAL CARDS */}

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {diseases.map((disease) => (
            <div
              key={disease._id}
              onClick={() => navigate(`/disease/${disease._id}`)}
              className="min-w-[280px] max-w-[280px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGE */}

              <div className="h-44 overflow-hidden">
                <img
                  src={`https://res.cloudinary.com/djmsizzc/image/upload/${encodeURIComponent(
                    disease.image,
                  )}`}
                  alt={disease.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800">
                  {disease.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {disease.shortDescription}
                </p>

                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseCards;

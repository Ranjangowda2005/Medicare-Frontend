import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DiseaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDisease = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/disease/${id}`,
      );

      if (response.data.success) {
        setDisease(response.data.disease);
      }
    } catch (error) {
      console.log("Get Disease Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDisease = async () => {
      await fetchDisease();
    };

    loadDisease();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading disease information...</p>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Disease not found</h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-semibold"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* TITLE */}

        <div className="mb-8">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
            Medical Information
          </span>

          <h1 className="text-4xl font-bold text-slate-800 mt-2">
            {disease.title}
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            {disease.shortDescription}
          </p>
        </div>

        {/* IMAGE */}

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
          <img
            src={`https://res.cloudinary.com/djmsizzc/image/upload/${encodeURIComponent(
              disease.image,
            )}`}
            alt={disease.title}
            className="w-full max-h-[450px] object-cover"
          />
        </div>

        {/* OVERVIEW */}

        <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Overview</h2>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {disease.overview}
          </p>
        </section>

        {/* SYMPTOMS */}

        <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Symptoms</h2>

          <ul className="space-y-3">
            {disease.symptoms?.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-600">
                <span className="text-blue-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CAUSES */}

        <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Causes</h2>

          <ul className="space-y-3">
            {disease.causes?.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-600">
                <span className="text-blue-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* RISK FACTORS */}

        {disease.riskFactors?.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Risk Factors
            </h2>

            <ul className="space-y-3">
              {disease.riskFactors.map((item, index) => (
                <li key={index} className="flex gap-3 text-gray-600">
                  <span className="text-blue-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PREVENTION */}

        <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Prevention</h2>

          <ul className="space-y-3">
            {disease.prevention?.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-600">
                <span className="text-blue-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* TREATMENT */}

        <section className="bg-white rounded-3xl border border-slate-200 p-7 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Treatment</h2>

          <ul className="space-y-3">
            {disease.treatment?.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-600">
                <span className="text-blue-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DiseaseDetails;

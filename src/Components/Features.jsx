const features = [
  {
    id: 1,
    icon: "👨‍⚕️",
    title: "Expert Doctor",
    description:
      "Consult with experienced and qualified healthcare professionals.",
  },
  {
    id: 2,
    icon: "📅",
    title: "Easy Booking",
    description: "Book your appointment online within a few clicks anytime.",
  },
  {
    id: 3,
    icon: "🔒",
    title: "Secure Data",
    description:
      "Your personal information is protected with secure authentication.",
  },
  {
    id: 4,
    icon: "⏰",
    title: "24/7 Support",
    description:
      "Our healthcare support team is available whenever you need help.",
  },
];

const Features = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Our Features
          </span>

          <h2 className="text-4xl font-bold text-slate-800 mt-4">
            Why Choose MediCare?
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            We provide a fast, secure, and reliable doctor appointment system
            that makes healthcare simple and accessible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-slate-800 mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

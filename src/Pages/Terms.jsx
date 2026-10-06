import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="mt-3 text-blue-100">
            Please read these terms carefully before using MediCare.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              By accessing or using the MediCare website, you agree to follow
              these Terms & Conditions. If you do not agree with any part of
              these terms, please do not use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              2. Use of the Website
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              MediCare provides an online platform that allows users to view
              doctor information and request or manage healthcare appointments.
              Users are expected to provide accurate information when using
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              3. User Account
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Users are responsible for maintaining the accuracy of their
              account information and keeping their login credentials secure.
              You should notify the appropriate administrator if you believe
              your account has been accessed without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              4. Appointments
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Appointment information should be entered accurately. Appointment
              availability, acceptance, or cancellation may depend on the
              information and actions of the healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              5. Healthcare Information
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              MediCare is an appointment management platform. Information
              provided through the platform should not be considered a
              replacement for professional medical advice, diagnosis, or
              emergency medical care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              6. Changes to These Terms
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              MediCare may update these Terms & Conditions when necessary.
              Updated terms will be made available on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              7. Contact
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              If you have questions regarding these terms, please contact the
              MediCare administration team.
            </p>
          </section>

          {/* Back button */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
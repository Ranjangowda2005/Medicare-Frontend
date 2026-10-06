import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-blue-100">
            Learn how MediCare handles information provided by users.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              MediCare may collect information provided by users when they
              register, log in, update their profile, or request an appointment.
              This may include information such as name, email address, contact
              details, and appointment-related information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              2. How We Use Information
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Information may be used to create and manage user accounts,
              process appointments, communicate appointment information, and
              operate and improve the MediCare platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              3. Account Information
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Users should provide accurate information when creating an
              account. Users are also responsible for keeping their account
              credentials secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              4. Appointment Information
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Information submitted during appointment requests may be used to
              help healthcare providers manage and respond to appointments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              5. Data Security
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              MediCare takes reasonable steps to protect information handled
              through the platform. However, no online system can guarantee
              complete security against every possible security threat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              6. Information Sharing
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              Information may be used within the MediCare platform for account
              and appointment management. Information should only be handled
              according to the purpose for which it was collected and applicable
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 mt-3 leading-7">
              This Privacy Policy may be updated when changes are made to the
              MediCare platform or its information practices. Updated
              information will be displayed on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800">8. Contact</h2>
            <p className="text-gray-600 mt-3 leading-7">
              If you have questions about this Privacy Policy, please contact
              the MediCare administration team.
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

export default Privacy;

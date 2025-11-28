import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-6 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Orange Book Publication ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Name, email address, phone number, and shipping address.</li>
            <li>Payment information (processed securely by our payment partners).</li>
            <li>Order history and preferences.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Process and fulfill your orders.</li>
            <li>Send order confirmations and shipping updates.</li>
            <li>Respond to your comments and questions.</li>
            <li>Improve our website and product offerings.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">4. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g., shipping companies, payment gateways) solely to fulfill your orders.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <span className="font-medium text-orange-600">contact@orangebook.in</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
import React from 'react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Orange Book Publication. By accessing or using our website, you agree to be bound by these Terms and Conditions.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">1. Introduction</h2>
          <p>
            These terms govern your use of our website and the purchase of products from us. If you do not agree with any part of these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">2. Use of the Site</h2>
          <p>
            You agree to use our website for lawful purposes only. You must not use our site to transmit any material that is offensive, defamatory, or infringes on intellectual property rights.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">3. Product Information</h2>
          <p>
            We strive to ensure that all product descriptions, images, and prices are accurate. However, errors may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">4. Pricing and Payment</h2>
          <p>
            All prices are listed in Indian Rupees (INR). We reserve the right to change prices at any time. Payment must be received in full before your order is processed.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">5. Limitation of Liability</h2>
          <p>
            Orange Book Publication shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our products or website.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">6. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Gujarat, India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
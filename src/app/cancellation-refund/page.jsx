import React from 'react';

const CancellationRefund = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Cancellation & Refund Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold text-gray-800">1. Cancellation Policy</h2>
          <p>
            You may cancel your order within <strong>24 hours</strong> of placing it, provided it has not yet been shipped. To cancel, please contact our support team immediately. Once the order is shipped, it cannot be canceled.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">2. Returns</h2>
          <p>
            We accept returns only if the product you received is <strong>damaged, defective, or incorrect</strong>. You must report the issue within <strong>7 days</strong> of delivery with photographic proof.
          </p>
          <p>
            We do not accept returns for change of mind or if the product has been used/read.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">3. Refund Process</h2>
          <p>
            If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days (typically 5-7 business days), depending on your card issuer's policies.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">4. Contact Us</h2>
          <p>
            For any cancellation or refund requests, please email us at <span className="font-medium text-orange-600">contact@orangebook.in</span> with your Order ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;
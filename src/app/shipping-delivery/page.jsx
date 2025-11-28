import React from 'react';

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Shipping & Delivery Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold text-gray-800">1. Processing Time</h2>
          <p>
            All orders are processed within <strong>1-2 business days</strong>. Orders are not shipped or delivered on weekends or holidays.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">2. Shipping Rates & Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Standard Shipping:</strong> 5-7 business days</li>
            <li><strong>Express Shipping:</strong> 2-3 business days (if available)</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">*Delivery delays can occasionally occur.</p>

          <h2 className="text-xl font-semibold text-gray-800">3. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">4. International Shipping</h2>
          <p>
            We currently do not ship outside of India.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">5. Damages</h2>
          <p>
            Orange Book Publication is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
'use client';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with actual submission logic
    alert('Thank you! We’ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-orange-50 py-16 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-600">Get in Touch</h2>
          <p className="text-gray-600 mt-2">We’re here to help. Contact us with any questions or feedback.</p>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-2xl shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Email</h4>
                <p className="text-gray-600">contact@orangebook.in</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Address</h4>
                <p className="text-gray-600">123 Orange Street, Delhi, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-orange-700 font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm text-orange-700 font-medium">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm text-orange-700 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md font-medium hover:bg-orange-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

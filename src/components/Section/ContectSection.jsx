'use client';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

export default function ContactSection() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Access environment variables with the NEXT_PUBLIC_ prefix
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Optional: Log to check if they are loaded (remove in production)
    // console.log("Service ID:", SERVICE_ID); 

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        toast.error("EmailJS configuration missing.");
        setLoading(false);
        return;
    }

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          toast.success('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' });
        },
        (error) => {
          console.error('FAILED...', error);
          toast.error('Failed to send message. Please try again.');
        }
      )
      .finally(() => {
        setLoading(false);
      });
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
                <p className="text-gray-600">Shop No. 19/1, Aroma City Center, 2nd Floor, Deesa, Gujarat, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {/* 1. Added ref={form} */}
          <form ref={form} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-orange-700 font-medium">Your Name</label>
              <input
                type="text"
                name="name" // Important: Must match {{name}} variable in EmailJS template
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
                name="email" // Important: Must match {{email}} variable in EmailJS template
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm text-orange-700 font-medium">Message</label>
              <textarea
                name="message" // Important: Must match {{message}} variable in EmailJS template
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-md font-medium hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
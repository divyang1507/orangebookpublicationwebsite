"use client";

import { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    if (PUBLIC_KEY) emailjs.init(PUBLIC_KEY);
  }, [PUBLIC_KEY]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      user_message: formData.message,
      reply_to: formData.email,
      from_name: formData.name,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-orange-50 py-16 px-4 md:px-10">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-600">Get in Touch</h2>
          <p className="text-gray-600 mt-2">
            We’re here to help. Contact us with any questions or feedback.
          </p>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-2xl shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Details */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600">+91 94998 88801</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Email</h4>
                <p className="text-gray-600">orangebookpublication2020@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-orange-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">Address</h4>
                <p className="text-gray-600">
                  Plot No 40/2, GF Suryanarayn Soc, Sector-25, Gandhinagar
                </p>
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
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-400"
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
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm text-orange-700 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="mt-1 w-full px-4 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-md font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

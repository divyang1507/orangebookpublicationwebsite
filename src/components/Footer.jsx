'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-1 rounded-full">
                 {/* Ensure this path matches your logo */}
                <Image src="/LogoImage.webp" alt="logo" width={40} height={40} />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">Orange Book</h2>
                <h2 className="text-lg font-bold leading-tight text-orange-500">Publication</h2>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering young minds with colorful, engaging, and educational books. We believe in making learning a joyful journey for every child.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-600 transition text-white"><FaFacebook size={18}/></Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-600 transition text-white"><FaTwitter size={18}/></Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-600 transition text-white"><FaInstagram size={18}/></Link>
              <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-600 transition text-white"><FaLinkedin size={18}/></Link>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-500">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/user" className="hover:text-white transition">My Account</Link></li>
            </ul>
          </div>

          {/* 3. Customer Policies (Important for Razorpay) */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-500">Policies</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/cancellation-refund" className="hover:text-white transition">Cancellation & Refund</Link></li>
              <li><Link href="/shipping-delivery" className="hover:text-white transition">Shipping & Delivery</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-orange-500">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-orange-500 shrink-0" />
                <span>Shop No. 19/1, Aroma City Center, 2nd Floor, Deesa, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500 shrink-0" />
                <span>contact@orangebook.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Orange Book Publication. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
             {/* Optional extra links */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
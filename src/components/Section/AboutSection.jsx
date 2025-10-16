"use client";
import React from "react";
import aboutImage from '../../../public/LetterReadChild.png'
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="w-full bg-orange-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Image Column */}
         <div className="relative w-full aspect-[2/3]">
         <Image
           src={aboutImage}
           alt="Vision"
           fill
           className="rounded-xl shadow-md object-cover"
         />
       </div>

        {/* Content Column */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-orange-600 leading-tight">
            We Empower Authors <br /> to Publish with Purpose
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Orange Book Publication is more than a publishing service — it's a movement
            to help aspiring and established writers bring their stories to the world.
            We offer editorial excellence, captivating design, and strategic distribution
            to make every book unforgettable.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Complete Author Support</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                From editing to printing and marketing, we walk with you every step of the way.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Eye-Catching Book Designs</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our creative team ensures every cover and layout is professionally crafted.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Global Reach</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Publish once, reach everywhere — bookstores, online platforms, and readers worldwide.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Transparent Pricing</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No hidden fees. You choose your package, and we deliver what we promise.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;

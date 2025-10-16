"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import imgs from "@/public/Group6.png";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const HeroSlider = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const imageurl =
    "https://www.freepik.com/free-vector/children-are-reading-books-stack-books_25679597.htm#fromView=search&page=1&position=4&uuid=1fabd929-1f15-458a-948f-d6f5c63916e9&query=reading+kids";
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        <SwiperSlide>
        <div className="min-h-[30rem] bg-blue-50 flex flex-col lg:flex-row md:justify-between lg:justify-center items-center px-6 py-12 gap-8">
  <div className="text-center lg:text-left max-w-xl">
    <h2 className="text-2xl text-gray-600">Welcome to,</h2>
    <h1 className="lg:text-6xl text-4xl font-bold text-orange-400 mb-4">
      Orange Book Publication <br />
      <span className="text-orange-400">Learn Forever</span>
    </h1>
    <p className="text-gray-700">
      We are a one-stop solution for your child. We provide the best
      colorful books with pictures which help children learn new
      things easily.
    </p>
  </div>

  <div className="w-full max-w-lg">
    <img
      src="/Group6.png"
      alt="Hero"
      className="w-full h-auto object-contain"
    />
  </div>
</div>

        </SwiperSlide>
        <SwiperSlide>
  <div className="min-h-[30rem] bg-gradient-to-r from-orange-50 to-blue-50 flex flex-col lg:flex-row items-center justify-center px-6 py-12 lg:py-20 gap-6 lg:gap-10">

    {/* Text Section */}
    <div className="flex-1 max-w-xl text-center lg:text-left">
      <h2 className="text-sm text-orange-500 uppercase tracking-wide mb-2">Orange Book Publication</h2>
      <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
        Nurturing Young Minds Through Colorful Learning
      </h1>
      <p className="text-gray-700 text-base lg:text-lg">
        At Orange Book Publication, we believe learning should be fun and inspiring. Our picture-rich books help children explore, imagine, and learn with joy.
      </p>
    </div>

    {/* Image Section */}
    <div className="flex-1 max-w-md">
      <img
        src="/TeacherStudent.png"
        alt="Hero"
        className="w-full h-auto object-contain drop-shadow-md"
      />
    </div>

  </div>
</SwiperSlide>



        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
};

export default HeroSlider;

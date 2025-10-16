import AboutSection from "@/components/Section/AboutSection";
import BookSection from "@/components/Section/BookSection/BookSection";
import ContactSection from "@/components/Section/ContectSection";
import HeroSlider from "@/components/Section/HeroSlider";
import Image from "next/image";

export default function Home() {
  return (
    <>
  <div className=" p-2">
  <HeroSlider/>
  </div>
  <div className="">
  <div className="flex flex-col items-center justify-center gap-4 p-4">
   <BookSection/>
    </div>
  <div className="mt-16">
   <AboutSection/>
    </div>
  <div className="mt-16">
   <ContactSection/>
    </div>
  </div>

    </>
  );
}

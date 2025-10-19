"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";

const Page = () => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-6 text-center relative overflow-hidden">
        {/* Banner */}
        <div className="relative">
          <Image
            src="/stack-books-with-library-scene.jpg"
            alt="Banner"
            className="w-full h-36 rounded-2xl object-cover"
            width={400}
            height={144}
          />
          {/* Avatar */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden bg-orange-400 shadow-lg">
            {/* <Image
              src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar11.1060b63041fdffa5f8ef.png"
              alt="Avatar"
              className="object-cover w-full h-full"
              width={100}
              height={100}
            /> */}
            <FaRegUserCircle className="w-full h-full text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-16 space-y-2">
          <h3 className="text-xl font-bold text-orange-600">{profile?.name || "Your Name"}</h3>
          <p className="text-gray-700 font-medium">{user?.email}</p>
          <p className="text-gray-500">{profile?.address || "Your Address"}</p>
        </div>

        {/* Edit Button */}
        <div className="mt-6 z-10">
          <Button
            onClick={() => router.push("/user/profile")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            Edit Profile
          </Button>
        </div>

        {/* Fun background shapes for kids */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-orange-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-300 rounded-full opacity-40 animate-pulse "></div>
      </div>
    </div>
  );
};

export default Page;

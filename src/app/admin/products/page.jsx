"use client";
import AdminProducts from "@/components/AdminProducts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";

const Page = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='p-12'>
   
      <AdminProducts />
    </div>
  );

};

export default Page;

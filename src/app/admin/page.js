"use client";
import AdminProducts from "@/components/AdminProducts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='p-12'>
      <Button onClick={() => router.push("/admin/addbook")} className="px-4 py-2 bg-orange-200 hover:outline-2 outline-orange-600 hover:bg-orange-400 rounded-lg">Add New Book ?</Button>
      <AdminProducts />
    </div>
  );

};

export default page;

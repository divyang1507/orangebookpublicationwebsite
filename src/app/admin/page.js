"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";

const page = () => {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  return <div>admin page</div>;
};

export default page;

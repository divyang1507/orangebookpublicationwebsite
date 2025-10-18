"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

const UserButton = ({ name }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Signed out successfully");
      router.refresh(); // refresh session state
      router.push("/"); // redirect to homepage
    } catch (err) {
      console.error(err);
      toast.error("Error signing out");
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-orange-500 rounded-full p-2 text-xl outline-0">
          <FiUser />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push("/user")
            }>{`profile : ${name}`}</DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="focus:bg-red-300 hover:bg-red-700 transition-colors">
            logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

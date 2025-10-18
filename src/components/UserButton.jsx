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

const UserButton = ({name}) => {
  const router = useRouter()

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-orange-500 rounded-full p-2 text-xl outline-0">
          <FiUser />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={()=>router.push('/user')}>{`profile : ${name}`}</DropdownMenuItem>
          <DropdownMenuItem
          onClick={() => signOut().then(() => router.push('/'))}
            className="focus:bg-red-300 hover:bg-red-700 transition-colors">
            logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
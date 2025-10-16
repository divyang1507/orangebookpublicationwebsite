"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import UserButton from "./UserButton";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Optional: use icon library

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <nav className="w-full z-50 p-4 sticky top-0 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/LogoImage.webp" alt="logo" width={48} height={48} />
          <div>
            <h1 className="text-lg md:text-xl font-bold">Orange Book</h1>
            <h1 className="text-lg md:text-xl font-bold">Publication</h1>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex space-x-10 text-lg font-medium">
          {navLinks.map((item, id) => (
            <li key={id} className="hover:text-orange-500 transition">
              <Link href={item.link}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-4">
          {"" ? (
            <UserButton name={"div"} />
          ) : (
            <>
              <Button
                onClick={() => router.push("/login")}
                className="bg-orange-500 hover:bg-orange-700 text-white">
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/signup")}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                Signup
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4 bg-white p-4 shadow-md rounded-md">
          <ul className="flex flex-col gap-2">
            {navLinks.map((item, id) => (
              <li key={id}>
                <Link
                  href={item.link}
                  className="block text-lg hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-4">
            {session ? (
              <UserButton name={"div"} />
            ) : (
              <>
                <Button
                  onClick={() => {
                    router.push("/login");
                    setMenuOpen(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-700 text-white">
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/signup");
                    setMenuOpen(false);
                  }}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  Signup
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

"use client"; // Required in Next.js 15 for interactivity
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import Link from 'next/link';
import { FaBars } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

function Navbar(){

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };


  return (
    <div className="z-[9999] w-full h-20 bg-black flex flex-row justify-between fixed top-0 left-0 border-b-2 border-neutral-800">
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

        {/* LEFT LINKS */}
        <div className="flex flex-row justify-center items-center sm:px-10 px-2 text-xs">
          
          <Image
            src="/splash-screen-logo.webp"
            alt="Instagram Clone Logo"
            width={30}  // Adjust size
            height={30} // Adjust size
            className="rounded-full mr-2 hover:scale-105 transition-transform duration-200 ease-in-out"
          />
          <Link href="/"> 
          <span className="banner-text uppercase font-extrabold mr-6 orbitron-font hover:text-shadow-cyan text-xs">instagram clone</span>
          </Link>
          <span className="text-gray-400 hidden sm:block font-semibold hover:shadow-xl hover:text-white transition-transform duration-200 ease-in-out mx-4 banner-text">Features</span>
          <span className="text-gray-400 hidden sm:block font-semibold hover:shadow-xl hover:text-white transition-transform duration-200 ease-in-out mx-4 banner-text">Pricing</span>
          <span className="text-gray-400 hidden sm:block font-semibold hover:shadow-xl hover:text-white transition-transform duration-200 ease-in-out mx-4 banner-text">About</span>
          <span className="text-gray-400 hidden sm:block font-semibold hover:shadow-xl hover:text-white transition-transform duration-200 ease-in-out mx-4 banner-text">Contact</span>
          <span className="text-gray-400 hidden sm:block font-semibold hover:shadow-xl hover:text-white transition-transform duration-200 ease-in-out mx-4 banner-text">Products</span>
        </div>

        <FaBars onClick={()=> setSidebarVisible(true)} className="m-6 hover:scale-125 transition-transform duration-200 ease-in-out" />
      </div>

    
  );
};

export default Navbar;

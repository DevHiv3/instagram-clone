"use client"; // Required in Next.js 15 for interactivity
import Link from "next/link"
import { IoCodeSlashSharp } from "react-icons/io5";
import { AiTwotoneCheckCircle, AiFillInstagram, AiFillTwitterSquare,  AiFillLinkedin, AiFillGithub } from "react-icons/ai"

function Footer(){
  return (
    <div className="flex flex-col justify-center items-center bg-black w-full py-28">
      <div className="mt-10">
        <span className="text-white font-bold text-center text-xl uppercase"> MADE WITH NEXT JS</span>
        <div className="flex flex-row justify-evenly items-center w-52 my-4">
          <AiFillInstagram className="h-8 w-8 text-white hover:scale-110 transition-all duration-150 ease-out " />
          <AiFillGithub className="h-8 w-8 text-white hover:scale-110 transition-all duration-150 ease-out " />
          <AiFillTwitterSquare className="h-8 w-8 text-white hover:scale-110 transition-all duration-150 ease-out " />
        </div>
        <span className="text-gray-300 font-thin text-center text-base">© all copyrights reserved, 2025</span>
      </div>
    </div>
    
  );
};

export default Footer;

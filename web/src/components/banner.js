"use client"; // Required in Next.js 15 for interactivity
import Link from "next/link"
import { FiDownload } from "react-icons/fi";
import { IoCodeSlashSharp } from "react-icons/io5";
import { AiTwotoneCheckCircle, AiFillInstagram, AiFillTwitterSquare,  AiFillLinkedin, AiFillGithub } from "react-icons/ai"
import { ReactTyped } from "react-typed";

function Banner(){
  return (
    <div className="bg-neutral-900 leading-none tracking-tight w-full flex flex-col justify-center items-center px-2 pt-12 bg-gradient-to-b from-black to-neutral-800">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 uppercase text-center sm:text-6xl text-5xl font-extrabold mt-32 banner-text sm:w-full w-80 text-wrap">
          An Instagram Clone Using JavaScript
        </h1>
        <span className="sm:h-16 h-60 sm:w-3/5 w-60 text-left text-lg my-16">
        <ReactTyped typeSpeed={10} backSpeed={10} startDelay={1000} backDelay={5000} className=" orbitron-font  font-light text-white "
         strings={[`Experience Social Media Like Never Before. Instagram Clone – Your Personal Space for Sharing Moments, Connecting, and Engaging with Real-Time Updates!`, `Built from the Ground Up with JavaScript: Instagram Clone – Seamlessly Share, Connect, and Engage with a Modern Social Media Experience!`, `Always Stay Ahead – With Over-The-Air Updates, Instagram Clone ensures you're always using the latest version, hassle-free!`,`Instant Connections – Chat in real-time with your friends and followers, bringing conversations to life instantly!`, `"Forgot Password?" No Worries, We've Got You – Recover your account in a few simple steps, ensuring a smooth and secure experience`, ]}
         />
         </span>
         
         <div className="flex flex-row justify-evenly items-center space-x-6 text-center">
          <Link href="https://www.instagram.com/dev.hiv3/">
          <span className="text-2xl text-gray-400 font-bold">
            <AiFillInstagram className="h-16 w-16 text-white hover:scale-110 transition-all duration-150 ease-out " />
          </span>
          </Link>
          <Link href="https://x.com/DevHiv319060">
          <span className="text-2xl text-gray-400 font-bold">
          <AiFillTwitterSquare className="h-16 w-16 text-white hover:scale-110 transition-all duration-150 ease-out" /></span>
          </Link>
          <Link href="https://www.linkedin.com/in/code-awesome-49720a209/">
          <span className="text-2xl text-gray-400 font-bold">
          <AiFillLinkedin className="h-16 w-16 text-white hover:scale-110 transition-all duration-150 ease-out " /></span>
          </Link>
        </div>
        
        <div className="flex flex-row justify-center items-center my-20 pb-40">
          <Link href="https://expo.dev/artifacts/eas/8y67iCRVMndvK12xbDyuAZ.apk" target="_blank" rel="noopener noreferrer" className="flex uppercase text-center p-4 mx-4 font-bold text-black bg-white rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-neutral-700 transition-transform duration-200 ease-in-out">
            <FiDownload className="mr-2" /> DOWNLOAD
          </Link>
          <Link href="https://github.com/DevHiv3/instagram-clone" target="_blank" rel="noopener noreferrer" className="flex text-center uppercase p-4 mx-4 font-bold text-black bg-white rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-neutral-700 transition-transform duration-200 ease-in-out">
          <IoCodeSlashSharp className="mr-2" /> view code
          </Link>
        </div>
      </div>
    
  );
};

export default Banner;

"use client"; // Required in Next.js 15 for interactivity
import { motion } from "framer-motion";
import Link from "next/link"
import { Typography } from '@mui/material';
import { FcAbout } from "react-icons/fc"
import { SiFiverr } from "react-icons/si"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import { AiOutlineInfoCircle } from "react-icons/ai"

const Sidebar = ({ isVisible, toggleSidebar }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}  // Sidebar starts from right (100% to the right)
      animate={{ x: isVisible ? 0 : "100%" }}  // Sidebar moves to the left (0 when visible)
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed top-0 right-0 h-full w-64 bg-black shadow-lg p-5 z-40"
    >
    
    <div className="flex flex-col justify-start items-center flex-wrap fixed bg-black h-screen w-52 z-[1500] text-gray-400 text-md text-sm font-bold py-20 space-y-2">
    
    <div className="flex justify-evenly items-center py-2 w-48 border-y-2 border-gray-800 hover:text-cyan-400 hover:border-cyan-400">
    <LibraryBooksIcon className="inline h-4 w-4" />
    <span className="inline h-4 w-4">     </span>
    <Link href="/terms-and-conditions">
    <Typography variant="subtitle6" className="relative orbitron-font">TERMS AND CONDITIONS </Typography>
    </Link>
    </div>

    <Link href="/iam">
    <div className="flex justify-evenly items-center py-2 w-48 border-y-2 border-gray-800 hover:text-cyan-400 hover:border-cyan-400">
    <span className="inline h-4 w-4">  </span>
    <Typography variant="subtitle6" className="relative right-6 orbitron-font"> IAM ACCESS </Typography>
    </div>
    </Link>
    
    <div onClick={toggleSidebar} className="flex justify-evenly items-center py-2 w-48 border-y-2 border-gray-800 hover:text-cyan-400 hover:border-cyan-400">
    <LibraryBooksIcon className="inline h-4 w-4" />
    <Typography variant="subtitle6" className="relative right-6 orbitron-font"> CLOSE </Typography>
    </div>
    
    
    </div>
    </motion.div>
  );
};

export default Sidebar;

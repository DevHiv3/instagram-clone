import Navbar from "@/components/navbar";
import Banner from "@/components/Banner";
import AppFeatures from "@/components/app-features"
import DevInfo from "@/components/dev-info";
import Footer from "@/components/footer";
import { AiTwotoneCheckCircle, AiFillInstagram, AiFillTwitterSquare,  AiFillLinkedin, AiFillGithub } from "react-icons/ai"


export default function Home() {
  
  return (
    <>
    <div className="bg-neutral-900 flex flex-col w-full h-full justify-center items-center">

      {/* THE NAVBAR */}
      <Navbar />

      {/* THE BANNER */}
      <Banner />

      {/* APP FEATURES */}
      <AppFeatures />

      {/* DEV ABOUT */}
      <DevInfo />

      {/* FOOTER */}
      <Footer />

    </div>
    </>
  );
}

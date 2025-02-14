"use client"; // Required in Next.js 15 for interactivity


function DevInfo(){
  return (
    <div className="flex flex-wrap justify-center items-center w-full bg-black pt-60">
      
    <div className="flex flex-wrap w-4/5 border-2 rounded-2xl border-gray-800 justify-center items-center bg-gradient-to-b from-neutral-900 to-black">
      <div className="h-60 w-full bg-gradient-to-b from-black to-neutral-900 py-20">
        <h1 className="text-center text-white text-4xl font-bold orbitron-font uppercase py-10">DEVELOPER'S OVERVIEW</h1>
      </div>
      <div className="flex flex-col w-96 break-words">
        <iframe src="https://embed.lottiefiles.com/animation/63487" className="h-60 w-60 mx-auto"></iframe>
      </div>
      <div className="flex flex-col w-96 text-left">
        
         <div className="flex flex-col space-y-4 bg-black  text-white bg-opacity-50 rounded-lg font-semibold m-4 shadow-md p-6 transition-transform duration-300 text-xl transform hover:-translate-y-1 hover:shadow-2xl">
           <span className="font-extrabold text-4xl text-white uppercase orbitron-font">Overview </span>
           
           <span className="text-base font-normal banner-text">
          Hello folks, I enjoy creating things that live on the internet. With the proficiency in JavaScript, I turn ideas to real life applications. Highly experienced using libraries like React, making eye-catching, accessible, and user friendly websites and applications
           </span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DevInfo;

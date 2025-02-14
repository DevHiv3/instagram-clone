"use client"; // Required in Next.js 15 for interactivity

function AppFeatures(){
  return (
  <div className="flex flex-col justify-center items-center space-y-20 w-full border-t-2 border-black bg-black py-20 ">
    <h1 className="text-center text-white text-5xl font-bold orbitron-font"> APP FEATURES </h1>
    <div className="flex flex-row justify-center items-center flex-wrap sm:space-x-20 space-y-4 w-full">
       
          <div className="flex flex-col justify-center items-center w-80 shadow-2xl transparent py-10 px-4 rounded-xl cursor-pointer hover:scale-110 transition-all duration-150 ease-out shadow-emerald-500">
            <iframe src="https://lottie.host/embed/12c39fbe-56f3-4a98-a3c0-2dd0d8217eab/z3BldZG4Fx.lottie" className="h-32 w-32 rounded-xl" />
            <h2 className="text-white font-bold text-xl text-left my-4 uppercase orbitron-font"> FORGOT PASSWORD</h2>
            <p className="banner-text text-left text-sm font-medium w-4/5 text-gray-300">
              Easily regain access to your account with our Forgot Password feature. If you ever forget your password, simply enter your registered email or phone number, and we'll send you a secure reset link or OTP. With a few quick steps, you can create a new password and get back to exploring, connecting, and sharing—hassle-free and secure.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center w-80 shadow-2xl transparent py-10 px-4 rounded-xl cursor-pointer hover:scale-110 transition-all duration-150 ease-out shadow-emerald-500">
            <iframe src="https://lottie.host/embed/ab9762ab-1d93-472b-8651-1d08045660ed/cXUk7fNIR5.lottie" className="h-32 w-32 rounded-xl" />
            
            <h2 className="text-white font-bold text-xl text-left my-4 uppercase orbitron-font"> OTA Updates</h2>
            <p className="banner-text text-left text-sm font-medium w-4/5 text-gray-300">
            Stay up to date effortlessly with OTA (Over-the-Air) Updates. Our app ensures you always have the latest features, security patches, and performance improvements—without needing manual downloads. Updates are automatically delivered in the background, so you can enjoy a seamless experience without interruptions.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center w-80 shadow-2xl transparent py-10 px-4 rounded-xl cursor-pointer hover:scale-110 transition-all duration-150 ease-out shadow-emerald-500">
            <iframe src="https://lottie.host/embed/418d93f1-9557-4472-9154-b695b494f8ac/qXmW02CORA.lottie" className="h-32 w-32 rounded-xl" />
            <h2 className="text-white font-bold text-xl text-left uppercase orbitron-font my-4"> REAL-TIME MESSAGING</h2>
            <p className="banner-text text-left text-sm font-medium w-4/5 text-gray-300">
            Connect instantly with friends and followers using our Real-Time Chat & Messaging feature. Send text, images, videos, and voice messages seamlessly, all in a fast and interactive chat experience. Stay engaged with typing indicators, read receipts, and message reactions—making every conversation feel lively and personal.
            </p>
          </div>

          
      </div>
  </div>
  );
};

export default AppFeatures;

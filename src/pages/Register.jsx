import { Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import RegistrationForm from "@/components/RegistrationForm";
import loginBg from "@/assets/login page.png";

export default function Register() {
  if (useStore((s) => s.activeUser)) {
    return <Navigate to="/categories" replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white flex">
      {/* Left Image Section */}
      <div className="hidden md:flex relative w-1/2 overflow-hidden flex-col justify-end p-14">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${loginBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold tracking-wide leading-[1.2]"
          >
            Discover new things on <br />
            Superapp
          </motion.h1>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          <h2 className="brand-title text-5xl mb-4 text-[#72db73]">Super app</h2>
          <p className="text-base text-white mb-8">Create your new account</p>

          <RegistrationForm />
        </motion.div>
      </div>
    </div>
  );
}

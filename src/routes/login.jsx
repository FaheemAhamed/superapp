import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import loginBg from "@/assets/login page.png";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (useStore((s) => s.activeUser)) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password) {
      setError("Please fill in both fields");
      return;
    }

    const success = login(form.username.trim(), form.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const inputCls = "w-full rounded-md bg-[#292929] text-white placeholder:text-[#7c7c7c] px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#11b800] transition-all duration-300";

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
            Welcome back to <br />
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
          <p className="text-base text-white mb-8">Log into your account</p>

          <form onSubmit={onSubmit} className="w-full space-y-4">
            <div>
              <input
                className={inputCls}
                placeholder="Username or Email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <input
                className={inputCls}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="mt-2 text-xs text-[#e61e32] font-medium text-center">
                {error}
              </p>
            )}

            <div className="pt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full rounded-full bg-[#72db73] hover:bg-[#11b800] py-4 font-bold text-white tracking-wide text-lg transition-colors"
              >
                LOG IN
              </motion.button>
            </div>

            <p className="text-center text-sm text-[#7c7c7c] pt-4">
              Don't have an account?{" "}
              <Link to="/" className="text-[#72db73] font-bold hover:underline transition-colors">Sign up</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

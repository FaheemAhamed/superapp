import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { register, users } = useStore();
  const [form, setForm] = useState({ name: "", username: "", email: "", mobile: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Field is required";
    if (!form.username.trim()) e.username = "Field is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Mobile must be 10 digits";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!agree) e.terms = "Please accept terms";

    if (users.some(u => u.username === form.username)) e.username = "Username already exists";
    if (users.some(u => u.email === form.email)) e.email = "Email already registered";

    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setTouched(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      register(form);
      navigate("/categories");
    }
  };

  const currentErrors = touched ? errors : {};

  const inputCls = (hasError) =>
    `w-full rounded-md bg-[#292929] text-white placeholder:text-[#7c7c7c] px-4 py-2.5 text-sm outline-none border transition-all duration-300 ${
      hasError 
        ? "border-[#e61e32]" 
        : "border-transparent focus:border-[#11b800]"
    }`;

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      {["name", "username", "email", "mobile", "password"].map((field) => {
        const placeholder = {
          name: "Name",
          username: "UserName",
          email: "Email",
          mobile: "Mobile",
          password: "Password",
        }[field];
        return (
          <div key={field}>
            <input
              className={inputCls(currentErrors[field])}
              placeholder={placeholder}
              value={form[field]}
              type={field === "mobile" ? "tel" : field === "password" ? "password" : "text"}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
            {currentErrors[field] && (
              <p className="mt-1 text-xs text-[#e61e32] font-medium">{currentErrors[field]}</p>
            )}
          </div>
        );
      })}

      <label className="flex items-center gap-3 mt-2 text-sm text-[#7c7c7c] cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="w-4 h-4 rounded-sm border-gray-600 bg-transparent checked:bg-[#72db73] checked:border-[#72db73] accent-[#72db73]"
        />
        <span>Share my registration data with Superapp</span>
      </label>
      {currentErrors.terms && (
        <p className="mt-1 text-xs text-[#e61e32] font-medium">{currentErrors.terms}</p>
      )}

      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full rounded-full bg-[#72db73] hover:bg-[#11b800] py-3.5 font-bold text-white tracking-wide text-lg transition-colors"
        >
          SIGN UP
        </motion.button>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[12px] text-[#7c7c7c] leading-relaxed">
          By clicking on Sign up, you agree to Superapp{" "}
          <span className="text-[#72db73] cursor-pointer">Terms and Conditions of Use</span>
        </p>

        <p className="text-[12px] text-[#7c7c7c] leading-relaxed">
          To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp{" "}
          <span className="text-[#72db73] cursor-pointer">Privacy Policy</span>
        </p>

        <p className="text-center text-sm text-[#7c7c7c] pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[#72db73] font-bold hover:underline transition-colors">Log in</Link>
        </p>
      </div>
    </form>
  );
}

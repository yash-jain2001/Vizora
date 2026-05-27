import { useContext, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpeg"

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      login(res.data);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-brand-dark overflow-hidden text-white">
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d10_1px,transparent_1px),linear-gradient(to_bottom,#1f293d10_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-brand-card/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            <img
            src={logo}
            alt="logo"
            className="w-15 h-15 rounded-full object-cover"
          />
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Vizora
          </h1>
          </div>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            IoT Monitoring & Analytics Platform
          </p>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Sign In
        </button>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

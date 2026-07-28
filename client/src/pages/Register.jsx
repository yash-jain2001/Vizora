import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";
import SEOHead from '../components/SEOHead';

const Register = () => {

  const navigate = useNavigate()

  const { login } =
    useContext(AuthContext)

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await API.post(
        '/auth/register',
        formData
      )

      login(res.data)

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert(error.response?.data?.message || 'Registration failed')

    }

  }

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-brand-dark overflow-hidden text-white">
      <SEOHead
        title="Create Account"
        description="Create a free Vizora account. Start monitoring IoT sensor data with real-time dashboards, 100+ chart types, and smart alerts."
        canonicalPath="/register"
      />
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d10_1px,transparent_1px),linear-gradient(to_bottom,#1f293d10_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-brand-card/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Join Vizora IoT Analytics Platform
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Select Role
            </label>
            <select
              name="role"
              onChange={handleChange}
              defaultValue="viewer"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Sign Up
        </button>

        <p className="text-center mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
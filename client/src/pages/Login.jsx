import {
  useContext,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate()

  const { login } =
    useContext(AuthContext)

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
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
        '/auth/login',
        formData
      )

      login(res.data)

      navigate('/dashboard')

    } catch (error) {

      console.log(error)

      alert('Invalid credentials')

    }

  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-[#1F2937] p-10 rounded-2xl w-[400px] shadow-2xl"
      >

        <h1 className="text-4xl font-bold mb-8 text-center">
          Mini Grafana
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#374151] mb-4 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#374151] mb-6 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 p-3 rounded-lg font-bold"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white">
      <div className="bg-[#1F2937] p-10 rounded-2xl w-[400px] shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Mini Grafana
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-[#374151] mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-[#374151] mb-6 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 p-3 rounded-lg font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
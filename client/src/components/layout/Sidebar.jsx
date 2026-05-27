import {
  Link,
} from "react-router-dom";

import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../../context/AuthContext";

const Sidebar = () => {

  const {
    user,
    logout,
  } = useContext(AuthContext)

  return (
    <div className="w-[260px] min-h-screen bg-black text-white p-6 flex flex-col justify-between">

      <div>

        <h1 className="text-3xl font-bold mb-10 text-green-500 cursor-default">
          MiniGrafana
        </h1>

        <div className="flex flex-col gap-5 text-lg">

          <Link
            to="/dashboard"
            className="hover:text-green-400 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/datasources"
            className="hover:text-green-400 transition"
          >
            Datasources
          </Link>

          {/* ADMIN ONLY */}

          {user?.role ===
            "admin" && (

            <Link
              to="/admin"
              className="hover:text-green-400 transition"
            >
              Admin Panel
            </Link>

          )}

        </div>

      </div>

      {/* USER INFO */}

      <div className="border-t border-zinc-700 pt-6">

        <p className="text-gray-400 mb-2">
          {user?.name}
        </p>

        <p className="text-sm text-green-400 capitalize mb-4">
          {user?.role}
        </p>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg w-full"
        >
          Logout
        </button>

      </div>

    </div>
  )

}

export default Sidebar
import {
  useContext,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

const RoleRoute = ({
  children,
  allowedRoles,
}) => {

  const { user } =
    useContext(AuthContext)

  if (!user) {
    return <Navigate to="/" />
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <div className="h-screen flex items-center justify-center bg-[#111827] text-white text-3xl font-bold">
        Access Denied 🚫
      </div>
    )

  }

  return children
}

export default RoleRoute
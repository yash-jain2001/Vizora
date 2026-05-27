import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Datasources from "../pages/Datasources";
import Admin from "../pages/Admin";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/datasources"
          element={
            <ProtectedRoute>
              <Datasources />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}

        <Route
          path="/admin"
          element={
            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <Admin />
            </RoleRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )

}

export default AppRoutes
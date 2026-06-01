import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Datasources from "../pages/Datasources";
import Alerts from "../pages/Alert";
import Analytics from "../pages/Analytics";
import Admin from "../pages/Admin";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

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

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute
              allowedRoles={[
                'admin',
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
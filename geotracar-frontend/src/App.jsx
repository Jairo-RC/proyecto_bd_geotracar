// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/Profile";
import SummaryDashboard from "./admin/SummaryDashboard";
import UsersList from "./admin/UsersList";
import UserDetail from "./admin/UserDetail";
import OrdersList from "./admin/OrdersList";
import OrderDetail from "./admin/OrderDetail";
import VehiclesList from "./admin/VehiclesList";

/**
 * Layout para Rutas Protegidas
 */
function ProtectedLayout() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

/**
 * Layout para Rutas de Administrador
 */
function AdminLayout() {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/**
 * Decide la página de inicio según el rol del usuario.
 */
function Root() {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return <Navigate to="/admin/summary" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

/**
 * Botón Volver reutilizable
 */
function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const hidePaths = ["/", "/dashboard", "/admin/summary"];

  if (hidePaths.includes(location.pathname)) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        padding: "6px 12px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      ← Volver
    </button>
  );
}

function App() {
  return (
    <BrowserRouter>
      <BackButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="summary" element={<SummaryDashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="vehicles" element={<VehiclesList />} />
          </Route>
        </Route>

        <Route path="/" element={<Root />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

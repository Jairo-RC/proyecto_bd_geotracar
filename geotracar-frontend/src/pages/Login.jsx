// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Si ya hay token, redirige al root y que App.jsx decida según rol
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/clients/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      const data = await response.json();
      // Guardamos token y datos del cliente
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.client));
      localStorage.setItem("role", data.client.role);
      localStorage.setItem(
        "last_connection",
        data.client.last_connection || ""
      );

      // Redirige al root; App.jsx hará la lógica para llevar a admin a su dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de red o servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 10,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {error}
          </div>
        )}
        <button type="submit" className="login-button">
          Entrar
        </button>
        <p style={{ marginTop: 16, color: "#64748b", textAlign: "center" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

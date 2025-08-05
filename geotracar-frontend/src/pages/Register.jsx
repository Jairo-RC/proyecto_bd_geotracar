import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Redirige si ya está logueado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (password !== confirm) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      const resp = await fetch("http://localhost:4000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          email,
          password,
          contact: "",
          address: "",
          create_date: new Date(), // Ajusta si tu backend necesita otro formato
        }),
      });

      if (resp.status === 201) {
        setMensaje("¡Usuario registrado exitosamente! Redirigiendo...");
        setTimeout(() => navigate("/login", { replace: true }), 1300);
      } else {
        const data = await resp.json();
        setMensaje(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          className="login-input"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {mensaje && (
          <div style={{
            color: mensaje.includes("exitosamente") ? "#22c55e" : "#e11d48",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "600",
            fontSize: "1rem"
          }}>
            {mensaje}
          </div>
        )}
        <button type="submit" className="login-button">
          Registrarme
        </button>
        <p style={{ marginTop: 16, color: "#64748b", textAlign: "center" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

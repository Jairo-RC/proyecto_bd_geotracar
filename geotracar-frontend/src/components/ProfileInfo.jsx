// src/components/ProfileInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileInfo() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const res = await axios.get(`/api/clients/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(res.data);
    };
    fetchProfile();
  }, []);

  if (!client) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h3>Perfil</h3>
      <p>Nombre: {client.name}</p>
      <p>Email: {client.email}</p>
      <p>
        Tipo de Cliente:{" "}
        <b>{client.type_client_id === 2 ? "Premium" : "Free"}</b>
      </p>
    </div>
  );
}

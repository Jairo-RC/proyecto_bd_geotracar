import axios from "axios";

// Devuelve la ruta realista de calles entre los puntos [lat, lng]
export async function getStreetRoute(coords, maxAttempts = 5) {
  if (!Array.isArray(coords) || coords.length < 2) return coords;

  const apiKey =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdlNzQ0MDdmMGYwODRiMjFhMjM1N2FkMGFjMmY0Yzg2IiwiaCI6Im11cm11cjY0In0=";
  const url =
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

  // ======================== Helper: Validar punto ========================
  function isValidPoint([lat, lng]) {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat > 8 &&
      lat < 12 &&
      lng > -86 &&
      lng < -82
    );
  }

  let coordinates = coords.map(([lat, lng]) => [lng, lat]); // [lng, lat] para ORS
  coordinates = coordinates.filter(([lng, lat]) => isValidPoint([lat, lng]));

  if (coordinates.length < 2) {
    console.warn("No hay suficientes puntos válidos para trazar ruta.");
    return coords;
  }

  // ======================== Retry eliminando puntos problemáticos ========================
  let attempt = 0;
  let lastError = null;
  let points = [...coordinates];

  while (points.length >= 2 && attempt < maxAttempts) {
    try {
      console.log(`Intentando ruteo, intento ${attempt + 1}:`, points);
      const res = await axios.post(
        url,
        { coordinates: points },
        {
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const result = res.data.features?.[0]?.geometry?.coordinates || [];
      return result.map(([lng, lat]) => [lat, lng]); // Regresar a formato [lat, lng]
    } catch (err) {
      lastError = err;
      const msg = err.response?.data?.error?.message || "";
      const match = msg.match(/coordinate (\\d+)/);
      if (match) {
        const idx = parseInt(match[1]);
        console.warn(`Removiendo punto problemático en posición ${idx}`);
        points.splice(idx, 1); // Quitar el punto problemático
        attempt++;
        continue;
      }
      break; // Si no se detecta índice o es otro error, salimos
    }
  }

  // ======================== Fallback ========================
  if (lastError?.response) {
    console.error(
      "API response:",
      JSON.stringify(lastError.response.data, null, 2)
    );
  }
  console.warn("No se pudo obtener ruta realista, mostrando ruta simple.");
  return coords;
}

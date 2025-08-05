// src/components/VehicleMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function VehicleMap({ vehicles }) {
  const center = vehicles.length
    ? [vehicles[0].position.lat, vehicles[0].position.lng]
    : [0, 0];

  return (
    <MapContainer center={center} zoom={6} style={{ height: 400, width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {vehicles.map(v => v.position && (
        <Marker
          key={v.id}
          position={[v.position.lat, v.position.lng]}
        >
          <Popup>
            {v.plate} — {v.brand}<br/>
            Estado: {v.status}<br/>
            {new Date(v.position.at).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

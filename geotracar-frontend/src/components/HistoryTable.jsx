// src/components/HistoryTable.jsx
import React from 'react';

export default function HistoryTable({ trackFrames, orders }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>ID</th>
          <th>Referencia</th>
          <th>Lat</th>
          <th>Lng</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {trackFrames.map(tf => (
          <tr key={`tf-${tf.id}`}>
            <td>TrackFrame</td>
            <td>{tf.id}</td>
            <td>{tf.order_tracker_id}</td>
            <td>{tf.latitude}</td>
            <td>{tf.longitude}</td>
            <td>{new Date(tf.create_date).toLocaleString()}</td>
          </tr>
        ))}
        {orders.map(o => (
          <tr key={`o-${o.id}`}>
            <td>Order</td>
            <td>{o.id}</td>
            <td>{o.description || '-'}</td>
            <td colSpan={3}>
              {new Date(o.create_date).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// scripts/fixOrphanOrders.js
const { OrderTracker } = require("../src/models");
const TrackFrameMongo = require("../src/models/trackFrameMongo");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER || "openstreetmap",
  apiKey: process.env.GEOCODER_API_KEY || null,
  formatter: null,
});

(async () => {
  // Busca todas las órdenes
  const orders = await OrderTracker.findAll();
  let count = 0;
  for (const order of orders) {
    const exists = await TrackFrameMongo.findOne({
      order_tracker_id: order.id,
    });
    if (!exists) {
      // Geocodifica para obtener coords
      const [origGeo] = await geocoder.geocode(order.origin);
      const [destGeo] = await geocoder.geocode(order.destination);
      if (!origGeo || !destGeo) {
        console.log(`❌ No coords para orden ${order.id}`);
        continue;
      }
      await TrackFrameMongo.create({
        order_tracker_id: order.id,
        status_id: 1,
        create_date: order.create_date,
        location: {
          type: "Point",
          coordinates: [origGeo.longitude, origGeo.latitude],
        },
      });
      await TrackFrameMongo.create({
        order_tracker_id: order.id,
        status_id: 2,
        create_date: order.create_date,
        location: {
          type: "Point",
          coordinates: [destGeo.longitude, destGeo.latitude],
        },
      });
      console.log(`✅ Reparada orden ${order.id} en Mongo`);
      count++;
    }
  }
  console.log(`Proceso completado. Se repararon ${count} órdenes.`);
  process.exit();
})();

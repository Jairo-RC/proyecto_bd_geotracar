const cron = require("node-cron");
const TrackFrame = require("../models/trackFrameMongo"); // Mongoose
const { OrderTracker } = require("../models"); // Sequelize (desde models/index.js)

/**
 * Inicia un job de validación entre MongoDB (trackframes) y PostgreSQL (ordenes).
 * Se ejecuta cada 5 minutos por defecto.
 */
module.exports = function startOrderValidationJob() {
  cron.schedule("*/5 * * * *", async () => {
    console.log(
      "[Job] Iniciando validación de órdenes entre Mongo y Postgres..."
    );

    try {
      // 1) IDs únicos en Mongo (trackframes)
      const mongoIds = await TrackFrame.distinct("order_tracker_id");

      // 2) IDs en Postgres (ordenes)
      const pgOrders = await OrderTracker.findAll({
        attributes: ["id"],
        raw: true,
      });
      const pgIds = pgOrders.map((o) => o.id);

      // 3) IDs que están en Mongo pero NO en Postgres
      const missingInPG = mongoIds.filter((id) => !pgIds.includes(id));
      // 4) IDs que están en Postgres pero NO en Mongo (opcional, para integridad bidireccional)
      const missingInMongo = pgIds.filter((id) => !mongoIds.includes(id));

      // Reportar
      if (missingInPG.length > 0) {
        console.warn(
          `[Job] ⚠️ Ordenes en Mongo pero NO en Postgres: ${missingInPG.join(", ")}`
        );
        // Aquí puedes enviar un correo, notificación, guardar log en BD, etc.
      }
      if (missingInMongo.length > 0) {
        console.warn(
          `[Job] ⚠️ Ordenes en Postgres pero NO en Mongo: ${missingInMongo.join(", ")}`
        );
      }
      if (missingInPG.length === 0 && missingInMongo.length === 0) {
        console.log(
          "[Job] ✅ No se encontraron inconsistencias entre las ordenes."
        );
      }
    } catch (err) {
      console.error("[Job] 🚨 Error validando órdenes:", err);
    }
  });

  console.log(
    "[Job] Tarea programada: validación de órdenes cada 5 minutos (Mongo vs. Postgres)."
  );
};

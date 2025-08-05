// scripts/createAdmin.js
const bcrypt = require("bcrypt");
const { Client } = require("../src/models"); // ajusta ruta si tu estructura es distinta
const sequelize = require("../src/config/postgres");

async function run() {
  try {
    await sequelize.authenticate();

    const email = "admin@gmail.com";
    const existing = await Client.findOne({ where: { email } });
    if (existing) {
      console.log("Ya existe un admin con ese email. Eliminando para recrear...");
      await existing.destroy();
    }

    const plainPassword = "admin"; // cambialo por uno seguro o pedir por args
    const hashed = await bcrypt.hash(plainPassword, 10);

    const admin = await Client.create({
      name: "Admin Principal",
      email,
      password: hashed,
      role: "admin",
      type_client_id: 2,
      premium_since: new Date(),
      track_available: true,
      create_date: new Date(),
      is_active: true,
    });

    console.log("Admin creado:");
    console.log({
      email: admin.email,
      role: admin.role,
      tempPassword: plainPassword,
    });
    process.exit(0);
  } catch (err) {
    console.error("Error creando admin:", err);
    process.exit(1);
  }
}

run();

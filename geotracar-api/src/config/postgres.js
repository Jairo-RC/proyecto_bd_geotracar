// src/config/postgres.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host:     process.env.PG_HOST,
    port:     process.env.PG_PORT,
    dialect:  'postgres',
    timestamps: false,
    logging:  false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err));

// **EXPORTA la instancia de Sequelize directamente**:
module.exports = sequelize;

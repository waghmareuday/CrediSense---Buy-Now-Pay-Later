const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function setup() {
  await client.connect();
  await client.query(`
    DROP TABLE IF EXISTS transactions;
    CREATE TABLE transactions (
      id SERIAL PRIMARY KEY,
      merchant_api_key VARCHAR(100),
      product_name VARCHAR(255),
      cart_value FLOAT NOT NULL,
      decision VARCHAR(50) NOT NULL,
      risk_probability FLOAT NOT NULL,
      fraud_flags JSON,
      telemetry JSON,
      shap_explanations JSON NOT NULL,
      user_data JSON NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database reset and rich schema created successfully");
  await client.end();
}

setup().catch(console.error);

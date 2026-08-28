const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

const VALID_API_KEY = process.env.API_KEY || 'cs_live_a1b2c3d4e5f6g7h8';

// API Key Verification Middleware (simulating Stripe/Klarna B2B authentication)
app.use((req, res, next) => {
    // We only protect the checkout route. The dashboard/health routes remain open for the UI demo.
    if (req.path === '/api/checkout') {
        const apiKey = req.headers['x-api-key'];
        // In a real app, this would check a DB. For demo, we accept any key starting with cs_live_ or cs_test_
        if (!apiKey || (!apiKey.startsWith('cs_live_') && !apiKey.startsWith('cs_test_'))) {
            return res.status(401).json({ error: "Unauthorized: Invalid API Key. Key must start with cs_live_ or cs_test_" });
        }
    }
    next();
});

app.post('/api/checkout', async (req, res) => {
    try {
        const { customer_identity, address_data, cart_data, telemetry } = req.body;
        const apiKey = req.headers['x-api-key'];
        
        // Pass everything to the ML microservice for the Two-Stage Risk Engine
        const mlPayload = {
            customer_identity,
            address_data,
            cart_data,
            telemetry
        };

        const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, mlPayload);
        const { decision, risk_probability, shap_explanations, fraud_flags } = mlResponse.data;

        const productName = cart_data.items && cart_data.items.length > 0 ? cart_data.items[0].name : 'Unknown Product';
        
        // Save to PostgreSQL
        const query = `
            INSERT INTO transactions (merchant_api_key, product_name, cart_value, user_data, decision, risk_probability, fraud_flags, telemetry, shap_explanations)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const values = [
            apiKey, 
            productName, 
            cart_data.total_value, 
            customer_identity, 
            decision, 
            risk_probability, 
            JSON.stringify(fraud_flags), 
            JSON.stringify(telemetry), 
            JSON.stringify(shap_explanations)
        ];
        const result = await pool.query(query, values);

        let message = '';
        if (decision === 'APPROVED') message = 'Your BNPL request was approved!';
        else if (decision === 'COUNTER_OFFER') message = 'Action Required: Please provide a 50% down-payment to proceed.';
        else message = 'We cannot approve this transaction at this time due to high risk.';

        res.json({
            success: true,
            decision,
            transaction_id: result.rows[0].id,
            message
        });

    } catch (error) {
        console.error("Error communicating with ML service or DB:", error.message);
        res.status(500).json({ error: "Failed to process checkout risk assessment" });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

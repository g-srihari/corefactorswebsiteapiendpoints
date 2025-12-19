// Load local environment variables from .env during development
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const express = require("express");
const bodyParser = require("body-parser");
const formHandler = require('./handlers/form.handler');
const newsletterHandler = require('./handlers/newsletter.handler');
const teleduceService = require('./services/teleduce.service');

// ==============================
// TELEDUCE CONTROL FOR LOCAL DEV
// Change ENABLE_TELEDUCE to true to actually send to Teleduce
// ==============================
const ENABLE_TELEDUCE = true; // Set to true when you want to send to Teleduce

// Wrap sendLead so payload is always logged
(() => {
  const origSendLead = teleduceService.sendLead.bind(teleduceService);
  teleduceService.sendLead = async (formType, payload) => {
    console.log(`\n[TELEDUCE] Outgoing payload for ${formType}:`, JSON.stringify(payload, null, 2));

    if (!ENABLE_TELEDUCE) {
      console.log('[TELEDUCE] Skipped (ENABLE_TELEDUCE=false)\n');
      return { status: 'skipped', reason: 'TELEDUCE_DISABLED_IN_LOCAL', payload };
    }

    console.log('[TELEDUCE] Sending to Teleduce...');
    try {
      const response = await origSendLead(formType, payload);
      console.log('[TELEDUCE] Response status:', response.status);
      console.log('[TELEDUCE] Response data:', JSON.stringify(response.data, null, 2));
      console.log('[TELEDUCE] ✓ Successfully sent\n');
      return response;
    } catch (error) {
      console.log('[TELEDUCE] ✗ Error:', error.message);
      console.log('[TELEDUCE] Full error:', error, '\n');
      throw error;
    }
  };
})();

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-SITE-TOKEN");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

/* -------------------------
   Route: /subscribe - Newsletter subscription
-------------------------- */
app.post("/subscribe", async (req, res) => {
  try {
    const result = await newsletterHandler.handleSubscription(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("[SUBSCRIBE] Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------
   Route: /submit - Form submission
-------------------------- */
app.post("/submit", async (req, res) => {
  try {
    const result = await formHandler.handleFormSubmission(
      req.body, 
      req.headers, 
      { skipCaptcha: false } // Disable CAPTCHA for local testing
    );
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("[SUBMIT] Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Local test server running on http://localhost:3000");
  console.log("  - POST /submit - Form submissions");
  console.log("  - POST /subscribe - Newsletter subscriptions");
});

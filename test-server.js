// Load environment variables
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const express = require('express');
const bodyParser = require('body-parser');
const { handler } = require('./server'); // Import Lambda handler

const app = express();
app.use(bodyParser.json());

// Middleware to simulate Lambda event from Express request
app.use(async (req, res) => {
  // Create Lambda event object from Express request
  const event = {
    httpMethod: req.method,
    path: req.path,
    rawPath: req.path,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null
  };

  console.log('[TEST-SERVER] Simulating Lambda event:');
  console.log('- Method:', event.httpMethod);
  console.log('- Path:', event.path);
  console.log('- Origin:', req.headers.origin);
  console.log('- Body:', event.body);

  try {
    // Call the actual Lambda handler
    const lambdaResponse = await handler(event);
    
    console.log('[TEST-SERVER] Lambda response:');
    console.log('- Status:', lambdaResponse.statusCode);
    console.log('- Headers:', lambdaResponse.headers);

    // Convert Lambda response to Express response
    res.status(lambdaResponse.statusCode);
    
    // Set headers from Lambda response
    if (lambdaResponse.headers) {
      Object.keys(lambdaResponse.headers).forEach(key => {
        res.set(key, lambdaResponse.headers[key]);
      });
    }
    
    // Send body
    if (lambdaResponse.body) {
      if (typeof lambdaResponse.body === 'string') {
        res.send(lambdaResponse.body);
      } else {
        res.json(lambdaResponse.body);
      }
    } else {
      res.end();
    }
    
  } catch (error) {
    console.error('[TEST-SERVER] Error calling Lambda handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log('📝 This simulates your Lambda handler locally');
  console.log('🧪 Test endpoints:');
  console.log('   POST http://localhost:4000/subscribe - Newsletter');
  console.log('   POST http://localhost:4000/submit - Form submission');
  console.log('   POST http://localhost:4000/anything - Default form handler');
});
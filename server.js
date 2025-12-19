const formHandler = require("./handlers/form.handler");
const newsletterHandler = require("./handlers/newsletter.handler");

/**
 * AWS Lambda Handler
 * Routes requests to appropriate handlers based on path
 */
exports.handler = async (event) => {
  const path = event.path || event.rawPath || '';
  
  // Simple CORS headers - allow all domains
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-SITE-TOKEN",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  
  // Debug logging
  console.log('[LAMBDA] Request path:', path);
  console.log('[LAMBDA] Method:', event.httpMethod);

  /* -------------------------
     Preflight (CORS)
  -------------------------- */
  if (event.httpMethod === "OPTIONS") {
    console.log('[LAMBDA] Handling preflight request');
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    /* -------------------------
       Parse request body
    -------------------------- */
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing request body" })
      };
    }

    const body = JSON.parse(event.body);

    /* -------------------------
       Route: /subscribe - Newsletter subscription
    -------------------------- */
    if (path.includes('/subscribe')) {
      const result = await newsletterHandler.handleSubscription(body);
      return {
        statusCode: result.statusCode,
        headers,
        body: JSON.stringify(result.body)
      };
    }

    /* -------------------------
       Route: /lead - Form submission (default)
    -------------------------- */
    const result = await formHandler.handleFormSubmission(body, event.headers);
    return {
      statusCode: result.statusCode,
      headers,
      body: JSON.stringify(result.body)
    };

  } catch (error) {
    console.error("[LAMBDA] Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};

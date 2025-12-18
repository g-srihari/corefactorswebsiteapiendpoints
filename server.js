const getCorsHeaders = require("./utils/cors");
const formHandler = require("./handlers/form.handler");
const newsletterHandler = require("./handlers/newsletter.handler");

/**
 * AWS Lambda Handler
 * Routes requests to appropriate handlers based on path
 */
exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin;
  const headers = getCorsHeaders(origin);
  const path = event.path || event.rawPath || '';

  /* -------------------------
     Preflight (CORS)
  -------------------------- */
  if (event.httpMethod === "OPTIONS") {
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

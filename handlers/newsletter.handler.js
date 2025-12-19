const newsletters = require('../newsletters');
const senderService = require('../services/sender.service');

/**
 * Handle newsletter subscription requests
 * @param {Object} body - Request body containing email, name, and optional newsletterType
 * @returns {Promise<Object>} Response object with status and data
 */
async function handleSubscription(body) {
  const newsletterType = body.newsletterType || "blog";
  const newsletterConfig = newsletters[newsletterType];

  console.log("[NEWSLETTER] Subscription request for:", newsletterType);

  if (!newsletterConfig) {
    console.log("Invalid newsletter type:", newsletterType);
    return {
      statusCode: 400,
      body: { error: "Invalid newsletter type" }
    };
  }

  // Map the payload using newsletter config
  const payload = newsletterConfig.mapPayload(body);

  if (!payload.email) {
    return {
      statusCode: 400,
      body: { error: "Email is required" }
    };
  }

  try {
    const result = await senderService.subscribe({
      email: payload.email,
      name: payload.name,
      source: payload.source,
      tags: payload.tags
    });
    
    console.log("[NEWSLETTER]  Successfully subscribed:", payload.email);
    
    return {
      statusCode: result.status,
      body: result.data
    };
  } catch (error) {
    console.error("[NEWSLETTER] Subscription failed:", error.message);
    
    return {
      statusCode: error.response?.status || 500,
      body: {
        error: "Internal server error",
        details: error.message
      }
    };
  }
}

module.exports = {
  handleSubscription
};

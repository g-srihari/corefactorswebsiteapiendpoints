const axios = require("axios");

const SENDER_API_KEY = process.env.SENDER_API_KEY;
const SENDER_API_URL = "https://api.sender.net/v2/subscribers";

/**
 * Subscribe a user to the newsletter via Sender.net API
 * @param {Object} params - Subscription parameters
 * @param {string} params.email - User's email address
 * @param {string} params.name - User's name (optional)
 * @param {string} params.source - Subscription source (optional)
 * @param {Array<string>} params.tags - Array of tag IDs (optional)
 * @returns {Promise<Object>} Sender.net API response
 */
async function subscribe({ email, name = "", source = "Newsletter Blogs API", tags = ["dGKEw8", "g-gyyg6B"] }) {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!SENDER_API_KEY) {
    throw new Error("SENDER_API_KEY not configured");
  }

  try {
    const response = await axios.post(SENDER_API_URL, {
      email,
      first_name: name,
      source,
      tags,
    }, {
      headers: {
        "Authorization": `Bearer ${SENDER_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000
    });

    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error("[SENDER] Error subscribing user:", error.message);
    throw error;
  }
}

module.exports = {
  subscribe
};

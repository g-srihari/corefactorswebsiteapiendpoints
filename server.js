const axios = require("axios");

const TELEDUCE_SECRET = process.env.TELEDUCE_SECRET;
const TELEDUCE_URL = `https://teleduce.corefactors.in/lead/apiwebhook/${TELEDUCE_SECRET}/websiteCorefactors/`;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const SITE_TOKEN = process.env.SITE_TOKEN;

// List of allowed origins
const allowedOrigins = [
  "https://www.corefactors.ai",
  "https://corefactors-website.webflow.io"
];

exports.handler = async (event) => {
  const origin = event.headers.origin;

  const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type, X-SITE-TOKEN",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    // Site token check
    if (event.headers["x-site-token"] !== SITE_TOKEN) {
      return { statusCode: 403, headers: corsHeaders, body: "Forbidden" };
    }

    const body = JSON.parse(event.body);

    // Honeypot check
    if (body.middle_name && body.middle_name.trim() !== "") {
      return { statusCode: 400, headers: corsHeaders, body: "Spam" };
    }

    // CAPTCHA check
    if (!body.captchaToken) {
      return { statusCode: 400, headers: corsHeaders, body: "Missing captcha" };
    }

    const captcha = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      { params: { secret: RECAPTCHA_SECRET, response: body.captchaToken } }
    );

    if (!captcha.data.success || (captcha.data.score && captcha.data.score < 0.5)) {
      return { statusCode: 400, headers: corsHeaders, body: "Captcha failed" };
    }

    // Prepare payload for Teleduce
    const payload = {
      fullName: body.fullName,
      mobileNo: body.mobileNo,
      email: body.email,
      companyName: body.companyName,
      noEmployees: body.noEmployees,
      jobTitle: body.jobTitle,
      primarySource: body.primarySource || "Website",
      secondarySource: body.secondarySource || "Website",
      webPage: body.webPage,
      campaignName: body.campaignName || "",
      additi1: body.additi1 || "",
      additi2: body.additi2 || "",
      utm_id: body.utm_id || ""
    };

    await axios.post(TELEDUCE_URL, payload);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Server error"
    };
  }
};

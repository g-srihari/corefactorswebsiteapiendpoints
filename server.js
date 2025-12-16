const axios = require("axios");

const TELEDUCE_URL = process.env.TELEDUCE_URL;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const SITE_TOKEN = process.env.SITE_TOKEN;

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.yoursite.com",
    "Access-Control-Allow-Headers": "Content-Type, X-SITE-TOKEN",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    // ✅ Site token check
    if (event.headers["x-site-token"] !== SITE_TOKEN) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: "Forbidden"
      };
    }

    const body = JSON.parse(event.body);

    // Honeypot
    if (body.middle_name) {
      return { statusCode: 400, headers: corsHeaders, body: "Spam" };
    }

    // Time check
    if (Date.now() - body.formLoadedAt < 3000) {
      return { statusCode: 400, headers: corsHeaders, body: "Too fast" };
    }

    // CAPTCHA
    if (!body.captchaToken) {
      return { statusCode: 400, headers: corsHeaders, body: "Missing captcha" };
    }

    const captcha = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      { params: { secret: RECAPTCHA_SECRET, response: body.captchaToken } }
    );

    if (!captcha.data.success || captcha.data.score < 0.5) {
      return { statusCode: 400, headers: corsHeaders, body: "Captcha failed" };
    }

    // Teleduce payload
    const payload = {
      fullName: body.fullName,
      mobileNo: body.mobileNo,
      email: body.email,
      companyName: body.companyName,
      noEmployees: body.noEmployees,
      jobTitle: body.jobTitle,
      primarySource: body.primarySource,
      secondarySource: body.secondarySource,
      webPage: body.webPage,
      campaignName: body.campaignName,
      additi1: body.additi1,
      additi2: body.additi2,
      utm_id: body.utm_id
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

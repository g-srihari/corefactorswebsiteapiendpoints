const axios = require("axios");

// Replace with your real Teleduce API URL
const TELEDUCE_URL = "https://teleduce.corefactors.in/lead/apiwebhook/2c04e244-b0d7-43e5-b9b9-cadbe9f05828/websiteCorefactors/";

// Replace with your Google reCAPTCHA secret key
const RECAPTCHA_SECRET = "6LcL7QksAAAAAK17EuFDzLkGuvX8PRg1IWsLwULu";

exports.handler = async (event) => {
  try {
    // Parse incoming request
    const body = JSON.parse(event.body);

    // Honeypot Check
  
    if (body.middle_name && body.middle_name.trim() !== "") {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Honeypot filled" }),
      };
    }
    if (body.formLoadedAt && Date.now() - body.formLoadedAt < 3000) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Submission too fast" }),
      };
    }
    if (!body.captchaToken) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing CAPTCHA token" }),
      };
    }

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${body.captchaToken}`
    );

    if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "CAPTCHA verification failed" }),
      };
    }
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
      utm_id: body.utm_id || "",
    };

    const teleduceRes = await axios.post(TELEDUCE_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, teleduce: teleduceRes.data }),
    };
  } catch (error) {
    console.error("Error in Lambda:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

const axios = require("axios");

async function verifyCaptcha(token) {
  const res = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    { params: { secret: process.env.RECAPTCHA_SECRET, response: token } }
  );
  return res.data.success && (!res.data.score || res.data.score >= 0.5);
}

module.exports = verifyCaptcha;

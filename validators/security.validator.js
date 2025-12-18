/**
 * Security validation (token, honeypot, captcha)
 */

const verifyCaptcha = require('../utils/captcha');
const { checkHoneypot } = require('../utils/honeypot');

const SITE_TOKEN = process.env.SITE_TOKEN;

/**
 * Validate site token
 * @param {Object} headers - Request headers
 * @returns {Object|null} Error response or null if valid
 */
function validateSiteToken(headers) {
  const siteToken = headers["x-site-token"] || headers["X-SITE-TOKEN"];
  
  if (!siteToken || siteToken !== SITE_TOKEN) {
    return { statusCode: 403, body: { error: "Forbidden: Invalid site token" } };
  }

  return null;
}

/**
 * Validate honeypot fields
 * @param {Object} body - Request body
 * @returns {Object|null} Error response or null if valid
 */
function validateHoneypot(body) {
  if (checkHoneypot(body)) {
    console.log("[SECURITY] Honeypot check failed - spam detected");
    return { statusCode: 400, body: { error: "Spam detected" } };
  }

  console.log("[SECURITY] Honeypot check passed");
  return null;
}

/**
 * Validate reCAPTCHA token
 * @param {string} token - reCAPTCHA token
 * @param {boolean} skipCaptcha - Skip validation (local dev)
 * @returns {Promise<Object|null>} Error response or null if valid
 */
async function validateCaptcha(token, skipCaptcha = false) {
  if (skipCaptcha) {
    return null;
  }

  if (!captchaToken) {
    return { statusCode: 400, body: { error: "Missing captcha" } };
  }

  const isValid = await verifyCaptcha(captchaToken);
  if (!isValid) {
    return { statusCode: 400, body: { error: "Invalid captcha" } };
  }

  return null;
}

/**
 * Run all security validations
 * @param {Object} body - Request body
 * @param {Object} headers - Request headers
 * @param {boolean} skipCaptcha - Skip CAPTCHA validation
 * @returns {Promise<Object|null>} Error response or null if all valid
 */
async function validateSecurity(body, headers, skipCaptcha = false) {
  // 1. Site token
  const tokenError = validateSiteToken(headers);
  if (tokenError) return tokenError;

  // 2. Honeypot
  const honeypotError = validateHoneypot(body);
  if (honeypotError) return honeypotError;

  // 3. CAPTCHA
  const captchaError = await validateCaptcha(body["g-recaptcha-response"], skipCaptcha);
  if (captchaError) return captchaError;

  return null;
}

module.exports = {
  validateSecurity,
  validateSiteToken,
  validateHoneypot,
  validateCaptcha
};

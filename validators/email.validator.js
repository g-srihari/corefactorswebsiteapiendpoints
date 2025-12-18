/**
 * Email domain validation
 */

const PERSONAL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'live.com', 'protonmail.com',
  'zoho.com', 'ymail.com', 'mail.com', 'gmx.com', 'msn.com'
];

const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwaway.email', 'temp-mail.org',
  'sharklasers.com', 'getnada.com', 'maildrop.cc',
  'trashmail.com', 'mohmal.com', 'fakeinbox.com'
];

/**
 * Validate email domain
 * @param {string} email - Email address to validate
 * @returns {Object|null} Error response or null if valid
 */
function validateEmailDomain(email) {
  if (!email) return null; // Skip if no email

  const emailLower = email.toLowerCase();
  const domain = emailLower.split('@')[1];

  if (!domain) {
    return { statusCode: 400, body: { error: "Invalid email format" } };
  }

  // Check disposable domains
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return {
      statusCode: 400,
      body: { error: "Disposable email addresses are not allowed" }
    };
  }

  // Check personal domains
  if (PERSONAL_DOMAINS.includes(domain)) {
    return {
      statusCode: 400,
      body: { error: "Please use your business email" }
    };
  }
  return null;
}

module.exports = {
  validateEmailDomain,
  PERSONAL_DOMAINS,
  DISPOSABLE_DOMAINS
};

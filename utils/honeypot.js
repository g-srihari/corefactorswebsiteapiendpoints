/**
 * Enhanced honeypot spam detection
 * Uses realistic field names that won't conflict with actual form data
 */
function checkHoneypot(body) {
  // Realistic honeypot field names (hidden from users, but look legitimate to bots)
  const honeypotFields = [
    'phone_verify',           // Looks like phone verification
    'user_confirmation',      // Looks like confirmation checkbox
    'additional_notes',       // Looks like optional notes field
    'referral_code',          // Looks like promo/referral code
    'subscribe_updates',      // Looks like newsletter checkbox
    'contact_preference'      // Looks like preference selection
  ];

  // Check if any honeypot field is filled
  for (const field of honeypotFields) {
    if (body[field] && body[field].trim() !== '') {
      return true;
    }
  }

  return false;
}

/**
 * Check if form was submitted too quickly (timing attack)
 * @param {number} formLoadedAt - Timestamp when form loaded
 * @param {number} minTimeMs - Minimum time required (default 3 seconds)
 * @returns {boolean} true if submitted too fast
 */
function checkTimingAttack(formLoadedAt, minTimeMs = 3000) {
  if (!formLoadedAt) {
    return false; // Don't block if timestamp missing (for backward compatibility)
  }

  const now = Date.now();
  const timeTaken = now - formLoadedAt;

  if (timeTaken < minTimeMs) {
    return true;
  }

  return false;
}

module.exports = checkHoneypot;
module.exports.checkHoneypot = checkHoneypot;
module.exports.checkTimingAttack = checkTimingAttack;

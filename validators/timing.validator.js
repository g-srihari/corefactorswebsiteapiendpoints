/**
 * Form timing validation
 */

const MIN_SUBMIT_TIME = 3000;      // 3 seconds
const MAX_SUBMIT_TIME = 3600000;   // 1 hour

/**
 * Validate form submission timing
 * @param {number|string} formLoadedAt - Timestamp when form loaded
 * @returns {Object|null} Error response or null if valid
 */
function validateFormTiming(formLoadedAt) {
  if (!formLoadedAt) {
    return null;
  }

  const submittedAt = Date.now();
  const loadedAt = parseInt(formLoadedAt);

  if (isNaN(loadedAt)) {
    return { statusCode: 400, body: { error: "Invalid form data" } };
  }

  const timeDiff = submittedAt - loadedAt;

  // Too fast (less than 3 seconds)
  if (timeDiff < MIN_SUBMIT_TIME) {
    return { 
      statusCode: 400, 
      body: { error: "Form submitted too quickly" } 
    };
  }

  // Too slow (more than 1 hour)
  if (timeDiff > MAX_SUBMIT_TIME) {
    return { 
      statusCode: 400, 
      body: { error: "Form session expired. Please reload the page." } 
    };
  }

  return null;
}

module.exports = {
  validateFormTiming,
  MIN_SUBMIT_TIME,
  MAX_SUBMIT_TIME
};

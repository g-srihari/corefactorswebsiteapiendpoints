const forms = require('../forms');
const teleduceService = require('../services/teleduce.service');
const calendlyService = require('../services/calendly.service');
const { validateSecurity } = require('../validators/security.validator');
const { validateEmailDomain } = require('../validators/email.validator');
const { validateFormTiming } = require('../validators/timing.validator');

// Import form-specific actions
const formActions = require('../actions/email.action');

const CALENDLY_FORMS = ['scheduleademo', 'banktechxevent', 'bookademonow'];

/**
 * Fetch Calendly data for specific form types
 */
async function enrichWithCalendlyData(formType, body) {
  if (!CALENDLY_FORMS.includes(formType)) {
    return body;
  }

  try {
    const calendlyData = await calendlyService.getCalendlyEventData();
    const leadData = calendlyService.extractLeadData(
      calendlyData,
      body.selectedSolutions || []
    );
    return { ...body, ...leadData };
  } catch (calendlyError) {
    console.error('[CALENDLY] Error:', calendlyError.message);
    return body;
  }
}

/**
 * Process form submission with payload mapping and hooks
 */
async function processFormSubmission(formConfig, processedBody, formType) {
  const payload = formConfig.mapPayload(processedBody);

  const teleduceResponse = await teleduceService.sendLead(formType, payload);

  // Execute after-submit action if available for this form type
  if (formActions[formType] && typeof formActions[formType] === 'function') {
    await formActions[formType](processedBody, teleduceResponse);
  }

  return {
    statusCode: 200,
    body: { 
      success: true,
      message: "Form submitted successfully"
    }
  };
}

/**
 * Handle form submission requests
 * @param {Object} body - Request body
 * @param {Object} headers - Request headers
 * @param {Object} options - Handler options (e.g., skipCaptcha for local dev)
 * @returns {Promise<Object>} Response object with status and data
 */
async function handleFormSubmission(body, headers, options = {}) {
  const { skipCaptcha = false } = options;

  // 1. Security validation (token, honeypot, captcha)
  const securityError = await validateSecurity(body, headers, skipCaptcha);
  if (securityError) return securityError;

  // 2. Email domain validation
  const emailError = validateEmailDomain(body.email);
  if (emailError) return emailError;

  // 3. Form timing validation
  const timingError = validateFormTiming(body.formLoadedAt);
  if (timingError) return timingError;

  // 4. Form type validation
  const formType = body.formType || "demo";
  const formConfig = forms[formType];
  
  if (!formConfig) {
    return { statusCode: 400, body: { error: "Invalid form type" } };
  }

  // 5. Enrich with Calendly data if needed
  const processedBody = await enrichWithCalendlyData(formType, body);

  // 6. Process and submit
  try {
    const result = await processFormSubmission(formConfig, processedBody, formType);
    return result;
  } catch (error) {
    console.error('[FORM] Submission error:', error.message);
    return {
      statusCode: 500,
      body: {
        error: "Submission failed",
        details: error.message
      }
    };
  }
}

module.exports = {
  handleFormSubmission
};

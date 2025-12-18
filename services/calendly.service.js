const axios = require('axios');

const CALENDLY_API_URL = 'https://api.calendly.com/sample_webhook_data?event=invitee.created&organization=https%3A%2F%2Fapi.calendly.com%2Forganizations%2Fe92bafb4-07b2-49c3-b4f5-2166011cd8f0&scope=organization';
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN;

/**
 * Fetch Calendly webhook sample data
 * This simulates getting invitee data from Calendly
 * @returns {Promise<Object>} Calendly webhook data
 */
async function getCalendlyEventData() {
  try {
    const response = await axios.get(CALENDLY_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CALENDLY_TOKEN}`
      }
    });

    console.log('[CALENDLY SERVICE] Successfully fetched event data');
    return response.data;
  } catch (error) {
    console.error('[CALENDLY SERVICE] Failed to fetch event data:', error.message);
    throw new Error(`Calendly API error: ${error.message}`);
  }
}

/**
 * Extract lead data from Calendly webhook payload
 * @param {Object} calendlyData - Raw Calendly webhook data
 * @param {Array} selectedSolutions - Array of selected solution texts
 * @returns {Object} Formatted lead data
 */
function extractLeadData(calendlyData, selectedSolutions = []) {
  const payload = calendlyData.payload || {};
  const scheduledEvent = payload.scheduled_event || {};
  const eventMemberships = scheduledEvent.event_memberships || [];
  const questionsAndAnswers = payload.questions_and_answers || [];

  // Extract host name
  const host = eventMemberships[0]?.user_name || '';
  const firstName_host = host ? host.split(' ')[0].trim().toLowerCase() + '_cfs' : '';

  // Extract answers from questions
  const mobile = questionsAndAnswers[0]?.answer || '';
  const company = questionsAndAnswers[1]?.answer || '';
  const designation = questionsAndAnswers[2]?.answer || '';
  const companySize = questionsAndAnswers[3]?.answer || '';
  const description = questionsAndAnswers[4]?.answer || '';

  // Remove spaces from phone number
  const cleanPhoneNumber = mobile.replace(/\s+/g, '');

  // Convert UTC to IST
  const eventDate = new Date(scheduledEvent.start_time);
  const optionsDate = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const istDate = eventDate.toLocaleDateString('en-IN', optionsDate);
  const istTime = eventDate.toLocaleTimeString('en-IN', optionsTime);

  return {
    name: payload.name || '',
    email: payload.email || '',
    mobile: cleanPhoneNumber,
    company,
    designation,
    companySize,
    description,
    istDate,
    istTime,
    meetingLink: scheduledEvent.location?.join_url || '',
    hostName: firstName_host,
    selectedSolutions: Array.isArray(selectedSolutions) ? selectedSolutions.join(', ') : selectedSolutions
  };
}

module.exports = {
  getCalendlyEventData,
  extractLeadData
};

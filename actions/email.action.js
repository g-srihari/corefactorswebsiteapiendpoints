const emailService = require('../services/email.service');

/**
 * Send meeting confirmation emails to client and sales team
 * Used by: scheduleademo, banktechxevent, bookademonow
 */
async function sendMeetingEmail(body, teleduceResponse, defaultTopic = 'Meeting Request') {
  try {
    // Send email to both sales team and client
    await emailService.sendMeetingNotification({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      description: body.description,
      company: body.company,
      designation: body.designation,
      companySize: body.companySize,
      istDate: body.istDate,
      istTime: body.istTime,
      meetingLink: body.meetingLink,
      selectedSolutions: body.selectedSolutions || defaultTopic,
      pageName: defaultTopic
    });
  } catch (error) {
    console.error('[ACTION] Email error:', error.message);
    // Silent fail - don't throw error to prevent form submission failure
  }
}

module.exports = {
  scheduleademo: (body, resp) => sendMeetingEmail(body, resp, 'Schedule a Demo'),
  banktechxevent: (body, resp) => sendMeetingEmail(body, resp, 'BankTechX Event'),
  bookademonow: (body, resp) => sendMeetingEmail(body, resp, 'Book a Demo Now')
};

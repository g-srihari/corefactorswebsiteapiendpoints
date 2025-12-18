const axios = require('axios');

const EMAIL_API_URL = 'https://tw1.teleduce.corefactors.in/send-email-json-otom/2c04e244-b0d7-43e5-b9b9-cadbe9f05828/1016/';

/**
 * Send email notification
 * @param {Object} emailData - Email configuration
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.htmlContent - HTML content of email
 * @param {string} emailData.fromMail - Sender email
 * @param {string} emailData.fromName - Sender name
 * @param {string} emailData.replyTo - Reply-to email
 * @param {Array} emailData.toRecipients - Array of recipient objects [{email_id: 'email@example.com'}]
 * @returns {Promise<Object>} Response from email API
 */
async function sendEmail(emailData) {
  const {
    subject,
    htmlContent,
    fromMail = 'sales@corefactors.in',
    fromName = 'Corefactors Sales Team',
    replyTo = 'support@corefactors.in',
    toRecipients = []
  } = emailData;

  const payload = {
    mail_datas: {
      message: {
        html_content: htmlContent,
        subject: subject,
        from_mail: fromMail,
        from_name: fromName,
        reply_to: replyTo,
        to_recipients: toRecipients,
      },
    },
  };

  try {
    const response = await axios.post(EMAIL_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send email:', error.message);
    throw error;
  }
}

/**
 * Send meeting notification to both sales team and client
 * @param {Object} leadData - Lead information from form
 */
async function sendMeetingNotification(leadData) {
  const {
    name,
    email,
    mobile,
    description,
    company,
    designation,
    companySize,
    istDate,
    istTime,
    meetingLink,
    selectedSolutions,
    pageName = 'Schedule a Demo'
  } = leadData;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f3f4f6;
            padding: 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          }
          .header {
            background-color: #13026A;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 3px solid #52b259;
          }
          .logo-section {
            margin-bottom: 20px;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .header p {
            color: rgba(255, 255, 255, 0.85);
            font-size: 15px;
            margin-top: 8px;
          }
          .content {
            padding: 45px 40px;
          }
          .greeting {
            font-size: 18px;
            color: #1a202c;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .intro {
            color: #4a5568;
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 35px;
          }
          .section-title {
            color: #13026A;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meeting-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 30px;
            margin: 30px 0;
          }
          .detail-row {
            display: flex;
            padding: 14px 0;
            border-bottom: 1px solid #e5e7eb;
            align-items: center;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 140px;
            font-size: 14px;
          }
          .detail-value {
            color: #1f2937;
            font-weight: 500;
            font-size: 15px;
          }
          .cta-section {
            text-align: center;
            margin: 35px 0;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 40px;
            background-color: #13026A;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 15px;
            transition: background-color 0.2s;
            border: none;
          }
          .cta-button:hover {
            background-color: #0e0550;
          }
          .info-box {
            background-color: #eff6ff;
            border-left: 3px solid #47A8fc;
            padding: 18px 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .info-box-title {
            font-weight: 600;
            color: #1e3a8a;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .info-box-text {
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
          }
          .signature {
            margin-top: 40px;
            padding-top: 25px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .signature-name {
            color: #13026A;
            font-weight: 600;
            font-size: 15px;
            margin-top: 5px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-content {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.8;
          }
          .footer-link {
            color: #13026A;
            text-decoration: none;
            font-weight: 500;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .meeting-card {
              padding: 20px;
            }
            .detail-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
            }
            .detail-label {
              min-width: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <h1>Meeting Confirmed</h1>
              <p>Your appointment has been successfully scheduled</p>
            </div>
            
            <div class="content">
              <div class="greeting">Dear ${name},</div>
              <div class="intro">
                Thank you for scheduling a meeting with Corefactors. We look forward to discussing how our solutions can help drive your business forward.
              </div>
              
              <div class="section-title">Meeting Details</div>
              <div class="meeting-card">
                <div class="detail-row">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">${istDate}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Time</div>
                  <div class="detail-value">${istTime}</div>
                </div>
                
                ${selectedSolutions ? `
                <div class="detail-row">
                  <div class="detail-label">Topic</div>
                  <div class="detail-value">${selectedSolutions}</div>
                </div>
                ` : ''}
                
                <div class="detail-row">
                  <div class="detail-label">Company</div>
                  <div class="detail-value">${company || 'Not specified'}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Designation</div>
                  <div class="detail-value">${designation || 'Not specified'}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Contact</div>
                  <div class="detail-value">${mobile || 'Not specified'}</div>
                </div>
              </div>
              
              <div class="cta-section">
                <a href="${meetingLink}" class="cta-button">Join Meeting</a>
              </div>
              
              <div class="info-box">
                <div class="info-box-title">Preparation Reminder</div>
                <div class="info-box-text">
                  Please join 2-3 minutes early to ensure your audio and video are working properly. A stable internet connection and quiet environment are recommended for the best experience.
                </div>
              </div>
              
              <div class="signature">
                Best regards,
                <div class="signature-name">Corefactors Sales Team</div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-content">
                Need assistance? Contact us at <a href="mailto:sales@corefactors.in" class="footer-link">sales@corefactors.in</a>
                <div style="margin-top: 12px; font-size: 12px; color: #9ca3af;">
                  © ${new Date().getFullYear()} Corefactors. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    subject: `Meeting Confirmation - ${name}`,
    htmlContent,
    toRecipients: [
      { email_id: email }, // Client
      { email_id: 'sheetal.s@corefactors.in' }, // Sales team
      { email_id: 'akshay.w@corefactors.in' }, // Sales team
    ],
  });
}

module.exports = {
  sendEmail,
  sendMeetingNotification,
};

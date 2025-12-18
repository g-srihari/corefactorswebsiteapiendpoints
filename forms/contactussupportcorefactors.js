module.exports = {
  mapPayload: (body = {}) => ({
    mobileNo: body.mobile || body.mobileNo || "",
    email: body.email || "",
    fullName: body.name || body.fullName || "",
    companyName: body.company || body.companyName || "",
    subject: body.subject || "",
    description: body.description || body.message || "",
    primarySource: body.primarySource || body.utm_medium || "Website",
    secondarySource: body.secondarySource || body.utm_source || "Website",
    additi1: body.utm_term || "",
    additi2: body.utm_content || "",
    campaignName: body.campaignName || "",
    webPage: body.webPage || ""
  })
};

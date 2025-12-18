module.exports = {
  mapPayload: (body = {}) => ({
    fullName: body.fullName || body.name || "",
    mobileNo: body.mobile || body.mobileNo || "",
    email: body.email || "",
    jobTitle: body.jobTitle || body.designation || "",
    companyName: body.companyName || body.company || "",
    noEmployees: body.noEmployees || body.employees || "",
    primarySource: body.primarySource || body.utm_medium || "",
    secondarySource: body.secondarySource || body.utm_source || "",
    webPage: body.webPage || "",
    campaignName: body.campaignName || body.utm_campaign || "",
    additi1: body.additi1 || body.utm_term || "",
    additi2: body.additi2 || body.utm_content || "",
    description: body.description || body.message || "",
    utm_id: body.utm_id || "",
    websiteOrigin: body.websiteOrigin || ""
  })
};

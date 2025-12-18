module.exports = {
  mapPayload: (body = {}) => ({
    mobileNo: body.mobile || body.mobileNo || "",
    email: body.email || "",
    fullName: body.name || body.fullName || "",
    companyName: body.company || body.companyName || "",
    noEmployees: body.noEmployees || body.noEmployees || "",
    jobTitle: body.designation || body.jobTitle || "",
    description: body.description || body.message || "",

    primarySource: body.primarySource || body.utm_medium || "Website",
    secondarySource: body.secondarySource || body.utm_source || "Website",
    additi1: body.utm_term || body.additi1 || "",
    additi2: body.utm_content || body.additi2 || "",
    campaignName: body.campaignName || body.campaign || "",
    utm_id: body.utm_id || "",
    webPage: body.webPage || body.webPageUrl || ""
  })
};

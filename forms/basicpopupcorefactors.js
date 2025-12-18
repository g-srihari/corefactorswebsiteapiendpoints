module.exports = {
  mapPayload: (body = {}) => ({
    // Keep keys expected by Teleduce; use sensible fallbacks from incoming popup payload
    email: body.email || "",
    mobile: body.mobile || body.mobileNo || body.mobileNo || "",
    primary_source: body.primary_source || body.primarySource || "",
    secondary_source: body.secondary_source || body.secondarySource || body.secondarySource || "",
    campaign: body.campaign || body.campaignName || "",
    term: body.term || body.utm_term || "",
    content: body.content || body.utm_content || "",
    utm_id: body.utm_id || "",
    webPage: body.webPage || ""
  })
};

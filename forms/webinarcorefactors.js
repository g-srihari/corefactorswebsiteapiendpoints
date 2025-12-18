module.exports = {
  mapPayload: (body = {}) => ({
    fullName: body.fullName || body.name || "",
    email: body.email || "",
    Webinar: body.Webinar || body.webinar || "Online Webinar",
    second_src: body.second_src || body.secondarySource || "Website",
    campaign_name: body.campaign_name || body.campaignName || "",
    utm_term: body.utm_term || body.additi1 || "",
    webPage: body.webPage || ""
  })
};

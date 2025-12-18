module.exports = {
  mapPayload: (body) => {
    // Expecting the incoming body from Webflow local/frontend:
    // { name, mobile, email, company, primarySource, secondarySource, campaignName, utm_term, utm_content }
    return {
      name: body.name || "",
      mobile: body.mobile || "",
      email: body.email || "",
      company: body.company || "",
      primarySource: body.primarySource || "Website",
      secondarySource: body.secondarySource || "",
      campaignName: body.campaignName || "",
      utm_term: body.utm_term || "",
      utm_content: body.utm_content || ""
    };
  }
};

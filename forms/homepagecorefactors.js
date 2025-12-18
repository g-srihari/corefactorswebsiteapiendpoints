module.exports = {
  mapPayload: (body = {}) => {
    return {
      mobileNo: body.mobile || body.mobileNo || "",
      email: body.email || "",
      fullName: body.name || body.fullName || "",
      companyName: body.company || body.companyName || "",
      noEmployees: body.noEmployees || body.noEmployees || "",
      primarySource: body.primarySource || body.utm_medium || "",
      secondarySource: body.secondarySource || body.utm_source || "",
      webPage: body.webPage || body.webPageUrl || "",
      additi1: body.utm_term || body.additi1 || "",
      additi2: body.utm_content || body.additi2 || "",
      campaignName: body.campaignName || body.campaign || body.homepageform || ""
    };
  }
};
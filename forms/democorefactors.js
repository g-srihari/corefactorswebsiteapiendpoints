module.exports = {
  mapPayload: (body) => ({
    fullName: body.fullName,
    mobileNo: body.mobileNo,
    email: body.email,
    companyName: body.companyName,
    noEmployees: body.noEmployees,
    jobTitle: body.jobTitle,
    primarySource: body.primarySource || "Website",
    secondarySource: body.secondarySource || "Website",
    webPage: body.webPage,
    campaignName: body.campaignName || "",
    additi1: body.additi1 || "",
    additi2: body.additi2 || "",
    utm_id: body.utm_id || ""
  })
};

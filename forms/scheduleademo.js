function mapPayload(body = {}) {
  return {
    name: body.name,
    email: body.email,
    mobile: body.mobile,
    company: body.company,
    designation: body.designation,
    companySize: body.companySize,
    description: body.description,

    primarySource: body.utm_medium || "Website",
    secondarySource: body.utm_source || "Website",
    campaignName: body.utm_campaign || "",
    webPage: body.webPage,

    istDate: body.istDate,
    istTime: body.istTime,
    meetingLink: body.meetingLink,
    hostName: body.hostName,
    additi2: body.selectedSolutions,

    leadStages: "Demo Schedule"
  };
}

module.exports = {
  mapPayload
};

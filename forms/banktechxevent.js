function mapPayload(body = {}) {
  return {
    name: body.name,
    email: body.email,
    mobile: body.mobile,
    company: body.company,
    designation: body.designation,
    companySize: body.companySize,
    description: body.description,

    primarySource: "Events",  // Always "Events" for BankTechX
    secondarySource: "BankTechX",  // Always "BankTechX"
    campaignName: body.utm_campaign || "",
    webPage: body.webPage,

    istDate: body.istDate,
    istTime: body.istTime,
    meetingLink: body.meetingLink,

    additi1: "",
    additi2: "",

    leadStages: "Demo Schedule"
  };
}

module.exports = {
  mapPayload
};

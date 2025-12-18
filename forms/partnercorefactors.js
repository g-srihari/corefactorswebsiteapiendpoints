module.exports = {
  mapPayload: (body) => ({
    name: body.name,
    mobile: body.mobile,
    email: body.email,
    designation: body.designation,
    company: body.company,
    noEmployees: body.noEmployees,

    primarySource: "Channel Partner",
    secondarySource: body.secondarySource || "Website",
    campaignName: body.campaignName || "Organic",
    utm_term: body.utm_term || ""
  })
};

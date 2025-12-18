const axios = require("axios");

// Path segments for different form types when using the TELEDUCE_SECRET pattern
const PATH_MAP = {
  demo: "websiteCorefactors/",
  ebook: "ebook/",
  partner: "partner/",
  sell: "SellWithCorefactors/",
  homepage: "websiteCorefactors/",
  contactus: "websiteCorefactors/",
  basicpopup: "BasicPopUp/",
  popupform: "websiteCorefactors/",
  webinar: "Webinar/",
  scheduleademo: "CalendlyWebhook/",
  banktechxevent: "BankTechXEventAPI/",
  bookademonow: "CalendlyWebhook/"
};


module.exports.sendLead = async function (formType, payload, opts = {}) {
  // 1) allow explicit override via opts.url
  let url = opts.url || process.env[`TELEDUCE_${formType.toUpperCase()}_URL`];

  // 2) support-specific endpoint uses a different base and secret
  if (!url) {
    if (formType === "support") {
      const supportSecret = process.env.TELEDUCE_CONTACTUS_SECRET;
      if (!supportSecret) throw new Error("Missing TELEDUCE_CONTACTUS_SECRET for support form");
      url = `https://teleduce.corefactors.in/support-box/apiwebhook/${supportSecret}/website_support_ticket/`;
    } else {
      // 3) construct using TELEDUCE_SECRET + PATH_MAP
      const secret = process.env.TELEDUCE_SECRET;
      if (!secret) throw new Error("Missing TELEDUCE_SECRET for Teleduce endpoints");
      const base = `https://teleduce.corefactors.in/lead/apiwebhook/${secret}/`;
      const path = PATH_MAP[formType] || "websiteCorefactors/";
      url = base + path;
    }
  }

  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const apiKey = opts.apiKey || process.env.TELEDUCE_APIKEY || process.env.TELEDUCE_BASICPOPUP_APIKEY;
  if (apiKey && !headers["API-KEY"] && !headers["Api-Key"]) headers["API-KEY"] = apiKey;

  // ensure additi3 is a JSON string when posting to Teleduce
  const toSend = Object.assign({}, payload);
  if (toSend.additi3 && typeof toSend.additi3 === 'object') {
    try {
      toSend.additi3 = JSON.stringify(toSend.additi3);
    } catch (e) {
      // fallback to original value if stringify fails
      toSend.additi3 = String(toSend.additi3);
    }
  }

  // Always send to Teleduce (use ENABLE_TELEDUCE flag in local.js for local dev control)
  return axios.post(url, toSend, { headers, timeout: 10000 });
};

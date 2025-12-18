const democorefactors = require("./democorefactors");
const ebookcorefactors = require("./ebookcorefactors");
const partnercorefactors = require("./partnercorefactors");
const sellcorefactors = require("./sellcorefactors");
const homepagecorefactors = require("./homepagecorefactors");
const contactussalescorefactors = require("./contactussalescorefactors");
const contactussupportcorefactors = require("./contactussupportcorefactors");
const basicpopupcorefactors = require("./basicpopupcorefactors");
const webinarcorefactors = require("./webinarcorefactors");
const popupformcorefactors = require("./popupformcorefactors");
const scheduleademo = require("./scheduleademo");
const banktechxevent = require("./banktechxevent");
const bookademonow = require("./bookademonow");

module.exports = {
  demo: democorefactors,
  ebook: ebookcorefactors,
  partner: partnercorefactors,
  sell: sellcorefactors,
  homepage: homepagecorefactors,
  contactus: contactussalescorefactors,
  support: contactussupportcorefactors,
  basicpopup: basicpopupcorefactors,
  webinar: webinarcorefactors,
  popupform: popupformcorefactors,
  scheduleademo: scheduleademo,
  banktechxevent: banktechxevent,
  bookademonow: bookademonow
};
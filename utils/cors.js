const allowedOrigins = [
  "https://www.corefactors.ai",
  "https://corefactors-website.webflow.io"
];

function getCorsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, X-SITE-TOKEN",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "*"; // fallback
  }
  return headers;
}

module.exports = getCorsHeaders;

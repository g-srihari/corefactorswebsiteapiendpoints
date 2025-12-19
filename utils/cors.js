const allowedOrigins = [
  "https://www.corefactors.ai",
  "https://corefactors-website.webflow.io"
];

function getCorsHeaders(origin) {
  console.log('[CORS] Request origin:', origin);
  console.log('[CORS] Allowed origins:', allowedOrigins);
  
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, X-SITE-TOKEN",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400" // Cache preflight for 24 hours
  };
  
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    console.log('[CORS] Origin allowed:', origin);
  } else {
    headers["Access-Control-Allow-Origin"] = "*"; // fallback
    console.log('[CORS] Using wildcard origin for:', origin);
  }
  
  return headers;
}

module.exports = getCorsHeaders;

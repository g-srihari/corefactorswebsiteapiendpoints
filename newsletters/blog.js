/**
 * Blog Newsletter Subscription Configuration
 */
function mapPayload(body = {}) {
  return {
    email: body.email,
    name: body.name || "",
    source: "Newsletter Blogs API",
    tags: ["dGKEw8", "g-gyyg6B"]
  };
}

module.exports = {
  mapPayload
};

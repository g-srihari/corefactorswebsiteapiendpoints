module.exports = {
  mapPayload: (body) => ({
    fullName: body.name,
    email: body.email,
    pri_source: 'Ebook',
    second_src: body.second_src || 'Website_Ebook',
    campaign_name: body.campaign_name || 'AI in Sales and Marketing',
    utm_term: body.utm_term || ''
  })
};

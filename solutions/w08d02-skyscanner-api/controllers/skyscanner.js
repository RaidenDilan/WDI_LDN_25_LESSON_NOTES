const request = require('request-promise');

function flights(req, res) {
  const baseUrl = 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/UK/GBP/en-GB/LON/';

  request({
    method: 'GET',
    url: `${baseUrl}${req.query.destination}/2019-03-22`,
    qs: {
      apiKey: process.env.SKYSCANNER_API_KEY
    },
    json: true
  })
  .then((response) => res.status(200).json(response))
  .catch((err) => res.status(500).json(err));
}

module.exports = {
  flights
};

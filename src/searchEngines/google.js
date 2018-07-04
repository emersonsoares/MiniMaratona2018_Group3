const axios = require('axios')

const google = ({ apiKey, engineId }) => offer => {
  const options = {
    url: 'https://www.googleapis.com/customsearch/v1',
    params: {
      key: apiKey,
      cx: engineId,
      q: offer.description
    }
  }

  return axios(options).then(response => response.data)
}

module.exports = google
const axios = require('axios')

const apiKey = 'AIzaSyCtzhDvhB27_vR9qDEK3OHxCDS_8_ajz-U'
const engineId = '012289445205605909699:cgmi_tl1d6u'

const search = offer => {
  const options = {
    url: 'https://www.googleapis.com/customsearch/v1',
    params: {
      key: apiKey,
      cx: engineId,
      q: offer.description
    }
  }

  return axios(options)
    .then(response => response.data)
}

module.exports = search
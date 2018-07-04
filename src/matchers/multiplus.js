const axios = require('axios')
const cheerio = require('cheerio')
const numeral = require('numeral')

const { google } = require('../searchEngines')

const gOpts = {
  apiKey: 'AIzaSyCtzhDvhB27_vR9qDEK3OHxCDS_8_ajz-U',
  engineId: '012289445205605909699:9b-6izqeude'
}

const vendors = {
  pontoFrio: "pontofrio",
  casasBahia: "casasbahia"
}

const empty = { program: 'multiplus' }

const match = offer => Promise.resolve({
  match: { program: 'multiplus', vendor: offer.vendor },
  offer
})

const identifyUrl = ({ offer, match }) => {
  const selectProductLink = response => response.items.filter(({ link }) =>
    link.includes(`troque/${vendors[match.vendor]}/`)
  )[0].link || null

  return google(gOpts)(offer)
    .then(selectProductLink)
    .then(link => ({ match: { ...match, link }, offer }))
}

const requestContents = ({ offer, match }) =>
  axios({
    url: match.link
  })
    .then(response => response.data)
    .then(cheerio.load)
    .then($ => ({
      ...match,
      name: $('h1.nome-produto-nome').text().trim(),
      pointsPrice: numeral($('div.resgate-pd-options-wrapper li.selected div.price-desktop p.product-price strong').text().replace('.', ',')).value(),
      pointsPriceFrom: numeral($('div.resgate-pd-options-wrapper li.selected div.price-desktop p.product-price-from del').text().replace('.', ',')).value(),
      link: match.link
    }))
    .then(match => Promise.resolve({ offer, match }))


const matched = ({ match }) => match

const multiplus = offer =>
  match(offer)
    .then(identifyUrl)
    .then(requestContents)
    .then(matched)
    .catch(err => {
      return empty
    })

module.exports = multiplus
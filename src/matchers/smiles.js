const axios = require('axios')
const cheerio = require('cheerio')
const numeral = require('numeral')
const { google } = require('../searchEngines')
const { URL } = require('url')

const gOpts = {
  apiKey: 'AIzaSyCtzhDvhB27_vR9qDEK3OHxCDS_8_ajz-U',
  engineId: '012289445205605909699:cgmi_tl1d6u'
}

const vendors = {
  extra: '3',
  casasBahia: '7',
  pontoFrio: '4',
  fastShop: '35'
}

const validateVendor = offer =>
  vendors[offer.vendor] ? Promise.resolve(offer) : Promise.reject()

const search = (offer) => {
  return google(gOpts)(offer)
    .then(response => response.items[0].link)
    .then(link => {
      const productUrl = new URL(link)
      
      let p = productUrl.searchParams.get('p').split('_')
      p = p.slice(0, p.length - 1)
      p = [...p, vendors[offer.vendor]].join('_')
      
      productUrl.searchParams.set('p', p)
      productUrl.searchParams.set('f', vendors[offer.vendor])
      productUrl.searchParams.set('a', false)

      return axios({
        url: productUrl.toString()
      })
        .then(response => response.data)
        .then(cheerio.load)
        .then($ => ({ $, link: productUrl.toString() }))
    })
}

const parse = ({ $, link }) => {
  return Promise.resolve({
    name: $('#produto\\:formProduto\\:produtoNome').text().trim(),
    pointsPrice: numeral($('span.box-pagamento-left span.smiles-pontos:first-child').text().replace('.', ',')).value(),
    pointsPriceFrom: numeral($('td.pagamento-left span.produto-reference-price strike').text().replace('.', ',')).value(),
    link
  })
}

const matched = ({ vendor }, product) =>
  ({ program: 'smiles', vendor, ...product })

const smilesMatcher = offer =>
  validateVendor(offer)
    .then(search)
    .then(parse)
    .then(product => matched(offer, product))
    .catch(e => ({ program: 'smiles', vendor: offer.vendor }))

module.exports = smilesMatcher
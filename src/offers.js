var Excel = require('exceljs')
const path = require('path')

const vendors = {
  'PONTO FRIO': 'pontoFrio',
  'EXTRA': 'extra',
  'FAST SHOP': 'fastShop',
  'PONTO FRIO': 'pontoFrio'
}

const read = (filename = './src/offers.xlsx', limit) => {
  const workbook = new Excel.Workbook()
  return workbook.xlsx.readFile(path.join(__dirname, filename))
    .then(() => {
      let workbookOffers = []
      workbook.eachSheet(function (worksheet, sheetId) {
        let sheetOffers = []
        worksheet.eachRow(function (row, rowNumber) {
          const [, description, , sku, category, brand, priceFrom, priceTo, pointsPrice, discount, vendorKey, url] = row.values
          let vendor = vendorKey && vendors[vendorKey.toUpperCase()]
          if (vendor)
            sheetOffers = [
              ...sheetOffers,
              { description, sku, category, brand, priceFrom, priceTo, pointsPrice, discount, vendor, url }
            ]
        })
        workbookOffers = [...workbookOffers, ...sheetOffers]
      })
      return limit ? workbookOffers.slice(0, limit) : workbookOffers
    })
}

module.exports = read

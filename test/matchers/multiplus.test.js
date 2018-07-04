const assert = require('assert')

describe('multiplus', () => {
  
  const { multiplus } = require('../../src/matchers')

  describe('given a valid offer', () => {
    const offer = {
      description: 'Colchão Inflável Jilong Casal em PVC',
      sku: '11556350',
      category: 'Esporte & Lazer',
      brand: 'Jilong',
      priceFrom: 70.68,
      priceTo: 52,
      pointsPrice: 2737,
      discount: 0.26,
      vendor: 'pontoFrio',
      url: 'https://www.santanderesfera.com.br/produto/colchao-inflavel-jilong-casal-em-pvc/1140456'
    }

    const expected = {
      link: 'https://www.pontosmultiplus.com.br/troque/pontofrio/produto/Esporte-Lazer/Camping-Aventura/Colch%C3%B5es-Infl%C3%A1veis-e-Colchonetes/Colchao-Inflavel-Jilong-Casal-em-PVC/_/PF8023025?categoryId=PF438'
    }

    it('should identify the product url', done => {
      multiplus(offer)
        .then(match => {
          assert.equal(expected.link, match.link)
          assert.equal('Colchão Inflável Jilong Casal em PVC', match.name)
          done()
        })
        .catch(done)
    })

    it('should request the product url contents')
    it('should parse product page')
    it('should return a valid match')
  })

  describe('given an invalid offer', _ => {
    const offer = {}

    it('should return an empty match', done => {
      multiplus(offer)
        .then(({ program }) => {
          assert.equal(program, 'multiplus')
          done()
        })
        .catch(err => assert.fail(err))
        .catch(done)
    })
  })
})
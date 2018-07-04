const assert = require('assert')

const matchers = require('../src/matchers')
const productMatcher = require('../src/productMatcher')

describe('product matcher', () => {
  describe('invalid offer', _ => {
    it('run each registered matcher for the offer', done => {
      const offer = {}

      const matchersCount = Object.keys(matchers).length

      Promise.all(productMatcher(offer))
        .then(matches => {
          assert.equal(matches.length, matchersCount)
          done()
        })
        .catch(err => assert.fail(err))
        .catch(done)
    })
  })
})
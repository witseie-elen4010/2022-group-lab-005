'use strict'
const wordQuery = require('../services/wordQuery')

test('Check that the word hello is successfully inserted into the db', () => {
  const word = 'hello'
  wordQuery.createWord(word).then(data => {
    const numRows = JSON.parse(JSON.stringify(data)).rowsAffected.at(0)
    expect(numRows).toBe(1)
  })
})

test('Check that inserting nothing does not insert an element into the db', () => {
  const emptyWord = ''
  wordQuery.createWord(emptyWord).then(data => {
    const numRows = JSON.parse(JSON.stringify(data)).rowsAffected.at(0)
    expect(numRows).toBe(1)
  })
})
jest.setTimeout(30000)

test('checks if checkWord correctly identifies correct words', () => {
  return wordQuery.checkWord('words', 1).then(data => {
    expect(data).toBe(true)
  }
  )
}
)

test('checks if checkWord correctly identifies incorrect words', () => {
  return wordQuery.checkWord('helps', 1).then(data => {
    expect(data).toBe(false)
  }
  )
}
)

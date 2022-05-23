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
        expect(numRows).toBe(0)
    })
})
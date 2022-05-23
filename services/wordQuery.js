const { get } = require('./poolManagement')

module.exports = {

    createWord: async function createWord(word) {
        const sqlCode = `INSERT INTO [HazardaGuess_db].[dbo].[WordLog] (Word) VALUES ('${word}');`
        get('default').then(
            (pool) => pool.request().query(sqlCode).then(
                (result) => {return result}
            ).catch( console.error )
        ).catch( console.error )
    }
}
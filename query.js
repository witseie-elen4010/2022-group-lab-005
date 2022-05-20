'use strict'

const config = {
    authentication: {
        options: {
            userName: "ELEN4010_Group5",
            password: "Suffering_"
        },
        type: "default"
    },
    server: "elen4010-project-group5.database.windows.net", 
    options: {
        database: "HazardaGuess_db", 
        encrypt: true
    }
}

const logWord = function (wordToLog) {
    const Connection = require('tedious').Connection
    const connection = new Connection(config)

    // Setup event handler when the connection is established. 
    connection.on('connect', function (err) {
        if (err) {
            console.log(err)
        } else {
            const Request = require('tedious').Request
            const request = new Request("INSERT INTO [HazardaGuess_db].[dbo].[WordLog] (Word) VALUES ('" + wordToLog + "');", function (err) {
                if (err) {
                    console.log(err)
                }
            })

            connection.execSql(request)
        }

    })

    // Initialize the connection.
    connection.connect()
}

module.exports = logWord

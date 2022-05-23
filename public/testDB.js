'use strict'
const { get } = require('./poolManagement')

module.exports = {
    example: async function example() {
        const pool = await get('default')
        var darkMode = [{ DarkMode: false }]

        //Get dark mode setting for specific user

        var mode = JSON.stringify(await pool.request().query(`SELECT DarkMode FROM User_Details WHERE Username = 'user'`));
        let obj = JSON.parse(mode);
        console.log(obj.DarkMode)

        //Return true if user has dark mode selected

        if (obj.DarkMode == false) {
            return "false";
        }
        else {
            return "true";
        }
    },

    
    changeMode: async function changeMode(Darkmode) {
        //update users table if dark mode has changed
        const sqlCode = `UPDATE dbo.User_Details SET DarkMode = '${Darkmode}' WHERE Username = 'user'`

        console.log(sqlCode)
        get('default').then(
            (pool) => pool.request().query(sqlCode).then(
                (result) => { return result }
            ).catch(console.error)
        ).catch(console.error)

    }
}



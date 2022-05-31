'use strict'
const { get } = require('./poolManagement.cjs')

module.exports = {
    getBackground: async function getMode(id) {
        const pool = await get('default')

        const background = await pool.request().query("SELECT Background FROM [dbo].[UserSettings] WHERE ID = '" + id + "'")

        if (background.recordset[0].Background === "Mountains") {
            return "Mountains"
        } else {
            if (background.recordset[0].Background === "Forest") {
                return "Forest"
            } else {
                if (background.recordset[0].Background === "Beach") {
                    return "Beach"
                }
            }
        }


    },


    changeBackground: async function changeBackground(Background, ID) {

        const sqlCode = `UPDATE [dbo].[UserSettings] SET Background  = '${Background}' WHERE ID = '1'`

        console.log(sqlCode)
        get('default').then(
            (pool) => pool.request().query(sqlCode).then(
                (result) => { return result }
            ).catch(console.error)
        ).catch(console.error)
    }


}
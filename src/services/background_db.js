'use strict'
const { get } = require('./poolManagement')

module.exports = {
  getBackground: async function getMode (id) {
    const pool = await get('default')

    // Get dark mode setting for specific user
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


}
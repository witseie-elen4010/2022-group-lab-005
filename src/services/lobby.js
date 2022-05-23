'use strict'
const { get } = require("./poolManagement");

module.exports = {
  prevGameID: async function prevGameID() {
    const sqlCode = `SELECT TOP 1 GameID FROM dbo.Game ORDER BY GameID DESC`;
    console.log(sqlCode);
    get("default")
      .then((pool) =>
        pool
          .request()
          .query(sqlCode)
          .then((result) => {
            console.log(result.recordset[0].GameID);
            return result.recordset[0].GameID;
          })
          .catch(console.error)
      )
      .catch(console.error);
  },

  createGame: async function createGame(gameMode, newID) {
    const sqlCode = `INSERT INTO dbo.Game(GameID, GameType) VALUES ('${newID}', '${gameMode}');`;
    console.log(sqlCode);
    get("default")
      .then((pool) =>
        pool
          .request()
          .query(sqlCode)
          .then((result) => {
            return result;
          })
          .catch(console.error)
      )
      .catch(console.error);
  },
};

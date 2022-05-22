const { get } = require('./poolManagement')

module.exports = {
    LogIn: async function LogIn(username, password){
        // make sure that any items are correctly URL encoded in the connection string
        // SELECT Password FROM User_Details WHERE Username = 'user';
        const pool = await get('default')

        return pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")
        //return pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")
    }
}
//  goes inbetween query sql code and .catch           
// .then(
//     (result) => {return result}
// )


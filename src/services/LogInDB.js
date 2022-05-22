const { get } = require('./poolManagement')

module.exports = {
    LogIn: async function LogIn(Username, Password){
        // make sure that any items are correctly URL encoded in the connection string
        // SELECT Password FROM User_Details WHERE Username = 'user';
        const sqlCode = 'SELECT Password FROM User_Details WHERE Username = ' + user +';';
        console.log(sqlCode)
        get('default').then(
            (pool) => pool.request().query(sqlCode).catch( console.error )
        ).catch( console.error )
        if(result == Password)
        {
            return "true";
        }
        else
        {
            return "false";
        }
    }
}
//  goes inbetween query sql code and .catch           
// .then(
//     (result) => {return result}
// )


const { get } = require('./poolManagement')

module.exports = {
    LogIn: async function LogIn(username, password){
        // make sure that any items are correctly URL encoded in the connection string
        // SELECT Password FROM User_Details WHERE Username = 'user';
        const pool = await get('default')
        var list = JSON.stringify((await pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")).recordset[0])
        let obj = JSON.parse(list);
        if(obj.Password == password)
        {
            return 1;
        }
        else
        {
            return 0;
        }
        return 
        //return pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")
    }
}

//  goes inbetween query sql code and .catch           
// .then(
//     (result) => {return result}
// )


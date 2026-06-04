const mysql = require('mysql2/promise');

async function MyConnection()
{
    const connection = await mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"admin",
    database:"shubham",
    });
    console.log(connection);
    console.log("Successfully Connected the DataBase.");
    return connection;
}

module.exports = MyConnection;
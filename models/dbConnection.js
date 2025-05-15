const mysql = require('mysql2');

// Create a connection pool
const dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Check if the database is connected
dbconnection.getConnection((error, connection) => {
    if (error) {
        console.log(error, 'Database is not Connected..!!');
    } else {
        console.log('Database Connected Successfully..!!');
        connection.release(); // Release the connection when done
    }
});

const queryPromise = (sql, values) => {
    return new Promise((resolve, reject) => {
        dbconnection.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    dbconnection,
    queryPromise,
};

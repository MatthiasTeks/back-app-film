const mysql = require("mysql2");
const dbConfig = require("./db");

// Créer un pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction pour obtenir une connexion à partir du pool
function getConnection() {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getConnection,
};
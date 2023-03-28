"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const db_1 = require("./db");
const pool = mysql2_1.default.createPool(db_1.dbConfig);
/**
 * Function to get a connection from the connection pool
 * @returns {Promise<mysql.Connection>}
 */
function getConnection() {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(connection);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getConnection = getConnection;

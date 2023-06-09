import { dbConfig } from "./db";
import { createPool, Pool } from "mysql2/promise";

let pool: Pool;

async function createDBConnection(): Promise<void> {
    pool = createPool(dbConfig);
}

async function getDBConnection() {
    return pool.getConnection();
}

async function closeDBConnection() {
    return pool.end();
}

export {
    createDBConnection,
    getDBConnection, 
    closeDBConnection
};
import { dbConfig } from "./db";
import { createPool, PoolConnection } from "mysql2/promise";

async function createDBConnection(): Promise<PoolConnection> {
    const pool = createPool(dbConfig);
    return pool.getConnection();
}

export {
    createDBConnection,
};
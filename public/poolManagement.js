'use strict'

require('dotenv').config()
const mssql = require('mssql')
const pools = new Map();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false
    }
}

module.exports = {
    /**
     * Get or create a pool. If a pool doesn't exist the config must be provided.
     * If the pool does exist the config is ignored (even if it was different to the one provided
     * when creating the pool)
     *
     * @param {string} name
     * @param {{}} [config]
     * @return {Promise.<mssql.ConnectionPool>}
     */
    get: (name) => {
        if (!pools.has(name)) {
            const pool = new mssql.ConnectionPool(config);
            // automatically remove the pool from the cache if `pool.close()` is called
            const close = pool.close.bind(pool);
            pool.close = (...args) => {
                pools.delete(name);
                return close(...args);
            }
            pools.set(name, pool.connect());
        }
        return pools.get(name);
    },
    /**
     * Closes all the pools and removes them from the store
     *
     * @return {Promise<mssql.ConnectionPool[]>}
     */
    closeAll: () => Promise.all(Array.from(pools.values()).map((connect) => {
        return connect.then((pool) => pool.close());
    })),
};
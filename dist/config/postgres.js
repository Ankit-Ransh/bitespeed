"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const config_js_1 = require("./config.js");
const constants_js_1 = require("../utils/constants.js");
const pool = new Pool({
    user: config_js_1.dbUsername,
    host: config_js_1.dbHost,
    database: config_js_1.dbName,
    password: config_js_1.dbPassword,
    port: Number(config_js_1.dbPort) || constants_js_1.Constants.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // only for testing
        // rejectUnauthorized: true, /* true for production */
    },
    connectionTimeoutMillis: constants_js_1.Constants.DB_TIMEOUTS.CONNECTION_TIMEOUT,
    idleTimeoutMillis: constants_js_1.Constants.DB_TIMEOUTS.IDLE_TIMEOUT,
    query_timeout: constants_js_1.Constants.DB_TIMEOUTS.QUERY_TIMEOUT,
    lock_timeout: constants_js_1.Constants.DB_TIMEOUTS.LOCK_TIMEOUT,
});
exports.pool = pool;
//# sourceMappingURL=postgres.js.map
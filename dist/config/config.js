"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPort = exports.dbPassword = exports.dbHost = exports.dbName = exports.dbUsername = exports.port = void 0;
require("dotenv/config");
const constants_1 = require("../utils/constants");
const port = constants_1.Constants.PORT;
exports.port = port;
const dbUsername = process.env.DB_USERNAME;
exports.dbUsername = dbUsername;
const dbName = process.env.DB_DATABASE;
exports.dbName = dbName;
const dbHost = process.env.DB_HOST;
exports.dbHost = dbHost;
const dbPassword = process.env.DB_PASSWORD;
exports.dbPassword = dbPassword;
const dbPort = process.env.DB_PORT;
exports.dbPort = dbPort;
//# sourceMappingURL=config.js.map
import 'dotenv/config';

const port = process.env.PORT;
const dbUsername = process.env.DB_USERNAME;
const dbName = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

export {
    port, 
    serverUrl,
    dbUsername,
    dbName,
    dbHost,
    dbPassword,
    dbPort,
};
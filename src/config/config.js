import 'dotenv/config';
import { Constants } from '../utils/constants';

const port = Constants.PORT;
const dbUsername = process.env.DB_USERNAME;
const dbName = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

export {
    port, 
    dbUsername,
    dbName,
    dbHost,
    dbPassword,
    dbPort,
};
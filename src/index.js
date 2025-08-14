import 'dotenv/config';
import { server } from "./routes/server.js";
import { port } from './config/config.js';
import { Constants } from './utils/constants.js';
import { contactRouter } from './routes/contact.js';

server.use(`${Constants.ROUTES.identifyContact}`, contactRouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
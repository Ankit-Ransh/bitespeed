"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const server_js_1 = require("./routes/server.js");
const config_js_1 = require("./config/config.js");
const constants_js_1 = require("./utils/constants.js");
const contact_js_1 = require("./routes/contact.js");
server_js_1.server.use(`${constants_js_1.Constants.ROUTES.identifyContact}`, contact_js_1.contactRouter);
server_js_1.server.listen(config_js_1.port, () => {
    console.log(`Server running on port ${config_js_1.port}`);
});
//# sourceMappingURL=index.js.map
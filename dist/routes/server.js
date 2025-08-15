"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const constants_js_1 = require("../utils/constants.js");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
exports.server = server;
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)());
server.use((0, cors_1.default)({
    origin: ["*"],
    credentials: true,
    methods: [constants_js_1.Constants.REQUEST_METHODS.POST, constants_js_1.Constants.REQUEST_METHODS.GET, constants_js_1.Constants.REQUEST_METHODS.PUT,
        constants_js_1.Constants.REQUEST_METHODS.PATCH, constants_js_1.Constants.REQUEST_METHODS.HEAD, constants_js_1.Constants.REQUEST_METHODS.OPTIONS],
    allowedHeaders: [constants_js_1.Constants.REQUEST_HEADERS.CONTENT_TYPE, constants_js_1.Constants.REQUEST_HEADERS.AUTHORIZATION],
}));
server.use((err, req, res, next) => {
    if (req.method === constants_js_1.Constants.REQUEST_METHODS.OPTIONS) {
        res.sendStatus(constants_js_1.Constants.STATUS_CODES.NO_CONTENT);
        return;
    }
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});
//# sourceMappingURL=server.js.map
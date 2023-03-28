"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const home_1 = __importDefault(require("./home"));
const auth_1 = __importDefault(require("./auth"));
const newsletter_1 = __importDefault(require("./newsletter"));
const projet_1 = __importDefault(require("./projet"));
/**
 * Sets up routes for the Express application.
 * @function
 * @param {Application} app - The Express application.
 * @returns {void}
 */
const setupRoutes = (app) => {
    app.use('/home', home_1.default);
    app.use('/auth', auth_1.default);
    app.use('/newsletter', newsletter_1.default);
    app.use('/projet', projet_1.default);
};
exports.setupRoutes = setupRoutes;

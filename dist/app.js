"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = require("./middlewares/cors");
const routes_1 = require("./routes");
// Create Express app instance
const app = (0, express_1.default)();
// Middlewares
app.use(cors_1.corsMiddleware);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configure routes
(0, routes_1.setupRoutes)(app);
exports.default = app;

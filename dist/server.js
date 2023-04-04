"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const cors_1 = require("./middlewares/cors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ silent: true });
// SETUP
const app = (0, express_1.default)();
const port = process.env.PORT || 4242;
// MIDDLEWARES
app.use(cors_1.corsMiddleware);
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ROUTING
(0, routes_1.setupRoutes)(app);
// TEST CONNECTION
app.get('/', (req, res) => {
    const message = 'API Films de la Bande';
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #e1e1e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                h1 {
                    font-size: 3rem;
                    color: #ffffff;
                    background-color: #000000;
                    padding: 20px;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <h1>${message}</h1>
        </body>
    </html>
  `);
});
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map
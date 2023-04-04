"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data, errorMessage) => {
    data ? res.status(200).json(data) : res.status(404).json({ message: errorMessage });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=SendResponse.js.map
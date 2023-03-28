"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.findByEmail = exports.validate = void 0;
const database_1 = require("../config/database");
const joi_1 = __importDefault(require("joi"));
const argon2_1 = __importDefault(require("argon2"));
const hashingOptions = {
    type: argon2_1.default.argon2d,
    memoryCost: Math.pow(2, 16),
    timeCost: 10,
    parallelism: 2,
    hashLength: 50,
};
const validate = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        mail: joi_1.default.string().email().max(255).presence(presence),
        password: joi_1.default.string().min(8).max(50).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};
exports.validate = validate;
const findByEmail = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.getConnection)();
        const [results] = yield connection.query('SELECT * FROM admin WHERE mail = ?', [mail]);
        connection.release();
        return results[0];
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findByEmail = findByEmail;
const verifyPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield argon2_1.default.verify(hashedPassword, plainPassword, hashingOptions);
    }
    catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
});
exports.verifyPassword = verifyPassword;

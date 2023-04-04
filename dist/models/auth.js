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
exports.verifyAdminPassword = exports.findAdminByMail = exports.hashingOptions = void 0;
const argon2_1 = __importDefault(require("argon2"));
const database_1 = require("../config/database");
exports.hashingOptions = {
    type: argon2_1.default.argon2d,
    memoryCost: Math.pow(2, 16),
    timeCost: 10,
    parallelism: 2,
    hashLength: 50,
};
/**
 * Finds an admin user by their email address.
 * @param {string} mail - The email address of the admin user to find.
 * @returns {Promise<Admin | undefined>} A promise that resolves to an Admin object or undefined if no admin is found.
 * @throws {Error} Will throw an error if there is an issue with the database query.
 */
const findAdminByMail = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM admin WHERE mail = ?', [mail]);
        connection.release();
        if (result.length === 0) {
            return undefined;
        }
        return {
            mail: result[0].mail,
            password: ''
        };
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findAdminByMail = findAdminByMail;
/**
 * Verifies if a given plain password matches a hashed password using Argon2.
 * @param {string} plainPassword - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the plain password matches the hashed password, or false otherwise.
 * @throws {Error} - If there's an error during the verification process, the error will be logged and thrown.
 */
const verifyAdminPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield argon2_1.default.verify(hashedPassword, plainPassword, exports.hashingOptions);
    }
    catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
});
exports.verifyAdminPassword = verifyAdminPassword;
//# sourceMappingURL=auth.js.map
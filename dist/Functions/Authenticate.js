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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const Hashing_1 = require("./Hashing");
const Authenticate = ({ emailInput, passwordInput }) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const userDataCheck = yield prisma.user.findUnique({
        where: {
            email: emailInput
        },
    });
    const hashedpassword = userDataCheck === null || userDataCheck === void 0 ? void 0 : userDataCheck.password;
    const passwordCheck = yield (0, Hashing_1.CompareString)(passwordInput, hashedpassword);
    console.log(passwordCheck);
    const data = {
        id: userDataCheck === null || userDataCheck === void 0 ? void 0 : userDataCheck.id,
        results: passwordCheck
    };
    return data;
});
exports.default = Authenticate;
//# sourceMappingURL=Authenticate.js.map
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
const express = require("express");
const cors = require("cors");
const app = express();
const LOCALPORT = 4000;
const path = require("path");
const client_1 = require("@prisma/client");
const AddUser_1 = __importDefault(require("./Functions/AddUser"));
const Authenticate_1 = __importDefault(require("./Functions/Authenticate"));
const ProfileLocater_1 = __importDefault(require("./Functions/ProfileLocater"));
const Hashing_1 = require("./Functions/Hashing");
const prisma = new client_1.PrismaClient();
app.use(express.json());
app.use(cors());
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});
// * Get request to get all users
// ? Returns all users in database
app.get("/getData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    console.log("I got a connection");
    res.json({
        results: users,
    });
}));
// * Post request to authenticate user
// * Checks if user exists in database
// * Using the supplied email and password, locate user
// ? If user exists, return true
// ! If user does not exist, return error
app.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("I got a connection to authentication");
    const findUser = req.body.email;
    const findPassword = req.body.password;
    const data = yield (0, Authenticate_1.default)({
        emailInput: findUser,
        passwordInput: findPassword,
    }).then((data) => {
        if (data.results === false) {
            return res
                .status(400)
                .json({ error: "User not found", userResults: false });
        }
        else if (data.results === true) {
            return res.status(200).json({ results: data.id, userResult: true });
        }
    });
    return data;
}));
// * Post request to add user to database
// * Checks if user already exists
// ? If user does not exist, add user to database
// ! If user exists, return error
app.post("/addUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const email = req.body.emailInput.toLowerCase();
    const password = (0, Hashing_1.EncryptString)(req.body.passwordCypherInput);
    console.log("I got a connection to add user");
    if ((yield (0, AddUser_1.default)({
        firstNameInput: firstName,
        lastNameInput: lastName,
        emailInput: email,
        passwordCypherInput: password,
    })) === false) {
        return res
            .status(400)
            .json({ error: "User already exists", results: false });
    }
    else {
        return res.status(201).json({ results: true, user: "User has been added" });
    }
}));
// * Post request to locate user
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, return user data
// ! If user does not exist, return error
app.post("/locateUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("I got a connection to locate user");
    const requestedId = req.body.id;
    const findUser = yield (0, ProfileLocater_1.default)(requestedId);
    if (!findUser === true) {
        return res.status(400).json({ error: "User not found", results: false });
    }
    else {
        return res.status(200).json({
            results: true,
            user: { firstName: findUser.firstName, lastName: findUser.lastName },
        });
    }
}));
app.listen(process.env.PORT || LOCALPORT, (req, res) => {
    console.log("Server is running @ " + LOCALPORT);
});
//# sourceMappingURL=index.js.map
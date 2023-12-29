const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
import { PrismaClient } from "@prisma/client";
import AddUser from "./Functions/AddUser";
import Authenticate from "./Functions/Authenticate";
import ProfileLocater from "./Functions/ProfileLocater";
import { EncryptString } from "./Functions/Hashing";

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// * Get request to get all users
// ? Returns all users in database

app.get("/getData", async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  console.log("I got a connection");

  res.json({
    results: users,
  });
});

// * Post request to authenticate user
// * Checks if user exists in database
// * Using the supplied email and password, locate user
// ? If user exists, return true
// ! If user does not exist, return error

app.post("/auth", async (req: any, res: any) => {
  console.log("I got a connection to authentication");

  const findUser = req.body.email;
  const findPassword = req.body.password;
  console.log(req.body, "this is coming from auth as the input request");

  const data = await Authenticate({
    emailInput: findUser,
    passwordInput: findPassword,
  }).then((data: any) => {
    console.log(data, "this is coming from auth as the output request");
    
    if (data.results === false) {
      return res
        .status(400)
        .json({ error: "User not found", userResults: false });
    } else if (data.results === true) {
      console.log();
      
      return res.status(200).json({ results: data.id, userResult: true });
    }
  });

  return data;
});

// * Post request to add user to database
// * Checks if user already exists
// ? If user does not exist, add user to database
// ! If user exists, return error

app.post("/addUser", async (req: any, res: any) => {
  const firstName = req.body.firstNameInput;
  const lastName = req.body.lastNameInput;
  const email = req.body.emailInput.toLowerCase();
  const password = EncryptString(req.body.passwordCypherInput);
  console.log("I got a connection to add user");

  if (
    (await AddUser({
      firstNameInput: firstName,
      lastNameInput: lastName,
      emailInput: email,
      passwordCypherInput: password,
    })) === false
  ) {
    return res
      .status(400)
      .json({ error: "User already exists", results: false });
  } else {
    return res.status(201).json({ results: true, user: "User has been added" });
  }
});

// * Post request to locate user
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, return user data
// ! If user does not exist, return error

app.post("/locateUser", async (req: any, res: any) => {
  console.log("I got a connection to locate user");
  const requestedId = req.body.id;
  console.log(
    requestedId,
    "this is coming from locateUser as the input request"
  );

  const findUser = await ProfileLocater(requestedId);
  if (!findUser === true) {
    return res.status(400).json({ error: "User not found", results: false });
  } else {
    return res.status(200).json({
      results: true,
      user: { firstName: findUser.firstName, lastName: findUser.lastName },
    });
  }
});

app.listen(PORT, (req: any, res: any) => {
  console.log("Server is running @ " + PORT);
});

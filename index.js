const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3003
const path = require('path')
const PrismaClient = require('@prisma/client').PrismaClient
const AddUser = require('./Functions/AddUser')
const Authenticate = require('./Functions/Authenticate')
const ProfileLocater = require('./Functions/ProfileLocater')
const { EncryptString } = require('./Functions/Hashing')
const UpdatePassword = require('./Functions/UpdatePassword')

const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// * Get request to get all users
// ? Returns all users in database

app.get('/getData', async (req, res) => {
  const users = await prisma.user.findMany()
  console.log('I got a connection')

  const userData = users.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName
  }))

  res.json({
    results: userData
  })
})

// * Post request to authenticate user
// * Checks if user exists in database
// * Using the supplied email and password, locate user
// ? If user exists, return true
// ! If user does not exist, return error

app.post('/auth', async (req, res) => {
  console.log('I got a connection to authentication')
  const findUser = req.body.email
  const findPassword = req.body.password
  const data = await Authenticate({
    emailInput: findUser,
    passwordInput: findPassword
  })
    .then((data) => {
      if (data.results === false) {
        return res
          .status(401)
          .json({ error: 'Log in Failed', userResults: false })
      } else if (data.results === true) {
        return res.status(200).json({ results: data.id, userResult: true })
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({ error: 'Log in Failed', userResults: false })
    })
  return data
})

// * Post request to add user to database
// * Checks if user already exists
// ? If user does not exist, add user to database
// ! If user exists, return error

app.post('/addUser', async (req, res) => {
  const firstName = req.body.firstNameInput
  const lastName = req.body.lastNameInput
  const email = req.body.emailInput.toLowerCase()
  const password = EncryptString(req.body.passwordCypherInput)
  console.log('I got a connection to add user')

  if (
    (await AddUser({
      firstNameInput: firstName,
      lastNameInput: lastName,
      emailInput: email,
      passwordCypherInput: password
    })) === false
  ) {
    return res
      .status(400)
      .json({ error: 'User already exists', results: false })
  } else {
    return res.status(201).json({ results: true, user: 'User has been added' })
  }
})

// * Post request to locate user
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, return user data
// ! If user does not exist, return error

app.post('/locateUser', async (req, res) => {
  console.log('I got a connection to locate user')
  const requestedId = req.body.id
  const findUser = await ProfileLocater(requestedId)

  if (!findUser === true) {
    return res.status(400).json({ error: 'User not found', results: false })
  } else {
    return res.status(200).json({
      results: true,
      user: { firstName: findUser.firstName, lastName: findUser.lastName }
    })
  }
})

// * Post request to update user password
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, update password
// ! If user does not exist, return error

app.post('/updatePassword', async (req, res) => {
  console.log('I got a connection to update password')
  const requestedId = req.body.id
  const newPassword = EncryptString(req.body.newPassword)
  await UpdatePassword(requestedId, newPassword)
    .then(async () => {
      const userNewInfo = await ProfileLocater(requestedId)
      return res.status(200).json({ results: 'Profile Updated', user: userNewInfo })
    })
    .catch((error) => {
      console.log(error)
      return res.status(400).json({ error: 'Update failed', results: 'Updated Failed' })
    })
})

app.listen(PORT, (req, res) => {
  console.log('Server is running @ ' + PORT)
})

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3003
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const AddUser = require('./Functions/AddUser')
const Authenticate = require('./Functions/Authenticate')
const ProfileLocater = require('./Functions/ProfileLocater')
const { EncryptString } = require('./Functions/Hashing')
const UpdatePassword = require('./Functions/UpdatePassword')

const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// * Get request to get all users
// ? Returns all users in database

app.get('/getData', async (req, res) => {
  const users = await prisma.user.findMany()
  console.log('I got a connection')

  const userData = users.map(user => ({
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
  const findUser = req.body.email.toLowerCase()
  const findPassword = req.body.password

  if (!findUser || !findPassword) {
    return res.status(400).json({ results: false, error: 'Missing information' })
  }

  await Authenticate({
    emailInput: findUser,
    passwordInput: findPassword
  })
    .then(data => {
      if (data.results === false) {
        throw new Error('Log in Failed')
      } else if (data.results === true) {
        return res.status(200).json({ results: data.id, userResult: true })
      }
    })
    .catch(err => {
      res.status(401).json({ error: err.message, userResults: false })
    })
})

// * Post request to add user to database
// * Checks if user already exists
// ? If user does not exist, add user to database
// ! If user exists, return error

app.post('/addUser', async (req, res) => {
  console.log('I got a connection to add user')
  const firstName = req.body.firstNameInput
  const lastName = req.body.lastNameInput
  const email = req.body.emailInput.toLowerCase()
  const password = EncryptString(req.body.passwordCypherInput)

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ results: false, error: 'Missing information' })
  }

  await AddUser({
    firstNameInput: firstName,
    lastNameInput: lastName,
    emailInput: email,
    passwordCypherInput: password
  })
    .then(data => {
      if (data === false) {
        throw new Error('User already exists')
      } else if (data === true) {
        return res.status(201).json({ results: true, user: 'User has been added' })
      }
    })
    .catch(err => {
      res.status(400).json({ results: false, error: err.message })
    })
})

// * Post request to locate user
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, return user data
// ! If user does not exist, return error

app.post('/locateUser', async (req, res) => {
  console.log('I got a connection to locate user')
  const requestedId = req.body.id

  if (!requestedId) {
    return res.status(400).json({ error: 'Missing information', results: false })
  }

  const findUser = await ProfileLocater(requestedId)

  if (!findUser === true) {
    return res.status(400).json({ error: 'User not found', results: false })
  }

  return res.status(200).json({
    results: true,
    user: { firstName: findUser.firstName, lastName: findUser.lastName }
  })
})

// * Post request to update user password
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, update password
// ! If user does not exist, return error

app.post('/updatePassword', async (req, res) => {
  console.log('I got a connection to update password')
  if (!req.body.id || !req.body.newPassword) {
    return res.status(400).json({ error: 'Missing information', results: false })
  }

  const requestedId = req.body.id
  const newPassword = EncryptString(req.body.newPassword)

  await UpdatePassword(requestedId, newPassword)
    .then(() => res
      .status(200)
      .json({ results: 'Profile Updated' }))
    .catch(error => res
      .status(400)
      .json({ error: error.message, results: 'Updated Failed' }))
})

// * Put request to delete user
// * Checks if user exists
// * Using the supplied ID, locate user
// ? If user exists, delete user
// ! If user does not exist, return error

app.put('/deleteUser', async (req, res) => {
  console.log('I got a connection to delete user')
  const requestedId = req.body.id

  if (!requestedId) {
    return res.status(400).json({ error: 'Missing information', results: false })
  }

  const findUser = await ProfileLocater(requestedId)

  if (!findUser === true) {
    return res.status(400).json({ error: 'User not found', results: false })
  }

  await prisma.user.delete({
    where: {
      id: requestedId
    }
  })

  return res.status(200).json({ results: true, user: 'User has been deleted' })
})

app.listen(PORT, (req, res) => {
  console.log('Server is running @ ' + PORT)
})

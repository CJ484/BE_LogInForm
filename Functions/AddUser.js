const { PrismaClient } = require('@prisma/client')
const { v4: uuid } = require('uuid')

const AddUser = async ({
  firstNameInput,
  lastNameInput,
  emailInput,
  passwordCypherInput
}) => {
  const prisma = new PrismaClient()
  const userDataCheck = await prisma.user.findMany({
    where: {
      email: emailInput
    }
  })
  if (userDataCheck.length !== 0) {
    return false
  }
  await prisma.user.create({
    data: {
      id: uuid(),
      email: emailInput,
      firstName: firstNameInput,
      lastName: lastNameInput,
      password: passwordCypherInput
    }
  })
}

module.exports = AddUser

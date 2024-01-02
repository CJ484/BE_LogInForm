const { PrismaClient } = require('@prisma/client')
const { CompareString } = require('./Hashing')

const Authenticate = async ({ emailInput, passwordInput }) => {
  const prisma = new PrismaClient()
  const userDataCheck = await prisma.user.findUnique({
    where: {
      email: emailInput
    }
  })

  const hashedpassword = userDataCheck?.password
  const passwordCheck = await CompareString(passwordInput, hashedpassword)

  console.log(passwordCheck)

  const data = {
    id: userDataCheck?.id,
    results: passwordCheck
  }

  return data
}

module.exports = Authenticate

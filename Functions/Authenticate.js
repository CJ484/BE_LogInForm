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
  const passwordCheck = CompareString(passwordInput, hashedpassword)

  const comparison = {
    id: userDataCheck?.id,
    results: passwordCheck
  }
  return comparison
}

module.exports = Authenticate

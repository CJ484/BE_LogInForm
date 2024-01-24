const { PrismaClient } = require('@prisma/client')

const DeleteUser = async ({ emailInput }) => {
  const prisma = new PrismaClient()
  const userDataCheck = await prisma.user.findMany({
    where: {
      email: emailInput
    }
  })
  if (userDataCheck.length === 0) {
    return false
  }

  await prisma.user.delete({
    where: {
      email: emailInput
    }
  })
  return true
}

module.exports = DeleteUser

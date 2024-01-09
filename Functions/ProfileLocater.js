const { PrismaClient } = require('@prisma/client')

const ProfileLocater = async IdInput => {
  const prisma = new PrismaClient()

  const userDataCheck = await prisma.user.findUnique({
    where: {
      id: IdInput
    }
  })
  return userDataCheck
}

module.exports = ProfileLocater

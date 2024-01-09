const { PrismaClient } = require('@prisma/client')

const UpdatePassword = async (requestedId, newPasswordCyphered) => {
  const prisma = new PrismaClient()
  await prisma.user.update({
    where: {
      id: requestedId
    },
    data: {
      password: newPasswordCyphered
    }
  })
    .catch(() => {
      throw new Error('Update failed')
    })
}

module.exports = UpdatePassword

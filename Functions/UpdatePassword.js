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
    .then(results => {
      console.log(results)
      return results
    })
    .catch(error => {
      console.log(error)
      throw new Error('Something went wrong')
    })
}

module.exports = UpdatePassword

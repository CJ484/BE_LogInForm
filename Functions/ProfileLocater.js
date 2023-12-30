const { PrismaClient } = require("@prisma/client");

const ProfileLocater = async (IdInput) => {
  const prisma = new PrismaClient();
  console.log(IdInput, "coming from ProfileLocater");
  
  const userDataCheck = await prisma.user.findUnique({
    where: {
      id: IdInput,
    },
  });
return userDataCheck;
};

module.exports = ProfileLocater;
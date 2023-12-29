import { PrismaClient } from "@prisma/client";

const ProfileLocater = async (IdInput: any) => {
  const prisma = new PrismaClient();
  console.log(IdInput, "coming from ProfileLocater");
  
  const userDataCheck = await prisma.user.findUnique({
    where: {
      id: IdInput,
    },
  });
return userDataCheck;
};

export default ProfileLocater;
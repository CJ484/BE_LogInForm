import { PrismaClient } from "@prisma/client";
const { v4: uuid } = require("uuid");

type User = {
  firstNameInput: string;
  lastNameInput: string;
  emailInput: string;
  passwordCypherInput: string;
};

const AddUser = async ({
  firstNameInput,
  lastNameInput,
  emailInput,
  passwordCypherInput,
}: User) => {
  const prisma = new PrismaClient();
  const userDataCheck = await prisma.user.findMany({
    where: {
      email: emailInput,
    },
  });
  if (userDataCheck.length !== 0) {
    return false;
  }
  await prisma.user.create({
    data: {
      id: uuid(),
      email: emailInput,
      firstName: firstNameInput,
      lastName: lastNameInput,
      password: passwordCypherInput,
    } as any,
  });
};

export default AddUser;

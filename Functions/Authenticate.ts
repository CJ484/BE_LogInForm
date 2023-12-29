import { PrismaClient } from "@prisma/client";
import { CompareString } from "./Hashing";

type InputtedUser = {
  emailInput: string;
  passwordInput: string;
};

const Authenticate = async ({ emailInput, passwordInput }: InputtedUser) => {
  const prisma = new PrismaClient();
  const userDataCheck = await prisma.user.findUnique({
    where: {
      email: emailInput
    },
  });

  const hashedpassword = userDataCheck?.password;
  const passwordCheck = await CompareString(passwordInput, hashedpassword!);

  console.log(passwordCheck);

  const data = {
    id: userDataCheck?.id,
    results: passwordCheck
  }
  
  return data;
};

export default Authenticate;

import { PrismaClient, Prisma, User } from "@prisma/client";
import { dbCatchMethod } from "../services/db.service";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UserService = {
  create: async (data: Prisma.UserCreateInput) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const created = await prisma.user
      .create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    debugger;
    await prisma.$disconnect();
    return created;
  },
  getUser: async (email: string) => {
    const user = await prisma.user
      .findUniqueOrThrow({
        where: {
          email: email,
        },
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return user;
  },
  isValidPassword: async (user: User, password: string) => {
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  },
};

export default UserService;

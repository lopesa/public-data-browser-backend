import { PrismaClient, Prisma, User } from "@prisma/client";
import { dbCatchMethod } from "../services/db.service";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const db = {
  create: async (data: Prisma.UserCreateInput) => {
    const created = await prisma.user.create({ data }).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return created;
  },
  getUser: async (select: Prisma.UserWhereUniqueInput) => {
    debugger;
    const user = await prisma.user
      .findUnique({
        where: select,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return user;
  },
  updateUser: async (user: User, data: Prisma.UserUpdateInput) => {
    const updated = await prisma.user
      .update({
        where: {
          id: user.id,
        },
        data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    debugger;
    return updated;
  },
};

export const getUserByEmail = async (email: string) => {
  return await db.getUser({ email }).catch((e) => {
    throw e;
  });
};
export const getUserById = async (id: string) => {
  return await db.getUser({ id }).catch((e) => {
    throw e;
  });
};

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = {
    email,
    password: hashedPassword,
  };
  return await db.create(data).catch((e) => {
    throw e;
  });
};

export const updateUser = async (user: User, data: Prisma.UserUpdateInput) => {
  return await db.updateUser(user, data).catch((e) => {
    throw e;
  });
};

export const updateUserById = async (
  id: string,
  data: Prisma.UserUpdateInput
) => {
  const user = await getUserById(id).catch((e) => {
    throw e;
  });
  if (!user) throw new Error("User not found to update");
  return await db.updateUser(user, data).catch((e) => {
    throw e;
  });
};

export const isValidPassword = async (user: User, password: string) => {
  return await bcrypt.compare(password, user.password);
};

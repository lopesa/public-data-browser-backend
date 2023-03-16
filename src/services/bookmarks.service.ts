import { PrismaClient, Prisma, User } from "@prisma/client";
import { dbCatchMethod } from "../services/db.service";
const prisma = new PrismaClient();

const BookmarksService = {
  addBookmarks: async (user: User, bookmarks: string[]) => {
    //
  },
  // create: async (data: Prisma.UserCreateInput) => {
  //   const hashedPassword = await bcrypt.hash(data.password, 10);

  //   const created = await prisma.user
  //     .create({
  //       data: {
  //         ...data,
  //         password: hashedPassword,
  //       },
  //     })
  //     .catch(async (e) => {
  //       await dbCatchMethod(e);
  //       throw e;
  //     });
  //   await prisma.$disconnect();
  //   return created;
  // },
  getBookmarks: async (user: User) => {
    // const bookmarks = await prisma.bookmarks
    //   .findUniqueOrThrow({
    //     where: {
    //       email: email,
    //     },
    //   })
    //   .catch(async (e) => {
    //     await dbCatchMethod(e);
    //     throw e;
    //   });
    // await prisma.$disconnect();
    // return user;
  },
};

export default BookmarksService;

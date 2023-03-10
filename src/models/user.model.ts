// import {
//   PrismaClient,
//   Prisma,
// } from "@prisma/client";
// import { dbCatchMethod } from "../services/db.service";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// const User = {
//   create: async (data: Prisma.UserCreateInput) => {
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     const created = await prisma.user.create({
//       data: {
//         ...data,
//         password: hashedPassword
//       },
//     }).catch(async e => {
//       await dbCatchMethod(e);
//       throw e;
//     });
//     await prisma.$disconnect();
//     return created;
//   }
//   isValidPassword: async (password: string) => {
//     const user = this;
//     const compare = await bcrypt.compare(password, user.password);

//     return compare;
//   }
// }

// export default User;

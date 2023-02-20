import { PrismaClient, Prisma } from "@prisma/client";
type TableNames = Uncapitalize<Prisma.ModelName>; // this is a bad path. struggling against what Prisma is doing for me. But interesting TS
// good post on intrinsic type manipulations:
// https://fjolt.com/article/typescript-intrinsic-type-manipulations

const prisma = new PrismaClient();

type DataTypes = Prisma.DepartmentOfAgricultureDataItemCreateInput;

export const dbCatchMethod = async (e: Error) => {
  console.error(e);
  await prisma.$disconnect();
  return e;
  // process.exit(1); // DO I NEED THIS???!?!?!?!?!?
};

// export const makeDbMethods = <DataType>() => {
//   return {
//     getAll: async () => {
//       const item = await prisma.departmentOfAgricultureDataItem
//         .findMany()
//         .catch(dbCatchMethod);
//       prisma.$disconnect();
//       return item;
//     },
//     // create: async (data: Prisma.DepartmentOfAgricultureDataItemCreateInput) => {
//     create: async (data: DataType) => {
//       // also need ot make variable what is the table controller
//       const created = await prisma.departmentOfAgricultureDataItem
//         .create({
//           data: {...(data as DataType)},
//         })
//         .catch(dbCatchMethod);
//       prisma.$disconnect();
//       return created;
//     },
//     createMany: async (data: DataType[]) => {
//       // createMany: async (
//       //   data: Prisma.DepartmentOfAgricultureDataItemCreateInput[]
//       // ) => {
//       const created = await prisma.departmentOfAgricultureDataItem
//         .createMany({
//           data,
//         })
//         .catch(dbCatchMethod);
//       prisma.$disconnect();
//       return created;
//     },
//   };
// };

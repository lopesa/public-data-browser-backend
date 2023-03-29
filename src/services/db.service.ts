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

// getAll: async (
//   select?: Prisma.InternationalCoffeeOrganizationDataItemSelect
// ) => {
//   const items = await prisma.internationalCoffeeOrganizationDataItem
//     .findMany({ select })
//     .catch(async (e) => {
//       await dbCatchMethod(e);
//       throw e;
//     });
//   await prisma.$disconnect();
//   return items;
// },

// type SelectMethodTypes = Prisma.InternationalCoffeeOrganizationDataItemSelect | Prisma.DepartmentOfAgricultureDataItemSelect | Prisma.DepartmentOfEnergyDataItemCreateInput;

// type MethodTypes = typeof prisma.internationalCoffeeOrganizationDataItem | typeof prisma.departmentOfAgricultureDataItem | typeof prisma.departmentOfEnergyDataItem;

// const SelectMethodTypesToMethodTypes: Record<SelectMethodTypes, MethodTypes> = {
// }

// export const makeGetAllMethod = (select: SelectMethodTypes, method: GetAllMethodTypes) => {
//   return async (select: SelectMethodTypes) => {
//       const items = await method
//         .findMany({ select })
//         .catch(async (e) => {
//           await dbCatchMethod(e);
//           throw e;
//         });
//       await prisma.$disconnect();
//       return items;
//     }
// }

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

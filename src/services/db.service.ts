import { getXataClient } from "../configs/xata-custom-config";
import { DatabaseSchema } from "../configs/xata";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const xata = getXataClient();

export const dbGet = async (table: keyof DatabaseSchema, filter: {}) => {
  const rows = await xata.db[table].filter(filter).getMany();
  return rows;
};

export const dbUpdate = async (
  table: keyof DatabaseSchema,
  id: string,
  data: {}
) => {
  const record = await xata.db[table].update(id, data).catch((e) => {
    console.log("~~~~~ error updating record", e);
  });
  return record;
};

// const _testPrisma = async () => {
//   // const allDataSources = await prisma["dataSource"].findMany();
//   let allDataSources = await prisma["dataSource"].findMany();
//   debugger;
//   await prisma.dataSource.create({
//     data: {
//       name: "test",
//       url: "test",
//     },
//   });

//   allDataSources = await prisma["dataSource"].findMany();
//   // debugger;
//   // ... you will write your Prisma Client queries here
// };

// export const testPrisma = async () => {
//   const result = await _testPrisma().catch(async (e) => {
//     console.log("error", e);
//     await prisma.$disconnect();
//     process.exit(1);
//     throw e;
//   });

//   await prisma.$disconnect();
//   return result;
// };

import { PrismaClient, Prisma } from "@prisma/client";
import { getCurrentDataFile } from "./data-files.service";
import { DataSources } from "../types/types-general";
import fs from "fs";
// import { makeDbMethods } from "./db.service";
import { dbCatchMethod } from "./db.service";

const prisma = new PrismaClient();

const db = {
  getAll: async (select?: Prisma.DepartmentOfEnergyDataItemSelect) => {
    const items = await prisma.departmentOfEnergyDataItem
      .findMany()
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return items;
  },
  getById: async (id: string) => {
    const item = await prisma.departmentOfEnergyDataItem
      .findUniqueOrThrow({
        where: {
          id: id,
        },
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return item;
  },
  create: async (data: Prisma.DepartmentOfEnergyDataItemCreateInput) => {},
  createMany: async (
    data: Prisma.DepartmentOfEnergyDataItemCreateManyInput
  ) => {
    const created = await prisma.departmentOfEnergyDataItem
      .createMany({
        data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return created;
  },
};

export const addSourceDataToDbService = async () => {
  debugger;
  const currentDataFile = await getCurrentDataFile(
    DataSources.DEPARTMENT_OF_ENERGY
  ).catch((e) => {
    throw e;
  });

  if (!currentDataFile) {
    throw new Error("No data file found");
  }

  const jsonDataBuffer = await fs.promises
    .readFile(currentDataFile!)
    .catch((e) => {
      throw e;
    });

  const bufferDataAsStringified = jsonDataBuffer && jsonDataBuffer.toString();
  const jsonData =
    bufferDataAsStringified && JSON.parse(bufferDataAsStringified);
  jsonData.dataset = jsonData.dataset.map((item: any) => {
    let returnVal = {
      ...item,
      type: item["@type"],
    };
    delete returnVal["@type"];
    return returnVal;
  });
  // const longestRights = jsonData?.dataset.reduce((acc: number, curr: any) => {
  //   return curr.rights?.length > acc ? curr.rights?.length : acc;
  // }, 0);
  // debugger;
  // const testChunk = jsonData?.dataset.slice(0, 50);
  // const result = await db.createMany(jsonData.dataset).catch((e) => {
  const result = await db.createMany(jsonData.dataset).catch((e) => {
    throw e;
  });
  return result;
  //   const all = await db.getAll().catch((e) => {
  //     res.status(200).json(e.message);
  //   });

  //   return res.status(200).json(all);
};

export const getDepartmentOfEnergyData = async () => {
  const items = await db.getAll().catch((e) => {
    throw e;
  });
  return items;
};

export const getTitleAndDescriptionData = async () => {
  const select = {
    id: true,
    title: true,
    description: true,
  };
  const data = await db.getAll(select).catch((e) => {
    throw e;
  });
  return data;
};

export const getFullDataForItem = async (id: string) => {
  const item = await db.getById(id).catch((e) => {
    throw e;
  });
  return item;
};

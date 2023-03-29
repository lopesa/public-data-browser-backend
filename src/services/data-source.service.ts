import { dbCatchMethod } from "./db.service";
import { PrismaClient, Prisma, DataSource } from "@prisma/client";
import { DataSourceModelNames } from "../types/types-general";

const prisma = new PrismaClient();

const db = {
  // getAll: async (select?: Prisma.DataSourceSelect) => {
  //   const items = await prisma.dataSource
  //     .findMany({ select })
  //     .catch(async (e) => {
  //       await dbCatchMethod(e);
  //       throw e;
  //     });
  //   await prisma.$disconnect();
  //   return items;
  // },
  getUnique: async (selectObject: { modelName: string } | { id: string }) => {
    const item = await prisma.dataSource
      .findUnique({
        where: selectObject,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return item;
  },
  create: async (data: Prisma.DataSourceCreateInput) => {},
  upsert: async (args: Prisma.DataSourceUpsertArgs) => {
    const upserted = await prisma.dataSource.upsert(args).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return upserted;
  },
  // createMany: async (
  //   data: Prisma.DataSourceCreateManyInput
  // ) => {
  //   const created = await prisma.dataSource
  //     .createMany({
  //       data,
  //     })
  //     .catch(async (e) => {
  //       await dbCatchMethod(e);
  //       throw e;
  //     });
  //   await prisma.$disconnect();
  //   return created;
  // },
};

export const getDataSourceByModelName = async (
  modelName: DataSourceModelNames
) => {
  const dataSource = await db.getUnique({ modelName }).catch((e) => {
    throw e;
  });
  return dataSource;
};

export const updateDataSourceInfo = async (modelName: DataSourceModelNames) => {
  const upserted = await db
    .upsert({
      where: { modelName },
      update: { createdAt: new Date() },
      create: {
        modelName,
      },
    })
    .catch((e) => {
      throw e;
    });
};

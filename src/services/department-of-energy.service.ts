import { PrismaClient, Prisma } from "@prisma/client";
import { getCurrentDataFile } from "./data-files.service";
import { DataSources, DataSourceMetadataRecord } from "../types/types-general";
import fs from "fs";
// import { makeDbMethods } from "./db.service";
import { dbCatchMethod } from "./db.service";
import { getFileExtension } from "../utils/generalUtils";
import { PartialBy } from "../types/types-helpers";

const prisma = new PrismaClient();

const db = {
  getAll: async (select?: Prisma.DepartmentOfEnergyDataItemSelect) => {
    const items = await prisma.departmentOfEnergyDataItem
      .findMany({ select })
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

// this whole structure is explained here: https://stackoverflow.com/questions/68366105/get-full-type-on-prisma-client
const titleDescriptionDistributionSelect =
  Prisma.validator<Prisma.DepartmentOfEnergyDataItemSelect>()({
    id: true,
    title: true,
    description: true,
    distribution: true,
  });

type TitleDescriptionDistributionPayload =
  Prisma.DepartmentOfEnergyDataItemGetPayload<{
    select: typeof titleDescriptionDistributionSelect;
  }>;

interface TitleDescriptionDistribution
  extends TitleDescriptionDistributionPayload {
  dataTypesByFileExtension?: string[];
}

type FinalDataReplyType = PartialBy<
  TitleDescriptionDistribution,
  "distribution"
>;

type FinalFullReplyType = {
  data: FinalDataReplyType[];
  originalJsonDataUrl?: string;
  originalIntialUrl?: string;
};

type GetTitleAndDescriptionDataReturnType = Promise<FinalFullReplyType>;

export const getTitleAndDescriptionData =
  async (): GetTitleAndDescriptionDataReturnType => {
    const data = (await db
      .getAll(titleDescriptionDistributionSelect)
      .catch((e) => {
        throw e;
      })) as TitleDescriptionDistribution[];

    data.forEach((item) => {
      let dataTypesByFileExtension: string[] = [];
      if (
        item.distribution &&
        typeof item.distribution === "object" &&
        Array.isArray(item.distribution)
      ) {
        item.distribution.forEach((dist) => {
          if (typeof dist === "object" && !Array.isArray(dist)) {
            const distributionObject = dist as Prisma.JsonObject;
            let distUrl =
              distributionObject["downloadURL"] ||
              distributionObject["accessURL"] ||
              "";

            let fileExtension;

            if (typeof distUrl === "string") {
              fileExtension = getFileExtension(distUrl);
            }

            typeof fileExtension === "string" &&
              dataTypesByFileExtension.push(fileExtension);
          }
        });
      }
      item.dataTypesByFileExtension = dataTypesByFileExtension;
    });

    const dataReplyVal: FinalDataReplyType[] = data.map((item) => {
      const { ["distribution"]: remove, ...rest } = item;
      return rest;
    });

    const returnVal: FinalFullReplyType = {
      data: dataReplyVal,
      originalJsonDataUrl:
        DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_ENERGY]
          .originalJsonDataUrl,
      originalIntialUrl:
        DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_ENERGY]
          .originalInitialUrl,
    };

    return returnVal;
  };

export const getFullDataForItem = async (id: string) => {
  const item = await db.getById(id).catch((e) => {
    throw e;
  });
  return item;
};

import {
  PrismaClient,
  Prisma,
  DepartmentOfEnergyDataItem,
} from "@prisma/client";
import {
  DataSources,
  DataSourceMetadataRecord,
  InitialIndexData,
  InitialIndexDataItem,
} from "../types/types-general";
import { dbCatchMethod } from "./db.service";
import { removeAmpersandFromTypeProp } from "../utils/generalUtils";
import { parseDataItemForIndexDataForUSGovData } from "./data-management.service";

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
    data: Prisma.DepartmentOfEnergyDataItemCreateManyInput[],
    skipDuplicates?: boolean
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
  count: async () => {
    const count = await prisma.departmentOfEnergyDataItem
      .count()
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return count;
  },
  deleteMany: async (
    select?: Prisma.DepartmentOfEnergyDataItemDeleteManyArgs
  ) => {
    const deleted = await prisma.departmentOfEnergyDataItem
      .deleteMany(select)
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return deleted;
  },
};

export const addSourceDataToDbService = async (jsonData: {
  dataset: Prisma.DepartmentOfEnergyDataItemCreateManyInput[];
}) => {
  let data = jsonData.dataset;
  data = data && removeAmpersandFromTypeProp(data);
  const result = await db.createMany(data).catch((e) => {
    throw e;
  });
  return result;
  // example of initial idea of writing to files also
  // goes alongside the data-files service
  // @TODO look to remove this and that service eventually

  // const currentDataFile = await getCurrentDataFile(
  //   DataSources.DEPARTMENT_OF_ENERGY
  // ).catch((e) => {
  //   throw e;
  // });
  // if (!currentDataFile) {
  //   throw new Error("No data file found");
  // }
  // const jsonDataBuffer = await fs.promises
  //   .readFile(currentDataFile!)
  //   .catch((e) => {
  //     throw e;
  //   });
  // const bufferDataAsStringified = jsonDataBuffer && jsonDataBuffer.toString();
  // const jsonData =
  //   bufferDataAsStringified && JSON.parse(bufferDataAsStringified);
  // EXAMPLE END
};

/**
 * getall call to db with no selector, returns everything
 */
export const getDepartmentOfEnergyData = async () => {
  const items = await db.getAll().catch((e) => {
    throw e;
  });
  return items;
};

/**
 * setup for getInitialData call below
 * This is the initial data that is used to populate the index page
 * for this data souce
 */
const initialDataSelect =
  Prisma.validator<Prisma.DepartmentOfEnergyDataItemSelect>()({
    id: true,
    title: true,
    description: true,
    distribution: true,
    spatial: true,
  });

type InitialDataPayload = Prisma.DepartmentOfEnergyDataItemGetPayload<{
  select: typeof initialDataSelect;
}>;

export interface DepartmentOfEnergyIndexDataItem extends InitialDataPayload {
  dataTypesByFileExtension?: string[];
}

/**
 *
 * @returns Dept of Energy getAll call to db parsed back as
 * the type: InitialIndexDataItem[] which should be kept
 * common across all data sources
 */
export const getInitialData = async (): Promise<InitialIndexData> => {
  const data = (await db.getAll(initialDataSelect).catch((e) => {
    throw e;
  })) as DepartmentOfEnergyIndexDataItem[];

  let parsedData: InitialIndexDataItem[] = [];

  data.forEach((item) => {
    parsedData.push(parseDataItemForIndexDataForUSGovData(item));
  });

  const returnVal = {
    data: parsedData,
    originalJsonDataUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_ENERGY]
        .originalJsonDataUrl,
    originalIntialUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_ENERGY]
        .originalInitialUrl,
  };

  return returnVal;
};

/**
 *
 * @param id
 * @returns full data for a single item
 */
export const getFullDataForItem = async (
  id: string
): Promise<DepartmentOfEnergyDataItem | never> => {
  const item = await db.getById(id).catch((e) => {
    throw e;
  });
  return item;
};

export const getCount = async () => {
  const count = await db.count().catch((e) => {
    throw e;
  });
  return count;
};

export const emptyTable = async () => {
  const result = db.deleteMany().catch(async (e) => {
    await dbCatchMethod(e);
    throw e;
  });
  await prisma.$disconnect();
  return result;
};

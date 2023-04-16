import {
  PrismaClient,
  Prisma,
  DepartmentOfTreasuryDataItem,
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const prisma = new PrismaClient();

const db = {
  getAll: async (select?: Prisma.DepartmentOfTreasuryDataItemSelect) => {
    const items = await prisma.departmentOfTreasuryDataItem
      .findMany({ select })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return items;
  },
  getById: async (id: string) => {
    const item = await prisma.departmentOfTreasuryDataItem
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
  create: async (data: Prisma.DepartmentOfTreasuryDataItemCreateInput) => {},
  createMany: async (
    data: Prisma.DepartmentOfTreasuryDataItemCreateManyInput[],
    skipDuplicates?: boolean
  ) => {
    const created = await prisma.departmentOfTreasuryDataItem
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
    const count = await prisma.departmentOfTreasuryDataItem
      .count()
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return count;
  },
  deleteMany: async (
    select?: Prisma.DepartmentOfTreasuryDataItemDeleteManyArgs
  ) => {
    const deleted = await prisma.departmentOfTreasuryDataItem
      .deleteMany(select)
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return deleted;
  },
};

export const addSourceDataToDb = async (jsonData: {
  dataset: Prisma.DepartmentOfTreasuryDataItemCreateManyInput[];
}) => {
  let data = jsonData.dataset;
  data = data && removeAmpersandFromTypeProp(data);
  const result = await db.createMany(data).catch((e) => {
    throw e;
  });
  return result;
};

/**
 * getall call to db with no selector, returns everything
 */
export const getDepartmentOfTreasuryData = async () => {
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
  Prisma.validator<Prisma.DepartmentOfTreasuryDataItemSelect>()({
    id: true,
    title: true,
    description: true,
    distribution: true,
  });

type InitialDataPayload = Prisma.DepartmentOfTreasuryDataItemGetPayload<{
  select: typeof initialDataSelect;
}>;

export interface DepartmentOfTreasuryIndexDataItem extends InitialDataPayload {
  dataTypesByFileExtension?: string[];
}

/**
 *
 * @returns Dept of Treasury getAll call to db parsed back as
 * the type: InitialIndexDataItem[] which should be kept
 * common across all data sources
 */
export const getInitialData = async (): Promise<InitialIndexData> => {
  const data = (await db.getAll(initialDataSelect).catch((e) => {
    throw e;
  })) as DepartmentOfTreasuryIndexDataItem[];

  let parsedData: InitialIndexDataItem[] = [];

  data.forEach((item) => {
    parsedData.push(parseDataItemForIndexDataForUSGovData(item));
  });

  const returnVal = {
    data: parsedData,
    originalJsonDataUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_TREASURY]
        .originalJsonDataUrl,
    originalIntialUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_TREASURY]
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
): Promise<DepartmentOfTreasuryDataItem | never> => {
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

export const getAll = async () => {
  const result = await db.getAll().catch(async (e) => {
    await dbCatchMethod(e);
    throw e;
  });
  await prisma.$disconnect();
  return result;
};

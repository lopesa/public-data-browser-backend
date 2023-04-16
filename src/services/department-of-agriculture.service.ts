import {
  PrismaClient,
  Prisma,
  DepartmentOfAgricultureDataItem,
} from "@prisma/client";
import { dbCatchMethod } from "./db.service";
import {
  DataSourceMetadataRecord,
  DataSources,
  InitialIndexData,
  InitialIndexDataItem,
} from "../types/types-general";
import { parseDataItemForIndexDataForUSGovData } from "./data-management.service";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const prisma = new PrismaClient();

const db = {
  getAll: async (select?: Prisma.DepartmentOfAgricultureDataItemSelect) => {
    const items = await prisma.departmentOfAgricultureDataItem
      .findMany({ select })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return items;
  },
  getById: async (id: string) => {
    const item = await prisma.departmentOfAgricultureDataItem
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
  create: async (data: Prisma.DepartmentOfAgricultureDataItemCreateInput) => {
    const created = await prisma.departmentOfAgricultureDataItem
      .create({
        data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return created;
  },
  createMany: async (
    data: Prisma.DepartmentOfAgricultureDataItemCreateInput[]
  ) => {
    const created = await prisma.departmentOfAgricultureDataItem
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
    const count = await prisma.departmentOfAgricultureDataItem
      .count()
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return count;
  },
  deleteMany: async (
    select?: Prisma.DepartmentOfAgricultureDataItemDeleteManyArgs
  ) => {
    const deleted = await prisma.departmentOfAgricultureDataItem
      .deleteMany(select)
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return deleted;
  },
};

const initialDataSelect =
  Prisma.validator<Prisma.DepartmentOfAgricultureDataItemSelect>()({
    id: true,
    title: true,
    description: true,
    distribution: true,
    spatial: true,
  });

type InitialDataPayload = Prisma.DepartmentOfAgricultureDataItemGetPayload<{
  select: typeof initialDataSelect;
}>;

export interface DepartmentOfAgricultureIndexDataItem
  extends InitialDataPayload {
  dataTypesByFileExtension?: string[];
}

export const getInitialData = async (): Promise<InitialIndexData> => {
  const data = (await db.getAll(initialDataSelect).catch((e) => {
    throw e;
  })) as DepartmentOfAgricultureIndexDataItem[];

  let parsedData: InitialIndexDataItem[] = [];

  data.forEach((item) => {
    parsedData.push(parseDataItemForIndexDataForUSGovData(item));
  });

  const returnVal = {
    data: parsedData,
    originalJsonDataUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_AGRICULTURE]
        .originalJsonDataUrl,
    originalIntialUrl:
      DataSourceMetadataRecord[DataSources.DEPARTMENT_OF_AGRICULTURE]
        .originalInitialUrl,
  };

  return returnVal;
};

export const getFullDataForItem = async (
  id: string
): Promise<DepartmentOfAgricultureDataItem | never> => {
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

export const addSourceDataToDbService = async (jsonData: {
  dataset: Prisma.DepartmentOfAgricultureDataItemCreateManyInput[];
}) => {
  const result = await db.createMany(jsonData?.dataset).catch((e) => {
    throw e;
  });
  return result;
};

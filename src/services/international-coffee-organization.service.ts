import {
  InternationalCoffeeOrganizationDataItem,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import ICODataJson from "../data/international-coffee-organization.json";
import {
  DataSourceMetadataRecord,
  DataSources,
  InitialIndexData,
  InitialIndexDataItem,
} from "../types/types-general";
import { dbCatchMethod } from "./db.service";

const prisma = new PrismaClient();

const db = {
  getAll: async (
    select?: Prisma.InternationalCoffeeOrganizationDataItemSelect
  ) => {
    const items = await prisma.internationalCoffeeOrganizationDataItem
      .findMany({ select })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return items;
  },
  getById: async (id: string) => {
    const item = await prisma.internationalCoffeeOrganizationDataItem
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
  createMany: async (
    data: Prisma.InternationalCoffeeOrganizationDataItemCreateManyInput[]
  ) => {
    const created = await prisma.internationalCoffeeOrganizationDataItem
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

// types for getInitialData
const initialDataSelect =
  Prisma.validator<Prisma.InternationalCoffeeOrganizationDataItemSelect>()({
    id: true,
    title: true,
    distribution: true,
  });

type InitialDataPayload =
  Prisma.InternationalCoffeeOrganizationDataItemGetPayload<{
    select: typeof initialDataSelect;
  }>;

export interface InternationalCoffeeOrganizationIndexDataItem
  extends InitialDataPayload {
  dataTypesByFileExtension?: string[];
}

/**
 *
 * @returns initial data for index page
 */
export const getInitialData = async (): Promise<InitialIndexData> => {
  const data = (await db.getAll(initialDataSelect).catch((e) => {
    throw e;
  })) as InternationalCoffeeOrganizationIndexDataItem[];

  data.map((item) => {
    item.dataTypesByFileExtension = ["xlsx"];
    item.title = item.title || "";
  });

  const returnVal = {
    data: data as InitialIndexDataItem[],
    originalJsonDataUrl:
      DataSourceMetadataRecord[DataSources.INTERNATIONAL_COFFEE_ORGANIZATION]
        .originalJsonDataUrl,
    originalIntialUrl:
      DataSourceMetadataRecord[DataSources.INTERNATIONAL_COFFEE_ORGANIZATION]
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
): Promise<InternationalCoffeeOrganizationDataItem | never> => {
  const item = await db.getById(id).catch((e) => {
    throw e;
  });
  return item;
};

/**
 *
 * @returns result of adding data to db
 *
 * admin tool to add data to db.
 */
export const addSourceDataToDbFromFile = async () => {
  if (!ICODataJson) {
    throw new Error("No data found");
  }
  const result = await db.createMany(ICODataJson).catch((e) => {
    throw e || new Error("Error adding data to db");
  });

  if (!result) {
    throw new Error("Error adding data to db");
  }

  return result;
};

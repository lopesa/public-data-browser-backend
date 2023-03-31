import {
  DataSourceModelNames,
  DataSources,
  InitialIndexDataItem,
} from "../types/types-general";
import { DepartmentOfAgricultureIndexDataItem } from "./department-of-agriculture.service";
import { diff_hours, getDataTypesByFileExtension } from "../utils/generalUtils";
import { Prisma } from "@prisma/client";
import {
  getDataSourceByModelName,
  updateDataSourceInfo,
} from "./data-source.service";
import { fetchNewData } from "./data-fetch.service";

/**
 *
 * @param data an array of one of the highest level datatypes
 * @returns fields on the current db table for the datatype that are null for all items in the array
 *
 * used to hlep input data from different sources. I can use a model based on
 * a previous model that is overly inclusive in order to get a new data set
 * into the db and then use this helper to go back and figure which items
 * never get used for the new model and remove these in the Prisma schema
 */
export const checkForNulls = <T>(data: T) => {
  if (typeof data !== "object" || !Array.isArray(data)) {
    throw new Error("Data in checkForNulls must be an array of objects");
  }
  let nulls: any = {};

  data.forEach((item) => {
    for (const key in item) {
      if (item[key as keyof T] === null) {
        if (!(nulls[key] === 2)) {
          nulls[key] = 1;
        }
      } else {
        nulls[key] = 2;
      }
    }
  });
  const finalNullFields = Object.keys(nulls).filter((key) => nulls[key] === 1);
  return finalNullFields;
};

export const parseDataItemForIndexDataForUSGovData = (
  item: DepartmentOfAgricultureIndexDataItem
) => {
  let newData = {} as InitialIndexDataItem;
  newData.id = item.id;
  newData.title = item.title ? item.title : "";
  const dataTypesByFileExtension = getDataTypesByFileExtension(
    item.distribution
  );
  dataTypesByFileExtension.length > 0 &&
    (newData.dataTypesByFileExtension = dataTypesByFileExtension);
  item.description && (newData.description = item.description);
  item.spatial && (newData.spatialData = Boolean(item.spatial));
  newData.apiData = false;
  return newData;
};

export interface AddOrReplaceDbDataParams {
  staleTime?: number;
  modelName: DataSourceModelNames;
  getCountMethod: () => Promise<number>;
  dataSource: DataSources;
  emptyTableMethod: () => Promise<Prisma.BatchPayload>;
  addSourceDataToDbMethod: (jsonData: {
    dataset: Prisma.DepartmentOfEnergyDataItemCreateManyInput[];
  }) => Promise<Prisma.BatchPayload>;
}

export const addOrReplaceDbData = async (params: AddOrReplaceDbDataParams) => {
  const {
    staleTime = 336,
    getCountMethod,
    dataSource,
    emptyTableMethod,
    addSourceDataToDbMethod,
    modelName,
  } = params;
  const currentDataSourceDataInfo = await getDataSourceByModelName(
    modelName
  ).catch((e) => {
    throw e || new Error("Error fetching DataSource data from db");
  });

  const hoursSinceLastUpdate =
    currentDataSourceDataInfo &&
    diff_hours(currentDataSourceDataInfo.updatedAt.valueOf(), Date.now());

  if (
    currentDataSourceDataInfo &&
    hoursSinceLastUpdate !== null &&
    hoursSinceLastUpdate < staleTime
  ) {
    return "data not updated - not needed, still fresh";
  }

  const count = await getCountMethod().catch((e) => {
    throw e || new Error("Error fetching Count for Dept of Energy from db");
  });

  const sourceData = await fetchNewData(dataSource).catch((e) => {
    throw e;
  });
  if (!sourceData) {
    throw new Error("No data retrieved from source");
  }

  if (count > 0) {
    if (sourceData.length < count * 0.9) {
      // warn before continuing
    }
    //@TODO save old data to file to enable undo
    const deleted = await emptyTableMethod().catch((e) => {
      throw e || new Error("Error deleting data from db");
    });
    if (deleted?.count !== count) {
      throw new Error("Error deleting data from db");
    }
  }

  const added = await addSourceDataToDbMethod(sourceData).catch((e) => {
    throw e || new Error("Error adding data to db");
  });
  if (!(added?.count > 0)) {
    throw new Error("Error adding data to db");
  }

  const updated = await updateDataSourceInfo(modelName).catch((e) => {
    throw e || new Error("Error updating DataSource data in db");
  });

  return "data updated";
};

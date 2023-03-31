import express from "express";
import {
  getInitialData,
  getFullDataForItem,
  getCount,
  emptyTable,
  addSourceDataToDbService,
} from "../services/department-of-agriculture.service";
import validator from "validator";
import { DataSources, InitialIndexData } from "../types/types-general";
import {
  AddOrReplaceDbDataParams,
  addOrReplaceDbData as addOrReplaceDbDataService,
} from "../services/data-management.service";

export const getInitialDepartmentOfAgricultureData =
  async (): Promise<InitialIndexData> => {
    const data = await getInitialData().catch((e) => {
      throw e;
    });
    return data;
  };

export const getDepartmentOfAgricultureDataItem = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  if (!validator.isUUID(id)) {
    throw new Error("Invalid ID");
  } else {
    const data = await getFullDataForItem(id).catch((e) => {
      throw e || new Error("Error fetching data from db");
    });
    return data;
  }
};

export const addOrReplaceDbData = async (staleTime?: number) => {
  const params: AddOrReplaceDbDataParams = {
    modelName: "DepartmentOfAgricultureDataItem",
    getCountMethod: getCount,
    dataSource: DataSources.DEPARTMENT_OF_AGRICULTURE,
    emptyTableMethod: emptyTable,
    addSourceDataToDbMethod: addSourceDataToDbService,
  };
  if (staleTime !== undefined) {
    params.staleTime = staleTime;
  }
  const result = await addOrReplaceDbDataService(params).catch((e) => {
    throw e;
  });
  return result;
};

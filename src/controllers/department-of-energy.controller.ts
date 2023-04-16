import express from "express";
import { DataSources } from "../types/types-general";
import {
  addSourceDataToDbService,
  emptyTable,
  getCount,
  getFullDataForItem,
  getInitialData,
} from "../services/department-of-energy.service";
import validator from "validator";
import {
  AddOrReplaceDbDataParams,
  addOrReplaceDbData as addOrReplaceDbDataService,
} from "../services/data-management.service";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const getInitialDepartmentOfEnergyData = async () => {
  const data = await getInitialData().catch((e) => {
    throw e;
  });
  return data;
};

export const getDepartmentOfEnergyDataItem = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  if (!validator.isUUID(id)) {
    throw new Error("Invalid ID");
  }
  const data = await getFullDataForItem(id).catch((e) => {
    throw e || new Error("Error fetching data from db");
  });
  return data;
};

export const addOrReplaceDbData = async (staleTime?: number) => {
  const params: AddOrReplaceDbDataParams = {
    modelName: "DepartmentOfEnergyDataItem",
    getCountMethod: getCount,
    dataSource: DataSources.DEPARTMENT_OF_ENERGY,
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

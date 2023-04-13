import express from "express";
import { DataSources } from "../types/types-general";
import {
  addSourceDataToDbService,
  emptyTable,
  getAll,
  getCount,
  getFullDataForItem,
  getInitialData,
} from "../services/department-of-treasury.service";
import validator from "validator";
import {
  AddOrReplaceDbDataParams,
  addOrReplaceDbData as addOrReplaceDbDataService,
  checkForNulls,
} from "../services/data-management.service";
import { DepartmentOfTreasuryDataItem } from "@prisma/client";

export const getInitialDepartmentOfTreasuryData = async () => {
  const data = await getInitialData().catch((e) => {
    throw e;
  });
  return data;
};

export const getDepartmentOfTreasuryDataItem = async (
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
    modelName: "DepartmentOfTreasuryDataItem",
    getCountMethod: getCount,
    dataSource: DataSources.DEPARTMENT_OF_TREASURY,
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

export const checkTableForNulls = async (
  req: express.Request,
  res: express.Response
) => {
  const data = (await getAll().catch((e) => {
    throw e;
  })) as DepartmentOfTreasuryDataItem[];

  try {
    const nulls = checkForNulls(data);
    return nulls;
  } catch (e) {
    throw e;
  }
};

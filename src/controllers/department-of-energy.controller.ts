import express from "express";
import { DataSources } from "../types/types-general";
import {
  addSourceDataToDbService,
  emptyTable,
  getCount,
  getDepartmentOfEnergyData,
  getFullDataForItem,
  getInitialData,
} from "../services/department-of-energy.service";
import { DepartmentOfEnergyDataItem } from "@prisma/client";
import validator from "validator";
import { checkForNulls } from "../services/data-management.service";
import {
  getDataSourceByModelName,
  updateDataSourceInfo,
} from "../services/data-source.service";
import { diff_hours } from "../utils/generalUtils";
import {
  AddOrReplaceDbDataParams,
  addOrReplaceDbData as addOrReplaceDbDataService,
} from "../services/data-management.service";

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

// export const getNewDepartmentOfEnergyDataFromSource = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   const data = await fetchNewData(DataSources.DEPARTMENT_OF_ENERGY).catch(
//     (e) => {
//       throw e;
//     }
//   );
//   return data;
// };

// export const addSourceDataToDb = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   const added = await addSourceDataToDbService().catch((e) => {
//     throw e;
//   });
//   if (!added) {
//     throw new Error("No data added");
//   }
//   const data = await getDepartmentOfEnergyData().catch((e) => {
//     throw e;
//   });
//   return data;
// };

// export const getAllDepartmentOfEnergyData = async (
// export const checkTableForNulls = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   const data = (await getDepartmentOfEnergyData().catch((e) => {
//     throw e;
//   })) as DepartmentOfEnergyDataItem[];

//   try {
//     const nulls = checkForNulls(data);
//     return nulls;
//   } catch (e) {
//     throw e;
//   }
// };

import express from "express";
import { DataSources } from "../types/types-general";
import { fetchNewData } from "../services/data-fetch.service";
import {
  addSourceDataToDbService,
  getDepartmentOfEnergyData,
  getFullDataForItem,
  getInitialData,
} from "../services/department-of-energy.service";
import { DepartmentOfEnergyDataItem } from "@prisma/client";
import validator from "validator";
import { checkForNulls } from "../services/data-management.service";

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

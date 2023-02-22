import express from "express";
import { DataSources } from "../types/types-general";
import { fetchNewData } from "../services/data-fetch.service";

export const getDepartmentOfEnergyData = async (
  req: express.Request,
  res: express.Response
) => {};

export const getNewDepartmentOfEnergyDataFromSource = async (
  req: express.Request,
  res: express.Response
) => {
  const data = await fetchNewData(DataSources.DEPARTMENT_OF_ENERGY).catch(
    (e) => {
      throw e;
    }
  );
  return data;
};

import express from "express";
import {
  addSourceDataToDbFromFile,
  getFullDataForItem,
  getInitialData,
} from "../services/international-coffee-organization.service";
import validator from "validator";

export const getInitialInternationalCoffeeOrganizationData = async () => {
  const data = await getInitialData().catch((e) => {
    throw e || new Error("Error fetching data from db");
  });
  return data;
};

export const getInternationalCoffeeOrganizationDataItem = async (
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

export const addICODataToDb = async (
  req: express.Request,
  res: express.Response
) => {
  const result = await addSourceDataToDbFromFile().catch((e) => {
    throw e || new Error("Error adding data to db");
  });
  if (!(result?.count > 0)) {
    throw new Error("Error adding data to db");
  }
  return result;
};

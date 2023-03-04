import { DepartmentOfAgricultureDataItem } from "@prisma/client";
import express from "express";
import fs from "fs";
import { checkForNulls } from "../services/data-management.service";
import {
  db,
  getShouldFetchNewData,
  fetchNewData,
  getCurrentDataFile,
  getTitleAndDescriptionData,
  getFullDataForItem,
  getDepartmentOfAgricultureData,
} from "../services/department-of-agriculture.service";
import validator from "validator";

export const getInitialDepartmentOfAgricultureData = async (
  req: express.Request,
  res: express.Response
) => {
  const data = await getTitleAndDescriptionData().catch((e) => {
    throw e;
    // return res.status(500).send(e.message || "Error fetching data");
  });
  return data;
  // return res.status(200).json(data);
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

export const checkTableForNulls = async (
  req: express.Request,
  res: express.Response
) => {
  const data = (await getDepartmentOfAgricultureData().catch((e) => {
    throw e;
  })) as DepartmentOfAgricultureDataItem[];

  try {
    const nulls = checkForNulls(data);
    return nulls;
  } catch (e) {
    throw e;
  }
};

// export const testPushDataToDb = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   // const currentDataFile = await getCurrentDataFile().catch((e) => {
//   //   res.status(500).send(e.message || "Error fetching data");
//   // });

//   // if (!currentDataFile) {
//   //   res.status(500).send("Error fetching data");
//   // }

//   // const jsonDataBuffer = await fs.promises
//   //   .readFile(currentDataFile!)
//   //   .catch((e) => {
//   //     res.status(500).send(e.message || "Error fetching data");
//   //   });

//   // const stringifiedData = jsonDataBuffer && jsonDataBuffer.toString();
//   // const jsonData = stringifiedData && JSON.parse(stringifiedData);
//   // const longestDescription = jsonData?.dataset.reduce(
//   //   (acc: number, curr: any) => {
//   //     return curr.description.length > acc ? curr.description.length : acc;
//   //   },
//   //   0
//   // );
//   // const testChunk = jsonData?.dataset.slice(0, 50);
//   // const result = await db.createMany(jsonData.dataset).catch((e) => {
//   //   res.status(200).json(e.message);
//   // });
//   const all = await db.getAll().catch((e) => {
//     res.status(200).json(e.message);
//   });

//   return res.status(200).json(all);
// };

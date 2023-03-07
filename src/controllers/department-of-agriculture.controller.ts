import express from "express";
import {
  getInitialData,
  getFullDataForItem,
} from "../services/department-of-agriculture.service";
import validator from "validator";
import { InitialIndexData } from "../types/types-general";

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

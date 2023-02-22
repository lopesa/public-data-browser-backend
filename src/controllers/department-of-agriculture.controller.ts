import express from "express";
import fs from "fs";
import {
  db,
  getShouldFetchNewData,
  fetchNewData,
  getCurrentDataFile,
  getTitleAndDescriptionData,
  getFullDataForItem,
} from "../services/department-of-agriculture.service";

const getDepartmentOfAgricultureData = async (
  req: express.Request,
  res: express.Response
) => {
  const data = await getTitleAndDescriptionData().catch((e) => {
    return res.status(500).send(e.message || "Error fetching data");
  });
  return res.status(200).json(data);
};

export const getDepartmentOfAgricultureDataItem = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Missing id");
  }
  const data = await getFullDataForItem(id).catch((e) => {
    return res.status(500).send(e.message || "Error fetching data");
  });
  return res.status(200).json(data);
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

export default getDepartmentOfAgricultureData;

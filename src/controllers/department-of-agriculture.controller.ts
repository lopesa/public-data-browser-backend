import express from "express";
import fs from "fs";
import {
  db,
  getShouldFetchNewData,
  fetchNewData,
  getCurrentDataFile,
} from "../services/department-of-agriculture.service";

const getDepartmentOfAgricultureData = async (
  req: express.Request,
  res: express.Response,
  next?: express.NextFunction
) => {
  const shouldFetchNewData = await getShouldFetchNewData().catch((e) => {
    res.status(500).send("Error fetching data");
  });
  if (shouldFetchNewData) {
    await fetchNewData().catch((e) => {
      res.status(500).send(e.message || "Error fetching data");
    });
  }
  const currentDataFile = await getCurrentDataFile().catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
  if (!currentDataFile) {
    res.status(500).send("Error fetching data");
  }

  const jsonDataBuffer = await fs.promises
    .readFile(currentDataFile!)
    .catch((e) => {
      res.status(500).send(e.message || "Error fetching data");
    });

  const stringData = jsonDataBuffer && jsonDataBuffer.toString();

  return !!stringData
    ? res.status(200).send(stringData)
    : res.status(500).send("Error fetching data");
};

export const testPushDataToDb = async (
  req: express.Request,
  res: express.Response
) => {
  const currentDataFile = await getCurrentDataFile().catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });

  if (!currentDataFile) {
    res.status(500).send("Error fetching data");
  }

  const jsonDataBuffer = await fs.promises
    .readFile(currentDataFile!)
    .catch((e) => {
      res.status(500).send(e.message || "Error fetching data");
    });

  const stringifiedData = jsonDataBuffer && jsonDataBuffer.toString();
  const jsonData = stringifiedData && JSON.parse(stringifiedData);
  const testChunk = jsonData?.dataset.slice(0, 2);
  // const result = await db.add(testChunk).catch((e) => {}
  // const result = await db
  //   .create({
  //     title: "DepartmentOfAgricultureDataItem TEST400",
  //     // description: "18testurl",
  //   })
  //   .catch((e) => {
  //     debugger;
  //   });
  // debugger;
  const result = await db.createMany(testChunk).catch((e) => {
    debugger;
    // @TODO: handle error
  });
  const all = await db.getAll();

  return res.status(200).json(all);
};

export default getDepartmentOfAgricultureData;

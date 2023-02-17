import express from "express";
import fs from "fs";
import {
  getShouldFetchNewData,
  fetchNewData,
  getCurrentDataFile,
} from "../services/department-of-agriculture.service";
import { dbGet, dbUpdate } from "../services/db.service";

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

  // db test
  //   const stringData2 = JSON.stringify({
  //     data: {
  //       data: "data",
  //       test: "testnewFeb16NEWNEW",
  //     },
  //   });
  //   const currentRecordArray = await dbGet("data-sources", {
  //     name: "Department of Agriculture",
  //   });

  //   const currentRecord = currentRecordArray[0];

  //   if (stringData2) {
  //     const record = await dbUpdate("data-sources", currentRecord.id, {
  //       "date-of-last-update": new Date(),
  //       data: stringData2,
  //     }).catch(e => {});
  //   }

  return !!stringData
    ? res.status(200).send(stringData)
    : res.status(500).send("Error fetching data");
};

export default getDepartmentOfAgricultureData;

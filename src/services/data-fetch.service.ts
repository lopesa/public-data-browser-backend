import {
  getCurrentDataFile,
  writeSourceDataFileWithTimeStamp,
} from "./data-files.service";
import fs from "fs";
import {
  DataSources,
  DataSourceMetadataRecord,
  DataSourceModelNames,
} from "../types/types-general";
import { diff_hours } from "../utils/generalUtils";
import {
  getDataSourceByModelName,
  updateDataSourceInfo,
} from "./data-source.service";
import { Prisma } from "@prisma/client";

export const fetchNewData = async (dataSource: DataSources) => {
  // console.log("~~~~~ fetching new data");
  const fetchedData = await fetch(
    DataSourceMetadataRecord[dataSource].originalJsonDataUrl
  ).catch((e) => {
    throw e;
  });
  if (!fetchedData?.ok) {
    throw new Error("Error fetching data from source");
  }

  // const currentDataFile = await getCurrentDataFile(dataSource).catch((e) => {
  //   console.log("~~~~ couldn't get current data file to delete it");
  //   // throw e;
  // });

  // if (currentDataFile) {
  //   fs.rmSync(currentDataFile, {
  //     force: true,
  //   });
  // }

  const fetchedDataJson = await fetchedData.json();
  return fetchedDataJson;
  // const stringified = JSON.stringify(fetchedDataJson);

  // await writeSourceDataFileWithTimeStamp(dataSource, stringified).catch((e) => {
  //   throw e;
  // });
};

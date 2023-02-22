import {
  getCurrentDataFile,
  writeSourceDataFileWithTimeStamp,
} from "./data-files.service";
import fs from "fs";
import { DataSources } from "../types/types-general";

enum DataSourceUrls {
  DOA_BASE_JSON_DATA_URL = "https://www.usda.gov/sites/default/files/documents/data.json",
  DEPARTMENT_OF_ENERGY_BASE_DATA_URL = "https://www.energy.gov/sites/default/files/2023-01/pdl010123.json",
}

const dataSourceUrlsRecord: Record<DataSources, DataSourceUrls> = {
  [DataSources.DEPARTMENT_OF_AGRICULTURE]:
    DataSourceUrls.DOA_BASE_JSON_DATA_URL,
  [DataSources.DEPARTMENT_OF_ENERGY]:
    DataSourceUrls.DEPARTMENT_OF_ENERGY_BASE_DATA_URL,
};

export const fetchNewData = async (dataSource: DataSources) => {
  console.log("~~~~~ fetching new data");

  const test = dataSourceUrlsRecord[dataSource];
  debugger;

  const fetchedData = await fetch(dataSourceUrlsRecord[dataSource]).catch(
    (e) => {
      throw e;
    }
  );
  if (!fetchedData?.ok) {
    throw new Error("Error fetching data from source");
  }

  const currentDataFile = await getCurrentDataFile(dataSource).catch((e) => {
    console.log("~~~~ couldn't get current data file to delete it");
    // throw e;
  });

  if (currentDataFile) {
    fs.rmSync(currentDataFile, {
      force: true,
    });
  }

  const fetchedDataJson = await fetchedData.json();
  const stringified = JSON.stringify(fetchedDataJson);

  await writeSourceDataFileWithTimeStamp(dataSource, stringified).catch((e) => {
    throw e;
  });
};

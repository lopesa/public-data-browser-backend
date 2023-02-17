import fs from "fs";
import { diff_hours } from "../utils/generalUtils";
const BASE_DIR = "dist";
const BASE_FOLDER = "json_data_external_sources";
const BASE_JSON_FILE_NAME = "DEPARTMENT_OF_AGRICULTURE_BASE_DATA_";
const MAX_HOURS_BEFORE_REFETCH = 24;
const DOA_BASE_JSON_DATA_URL =
  "https://www.usda.gov/sites/default/files/documents/data.json";

export const getCurrentDataFile = async () => {
  const currentDataFiles = await fs.promises
    .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
    .catch((e) => {
      throw e;
    });
  const currentDataFile = currentDataFiles.find((dataFileName) => {
    return dataFileName.includes(BASE_JSON_FILE_NAME);
  });
  return `./${BASE_DIR}/${BASE_FOLDER}/${currentDataFile}`;
};

export const getShouldFetchNewData = async () => {
  const currentDataFileFolderExists = !!(await fs.promises
    .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
    .catch((e) => {
      return false;
    }));

  if (!currentDataFileFolderExists) {
    await fs.promises.mkdir(`./${BASE_DIR}/${BASE_FOLDER}`);
    return true;
  }

  const currentDataFile = await getCurrentDataFile().catch((e) => {
    throw e;
  });

  if (!currentDataFile) {
    return true;
  }
  const lastDownloadDate = Number(
    currentDataFile.slice(
      currentDataFile.lastIndexOf("_") + 1,
      currentDataFile.lastIndexOf(".")
    )
  );
  const todaysDate = Date.now();

  return diff_hours(lastDownloadDate, todaysDate) > MAX_HOURS_BEFORE_REFETCH;
};

export const fetchNewData = async () => {
  console.log("~~~~~ fetching new data");
  const doaBaseJsonData = await fetch(DOA_BASE_JSON_DATA_URL).catch((e) => {
    throw e;
  });
  if (!doaBaseJsonData?.ok) {
    throw new Error("Error fetching data from source");
  }

  const currentDataFile = await getCurrentDataFile().catch((e) => {
    console.log("~~~~ couldn't get current data file to delete it");
    // throw e;
  });

  if (currentDataFile) {
    fs.rmSync(currentDataFile, {
      force: true,
    });
  }

  const doaJson = await doaBaseJsonData.json();
  const stringified = JSON.stringify(doaJson);

  await fs.promises
    .writeFile(
      `./${BASE_DIR}/${BASE_FOLDER}/${BASE_JSON_FILE_NAME}${Date.now()}.json`,
      stringified
    )
    .catch((e) => {
      throw e;
    });
};
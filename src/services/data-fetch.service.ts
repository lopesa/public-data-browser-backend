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

/**
 * not used any more, relocated to this service for convenience
 * this isn't where it was when it was workikng
 */
// export const getShouldFetchNewData = async () => {
//   const currentDataFileFolderExists = !!(await fs.promises
//     .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
//     .catch((e) => {
//       return false;
//     }));

//   if (!currentDataFileFolderExists) {
//     await fs.promises.mkdir(`./${BASE_DIR}/${BASE_FOLDER}`);
//     return true;
//   }

//   const currentDataFile = await getCurrentDataFile().catch((e) => {
//     throw e;
//   });

//   if (!currentDataFile) {
//     return true;
//   }
//   const lastDownloadDate = Number(
//     currentDataFile.slice(
//       currentDataFile.lastIndexOf("_") + 1,
//       currentDataFile.lastIndexOf(".")
//     )
//   );
//   const todaysDate = Date.now();

//   return diff_hours(lastDownloadDate, todaysDate) > MAX_HOURS_BEFORE_REFETCH;
// };

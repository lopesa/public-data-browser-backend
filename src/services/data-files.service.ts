import fs from "fs";
const BASE_DIR = "dist";
const BASE_FOLDER = "json_data_external_sources";
import { DataSources } from "../types/types-general";

enum DataFileBaseNames {
  DEPARTMENT_OF_AGRICULTURE_BASE_DATA_ = "DEPARTMENT_OF_AGRICULTURE_BASE_DATA_",
  DEPARTMENT_OF_ENERGY_BASE_DATA_ = "DEPARTMENT_OF_ENERGY_BASE_DATA_",
}

const dataFileBaseNamesRecord: Record<DataSources, DataFileBaseNames> = {
  [DataSources.DEPARTMENT_OF_AGRICULTURE]:
    DataFileBaseNames.DEPARTMENT_OF_AGRICULTURE_BASE_DATA_,
  [DataSources.DEPARTMENT_OF_ENERGY]:
    DataFileBaseNames.DEPARTMENT_OF_ENERGY_BASE_DATA_,
};

export const getCurrentDataFile = async (dataSource: DataSources) => {
  const currentDataFiles = await fs.promises
    .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
    .catch((e) => {
      throw e;
    });
  const currentDataFile = currentDataFiles.find((dataFileName) => {
    return dataFileName.includes(dataFileBaseNamesRecord[dataSource]);
  });
  return `./${BASE_DIR}/${BASE_FOLDER}/${currentDataFile}`;
};

export const writeSourceDataFileWithTimeStamp = async (
  dataSource: DataSources,
  data: string
) => {
  await fs.promises
    .writeFile(
      `./${BASE_DIR}/${BASE_FOLDER}/${
        dataFileBaseNamesRecord[dataSource]
      }${Date.now()}.json`,
      data
    )
    .catch((e) => {
      throw e;
    });
};

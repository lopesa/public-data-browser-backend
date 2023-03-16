import { Prisma } from "@prisma/client";
import { getFullDataForItem as departmentOfAgricultureGetFullDataForItem } from "../services/department-of-agriculture.service";
import { getFullDataForItem as departmentOfEnergyGetFullDataForItem } from "../services/department-of-energy.service";
import {
  DepartmentOfAgricultureDataItem,
  DepartmentOfEnergyDataItem,
} from "@prisma/client";

export enum DataSources {
  DEPARTMENT_OF_AGRICULTURE,
  DEPARTMENT_OF_ENERGY,
}

type DatasourceMetadata = {
  originalJsonDataUrl: string;
  originalInitialUrl: string;
};

export const DataSourceMetadataRecord: Record<DataSources, DatasourceMetadata> =
  {
    [DataSources.DEPARTMENT_OF_AGRICULTURE]: {
      originalJsonDataUrl:
        "https://www.usda.gov/sites/default/files/documents/data.json",
      originalInitialUrl: "https://data.gov/metrics.html",
    },
    [DataSources.DEPARTMENT_OF_ENERGY]: {
      originalJsonDataUrl:
        "https://www.energy.gov/sites/default/files/2023-01/pdl010123.json",
      originalInitialUrl: "https://data.gov/metrics.html",
    },
  };

export type InitialIndexDataItem = {
  id: string;
  title: string;
  dataTypesByFileExtension?: string[];
  description?: string;
  spatialData?: boolean;
  apiData?: boolean;
};

export type InitialIndexData = {
  data: InitialIndexDataItem[];
  originalJsonDataUrl: string;
  originalIntialUrl: string;
};

export type BookmarkKey = {
  dataItemUuid: string;
  datasetId: DatasetKeys;
};

export const enum DatasetKeys {
  departmentOfAgriculture = "departmentOfAgriculture",
  departmentOfEnergy = "departmentOfEnergy",
}

export type DatasetGetFullDataMethod =
  | typeof departmentOfAgricultureGetFullDataForItem
  | typeof departmentOfEnergyGetFullDataForItem;

export type AllDataTypes =
  | DepartmentOfAgricultureDataItem
  | DepartmentOfEnergyDataItem;

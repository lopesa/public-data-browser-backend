import { Prisma } from "@prisma/client";
import { getFullDataForItem as departmentOfAgricultureGetFullDataForItem } from "../services/department-of-agriculture.service";
import { getFullDataForItem as departmentOfEnergyGetFullDataForItem } from "../services/department-of-energy.service";
import {
  DepartmentOfAgricultureDataItem,
  DepartmentOfEnergyDataItem,
} from "@prisma/client";
import icoDataJson from "../data/international-coffee-organization.json";

export enum DataSources {
  DEPARTMENT_OF_AGRICULTURE,
  DEPARTMENT_OF_ENERGY,
  DEPARTMENT_OF_TREASURY,
  INTERNATIONAL_COFFEE_ORGANIZATION,
}

type DatasourceMetadata = {
  originalJsonData?: Array<object>;
  originalJsonDataUrl: string;
  originalInitialUrl: string;
};

export type DataSourceModelNames =
  | "DepartmentOfAgricultureDataItem"
  | "DepartmentOfEnergyDataItem"
  | "DepartmentOfTreasuryDataItem"
  | "InternationalCoffeeOrganizationDataItem";

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
    [DataSources.DEPARTMENT_OF_TREASURY]: {
      originalJsonDataUrl: "http://www.treasury.gov/data.json",
      originalInitialUrl:
        "https://catalog.data.gov/harvest/about/treasury-json",
    },
    [DataSources.INTERNATIONAL_COFFEE_ORGANIZATION]: {
      originalJsonData: icoDataJson,
      originalJsonDataUrl: "https://www.ico.org/new_historical.asp",
      originalInitialUrl: "https://www.ico.org/new_historical.asp",
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

export type BookmarkInputCandidate = {
  originalSource: string;
  originalId: string;
};

export const enum DatasetKeys {
  departmentOfAgriculture = "departmentOfAgriculture",
  departmentOfEnergy = "departmentOfEnergy",
}

export type DatasetGetFullDataMethod =
  | typeof departmentOfAgricultureGetFullDataForItem
  | typeof departmentOfEnergyGetFullDataForItem;

export type AllDataTypesIntersection = DepartmentOfAgricultureDataItem &
  DepartmentOfEnergyDataItem;

export type AllDataTypesUnion =
  | DepartmentOfAgricultureDataItem
  | DepartmentOfEnergyDataItem;

export type JwtTokenUser = {
  _id: string;
  email: string;
};

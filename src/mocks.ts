import {
  DepartmentOfAgricultureDataItem,
  DepartmentOfEnergyDataItem,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { InitialIndexData } from "./types/types-general";

type US_GOV_TYPES =
  | DepartmentOfAgricultureDataItem
  | DepartmentOfEnergyDataItem;
export const mockUSGovernmentInitialDataItem = {
  id: uuidv4(),
  createdAt: new Date(),
  updatedAt: new Date(),
  identifier: null,
  accessLevel: null,
  contactPoint: null,
  programCode: null,
  description: null,
  title: null,
  distribution: null,
  license: null,
  bureauCode: null,
  modified: null,
  publisher: null,
  accrualPeriodicity: null,
  keyword: null,
  deletedAt: null,
  describedBy: null,
  issued: null,
  language: null,
  rights: null,
  spatial: null,
  dataQuality: null,
  describedByType: null,
  landingPage: null,
  references: null,
  theme: null,
  systemOfRecords: null,
  isPartOf: null,
};

export const mockUSGovernmentInitialData: InitialIndexData = {
  data: [
    {
      id: uuidv4(),
      title: "title",
      // dataTypesByFileExtension: [],
      // description: "description",
    },
  ],
  originalJsonDataUrl: "https://www.invalidurl",
  originalIntialUrl: "https://www.invalidurl",
};

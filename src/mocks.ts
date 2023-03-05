import { DepartmentOfAgricultureDataItem } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { USGovernmentInitialDataItem } from "./types/types-general";

export const mockDepartmentOfAgricultureDataItem: DepartmentOfAgricultureDataItem =
  {
    id: "mockId",
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

export const mockUSGovernmentInitialDataItem: USGovernmentInitialDataItem = {
  data: [
    {
      dataTypesByFileExtension: undefined,
      id: uuidv4(),
      description: "description",
      title: "title",
      spatial: null,
    },
  ],
  originalJsonDataUrl: "https://www.invalidurl",
  originalIntialUrl: undefined,
};

//   export type USGovernmentInitialDataItem = {
//     data: {
//       dataTypesByFileExtension?: string[] | undefined;
//       id: string;
//       description: string | null;
//       title: string | null;
//       spatial: string | null;
//   }[];
//   originalJsonDataUrl: string;
//   originalIntialUrl: string | undefined;
// };

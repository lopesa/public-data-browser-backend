export enum DataSources {
  DEPARTMENT_OF_AGRICULTURE,
  DEPARTMENT_OF_ENERGY,
}

type DatasourceMetadata = {
  originalJsonDataUrl: string;
  originalInitialUrl?: string;
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

export type USGovernmentInitialDataItem = {
  data: {
    dataTypesByFileExtension?: string[] | undefined;
    id: string;
    description: string | null;
    title: string | null;
    spatial: string | null;
  }[];
  originalJsonDataUrl: string;
  originalIntialUrl: string | undefined;
};

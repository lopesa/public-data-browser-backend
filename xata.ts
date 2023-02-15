// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "data-sources",
    columns: [
      { name: "name", type: "string", unique: true },
      { name: "date-of-last-update", type: "datetime" },
      { name: "data", type: "text" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type DataSources = InferredTypes["data-sources"];
export type DataSourcesRecord = DataSources & XataRecord;

export type DatabaseSchema = {
  "data-sources": DataSourcesRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Tony-Lopes-s-workspace-hk8d1k.us-east-1.xata.sh/db/public-data-browser",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};

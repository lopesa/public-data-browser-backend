import { getXataClient } from "../configs/xata-custom-config";
import { DatabaseSchema } from "../configs/xata";

const xata = getXataClient();

export const dbGet = async (table: keyof DatabaseSchema, filter: {}) => {
  const rows = await xata.db[table].filter(filter).getMany();
  return rows;
};

export const dbUpdate = async (
  table: keyof DatabaseSchema,
  id: string,
  data: {}
) => {
  const record = await xata.db[table].update(id, data).catch((e) => {
    console.log("~~~~~ error updating record", e);
  });
  return record;
};

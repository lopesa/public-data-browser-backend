import { XataClient } from "./xata";
import * as dotenv from "dotenv";
dotenv.config();

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient({ apiKey: process.env.XATA_API_KEY });
  return instance;
};

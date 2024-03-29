import { Prisma } from "@prisma/client";
import fs from "fs";

export const diff_hours = (dt2: number, dt1: number) => {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

export const getFileExtension = (filename: string) => {
  // return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  if (!filename.includes(".")) {
    return -1;
  }
  const lastDotIndex = filename.lastIndexOf(".");
  const length = filename.length;
  if (length - lastDotIndex > 5) {
    return -1;
  }
  return (
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) || -1
  );
};

export const getDataTypesByFileExtension = (distribution: any) => {
  if (typeof distribution !== "object" || !Array.isArray(distribution)) {
    return [];
  }

  let dataTypesByFileExtension: string[] = [];
  distribution.forEach((dist) => {
    if (typeof dist === "object" && !Array.isArray(dist)) {
      const distributionObject = dist;
      let distUrl =
        distributionObject["downloadURL"] ||
        distributionObject["accessURL"] ||
        "";

      let fileExtension;

      if (typeof distUrl === "string") {
        fileExtension = getFileExtension(distUrl);
      }

      typeof fileExtension === "string" &&
        dataTypesByFileExtension.push(fileExtension);
    }
  });
  return dataTypesByFileExtension;
};

export const removeAmpersandFromTypeProp = (
  dataset: { [key: string]: any }[]
) => {
  return dataset?.map((item: any) => {
    let returnVal = {
      ...item,
      type: item["@type"],
    };
    delete returnVal["@type"];
    return returnVal;
  });
};

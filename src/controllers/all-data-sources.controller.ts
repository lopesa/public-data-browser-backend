import express from "express";
import PapaParse from "papaparse";
import validator from "validator";
import { getFileExtension } from "../utils/generalUtils";
// import https from "https";
// import http from "http";

export const getSpreadsheetData = async (
  req: express.Request,
  res: express.Response
) => {
  const DEFAULT_RETURN_AMOUNT = 100;
  const url = req.params.url;
  const returnAmount = Number(req.query.returnAmount);
  const fileExtension = getFileExtension(url);
  if (!validator.isURL(url)) {
    throw new Error("Invalid URL");
  }
  if (
    fileExtension === -1 ||
    (!fileExtension.includes("csv") && !fileExtension.includes("xls"))
  ) {
    throw new Error(`Invalid file type, got: ${fileExtension}`);
  }

  // @TODO: check how large the file is before starting to download
  // implement a max size to try to download

  // for debugging. Native Node
  // http
  //   .get(url, (res) => {
  //     res.on("data", (chunk) => {
  //       debugger;
  //     });

  //     res.on("end", () => {
  //       debugger;
  //     });
  //   })
  //   .on("error", (err) => {
  //     debugger;
  //     console.log("Error: ", err.message);
  //   });

  // @TODO: all http (not s) requests are failing
  const response = await fetch(url, {
    method: "GET",
    headers: {
      // "Content-Type": "text/csv",
      "Accept-Encoding": "gzip, deflate, br",
      Origin: "http://localhost:3001",
      // Accept: "text/csv",
    },
    // mode: "no-cors",
  }).catch((e) => {
    // const proxiedRequestUrl = `http://proxy:8080/${url}`;
    // const proxiedRequestUrl = `http://localhost:8080/${url}`;
    // const response = await fetch(proxiedRequestUrl).catch((e) => {
    // debugger;
    throw new Error(e.message || "Error fetching data");
  });
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  const data = await response.text();

  let totalRows;
  let dataSubset;

  const parsedCsvData: PapaParse.ParseResult<string[]> = PapaParse.parse(data);
  totalRows = parsedCsvData?.data?.length;
  dataSubset = parsedCsvData?.data?.slice(
    0,
    returnAmount || DEFAULT_RETURN_AMOUNT
  );
  if (!dataSubset || !totalRows) {
    throw new Error("Error fetching data");
  }

  return {
    data: dataSubset,
    totalRows: totalRows,
  };
};

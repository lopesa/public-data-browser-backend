import express from "express";
var router = express.Router();
import fs from "fs";
import { json } from "stream/consumers";
import { DataSourcesRecord } from "../configs/xata";
import { getXataClient } from "../configs/xata-custom-config";
import Iconv from "iconv";
import detectCharacterEncoding from "detect-character-encoding";
import buffer from "node:buffer";
// var net = require('net');
// var Iconv = require('iconv').Iconv;
// var server = net.createServer(function(conn) {
//   var iconv = new Iconv('latin1', 'utf-8');
//   conn.pipe(iconv).pipe(conn);
// });

const BASE_DIR = "dist";
const BASE_FOLDER = "json_data_external_sources";
const BASE_JSON_FILE_NAME = "DEPARTMENT_OF_AGRICULTURE_BASE_DATA_";
const MAX_HOURS_BEFORE_REFETCH = 24;
const DOA_BASE_JSON_DATA_URL =
  "https://www.usda.gov/sites/default/files/documents/data.json";

let xata = getXataClient();

const diff_hours = (dt2: number, dt1: number) => {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

const getCurrentDataFile = async () => {
  const currentDataFiles = await fs.promises
    .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
    .catch((e) => {
      throw e;
    });
  const currentDataFile = currentDataFiles.find((dataFileName) => {
    return dataFileName.includes(BASE_JSON_FILE_NAME);
  });
  return `./${BASE_DIR}/${BASE_FOLDER}/${currentDataFile}`;
};

const getShouldFetchNewData = async () => {
  const currentDataFileFolderExists = !!(await fs.promises
    .readdir(`./${BASE_DIR}/${BASE_FOLDER}`)
    .catch((e) => {
      return false;
    }));

  if (!currentDataFileFolderExists) {
    await fs.promises.mkdir(`./${BASE_DIR}/${BASE_FOLDER}`);
    return true;
  }

  const currentDataFile = await getCurrentDataFile().catch((e) => {
    throw e;
  });

  if (!currentDataFile) {
    return true;
  }
  const lastDownloadDate = Number(
    currentDataFile.slice(
      currentDataFile.lastIndexOf("_") + 1,
      currentDataFile.lastIndexOf(".")
    )
  );
  const todaysDate = Date.now();

  return diff_hours(lastDownloadDate, todaysDate) > MAX_HOURS_BEFORE_REFETCH;
};

const fetchNewData = async () => {
  console.log("~~~~~ fetching new data");
  const doaBaseJsonData = await fetch(DOA_BASE_JSON_DATA_URL).catch((e) => {
    throw e;
  });
  if (!doaBaseJsonData?.ok) {
    throw new Error("Error fetching data from source");
  }

  const currentDataFile = await getCurrentDataFile().catch((e) => {
    console.log("~~~~ couldn't get current data file to delete it");
    // throw e;
  });

  if (currentDataFile) {
    fs.rmSync(currentDataFile, {
      force: true,
    });
  }

  const doaJson = await doaBaseJsonData.json();
  const stringified = JSON.stringify(doaJson);
  // // const length = stringified && stringified.length;
  // const charsetMatch1 = buffer && detectCharacterEncoding(buffer);

  // debugger;

  // // XATA DB TEST
  // const currentRecordArray = await xata.db["data-sources"]
  //   .filter({ name: "Department of Agriculture" })
  //   .getMany();

  // const currentRecord = currentRecordArray[0];

  // // if (stringData) {
  // const record = await xata.db["data-sources"]
  //   .update(currentRecord.id, {
  //     "date-of-last-update": new Date(),
  //     data: stringified,
  //   })
  //   .catch((e) => {
  //     console.log("~~~~~ error updating record", e);
  //   });
  // // }

  await fs.promises
    .writeFile(
      `./${BASE_DIR}/${BASE_FOLDER}/${BASE_JSON_FILE_NAME}${Date.now()}.json`,
      stringified
    )
    .catch((e) => {
      throw e;
    });
};

router.get("/", async (req: express.Request, res: express.Response) => {
  const shouldFetchNewData = await getShouldFetchNewData().catch((e) => {
    res.status(500).send("Error fetching data");
  });
  if (shouldFetchNewData) {
    await fetchNewData().catch((e) => {
      res.status(500).send(e.message || "Error fetching data");
    });
  }

  const currentDataFile = await getCurrentDataFile().catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
  if (!currentDataFile) {
    res.status(500).send("Error fetching data");
  }

  const jsonDataBuffer = await fs.promises
    .readFile(currentDataFile!)
    .catch((e) => {
      res.status(500).send(e.message || "Error fetching data");
    });

  // const testString = (input: string) => {
  //   var instances = 0;
  //   for (var i = 0; i < input.length; i++) {
  //     console.log(input.charCodeAt(i));
  //     if (
  //       (input.charCodeAt(i) > 127 && input.charCodeAt(i) < 160) ||
  //       input.charCodeAt(i) > 255
  //     ) {
  //       console.log(input.charCodeAt(i));
  //       instances++;
  //     }
  //   }
  //   return instances;
  // };

  // // the following doesn't work with the error of it not being utf8
  const stringData = jsonDataBuffer && jsonDataBuffer.toString();

  const myBuffer = stringData && Buffer.from(stringData);
  //@ts-ignore // isUtf8 is added in node 18.14, typing defs are not updated yet
  const isUtf8 = buffer.isUtf8(myBuffer); // true
  // debugger;

  var someEncodedString =
    stringData && Buffer.from(stringData, "utf-8").toString();

  // const numNonUtf8Chars = stringData && testString(stringData);
  // debugger;

  const testLogStringData = stringData && stringData.slice(0, 1000);
  console.log("~~~~~ testLogStringData", testLogStringData);

  // XATA DB TEST
  //   // the following works
  // const stringData2 = JSON.stringify({
  //   data: "data",
  //   test: "testnew?",
  // });

  const currentRecordArray = await xata.db["data-sources"]
    .filter({ name: "Department of Agriculture" })
    .getMany();

  const currentRecord = currentRecordArray[0];

  // const buffer = stringData && Buffer.from(stringData);
  // const length = stringData && stringData.length;
  // const charsetMatch = buffer && detectCharacterEncoding(buffer);

  if (myBuffer) {
    const record = await xata.db["data-sources"]
      .update(currentRecord.id, {
        "date-of-last-update": new Date(),
        data: JSON.stringify(someEncodedString),
      })
      .catch((e) => {
        console.log("~~~~~ error updating record", e);
      });
  }

  return !!stringData
    ? res.status(200).send(stringData)
    : res.status(500).send("Error fetching data");
});

export default router;

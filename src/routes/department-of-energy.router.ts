import express from "express";
import validator from "validator";
var router = express.Router();

import {
  getNewDepartmentOfEnergyDataFromSource,
  addSourceDataToDb,
  checkTableForNulls,
  getInitialDepartmentOfEnergyData,
  getDepartmentOfEnergyDataItem,
} from "../controllers/department-of-energy.controller";

router.get("/", async (req: express.Request, res: express.Response) => {
  debugger;
  // const data = await getAllDepartmentOfEnergyData(req, res).catch((e) => {
  const data = await getInitialDepartmentOfEnergyData(req, res).catch((e) => {
    return res.status(500).send(e.message || "Error fetching data");
  });
  return res.status(200).json(data);
});

router.get(
  "/get-new-data-from-source",
  async (req: express.Request, res: express.Response) => {
    await getNewDepartmentOfEnergyDataFromSource(req, res).catch((e) => {
      return res.status(500).send(e.message || "Error fetching data");
    });
    return res.status(200).send("ok");
  }
);

router.get(
  "/add-source-data-to-db",
  async (req: express.Request, res: express.Response) => {
    const data = await addSourceDataToDb(req, res).catch((e) => {
      return res.status(500).send(e.message || "Error fetching data");
    });
    return res.status(200).json(data);
  }
);

router.get(
  "/check-for-nulls",
  async (req: express.Request, res: express.Response) => {
    debugger;
    const nullFields = await checkTableForNulls(req, res).catch((e) => {
      return res
        .status(500)
        .send(e.message || "Error fetching data in check for nulls");
    });
    return res.status(200).json(nullFields);
  }
);

router.get("/:id", async (req: express.Request, res: express.Response) => {
  if (!validator.isUUID(req.params.id)) {
    return res.status(500).send("Invalid id");
  }
  await getDepartmentOfEnergyDataItem(req, res).catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
});

export default router;

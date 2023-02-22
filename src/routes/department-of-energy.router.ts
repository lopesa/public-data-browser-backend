import express from "express";
var router = express.Router();

import {
  getNewDepartmentOfEnergyDataFromSource,
  addSourceDataToDb,
  getAllDepartmentOfEnergyData,
  getDepartmentOfEnergyDataItem,
} from "../controllers/department-of-energy.controller";

router.get("/", async (req: express.Request, res: express.Response) => {
  const data = await getAllDepartmentOfEnergyData(req, res).catch((e) => {
    return res.status(500).send(e.message || "Error fetching data");
  });
  return res.status(200).json(data);
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  await getDepartmentOfEnergyDataItem(req, res).catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
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

export default router;

import express from "express";
var router = express.Router();
import getDepartmentOfAgricultureData from "../controllers/department-of-agriculture.controller";

import { getNewDepartmentOfEnergyDataFromSource } from "../controllers/department-of-energy.controller";

router.get(
  "/get-new-data-from-source",
  async (req: express.Request, res: express.Response) => {
    await getNewDepartmentOfEnergyDataFromSource(req, res).catch((e) => {
      return res.status(500).send(e.message || "Error fetching data");
    });
    return res.status(200).send("ok");
  }
);

export default router;

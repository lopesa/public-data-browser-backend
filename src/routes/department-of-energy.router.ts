import express from "express";
import { Stats } from "fs";
var router = express.Router();

import {
  // getNewDepartmentOfEnergyDataFromSource,
  // addSourceDataToDb,
  // checkTableForNulls,
  getInitialDepartmentOfEnergyData,
  getDepartmentOfEnergyDataItem,
  addOrReplaceDbData,
} from "../controllers/department-of-energy.controller";

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInitialDepartmentOfEnergyData().catch((e) => {
      // return res.status(500).send(e.message || "Error fetching data");
      next(e || new Error("Error fetching data"));
    });
    // return res.status(200).json(data);
    data ? res.status(200).json(data) : next();
  }
);

router.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getDepartmentOfEnergyDataItem(req, res).catch((e) => {
      next(e || new Error("Error fetching data"));
    });
    data ? res.status(200).json(data) : next();
  }
);

router.post(
  "/add-data-to-db",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const staleTime = req.body.staleTime && Number(req.body.staleTime);
    debugger;
    const result = await addOrReplaceDbData(
      typeof staleTime === "number" ? staleTime : undefined
    ).catch((e) => {
      next(e || new Error("Error adding data to db"));
    });
    result ? res.status(200).json(result) : next();
  }
);

// router.get(
//   "/get-new-data-from-source",
//   async (req: express.Request, res: express.Response) => {
//     await getNewDepartmentOfEnergyDataFromSource(req, res).catch((e) => {
//       return res.status(500).send(e.message || "Error fetching data");
//     });
//     return res.status(200).send("ok");
//   }
// );

// router.get(
//   "/add-source-data-to-db",
//   async (req: express.Request, res: express.Response) => {
//     const data = await addSourceDataToDb(req, res).catch((e) => {
//       return res.status(500).send(e.message || "Error fetching data");
//     });
//     return res.status(200).json(data);
//   }
// );

// router.get(
//   "/check-for-nulls",
//   async (req: express.Request, res: express.Response) => {
//     debugger;
//     const nullFields = await checkTableForNulls(req, res).catch((e) => {
//       return res
//         .status(500)
//         .send(e.message || "Error fetching data in check for nulls");
//     });
//     return res.status(200).json(nullFields);
//   }
// );

export default router;

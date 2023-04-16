import express from "express";
let router = express.Router();
import passport from "passport";
import { adminUsersByEmail } from "../configs/constants";

import {
  getInitialDepartmentOfTreasuryData,
  getDepartmentOfTreasuryDataItem,
  addOrReplaceDbData,
} from "../controllers/department-of-treasury.controller";
import { JwtTokenUser } from "../types/types-general";
import { winstonLogger } from "../middlewares/logging.middleware";

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInitialDepartmentOfTreasuryData().catch((e) => {
      next(e || new Error("Error fetching data"));
    });
    data ? res.status(200).json(data) : next(new Error("Error fetching data"));
  }
);

router.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getDepartmentOfTreasuryDataItem(req, res).catch((e) => {
      next(e || new Error("Error fetching data"));
    });
    data ? res.status(200).json(data) : next(new Error("Error fetching data"));
  }
);

router.post(
  "/add-data-to-db",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!adminUsersByEmail.includes((req.user as JwtTokenUser)?.email)) {
      return next(new Error("insufficient permissions"));
    }
    const staleTime = req.body?.staleTime && Number(req.body?.staleTime);
    const result = await addOrReplaceDbData(
      typeof staleTime === "number" ? staleTime : undefined
    ).catch((e) => {
      next(e || new Error("Error adding data to db"));
    });
    result
      ? res.status(200).json(result)
      : next(new Error("Error fetching data"));
  }
);

/**
 * used during initial inport of data
 * add an exhaustive list of all fields, then check for nulls
 * and remove them
 */

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

import express from "express";
let router = express.Router();
import passport from "passport";
import { adminUsersByEmail } from "../configs/constants";

import {
  getInitialDepartmentOfEnergyData,
  getDepartmentOfEnergyDataItem,
  addOrReplaceDbData,
} from "../controllers/department-of-energy.controller";
import { JwtTokenUser } from "../types/types-general";
import { winstonLogger } from "../middlewares/logging.middleware";

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInitialDepartmentOfEnergyData().catch((e) => {
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
    const data = await getDepartmentOfEnergyDataItem(req, res).catch((e) => {
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

export default router;

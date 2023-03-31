import express from "express";
import { adminUsersByEmail } from "../configs/constants";
import {
  addICODataToDb,
  getInitialInternationalCoffeeOrganizationData,
  getInternationalCoffeeOrganizationDataItem,
} from "../controllers/international-coffee-organization.controller";
import { JwtTokenUser } from "../types/types-general";

var router = express.Router();

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInitialInternationalCoffeeOrganizationData().catch(
      (e) => {
        next(e || new Error("Error fetching data"));
        // return res.status(500).send(e.message || "Error fetching data");
      }
    );
    data ? res.status(200).json(data) : next(new Error("Error fetching data"));
    // return res.status(200).json(data);
  }
);

router.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInternationalCoffeeOrganizationDataItem(
      req,
      res
    ).catch((e) => {
      next(e || new Error("Error fetching data"));
    });
    data ? res.status(200).json(data) : next(new Error("Error fetching data"));
  }
);

router.post(
  "/add-data-to-db",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!adminUsersByEmail.includes((req.user as JwtTokenUser)?.email)) {
      return next(new Error("insufficient permissions"));
    }
    const result = await addICODataToDb(req, res).catch((e) => {
      next(e || new Error("Error adding data to db"));
    });
    result
      ? res.status(200).json(result)
      : next(new Error("Error fetching data"));
  }
);

export default router;

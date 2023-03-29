import express from "express";
import {
  addICODataToDb,
  getInitialInternationalCoffeeOrganizationData,
  getInternationalCoffeeOrganizationDataItem,
} from "../controllers/international-coffee-organization.controller";

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
    data ? res.status(200).json(data) : next();
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
    const result = await addICODataToDb(req, res).catch((e) => {
      next(e || new Error("Error adding data to db"));
      // return res.status(500).send(e.message || "Error adding data to db");
    });
    result ? res.status(200).json(result) : next();
  }
);

export default router;
import express from "express";
var router = express.Router();
import {
  getInitialDepartmentOfAgricultureData,
  getDepartmentOfAgricultureDataItem,
  addOrReplaceDbData,
} from "../controllers/department-of-agriculture.controller";
// import { checkTableForNulls, testPushDataToDb } from "../controllers/department-of-agriculture.controller";

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = await getInitialDepartmentOfAgricultureData().catch((e) => {
      next(e || new Error("Error fetching data"));
    });
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
    const data = await getDepartmentOfAgricultureDataItem(req, res).catch(
      (e) => {
        next(e || new Error("Error fetching data"));
      }
    );
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
    const result = await addOrReplaceDbData(
      typeof staleTime === "number" ? staleTime : undefined
    ).catch((e) => {
      next(e || new Error("Error adding data to db"));
    });
    result ? res.status(200).json(result) : next();
  }
);

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

// router.get("/test", async (req: express.Request, res: express.Response) => {
//   await testPushDataToDb(req, res).catch((e) => {
//     res.status(500).send(e.message || "Error fetching data");
//   });
// });

export default router;

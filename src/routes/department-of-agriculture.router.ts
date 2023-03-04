import express from "express";
var router = express.Router();
import {
  getInitialDepartmentOfAgricultureData,
  getDepartmentOfAgricultureDataItem,
} from "../controllers/department-of-agriculture.controller";
import { checkTableForNulls } from "../controllers/department-of-agriculture.controller";
import validator from "validator";

router.get("/", async (req: express.Request, res: express.Response) => {
  const data = await getInitialDepartmentOfAgricultureData(req, res).catch(
    (e) => {
      return res.status(500).send(e.message || "Error fetching data");
    }
  );
  return res.status(200).json(data);
});

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
  await getDepartmentOfAgricultureDataItem(req, res).catch((e) => {
    return res.status(500).send(e.message || "Error fetching data");
  });
});

// router.get("/test", async (req: express.Request, res: express.Response) => {
//   await testPushDataToDb(req, res).catch((e) => {
//     res.status(500).send(e.message || "Error fetching data");
//   });
// });

export default router;

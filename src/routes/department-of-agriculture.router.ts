import express from "express";
var router = express.Router();
import getDepartmentOfAgricultureData, {
  testPushDataToDb,
} from "../controllers/department-of-agriculture.controller";

router.get("/", async (req: express.Request, res: express.Response) => {
  await getDepartmentOfAgricultureData(req, res).catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
});

router.get("/test", async (req: express.Request, res: express.Response) => {
  await testPushDataToDb(req, res).catch((e) => {
    res.status(500).send(e.message || "Error fetching data");
  });
});

export default router;

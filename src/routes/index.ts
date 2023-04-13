import express from "express";
var router = express.Router();
import { getSpreadsheetData } from "../controllers/all-data-sources.controller";

router.get("/", async (req: express.Request, res: express.Response) => {
  res.send("Hello Public Data");
});

router.get(
  "/get-spreadsheet-data/:url",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log("calls get-spreadsheet-data/:url");
    const data = await getSpreadsheetData(req, res).catch((e) => {
      next(e || new Error("Error fetching data"));
    });
    data ? res.status(200).json(data) : next();
  }
);

export default router;

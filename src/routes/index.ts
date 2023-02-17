import express from "express";
var router = express.Router();
// import { testPrisma } from "../services/db.service";

router.get("/", async (req: express.Request, res: express.Response) => {
  // debugger;
  // const result = await testPrisma().catch((e) => {
  //   debugger;
  // });
  // debugger;
  res.send("Express + TypeScript Server");
});

export default router;

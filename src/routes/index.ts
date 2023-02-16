import express from "express";
var router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Express + TypeScript Server");
});

export default router;

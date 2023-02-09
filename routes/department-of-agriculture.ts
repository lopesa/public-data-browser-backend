import express from "express";
var router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const doaBaseJsonDataUrl =
    "https://www.usda.gov/sites/default/files/documents/data.json";
  const doaBaseJsonData = await fetch(doaBaseJsonDataUrl).catch((e) => {
    throw new Error(e);
  });
  if (!doaBaseJsonData.ok) {
    res.status(500).send("Error fetching data from source");
    return;
  }
  const doaBaseJsonDataJson = await doaBaseJsonData.json();
  res.status(200).send(JSON.stringify(doaBaseJsonDataJson));
});

export default router;

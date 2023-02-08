import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/department-of-agriculture", async (req: Request, res: Response) => {
  const doaBaseJsonDataUrl =
    "https://www.usda.gov/sites/default/files/documents/data.json";
  const doaBaseJsonData = await fetch(doaBaseJsonDataUrl);
  if (!doaBaseJsonData.ok) {
    res.status(500).send("Error fetching data from source");
    return;
  }
  const doaBaseJsonDataJson = await doaBaseJsonData.json();
  res.status(200).send(JSON.stringify(doaBaseJsonDataJson));
  // res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

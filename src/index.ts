import dotenv from "dotenv";
import express from "express";
import { Document } from "./base/document";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get("/api/data", async (req, res) => {
  const modelName = req.query.modelName as string;
  const fields = req.query.fields as string;
  const filters = req.query.filters as string;

  try {
    // Load model schema

    // Fetch data
    const data = await Document.find(modelName, filters, fields);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/create", async (req, res) => {
  const modelName = req.query.modelName as string;

  const body = req.body;
  try {
    const data = await Document.create(modelName, body);

    res.json({ data });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  Document.connect();
  console.log(`Server is running on port ${PORT}`);
});

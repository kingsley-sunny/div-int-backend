import dotenv from "dotenv";
import express from "express";
import { Document } from "./base/document";
import { afterMigrate, afterStart, beforeMigrate } from "./hooks/hooks";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT ?? 3000;

// This is main endpoint.
app.get("/api/data", async (req, res) => {
  const modelName = req.query.modelName as string;
  const fields = req.query.fields as string;
  const filters = req.query.filters as string;

  try {
    const data = await Document.find(modelName, filters, fields);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * This is just an extra endpoint to create the model dynamically, i used it in testing the model validation
 */
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
  Document.connect(
    async () => {
      beforeMigrate(
        async () => {
          console.log("beforeMigrate hook: before migrating 30%");
        },
        async () => {
          console.log("beforeMigrate hook: before migrating 60%");
        },
        async () => {
          console.log("beforeMigrate hook: before migrating 100%");
        }
      );
    },
    async () => {
      afterMigrate(
        async () => {
          console.log("afterMigrate hook: after migrating 30%");
        },
        async () => {
          console.log("afterMigrate hook: after migrating 60%");
        },
        async () => {
          console.log("afterMigrate hook: after migrating 100%");
        }
      );
    }
  );
  console.log(`Server is running on port ${PORT}`);

  // call the after start hook if the application has started
  afterStart(
    async () => {
      console.log("afterStart hook: Application starting 30%");
    },
    async () => {
      console.log("afterStart hook: Application starting 60%");
    },
    async () => {
      console.log("afterStart hook: Application started successfully 100%");
    }
  );
});

import express from "express";
import { initializeRoutes } from "./routes/index.js";
import { connectDB } from "./db/mongoDB.js";
import { logger } from "./utils/logger.js";

if (!process.env.MONGODB_URI) throw new Error(`MONGODB_URI missing`);
if (!process.env.REDIS_URL) throw new Error(`REDIS_URL missing`);

await connectDB(process.env.MONGODB_URI);
logger.info("Database connected successfully");

const app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} ip:${req.ip}`);
  next();
});

app.use(express.json());
initializeRoutes(app);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error:", {
    error: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: "Internal Server Error" });
});

export { app };

import express from "express";
import { initializeRoutes } from "./routes/index.ts";
import { connectDB, MongoDB } from "./db/mongoDB.ts";
if (!process.env.MONGODB_URI) throw new Error(`MONGODB_URI missing`);
if (!process.env.REDIS_URL) throw new Error(`REDIS_URL missing`);

await connectDB(process.env.MONGODB_URI);
const app = express();
app.use(express.json());
initializeRoutes(app);

export { app };

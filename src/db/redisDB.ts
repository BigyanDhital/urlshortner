import { createClient } from "redis";
if (!process.env.REDIS_URL) throw new Error(`Redis URL missing`);

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.connect().catch(console.error);

const setCache = async (key: string, value: string, expireInSeconds = 3600) => {
  try {
    await redisClient.set(key, value, {
      EX: expireInSeconds,
    });
  } catch (error) {
    console.error("Redis SET Error:", error);
  }
};

const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error("Redis GET Error:", error);
    return null;
  }
};

export const redisDB = {
  redisClient,
  getCache,
  setCache,
};

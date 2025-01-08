import express from "express";

import { ShortUrl } from "../db/schemas";
import { redisDB } from "../db/redisDB";

export const initializeRoutes = (app: express) => {
  // Route to create short URL
  app.get("/", async (req, res) => {
    res.json({ message: "Shortner", time: new Date().getTime() });
  });
  app.post("/shorten", async (req, res) => {
    try {
      const { url, shortId: customShortId } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }
      // Check if URL already exists
      const existingUrl = await ShortUrl.findOne({ originalUrl: url });
      if (existingUrl) {
        return res.json({
          shortUrl: `${req.protocol}://${req.get("host")}/${existingUrl.shortId}`,
          originalUrl: url,
          message: "URL was already shortened",
        });
      }
      // If custom shortId provided, check if it's already taken
      if (customShortId) {
        const existingCustomId = await ShortUrl.findOne({ shortId: customShortId });
        if (existingCustomId) {
          return res.status(400).json({ error: "Custom short ID is already in use" });
        }
      }

      // Generate unique short ID using base58
      const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

      const shortId =
        customShortId ||
        Array.from(crypto.getRandomValues(new Uint8Array(8)))
          .map((byte) => base58Chars[byte % base58Chars.length])
          .join("");

      // Create new URL document
      const urlDoc = new ShortUrl({
        originalUrl: url,
        shortId,
      });

      await urlDoc.save();

      res.json({
        shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
        originalUrl: url,
      });
    } catch (error) {
      console.error("Error creating short URL:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  const getUrlFromShortId = async (shortId) => {
    // Check cache first
    const cachedUrl = await redisDB.getCache(shortId);
    if (cachedUrl) {
      console.log(`cachedUrl`, shortId, cachedUrl);
      return cachedUrl;
    }

    const urlDoc = await ShortUrl.findOne({ shortId });

    if (!urlDoc) return "";

    await redisDB.setCache(shortId, urlDoc.originalUrl);

    return urlDoc.originalUrl;
  };
  app.get("/urls", async (req, res) => {
    try {
      const dbResponse = await ShortUrl.find({}).limit(10).exec();
      const urls = await dbResponse.map((item) => ({
        ...item?._doc,
        shortUrl: `${req.protocol}://${req.get("host")}/${item.shortId}`,
      }));

      return res.json({ urls: urls });
    } catch (error) {
      console.error("Error redirecting to URL:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  app.get("/url/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;
      const originalUrl = await getUrlFromShortId(shortId);
      if (!originalUrl) return res.status(404).json({ error: "URL not found" });

      res.json({ shortId, originalUrl });
    } catch (error) {
      console.error("Error redirecting to URL:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/:shortId", async (req, res) => {
    try {
      const { shortId } = req.params;
      const originalUrl = await getUrlFromShortId(shortId);
      if (!originalUrl) return res.status(404).json({ error: "URL not found" });

      res.redirect(originalUrl);
    } catch (error) {
      console.error("Error redirecting to URL:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
};

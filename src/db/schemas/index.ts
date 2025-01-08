import mongoose from "mongoose";

// Define URL Schema
export const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const ShortUrl = mongoose.model("URL", urlSchema);
export { ShortUrl };

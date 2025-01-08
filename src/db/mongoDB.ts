import mongoose from "mongoose";

let MongoDB;
const connectDB = async (uri: string) => {
  try {
    if (!uri) throw new Error(`MONGODB_URI missing`);
    console.log(`Connecting to MongoDB at ${uri}`);
    const mongoDB = await mongoose.connect(uri);
    console.log(`Connected to MongoDB`);

    if (!mongoDB.connection?.db) {
      throw new Error("MongoDB connection failed - database not available");
    }

    await mongoDB.connection.db.admin().ping();
    MongoDB = mongoDB;
    return mongoDB;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export { connectDB, MongoDB };

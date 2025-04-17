import { connect } from "mongoose";
import 'dotenv/config'

const MONGO_URL = "mongodb://localhost:27017/narela-ecommerce";

export const initMongoDB = async () => {
  try {
    await connect(MONGO_URL);
  } catch (error) {
    throw new Error(error);
  }
};
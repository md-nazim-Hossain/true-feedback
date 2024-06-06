import mongoose from "mongoose";

type ConnectionType = {
  isConnect: number;
};

const connection: ConnectionType = {
  isConnect: 0,
};

async function dbConnect() {
  if (connection.isConnect) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL || "", {});
    connection.isConnect = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
export default dbConnect;

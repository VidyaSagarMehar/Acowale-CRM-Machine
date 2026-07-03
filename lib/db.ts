import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "@/models/User";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalConnection = global.mongooseConnection ?? {
  conn: null,
  promise: null
};

global.mongooseConnection = globalConnection;

const SEEDED_ADMIN = {
  email: "admin@acowale.local",
  password: "Admin@123",
  role: "admin" as const
};

export async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("Missing environment variable: MONGODB_URI");
  }

  if (globalConnection.conn) {
    return globalConnection.conn;
  }

  if (!globalConnection.promise) {
    globalConnection.promise = mongoose.connect(mongodbUri, {
      dbName: "acowale-crm-machine"
    });
  }

  globalConnection.conn = await globalConnection.promise;

  return globalConnection.conn;
}

export async function ensureSeededAdmin() {
  await connectToDatabase();

  const existingAdmin = await UserModel.findOne({ email: SEEDED_ADMIN.email });

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(SEEDED_ADMIN.password, 10);

  return UserModel.create({
    email: SEEDED_ADMIN.email,
    password: hashedPassword,
    role: SEEDED_ADMIN.role
  });
}

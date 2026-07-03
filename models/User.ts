import { Model, Schema, model, models } from "mongoose";

export type UserDocument = {
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

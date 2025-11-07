import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1000 * 60 * 10),
      index: { expires: 0 }, // Default expiration: 10 minutes
    },
  },
  { timestamps: true }
);

const Token = models.Token || model("Token",TokenSchema)
export default Token

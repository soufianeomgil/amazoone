import mongoose from "mongoose";
interface IResetCode {
  identifier: string;
  type: "email" | "phone";
  code: string;
  expiresAt: Date;
  attempts: number;
  used: boolean
}
const ResetCodeSchema = new mongoose.Schema<IResetCode>({
  identifier: { type: String, required: true },
  type: { type: String, enum: ["email", "phone"], required: true },
  code: { type: String, required: true }, // hashed
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  used: { type: Boolean, default: false },
}, { timestamps: true });

const ResetCode = mongoose.models.ResetCode || mongoose.model("ResetCode", ResetCodeSchema);
  export default ResetCode

// models/cityRisk.model.ts
import { Schema, model, models } from "mongoose";
interface ICityBlackListed {
    city:string;
    codSuccessRate: number;
    totalOrders: number;
    returnedOrders: number;
    isBlacklisted: boolean;
    reason?:string
}
const CityRiskSchema = new Schema<ICityBlackListed>(
  {
    city: { type: String, required: true, unique: true },
    codSuccessRate: { type: Number, required: true }, // %
    totalOrders: { type: Number, default: 0 },
    returnedOrders: { type: Number, default: 0 },

    isBlacklisted: { type: Boolean, default: false },

    reason: { type: String }, // optional admin note
  },
  { timestamps: true }
);

export const CityRisk =
  models.CityRisk || model("CityRisk", CityRiskSchema);

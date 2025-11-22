import mongoose, { model, Schema } from "mongoose";
import { models } from "mongoose";


export interface IAddress {
    _id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    state: string;
    city: string;
    zipCode: string;
    country: string;
    phone: number;
    userId: mongoose.Schema.Types.ObjectId;
    isDefault: boolean;
    DeliveryInstructions?:string;
}
const AddressSchema = new Schema<IAddress>({
   name: {
     type: String,
     required: true,
   },
   state: {
     type: String,
     required: true,
   },
   addressLine1: {
     type: String,
     required: true
   },
   addressLine2: {
     type: String
   },
   phone: {
     type: Number,
     required: true,
   },
   userId: {
     type: Schema.Types.ObjectId,
     required: true,
     ref: "User"
   },
   city: {
     type: String,
     required: true,
   },
   country: {
     type: String,
     default: "morocco",
     required: true
   },
   zipCode: {
     type: String,
     required: true
   },
   isDefault: {
    type: Boolean,
    default: false,
    required: true
   },
   DeliveryInstructions: {
     type: String
   }

}, {
    timestamps: true
})
const Address = models.Address || model("Address", AddressSchema)
export default Address;

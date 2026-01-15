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
//  import mongoose, { model, models } from "mongoose";

// export interface IAddress {
//   _id: string;
//   userId: mongoose.Schema.Types.ObjectId;

//   formattedAddress: string;
//   city?: string;
//   region?: string;
//   country?: string;
//   zipCode?: string;

//   phone: string;
//   isDefault: boolean;

//   location: {
//     type: "Point";
//     coordinates: [number, number]; // [lng, lat]
//   };
// }

// const AddressSchema = new mongoose.Schema<IAddress>(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     formattedAddress: {
//       type: String,
//       required: true,
//     },

//     city: String,
//     region: String,
//     country: String,
//     zipCode: String,

//     phone: {
//       type: String,
//       required: true,
//     },

//     isDefault: {
//       type: Boolean,
//       default: false,
//     },

//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         required: true,
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [lng, lat]
//         required: true,
//       },
//     },
//   },
//   { timestamps: true }
// );

// // 🌍 Geospatial index
// AddressSchema.index({ location: "2dsphere" });

// // 🧠 Only ONE default address per user (optional but powerful)
// AddressSchema.index(
//   { userId: 1, isDefault: 1 },
//   { unique: true, partialFilterExpression: { isDefault: true } }
// );

// const Address = models.Address || model<IAddress>("Address", AddressSchema);
// export default Address;

// models/SavedList.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IVariant } from "./product.model";

export type ObjectId = Types.ObjectId;

// Schema for each saved item in a list (product ref + optional variant info)
// Schema for each saved item in a list (product ref + optional variant info)
export interface ISavedItem {
  productId: ObjectId;
  variantId?: string | null;        // pointer to variant _id or sku (string)
  variant?: IVariant | null;        // optional snapshot (not indexed)
  addedAt: Date;
  // optional extra metadata (snapshot price, thumbnail, note)
  priceSnapshot?: number;
  thumbnail?: string;
  note?: string;
}


// Main SavedList shape
export interface ISavedList extends Document {
  
  userId: ObjectId;            // owner
  name: string;                // e.g., "Wishlist", "For Mom"
  items: ISavedItem[];         // saved products
  isPrivate: boolean;          // visible only to owner
  isDefault: boolean;          // user's default saved list
  archived?: boolean;          // soft-delete
  meta?: {
    count: number;             // cached items count
    lastAddedAt?: Date;
    lastRemovedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}



// Static methods (optional)


const SavedItemSchema = new Schema<ISavedItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },

    // store the variant id (string) for matching; do NOT create unique/indexed sku here
    variantId: { type: String, default: null },

    // snapshot of variant metadata (stored as Mixed to avoid index propagation)
    variant: { type: Schema.Types.Mixed, default: null },

    addedAt: { type: Date, default: () => new Date() },
    priceSnapshot: { type: Number, default: undefined },
    thumbnail: { type: String, default: undefined },
    note: { type: String, default: undefined, maxlength: 300 },
  },
  { _id: false }
);


const SavedListSchema = new Schema<ISavedList>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 120, default: "Wishlist" },
    items: { type: [SavedItemSchema], default: [] },
    isPrivate: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    meta: {
      count: { type: Number, default: 0 },
      lastAddedAt: Date,
      lastRemovedAt: Date,
    },
  },
  {
    timestamps: true,

  }
);

// index: unique list name per user
SavedListSchema.index({ userId: 1, name: 1 }, { unique: true, partialFilterExpression: { archived: { $ne: true } } });








const SavedList = mongoose.models.SavedList || mongoose.model("SavedList", SavedListSchema);
// add after schema definition
// SavedListSchema.index({ "items.productId": 1, "items.variantId": 1 });

export default SavedList;

import mongoose, { Schema, Types, Document } from "mongoose";
import { IVariant } from "./product.model";

export type ObjectId = Types.ObjectId;

/* ===============================
   SAVED ITEM (Wishlist Item)
================================ */

export interface ISavedItem {
  productId: ObjectId;
  variantId?: string | null;
  variantSnapshot?: IVariant | null; // optional variant snapshot
  priceSnapshot?: number;
  thumbnail?: string;
  note?: string;
  addedAt: Date;
}

const SavedItemSchema = new Schema<ISavedItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: String,
      default: null,
    },

    variantSnapshot: {
      type: Schema.Types.Mixed,
      default: null,
    },

    priceSnapshot: {
      type: Number,
    },

    thumbnail: {
      type: String,
    },

    note: {
      type: String,
      maxlength: 300,
    },

    addedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { _id: false }
);

/* ===============================
   SAVED LIST (Wishlist)
================================ */

export interface ISavedList extends Document {
  userId: ObjectId;

  name: string;              // "Wishlist", "For Mom"
  isDefault: boolean;
  isPrivate: boolean;
  archived: boolean;

  shareSlug?: string;        // for public sharing

  items: ISavedItem[];

  meta: {
    count: number;
    lastAddedAt?: Date;
    lastRemovedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SavedListSchema = new Schema<ISavedList>(
  {
    // THE USER REFERENCE WHO HOLDS THE SAVEDLIST
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // THE NAME OF THE LIST
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "Wishlist",
    },
 // BOOLEAN DEFAULT FOR WHICH LIST IS DEFAULT ONE
    isDefault: {
      type: Boolean,
      default: false,
    },
 // IS THE LIST PRIVATE OR PUBLIC FOR EVERYONE
    isPrivate: {
      type: Boolean,
      default: true,
    },
  // IT'S ARCHIVED
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },

    shareSlug: {
      type: String,
      unique: true,
      sparse: true,
    },

    items: {
      type: [SavedItemSchema],
      default: [],
    },

    meta: {
      count: {
        type: Number,
        default: 0,
      },
      lastAddedAt: Date,
      lastRemovedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   INDEXES (VERY IMPORTANT)
================================ */

// 🔒 Unique list name per user (excluding archived)
SavedListSchema.index(
  { userId: 1, name: 1 },
  { unique: true, partialFilterExpression: { archived: { $ne: true } } }
);

// 🚀 Fast queries for default list
SavedListSchema.index({ userId: 1, isDefault: 1 });

// 🚀 Fast product lookup inside list
SavedListSchema.index({ userId: 1, "items.productId": 1 });

/* ===============================
   MODEL EXPORT
================================ */

const SavedList =
  mongoose.models.SavedList ||
  mongoose.model<ISavedList>("SavedList", SavedListSchema);

export default SavedList;

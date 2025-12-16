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

// Document interface (mongoose)
export interface ISavedListDoc extends ISavedList, Document {
  addItem: (item: {
    productId: ObjectId | string;
    variantId?: string | null;
    priceSnapshot?: number;
    variant?:IVariant;
    thumbnail?: string;
    note?: string;
  }) => Promise<ISavedListDoc>;
  removeItem: (productId: ObjectId | string, variantId?: string | null) => Promise<ISavedListDoc>;
  hasItem: (productId: ObjectId | string, variantId?: string | null) => boolean;
}

// Static methods (optional)
export interface ISavedListModel extends Model<ISavedListDoc> {
  createForUser: (userId: ObjectId | string, name?: string, opts?: Partial<ISavedList>) => Promise<ISavedListDoc>;
  getForUser: (userId: ObjectId | string) => Promise<ISavedListDoc[]>;
  toggleItem: (userId: ObjectId | string, listId: ObjectId | string, item: { productId: ObjectId | string; variantId?: string | null; priceSnapshot?: number; thumbnail?: string; note?: string }) => Promise<{ added: boolean; list: ISavedListDoc }>;
}

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


const SavedListSchema = new Schema<ISavedListDoc, ISavedListModel>(
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
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// index: unique list name per user
SavedListSchema.index({ userId: 1, name: 1 }, { unique: true, partialFilterExpression: { archived: { $ne: true } } });

// helper to compute count before save
SavedListSchema.pre("save", function (next) {
  const doc = this as ISavedListDoc;
  doc.meta = doc.meta || { count: 0 };
  doc.meta.count = Array.isArray(doc.items) ? doc.items.length : 0;
  next();
});

// Instance methods
// Instance methods
SavedListSchema.methods.hasItem = function (productId: ObjectId | string, variantId?: string | null) {
  const pid = String(productId);
  return this.items.some((it: ISavedItem) => {
    const sameProduct = String(it.productId) === pid;
    if (!sameProduct) return false;
    // if caller didn't pass variantId, treat any variant as a match (existing behavior)
    if (variantId == null) return true;
    // compare variantId (explicit) OR snapshot variant._id or variant.sku if present
    if (it.variantId && String(it.variantId) === String(variantId)) return true;
    if (it.variant && ((it.variant as any)._id && String((it.variant as any)._id) === String(variantId))) return true;
    if (it.variant && (it.variant as any).sku && String((it.variant as any).sku) === String(variantId)) return true;
    return false;
  });
};

SavedListSchema.methods.addItem = async function (this: ISavedListDoc, item: { productId: ObjectId | string; variantId?: string | null; priceSnapshot?: number; thumbnail?: string; note?: string; variant?: IVariant }) {
  const pid = String(item.productId);
  const existsIndex = this.items.findIndex((it: ISavedItem) => {
    const sameProduct = String(it.productId) === pid;
    if (!sameProduct) return false;
    if (item.variantId == null) return true;
    if (it.variantId && String(it.variantId) === String(item.variantId)) return true;
    if (it.variant && ((it.variant as any)._id && String((it.variant as any)._id) === String(item.variantId))) return true;
    if (it.variant && (it.variant as any).sku && String((it.variant as any).sku) === String(item.variantId)) return true;
    return false;
  });

  if (existsIndex !== -1) {
    // update metadata if present
    const existing = this.items[existsIndex];
    if (item.priceSnapshot !== undefined) existing.priceSnapshot = item.priceSnapshot;
    if (item.thumbnail) existing.thumbnail = item.thumbnail;
    if (item.note) existing.note = item.note;
    existing.addedAt = new Date();
    this.items.splice(existsIndex, 1, existing);
  } else {
    this.items.unshift({
      productId: new mongoose.Types.ObjectId(pid),
      variantId: item.variantId ?? null,
      variant: item.variant ?? null,
      addedAt: new Date(),
      priceSnapshot: item.priceSnapshot,
      thumbnail: item.thumbnail,
      note: item.note,
    } as ISavedItem);
  }
  this.meta = this.meta || { count: 0 };
  this.meta.count = this.items.length;
  this.meta.lastAddedAt = new Date();
  await this.save();
  return this;
};

SavedListSchema.methods.removeItem = async function (this: ISavedListDoc, productId: ObjectId | string, variantId?: string | null) {
  const pid = String(productId);
  const before = this.items.length;
  this.items = this.items.filter((it: ISavedItem) => {
    const sameProduct = String(it.productId) === pid;
    if (!sameProduct) return true; // keep items that are different product
    // if called without variantId, remove all matching product items
    if (variantId == null) return false;
    // remove only if variantId matches (either explicit or snapshot)
    if (it.variantId && String(it.variantId) === String(variantId)) return false;
    if (it.variant && ((it.variant as any)._id && String((it.variant as any)._id) === String(variantId))) return false;
    if (it.variant && (it.variant as any).sku && String((it.variant as any).sku) === String(variantId)) return false;
    // otherwise keep
    return true;
  });
  this.meta = this.meta || { count: 0 };
  this.meta.count = this.items.length;
  this.meta.lastRemovedAt = new Date();
  if (this.items.length !== before) {
    await this.save();
  }
  return this;
};


// Statics
SavedListSchema.statics.createForUser = async function (userId: ObjectId | string, name = "Wishlist", opts: Partial<ISavedList> = {}) {
  const doc = await this.create({
    userId,
    name,
    ...opts,
  });
  return doc;
};

SavedListSchema.statics.getForUser = async function (userId: ObjectId | string) {
  return this.find({ userId: userId, archived: { $ne: true } }).sort({ isDefault: -1, updatedAt: -1 }).lean();
};

SavedListSchema.statics.toggleItem = async function (userId: ObjectId | string, listId: ObjectId | string, item: { productId: ObjectId | string; variantId?: string | null; priceSnapshot?: number; thumbnail?: string; note?: string }) {
  const list = await this.findOne({ _id: listId, userId }).exec();
  if (!list) throw new Error("Saved list not found or not owned by user");
  const exists = list.hasItem(item.productId, item.variantId);
  if (exists) {
    await list.removeItem(item.productId, item.variantId);
    return { added: false, list };
  } else {
    await list.addItem(item);
    return { added: true, list };
  }
};

const SavedList = mongoose.models.SavedList as ISavedListModel || mongoose.model<ISavedListDoc, ISavedListModel>("SavedList", SavedListSchema);
// add after schema definition
// SavedListSchema.index({ "items.productId": 1, "items.variantId": 1 });

export default SavedList;

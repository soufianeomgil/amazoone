// models/SavedList.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ObjectId = Types.ObjectId;

// Schema for each saved item in a list (product ref + optional variant info)
export interface ISavedItem {
  productId: ObjectId;
  variantId?: string | null;
  addedAt: Date;
  // optional extra metadata (snapshot price, thumbnail, note)
  priceSnapshot?: number;
  thumbnail?: string;
  note?: string;
}

// Main SavedList shape
export interface ISavedList {
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

const SavedItemSchema = new Schema<ISavedItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  variantId: { type: String, default: null },
  addedAt: { type: Date, default: () => new Date() },
  priceSnapshot: { type: Number, default: undefined },
  thumbnail: { type: String, default: undefined },
  note: { type: String, default: undefined, maxlength: 300 },
}, { _id: false });

const SavedListSchema = new Schema<ISavedListDoc, ISavedListModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120, default: "Wishlist" },
    items: { type: [SavedItemSchema], default: [] },
    isPrivate: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    archived: { type: Boolean, default: false, index: true },
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
SavedListSchema.methods.hasItem = function (productId: ObjectId | string, variantId?: string | null) {
  const pid = String(productId);
  return this.items.some((it: ISavedItem) => String(it.productId) === pid && (variantId == null || it.variantId === variantId));
};

SavedListSchema.methods.addItem = async function (this: ISavedListDoc, item: { productId: ObjectId | string; variantId?: string | null; priceSnapshot?: number; thumbnail?: string; note?: string }) {
  const pid = String(item.productId);
  const existsIndex = this.items.findIndex((it: ISavedItem) => String(it.productId) === pid && (item.variantId == null || it.variantId === item.variantId));
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
  this.items = this.items.filter((it: ISavedItem) => !(String(it.productId) === pid && (variantId == null || it.variantId === variantId)));
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

export default SavedList;

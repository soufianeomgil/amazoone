// models/saveForLater.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { IVariant } from "./product.model";

/**
 * Interface definitions
 */
export interface ImageSnapshot {
  url?: string;
  public_id?: string;
  preview?: string;
}

export interface ISaveForLaterSnapshot {
  title?: string;
  price?: number;
  thumbnail?: ImageSnapshot;
  sku?: string;
}

export interface ISaveForLaterDoc {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  variant: IVariant;
  variantId?: Types.ObjectId | null;
  quantity: number;
  note?: string;
  addedAt: Date;
  snapshot?: ISaveForLaterSnapshot;
  active: boolean;
  // meta (timestamps added by mongoose)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISaveForLaterDocument extends ISaveForLaterDoc, Document {}
export interface ISaveForLaterModel extends Model<ISaveForLaterDocument> {
  addOrUpdate(opts: {
    userId: Types.ObjectId | string;
    productId: Types.ObjectId | string;
    variantId?: Types.ObjectId | string | null;
    variant: IVariant | null
    quantity?: number;
    note?: string;
    snapshot?: ISaveForLaterSnapshot;
  }): Promise<ISaveForLaterDocument>;

  removeItem(opts: { userId: Types.ObjectId | string; id: Types.ObjectId | string }): Promise<ISaveForLaterDocument | null>;

  listForUser(opts: { userId: Types.ObjectId | string; page?: number; perPage?: number }): Promise<ISaveForLaterDocument[]>;

  moveToCart(opts: { userId: Types.ObjectId | string; id: Types.ObjectId | string; cartAddFn: (params: { userId: string; productId: string; variantId?: string | null; quantity?: number }) => Promise<any> }): Promise<{ moved: boolean; reason?: string }>;
}

/**
 * Schema
 */
const ImageSnapshotSchema = new Schema<ImageSnapshot>(
  {
    url: { type: String },
    public_id: { type: String },
    preview: { type: String },
  },
  { _id: false }
);

const SnapshotSchema = new Schema<ISaveForLaterSnapshot>(
  {
    title: { type: String },
    price: { type: Number },
    thumbnail: { type: ImageSnapshotSchema },
    sku: { type: String },
  },
  { _id: false }
);
 const VariantSchema = new Schema<IVariant>({
  sku: { type: String, required: true },
  priceModifier: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  attributes: [{
    _id: false, // Don't create a separate _id for each attribute
    name: { type: String, required: true },
    value: { type: String, required: true },
  }],
  images: [{ type: {
    url: { type: String },
    preview: { type: String },
    public_id: { type: String },
  },
  default: {},}],})
const SaveForLaterSchema = new Schema<ISaveForLaterDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    variantId: { type: Schema.Types.ObjectId, ref: "Variant", required: false, default: null },
     variant: { type: VariantSchema, default: null },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    note: { type: String },
    addedAt: { type: Date, default: () => new Date() },
    snapshot: { type: SnapshotSchema, default: {} },
    active: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Indexes
 * - Unique (user+product+variant) for active entries only (soft-unique)
 * - compound indexes support common queries
 */
SaveForLaterSchema.index({ userId: 1, productId: 1, variantId: 1 }, { unique: true, partialFilterExpression: { active: true } });
SaveForLaterSchema.index({ userId: 1, addedAt: -1 });
SaveForLaterSchema.index({ productId: 1 });

/**
 * Statics
 */

// Add or update saved item — upsert, prevent duplicates, and update snapshot/quantity
SaveForLaterSchema.statics.addOrUpdate = async function ({
  userId,
  productId,
  variantId = null,
  variant = null, // <- new param
  quantity = 1,
  note,
  snapshot,
}: {
  userId: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  variantId?: Types.ObjectId | string | null;
  variant?: any | null; // replace `any` with IVariant if available
  quantity?: number;
  note?: string;
  snapshot?: ISaveForLaterSnapshot;
}) {
  const filter = {
    userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
    productId: typeof productId === "string" ? new Types.ObjectId(productId) : productId,
   //  variantId: variantId ? (typeof variantId === "string" ? new Types.ObjectId(variantId) : variantId) : null,
    variantId,
    active: true,
  };

  // Upsert: if exists, increment quantity (or set to provided), else create new
  const update: any = {
    $set: { active: true, snapshot: snapshot ?? {}, addedAt: new Date() },
    $inc: { quantity: quantity ?? 1 },
  };

  if (note) update.$set.note = note;
  if (variant) update.$set.variant = variant; // <-- store variant object when provided

  // Use findOneAndUpdate with upsert for atomic behaviour
  const doc = await this.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  }).exec();

  return doc;
};


// Soft remove (mark inactive) — safer than deleting so analytics remain
SaveForLaterSchema.statics.removeItem = async function ({ userId, id }: { userId: Types.ObjectId | string; id: Types.ObjectId | string }) {
  const res = await this.findOneAndUpdate(
    {
      _id: typeof id === "string" ? new Types.ObjectId(id) : id,
      userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
      active: true,
    },
    { $set: { active: false } },
    { new: true }
  ).exec();
  return res;
};

// List saved items for a user — paginated, newest-first, with optional population
SaveForLaterSchema.statics.listForUser = async function ({ userId, page = 0, perPage = 20 }: { userId: Types.ObjectId | string; page?: number; perPage?: number }) {
  const skip = Math.max(0, page) * Math.max(1, perPage);
  const docs = await this.find({ userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId, active: true })
    .sort({ addedAt: -1 })
    .skip(skip)
    .limit(perPage)
    .populate([
      { path: "productId", select: "name basePrice thumbnail images status" },
      { path: "variantId", select: "sku priceModifier stock attributes" },
    ])
    .lean()
    .exec();
  return docs;
};

// Move a saved item to cart: this calls a provided cartAddFn (your cart logic) and soft-removes saved item on success.
// cartAddFn must be an async function that accepts { userId, productId, variantId, quantity } and returns a truthy success result.
SaveForLaterSchema.statics.moveToCart = async function ({
  userId,
  id,
  cartAddFn,
}: {
  userId: Types.ObjectId | string;
  id: Types.ObjectId | string;
  cartAddFn: (params: { userId: string; productId: string; variantId?: string | null; quantity?: number }) => Promise<any>;
}) {
  // fetch item
  const item = await this.findOne({
    _id: typeof id === "string" ? new Types.ObjectId(id) : id,
    userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
    active: true,
  }).lean().exec();

  if (!item) return { moved: false, reason: "not_found" };

  // call cart function
  try {
    const result = await cartAddFn({
      userId: String(userId),
      productId: String(item.productId),
      variantId: item.variantId ? String(item.variantId) : undefined,
      quantity: item.quantity ?? 1,
    });

    // If cartAddFn indicates success, soft-remove saved item
    // Accept any truthy result as success (adapt if your function returns { success: boolean })
    if (result) {
      await this.findOneAndUpdate({ _id: item._id }, { $set: { active: false } }).exec();
      return { moved: true };
    } else {
      return { moved: false, reason: "cart_failed" };
    }
  } catch (err: any) {
    return { moved: false, reason: err?.message ?? "error" };
  }
};

/**
 * Optional: tidy pre-save hook to clamp quantity and ensure snapshot shape
 */
SaveForLaterSchema.pre("save", function (next) {
  if (this.quantity && this.quantity < 1) this.quantity = 1;
  if (!this.addedAt) this.addedAt = new Date();
  next();
});

/**
 * Export model
 */
export const SaveForLaterModel = mongoose.models.SaveForLater || mongoose.model<ISaveForLaterDocument, ISaveForLaterModel>("SaveForLater", SaveForLaterSchema);
export default SaveForLaterModel;

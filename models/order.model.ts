// models/Order.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IVariant } from "./product.model";

export type ObjectId = Types.ObjectId;

/**
 * Order statuses
 */
export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

/**
 * Payment methods
 */
export enum PaymentMethod {
 
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",

  STRIPE = "STRIPE",
}

/**
 * Line item stored on the order (snapshot of product at time of purchase)
 */
export interface IOrderItem {
  productId: ObjectId;
  name: string;
  quantity: number;
  variant?: IVariant | null
  unitPrice: number; // price per unit at the time of purchase
  linePrice: number; // unitPrice * quantity (stored for convenience)
  thumbnail?: string | null;
  // any additional metadata
  meta?: Record<string, any>;
}

/**
 * Shipping address snapshot (stored on the order)
 */
export interface IOrderAddress {
  name: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  
  DeliveryInstructions?: string | null;
}

/**
 * Payment snapshot (masked card info or payment provider reference)
 */
export interface IPaymentSnapshot {
  method: PaymentMethod;
  provider?: string | null; // e.g., "stripe", "paypal"
  transactionId?: string | null;
  paidAt?: Date | null;
  amount?: number | null;
  // DO NOT store full card numbers here. Only store masked, token, or provider id.
  cardLast4?: string | null;
  cardBrand?: string | null;
}

/**
 * Main Order interface
 */
export interface IOrder {
  userId: ObjectId;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  billingAddress?: IOrderAddress | null;
  subtotal: number; // sum of linePrice
  checkoutId: string;
  shippingCost: number;
  tax: number;
  discount?: number;
  total: number; // subtotal + shipping + tax - discount
  currency?: string;
  status: OrderStatus;
  payment?: IPaymentSnapshot | null;
  notes?: string | null;
  isPaid?: boolean;
  // fulfillment/shipping
  trackingNumber?: string | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  cancelReason?: string;
  refundedAt?: Date | null;
  canceledBy?: Types.ObjectId;
  // soft-delete / archived
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose Document interfaces
 */
export interface IOrderDoc extends IOrder, Document {
  addItem: (item: Partial<IOrderItem>) => void;
  removeItem: (productId: ObjectId | string, variantId?: string | null) => void;
  recalcTotals: () => void;
  markAsPaid: (snapshot: Partial<IPaymentSnapshot>) => Promise<void>;
}

/**
 * Static model interface
 */
export interface IOrderModel extends Model<IOrderDoc> {
  createForUser: (userId: ObjectId | string, payload: Partial<IOrder>) => Promise<IOrderDoc>;
}

/* -----------------------------
   SCHEMAS
   -----------------------------*/
const VariantSchema = new Schema<IVariant>(
  {
    sku: { type: String }, // <--- no `unique: true` and no `required` if SKU can be missing
    priceModifier: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    attributes: [
      {
        _id: false,
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    images: [
      {
        url: { type: String },
        preview: { type: String },
        public_id: { type: String },
      },
    ],
  },
  { _id: false } // embedded, no separate _id by default for variant snapshot
);
// OrderItem schema (embedded)
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    variant: { type: VariantSchema, default: null },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    linePrice: { type: Number, required: true, min: 0 }, // unitPrice * quantity (snapshotted)
    thumbnail: { type: String, default: null },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

// Address snapshot schema (embedded)
const AddressSchema = new Schema<IOrderAddress>(
  {
    name: { type: String, required: true },
    phone: { type: String, default: null },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: null },
    city: { type: String, required: true },
    state: { type: String, default: null },
    zipCode: { type: String, default: null },
   
    DeliveryInstructions: { type: String, default: null },
  },
  { _id: false }
);

// Payment snapshot schema
const PaymentSchema = new Schema<IPaymentSnapshot>(
  {
    method: { type: String, enum: Object.values(PaymentMethod), required: true },
    provider: { type: String, default: null },
    transactionId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    amount: { type: Number, default: null },
    cardLast4: { type: String, default: null },
    cardBrand: { type: String, default: null },
  },
  { _id: false }
);

// Main Order schema
const OrderSchema = new Schema<IOrderDoc, IOrderModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true, default: [] },
    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema, default: null },
    subtotal: { type: Number, required: true, default: 0 },
    shippingCost: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    checkoutId: {
  type: String,
  unique: true,
  sparse: true,
},

    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "MAD" },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING, index: true },
    payment: { type: PaymentSchema, default: null },
    notes: { type: String, default: null },
    isPaid: { type: Boolean, default: false },
    trackingNumber: { type: String, default: null },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    cancelReason: { type: String},
    canceledBy: {type: Schema.Types.ObjectId, ref: "User" },
    cancelledAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    archived: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

/* -----------------------------
   VIRTUALS & INDEXES
   -----------------------------*/

// virtual: itemCount
OrderSchema.virtual("itemCount").get(function (this: IOrderDoc) {
  return Array.isArray(this.items) ? this.items.reduce((s, it) => s + (it.quantity || 0), 0) : 0;
});

// useful compound index for user and status queries
OrderSchema.index({ userId: 1, status: 1, createdAt: -1 });

/* -----------------------------
   HOOKS & METHODS
   -----------------------------*/

// Recalculate subtotal, line prices and total. Use simple arithmetic here; tax/shipping calc can be customized.
OrderSchema.methods.recalcTotals = function (this: IOrderDoc) {
  // ensure quantities and unitPrice exist
  const subtotal = (this.items || []).reduce((sum: number, it: IOrderItem) => {
    const qty = Number(it.quantity || 0);
    const unit = Number(it.unitPrice || 0);
    it.linePrice = Math.round((qty * unit + Number.EPSILON) * 100) / 100;
    return sum + it.linePrice;
  }, 0);

  // simple tax example (you may have a tax calculation service)
  const tax = Number(this.tax ?? 0);

  // shippingCost kept as-is (or compute based on subtotal)
  const shippingCost = Number(this.shippingCost ?? 0);
  const discount = Number(this.discount ?? 0);

  const total = Math.round((subtotal + shippingCost + tax - discount + Number.EPSILON) * 100) / 100;

  this.subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
  this.total = total;
  // keep isPaid flag aligned with payment
  this.isPaid = !!(this.payment && this.payment.paidAt);
};

// Instance method: addItem
OrderSchema.methods.addItem = function (this: IOrderDoc, item: Partial<IOrderItem>) {
  if (!item.productId || !item.unitPrice || !item.quantity) {
    throw new Error("productId, unitPrice and quantity are required to add an item");
  }
  const newItem: IOrderItem = {
    productId: new mongoose.Types.ObjectId(String(item.productId)),
    name: String(item.name || "Product"),
    quantity: Number(item.quantity),
    variant: item.variant,
    unitPrice: Number(item.unitPrice),
    linePrice: Math.round((Number(item.unitPrice) * Number(item.quantity) + Number.EPSILON) * 100) / 100,
    thumbnail: item.thumbnail ?? null,
    meta: item.meta ?? {},
  };
  this.items.push(newItem);
  this.recalcTotals();
  return newItem;
};

// Instance method: removeItem
OrderSchema.methods.removeItem = function (this: IOrderDoc, productId: ObjectId | string, variantId?: string | null) {
  const pid = String(productId);
  this.items = (this.items || []).filter(
    (it) => !(String(it.productId) === pid && (variantId == null || it.variant?._id === variantId))
  );
  this.recalcTotals();
};

// Instance method: markAsPaid
OrderSchema.methods.markAsPaid = async function (this: IOrderDoc, snapshot: Partial<IPaymentSnapshot> = {}) {
  this.payment = {
    method: snapshot.method ?? PaymentMethod.STRIPE,
    provider: snapshot.provider ?? null,
    transactionId: snapshot.transactionId ?? null,
    paidAt: snapshot.paidAt ?? new Date(),
    amount: snapshot.amount ?? this.total,
    cardLast4: snapshot.cardLast4 ?? null,
    cardBrand: snapshot.cardBrand ?? null,
  };
  this.isPaid = true;
  this.status = OrderStatus.PAID;
  await this.save();
};

/* -----------------------------
   PRE / POST HOOKS
   -----------------------------*/

// recalc totals before saving
OrderSchema.pre<IOrderDoc>("save", function (next) {
  try {
    this.recalcTotals();
    next();
  } catch (err:any) {
    next(err);
  }
});

/* -----------------------------
   STATICS
   -----------------------------*/

OrderSchema.statics.createForUser = async function (userId: ObjectId | string, payload: Partial<IOrder>) {
  const order = await this.create({
    userId,
    ...payload,
  });
  return order;
};

/* -----------------------------
   EXPORT MODEL
   -----------------------------*/

const Order = (mongoose.models.Order as IOrderModel) || (mongoose.model<IOrderDoc, IOrderModel>("Order", OrderSchema));

export default Order;


import mongoose, { model, models, Schema } from 'mongoose';

export  interface ICartItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  variantId?: string | null;           // optional variant id (string)
  variant?: any | null;                // variant metadata (size/color/etc.)
}

export interface ICart {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId | null;
  guestId: string | null;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  variantId: { type: String, default: null }, // store variant id (if present)
  variant: { type: Schema.Types.Mixed, default: null }, // store variant metadata (attributes)
});

const cartSchema = new Schema<ICart>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);


export const Cart = models.Cart || model<ICart>('Cart', cartSchema);

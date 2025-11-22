import { Schema, model, Document, Model, models } from 'mongoose';


/**
 * Interface for a customer review.
 */
export interface IReview  {
  user: Schema.Types.ObjectId; // Reference to the user who wrote the review
   isVerifiedPurchase: boolean;
  name: string; // User's name to display
  rating: number; // Rating from 1 to 5
  headline: string;
  isRecommendedByBuyer: boolean;
  images?: ImageState[]
  comment: string;
  createdAt: Date;
}

/**
 * Interface for individual variant attributes (e.g., { name: 'Color', value: 'Red' }).
 */
export interface IVariantAttribute {
  name: string;
  value: string;
}

/**
 * Interface for a product variant (e.g., a specific size and color combination).
 */
export interface ImageState {
  url?: string;
  public_id?: string;
  preview?: string;
}
export interface IVariant {
  sku: string; // Stock Keeping Unit for this specific variant
  priceModifier: number; // Amount to add/subtract from the base price
  stock: number;
  attributes: IVariantAttribute[];
  images?: ImageState[]; // Specific images for this variant
}

/**
 * Interface for the main Product document.
 */
export interface IProduct extends Document {
  name: string;
  description: string;
  brand: string;
  category: string; // Reference to a Category model
  basePrice: number;
  status: "ACTIVE" | "DRAFT" | "INACTIVE" | "OUT OF STOCK",
  thumbnail: ImageState // Main display image
  images: ImageState[]; // Additional gallery images
  rating: number; // Average rating, calculated from reviews
  reviewCount: number;
  reviews: IReview[];
  variants: IVariant[];
  attributes: IVariantAttribute[]; // General attributes like 'Material', 'Dimensions'
  tags: string[];
  isFeatured: boolean;
  stock: number; // Stock for simple products without variants
  totalStock: number; // A virtual property to calculate total stock
}


// --- Mongoose Schemas ---

/**
 * Schema for customer reviews. It's embedded within the Product schema.
 */
const ReviewSchema = new Schema<IReview>({
  // Assuming a User model exists for linking reviews to users
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  isVerifiedPurchase: {type: Boolean , default: false, required: true},
  rating: { type: Number, required: true, min: 1, max: 5 },
  headline: { type: String, required: true},
   images: [{ type: {
    url: { type: String },
    preview: { type: String },
    public_id: { type: String },
  },
  default: {},}],
  isRecommendedByBuyer: {type: Boolean, default: false},
  comment: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only track creation time for reviews
});

/**
 * Schema for product variants. This is also embedded in the Product schema.
 */
 const VariantSchema = new Schema<IVariant>({
  sku: { type: String, required: true, unique: true },
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
  default: {},}],
}, { _id: false }); // Don't create a separate _id for each variant object in the array
const attributeSchema = new Schema<IVariantAttribute>({
  name: {
    type: String,
    required: true
  },
  value: {
     type: String,
    required: true
  }
}, { _id: false });
/**
 * Main Product Schema.
 */
const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  status: {type: String, enum: ["ACTIVE", "DRAFT", "INACTIVE", "OUT OF STOCK"], default: "DRAFT"},
  // Assuming a Category model exists for better organization
  category: { type: String, required: true},
  basePrice: { type: Number, required: true, min: 0 },
  // 
 thumbnail: {
  type: {
    url: { type: String },
    preview: { type: String },
    public_id: { type: String },
  },
  default: {}, // ensures the field always exists as an object
},

  images: [ {
  type: {
    url: { type: String },
    preview: { type: String },
    public_id: { type: String },
  },
  default: {}, // ensures the field always exists as an object
},
],
  rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, required: true, default: 0, min: 0 },
  reviews: [ReviewSchema],
  variants: [VariantSchema],
  attributes: [attributeSchema],
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  // Default stock for products that don't have variants.
  // If variants exist, their individual stock levels should be used.
  stock: { type: Number, required: true, default: 0, min: 0 },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
  toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
  toObject: { virtuals: true }, // Ensure virtuals are included when converting to object
});

// --- Virtuals ---

// Create a virtual property 'totalStock' that calculates the stock from variants if they exist.
ProductSchema.virtual('totalStock').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

// --- Indexes ---

// Create indexes to improve query performance on commonly searched fields.
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ category: 1, basePrice: 1 });
ProductSchema.index({ isFeatured: -1 });

/**
 * The Mongoose model for the Product.
 */
export const Product: Model<IProduct> = models.Product ||  model<IProduct>('Product', ProductSchema);
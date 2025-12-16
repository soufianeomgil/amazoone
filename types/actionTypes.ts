import { IAddress } from "@/models/address.model";
import { OrderStatus } from "@/models/order.model";
import { IReview } from "@/models/product.model";
import { ObjectId, Schema } from "mongoose";

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface MediaAsset {
  mediaId: string;
  type: MediaType;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ShippingDetails {
  weight: number;
  weightUnit: 'kg' | 'lb';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  isEligibleForPrime: boolean;
}
// USE THIS FOR ADDING A REVIEW AS A TYPE INTERFACE;
// export interface Review {
//   userId: string;
//   rating: 1 | 2 | 3 | 4 | 5;
//   title: string;
//   commentBody: string;
//   images?: string[];
//   isVerifiedPurchase: boolean;
//   createdAt: Date;
// }
// export interface ImageState {
//           url?: string | undefined,
//           public_id?: string | undefined,
//           preview?: string | undefined,
// }
// export interface ProductVariant {
//     sku: string; // Stock Keeping Unit for this specific variant
//     priceModifier: number | string | undefined; // Amount to add/subtract from the base price
//     stock: number;
//     attributes: ProductAttribute[];
//     images?: ImageState[]; 
// }

export interface IProduct {
  title: string;
  description: string;
  brand: string;
  sku: string;
  price: number;
  salePrice?: number;
  currency: 'USD' | 'EUR' | 'MAD';
  quantity: number;
  categoryIds: string[];
  tags?: string[];
  status: ProductStatus;
  isFeatured: boolean;
  mediaAssets: MediaAsset[];
  shippingDetails: ShippingDetails;
  hasVariants: boolean;
  variants: ProductVariant[];
  sellerId: string;
  averageRating: number;
  reviewCount: number;
  recentReviews: IReview[];
  technicalSpecifications: ProductAttribute[];
}
 


// export interface CreateProductParams {
//   name: string;
//   description: string;
//   brand: string;
//   category: string;
//   status: "ACTIVE" | "DRAFT" | "INACTIVE" | "OUT OF STOCK";
//   basePrice: number | string;
//   stock?: number | string | undefined;
//   imageUrl: ImageState; // Main display image
//   images: ImageState[]; 
//   tags: string[];
//   isFeatured: boolean;
//   variants: ProductVariant[];
//   attributes: ProductAttribute[]

// }
export interface GetSingleProductParams  {
  productId: string;
}
export interface ToggleWishlistParams {
  productId: string;
}
export interface ImageState {
  url?: string;
  public_id?: string;
  preview?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  sku: string;
  priceModifier?: number | string;
  stock: number | string;
  attributes: ProductAttribute[];
  images?: ImageState[];
}

export interface CreateProductParams {
  name: string;
  description: string;
  brand: string;
  category: string;
  status: "ACTIVE" | "DRAFT" | "INACTIVE" | "OUT OF STOCK";
  basePrice: number | string;
  stock?: number | string;
  imageUrl?: ImageState;
  images?: ImageState[];
  tags?: string[];
  isFeatured?: boolean;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}
interface CreditCardInfo {
  cardholderName: string;
  last4Digits: string; // Only store the last 4 digits for display
  expirationMonth: number;
  expirationYear: number;
  cardType: string; // e.g., "Visa", "MasterCard"
  billingAddressId: string; // Link to an address in the user's address book
}
enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  COD = "CASH ON DELIVERY" ,
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  GIFT_CARD_BALANCE = 'GIFT_CARD_BALANCE',
}
interface PaymentMethod {
  paymentMethodType: PaymentMethodType;
  token: string; // A secure token from a payment processor (e.g., Stripe, Braintree)
  details: CreditCardInfo; // Could be a union type for different payment methods
  isDefault: boolean;
}
export interface IUser {
   _id: string;
  // --- Core Account Information ---
  fullName: string;
  email: string;
  isVerified: boolean;
  phoneNumber?: string;
  hashedPassword: string; // Stored as a hash, never plaintext
  gender: "male" | "female",
  isAdmin: boolean;
  // --- Profile & Personalization ---
  profilePictureUrl?: string;

  
  // --- Related Data Collections (Relationships) ---
  addresses: Schema.Types.ObjectId[];
  paymentMethods: PaymentMethod[];
  orderHistory: Schema.Types.ObjectId[]; // Array of order IDs
  browsingHistory: Schema.Types.ObjectId[]; // Array of product IDs
  wishLists: Schema.Types.ObjectId[]; // Array of wish list IDs
  

  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthCredentials {
  email: string;
  gender: "male" | "female";
  fullName: string;
 
  password: string;
 
}
export interface GetAddressDetailsParams {
  id:string;
}
export interface SignInWithOAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    email: string;
    lastName: string;
    name: string;
    image: string;
  };
}
export interface  AddAddressParams  { 
     name: string;
     addressLine1: string;
     addressLine2?: string;
     city: string;
     postalCode: string;
     state: string;
    
     phone: number | string;

     isDefault: boolean;
     DeliveryInstructions?:string;
}
export interface EditAddressParams extends AddAddressParams {
  id: string;
}

import { IAddress } from "@/models/address.model";
import { OrderStatus } from "@/models/order.model";

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
 
  technicalSpecifications: ProductAttribute[];
}
 
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
  isTrendy:boolean;
  isBestSeller: boolean;
  listPrice:number | string;
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

export interface AuthCredentials {
  email: string;
  gender: "male" | "female"
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


export interface SaleData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductData {
  category: string;
  value: number;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled';
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface KpiData {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}
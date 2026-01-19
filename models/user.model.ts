import mongoose, { Schema } from "mongoose"
// --- Enums for specific, controlled values ---

enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRIAL = 'TRIAL',
  PAST_DUE = 'PAST_DUE',
}

enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  COD = "CASH ON DELIVERY" ,
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  GIFT_CARD_BALANCE = 'GIFT_CARD_BALANCE',
}

// --- Sub-documents and related interfaces ---

interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string; // Optional
  city: string;
  stateOrRegion: string;
  postalCode: string;
 
  phoneNumber?: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

interface CreditCardInfo {
  cardholderName: string;
  last4Digits: string; // Only store the last 4 digits for display
  expirationMonth: number;
  expirationYear: number;
  cardType: string; // e.g., "Visa", "MasterCard"
  billingAddressId: string; // Link to an address in the user's address book
}

interface PaymentMethod {
  paymentMethodType: PaymentMethodType;
  token: string; // A secure token from a payment processor (e.g., Stripe, Braintree)
  details: CreditCardInfo; // Could be a union type for different payment methods
  isDefault: boolean;
}

interface PrimeMembership {
  status: MembershipStatus;
  startDate: Date;
  nextBillingDate: Date;
  plan: 'monthly' | 'annual';
}

// --- The Core User Schema ---

export interface IUser {
  _id:string;
  // --- Core Account Information ---
  fullName: string;
  email: string;
  profileCompleted: boolean;
  isVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  gender: "male" | "female",
  isAdmin: boolean;
  // --- Profile & Personalization ---
  profilePictureUrl?: string;
 interests: {
  tag: string;
  score: number;
  source: 'manual' | 'auto';
  updatedAt: Date;
}[];
  
  // --- Related Data Collections (Relationships) ---
  addresses: Schema.Types.ObjectId[];
  paymentMethods: PaymentMethod[];
  orderHistory: Schema.Types.ObjectId[]; // Array of order IDs
  browsingHistory: {
    product: Schema.Types.ObjectId[],
    viewedAt: Date,
    viewCount:number
  }[] // Array of product IDs
  wishLists: Schema.Types.ObjectId[]; // Array of wish list IDs
  

  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<IUser>({
  fullName:  {
     type: String,
     required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  interests: [
  {
    tag: {
      type: String,
      required: true,
      index: true, // important for recommendations
      lowercase: true,
      trim: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    source: {
      type: String,
      enum: ['manual', 'auto'],
      default: 'manual'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
],

 
   isVerified: {
     type: Boolean,
     default: false
   },
   profileCompleted: {
  type: Boolean,
  default: false
},

   isAdmin: {
       type: Boolean,
     default: false
   },
   phoneVerified: {
       type: Boolean,
     default: false
   },
   gender:  {
     type: String,
     enum: ["male", "female"],
     default: "female"
   },
   phoneNumber: {
     type : String
   },
   profilePictureUrl: {
     type:String
   },
   orderHistory: [{
       type: Schema.Types.ObjectId,
       ref: "Order",
       default: []
   }],
    browsingHistory: [
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    viewCount: {
      type: Number,
      default: 1
    }
  }
]
,
    wishLists: [{
       type: Schema.Types.ObjectId,
       ref: "Product",
       default: []
   }],
    addresses: [{
       type: Schema.Types.ObjectId,
       ref: "Address",
        default: []
   }],
   lastLogin: {
      type: Date,
      default: Date.now()
   },


}, {timestamps: true})
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default User;
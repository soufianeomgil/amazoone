import { model, models, Schema, Types } from "mongoose"

interface IvariantSnapshot {
  variantId: string;
  attributes: {
    name: string;
    value: string;
  }[];
};

export interface IReview {
  _id?: Types.ObjectId
  product: Types.ObjectId;
  /* -------------------- AUTHOR -------------------- */
  user: Types.ObjectId
  userName: string;

  /* -------------------- TRUST SIGNALS -------------------- */
  isVerifiedPurchase: boolean
  orderId?: Types.ObjectId

  /* -------------------- RATING -------------------- */
  rating: number // 1 → 5

  /* -------------------- REVIEW CONTENT -------------------- */
  headline: string
  comment: string

  /* -------------------- MEDIA -------------------- */
  images: {
    url: string
    preview?: string
    public_id?: string
    type?: "image" | "video"
  }[]

  /* -------------------- VARIANT SNAPSHOT -------------------- */
  variantSnapshot?: IvariantSnapshot

  /* -------------------- HELPFUL VOTING -------------------- */
  helpfulVotes: number
  notHelpfulVotes: number

  voters: {
    user: Types.ObjectId
    vote: "HELPFUL" | "NOT_HELPFUL"
  }[]

  /* -------------------- RECOMMENDATION -------------------- */
  isRecommendedByBuyer: boolean

  /* -------------------- MODERATION -------------------- */
  status: "PENDING" | "APPROVED" | "REJECTED" | "REPORTED"
  reportCount: number

  /* -------------------- EDIT TRACKING -------------------- */
  isEdited: boolean
  editedAt?: Date

  /* -------------------- SELLER REPLY -------------------- */
  sellerReply?: {
    message: string
    repliedAt: Date
  }

  /* -------------------- TIMESTAMPS -------------------- */
  createdAt?: Date
  updatedAt?: Date
}
const ReviewVariantSnapshotSchema = new Schema<IvariantSnapshot>(
  {
    variantId: {
      type: String, // or ObjectId if variants are separate docs
      required: true,
    },
    attributes: [
      {
        _id: false,
        name: String,
        value: String,
      },
    ],
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    // Author
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userName: {
      type: String,
      required: true
    },



    // Trust signals
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order" // proof of purchase
    },

    // Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true
    },

    // Review content
    headline: {
      type: String,
      required: true,
      maxlength: 120
    },

    comment: {
      type: String,
      required: true,
      maxlength: 5000
    },

    // Media (Amazon-style)
    images: [
  {
    _id: false, // 🔥 IMPORTANT
    url: {
      type: String,
      required: true,
    },
    preview: {
      type: String,
    },
    public_id: {
      type: String,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
],


    // Variant context (VERY important)
    variantSnapshot: ReviewVariantSnapshotSchema ,

    // Helpful voting system
    helpfulVotes: {
      type: Number,
      default: 0
    },

    notHelpfulVotes: {
      type: Number,
      default: 0
    },

    voters: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        vote: {
          type: String,
          enum: ["HELPFUL", "NOT_HELPFUL"]
        }
      }
    ],

    // Recommendation
    isRecommendedByBuyer: {
      type: Boolean,
      default: false
    },

    // Moderation & lifecycle
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "REPORTED"],
      default: "APPROVED",
      index: true
    },

    reportCount: {
      type: Number,
      default: 0
    },

    // Edits
    isEdited: {
      type: Boolean,
      default: false
    },

    editedAt: {
      type: Date
    },

    // Seller reply (Amazon has this)
    sellerReply: {
      message: String,
      repliedAt: Date
    }
  },
  {
    timestamps: true
  }
);
const Review = models.Review || model("Review", ReviewSchema)
export default Review;
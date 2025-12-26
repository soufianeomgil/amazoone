import z from "zod";

export const LoginValidationSchema = z.object({
  email: z.email({ message: "please provide a valid email address!" }),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z.string().min(1, { message: "name is required" }),
  image: z.string().url({ message: "invalid image URL" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." })
    .optional(),
  provider: z.string().min(1, { message: "provider name is required" }),
  providerAccountId: z.string().min(1, { message: "ProviderAccount ID is required" }),
});
// const ImageObject = z.object({
//   // File exists only in browsers; validate cautiously
//   // Try to validate `File` in browser; if `File` is undefined (server), accept null/undefined/string
//   file: (() => {
//     if (typeof File !== "undefined") {
//       // In browser environment we can assert instanceof File
//       return z.instanceof(File).optional().nullable();
//     }
//     // On server (Node) `File` may not exist — accept unknown (will be ignored server-side anyway)
//     return z.any().optional().nullable();
//   })(),
//   preview: z.string().url().optional().or(z.string().optional()), // allow preview strings (data urls or object URLs)
//   url: z.string().url().optional(), // final uploaded image URL (Cloudinary)
//   alt: z.string().optional(),
// });

// export const productSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   brand: z.string().min(1, "Brand is required"),
//   category: z.string().min(1, "Category is required"),
//   basePrice: z
//     .union([z.string(), z.number()])
//     .refine((v) => {
//       const n = typeof v === "string" ? Number(v) : v;
//       return !Number.isNaN(n) && Number(n) >= 0;
//     }, { message: "Base price must be a non-negative number" }),
//   stock: z
//     .union([z.string(), z.number()])
//     .refine((v) => {
//       const n = typeof v === "string" ? Number(v) : v;
//       return Number.isInteger(Number(n)) && Number(n) >= 0;
//     }, { message: "Stock must be an integer ≥ 0" }),
//   tags: z.string().optional(),
//   isFeatured: z.boolean().optional().default(false),
//   status: z.enum(["ACTIVE", "DRAFT", "INACTIVE", "OUT OF STOCK"]).optional().default("DRAFT"),

//   // NEW: main image object (thumbnail)
//   imageUrl: ImageObject,

//   // NEW: images array (gallery)
//   images: z.array(ImageObject).optional().default([]),

//   // Variants — if present, each variant may have its own images
//   variants: z.array(z.object({
//     sku: z.string().min(1),
//     priceModifier: z.union([z.string(), z.number()]).optional(),
//     stock: z.union([z.string(), z.number()]).optional(),
//     attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
//     images: z.array(ImageObject).optional().default([]), // validate variant-level images too
//   })).optional().default([]),

//   // Attributes (general)
//   attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
// });
// imports


/* ImageObject (same as before) */
// export const ImageObject = z.object({
//   preview: z.string().optional(), // data URL / blob URL or remote preview
//   public_id: z.url().optional(),
//   url: z.string().optional(),
// }).optional();

// // Updated product schema: more flexible types to match client shapes
// export const productSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   brand: z.string().min(1, "Brand is required"),
//   category: z.string().min(1, "Category is required"),
//   basePrice: z
//     .union([z.string(), z.number()])
//     .refine((v) => {
//       const n = typeof v === "string" ? Number(v) : v;
//       return !Number.isNaN(n) && Number(n) >= 0;
//     }, { message: "Base price must be a non-negative number" }),

//   // Make stock optional and accept string | number
//   stock: z
//     .union([z.string(), z.number()])
//     .optional()
//     .refine((v) => {
//       if (typeof v === "undefined") return true;
//       const n = typeof v === "string" ? Number(v) : v;
//       return Number.isInteger(Number(n)) && Number(n) >= 0;
//     }, { message: "Stock must be an integer ≥ 0" }),

//   // Accept tags as either string (comma separated) or array of strings
//   tags: z.union([ z.string(), z.array(z.string()) ]).optional(),

//   isFeatured: z.boolean().optional().default(false),
//   status: z.enum(["ACTIVE", "DRAFT", "INACTIVE", "OUT OF STOCK"]).optional().default("DRAFT"),

//   // Make imageUrl optional (so missing won't fail validation)
//   imageUrl: z.object({
//   url: z.string().url().optional(), // or .nullable()
//   public_id: z.string().optional(),
//   preview: z.string().optional(),
// }).optional(),

// images: z.array(z.object({
//   url: z.url(),
//   public_id: z.string(),
// })).optional(),

//   variants: z.array(z.object({
//     sku: z.string().min(1),
//     priceModifier: z.union([z.string(), z.number()]).optional(),
//     stock: z.union([z.string(), z.number()]).optional(),
//     attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
//     images: z.array(ImageObject).optional().default([]),
//   })).optional().default([]),

//   attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
// });
export const ImageObject = z.object({
  url: z.string().url().optional(),
  public_id: z.string().optional(),
  preview: z.string().optional(),
})
export const GetOrderDetailsSchema = z.object({
  orderId: z.string().min(1, "Order ID is required")
})
export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  isTrendy: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),

  basePrice: z
    .union([z.string(), z.number()])
    .refine((v) => {
      const n = typeof v === "string" ? Number(v) : v;
      return !Number.isNaN(n) && n >= 0;
    }, { message: "Base price must be a non-negative number" }),
  listPrice: z
    .union([z.string(), z.number()])
    .refine((v) => {
      const n = typeof v === "string" ? Number(v) : v;
      return !Number.isNaN(n) && n >= 0;
    }, { message: "Base price must be a non-negative number" }),
 
  stock: z
    .union([z.string(), z.number()])
    .optional()
    .refine((v) => {
      if (v === undefined) return true;
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isInteger(n) && n >= 0;
    }, { message: "Stock must be an integer ≥ 0" }),

 //  tags: z.union([z.string(), z.array(z.string())]).optional(),
 tags: z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) return []; // default empty array
    if (typeof val === "string") return val.split(",").map((t) => t.trim());
    return val;
  }),

  isFeatured: z.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "INACTIVE", "OUT OF STOCK"]).optional().default("DRAFT"),

  imageUrl: ImageObject,
  images: z.array(ImageObject).optional().default([]),

  variants: z.array(
    z.object({
      sku: z.string().min(1),
      priceModifier: z.union([z.string(), z.number()]).optional(),
      stock: z.union([z.string(), z.number()]),
      attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
      images: z.array(ImageObject).optional().default([]),
    })
  ).optional().default([]),

  attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional().default([]),
});
export const GetAddressDetailsSchema = z.object({
  id: z.string().min(1, {message: "Address Id is required"})
})
export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"], { message: "Invalid provider type" }),
  providerAccountId: z.string().min(1, { message: "provider account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "name is required" }),
    image: z.string().url({ message: "invalid image URL" }).optional(),
    lastName: z.string().min(3),
    email: z.string().email({ message: "Invalid email address" }),
  }),
});
export const SignUpValidationSchema = z.object({
  gender: z.enum(["male", "female"], { message: "gender Type is not valid!" }),
 
  fullName: z.string().min(1, { message: "fullName is required!" }),
 
  email: z.string().email({ message: "please provide a valid email address!" }),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
export const UsersSchema = z.object({
  

  // --- Core Account Information ---
  fullName: z.string().min(1),
  email: z.string().email(),
  isVerified: z.boolean(),
  phoneNumber: z.string().optional(),
  hashedPassword: z.string().min(1), // hashed, so just require non-empty
  gender: z.enum(["male", "female"]),
  isAdmin: z.boolean(),

  // --- Profile & Personalization ---
  profilePictureUrl: z.string().url().optional(),

  // --- Related Data Collections (Relationships) ---
  
});
export const GetSingleProductSchema = z.object({
  productId: z.string().min(1, {message: "product Id is required"})
})


export const ToggleWishlistSchema  = z.object({
  productId: z.string().min(1, {message: "Product Id is required"})
})


/**
 * Zod schema for adding/editing an address.
 
 * - Validates Moroccan phone numbers: accepts +212... or 0... with leading 5/6/7
 * - Validates Moroccan postal codes (5 digits)
 */
export const VariantAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
});
export const VariantSchema = z.object({
  _id: z.string().optional(),
  sku: z.string().optional(),
  priceModifier: z.number(),
  stock: z.number().optional(),
  attributes: z.array(VariantAttributeSchema).optional(),
  images: z
    .array(
      z.object({
        url: z.string().optional(),
        preview: z.string().optional(),
        public_id: z.string().optional(),
      })
    )
    .optional(),
});
export const SaveForLaterSnapshotSchema = z.object({
  price: z.number(),
  thumbnail: z.string(),
  title: z.string(),
  sku: z.string().optional()
});
export const CancelOrderSchema = z.object({
  orderId: z.string().min(1, {message: "Order ID is required"}),
  reason: z.string().optional()
})
export const SaveForLaterPayloadSchema = z.object({
  productId: z.string().min(1, "productId is required"),

  variantId: z.string().nullable().optional(),

  variant: VariantSchema.nullable(),

  quantity: z.number().int().positive().optional(),

  note: z.string().optional(),

  snapshot: SaveForLaterSnapshotSchema.optional(),
});

// ----- Final params schema -----
export const AddToSaveForLaterSchema = z.object({
  payload: SaveForLaterPayloadSchema,
  userId: z.string().optional(),
});
export const AddAddressSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" })
    .transform((s) => s.trim()),

  addressLine1: z
    .string()
    .min(1, { message: "Address is required" })
    .max(200, { message: "Address is too long" })
    .transform((s) => s.trim()),

  // optional second line (nullable allowed)
  addressLine2: z
    .string()
    .max(200, { message: "Address line is too long" })
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() : v)),

  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(100, { message: "City name is too long" })
    .transform((s) => s.trim()),

  // Morocco postal codes are 5 digits
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" }),

 
  state: z.string().min(1, {message: "state feild is required"}),
  // Phone: accept +2125XXXXXXXX or 0[5|6|7]XXXXXXXX (10 digits total after leading 0)
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^(\+212|0)(5|6|7)\d{8}$/, {
      message:
        "Invalid phone. Use +212XXXXXXXXX or 0XXXXXXXXX (Moroccan numbers start with 5/6/7).",
    }),

  isDefault: z.boolean().optional().default(false),

  deliveryInstructions: z
    .string()
    .max(500, { message: "Delivery instructions are too long" })
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() : v)),
});
export const MoveToCartSchema = z.object({
 id: z.string().min(1, { message: "saved item Id is required" }),
})
export const RemoveFromSaveSchema = z.object({
 id: z.string().min(1, { message: "Id is required" }),
})
export const EditAddressSchema = AddAddressSchema.extend({
  id: z.string().min(1, { message: "Address Id is required" }),
});
export const CreateListSchema = z.object({
  name: z.string().min(1, {message: "list name is required"}).max(120).optional().default("Wishlist"),
  isPrivate: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
});


// export const writeReviewSchema = z.object({
//   rating: z.number().min(1, "Please select a rating"),
//   headline: z
//     .string()
//     .min(5, "Title is too short")
//     .max(120, "Title is too long"),
//   comment: z
//     .string()
//     .min(20, "Review must be at least 20 characters")
//     .max(5000),
//   recommend: z.boolean(),
//   variantSnapshot: z.any().optional(),
// })

// export type WriteReviewFormValues = z.infer<typeof writeReviewSchema>
const ReviewImageSchema = z.object({
  url: z.string().url(),
  preview: z.string().url().optional(),
  public_id: z.string().min(1),
  type: z.enum(["image", "video"]).default("image"),
});

const VariantSnapshotSchema = z.object({
  variantId: z.string().optional(),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ).optional(),
});
export const EditProfileSchema = z.object({
  fullName: z.string().min(1, {message: "fullName is required"}),
  profilePic: z.url({message: "Please provide a valid URL"}).optional(),
   phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^(\+212|0)(5|6|7)\d{8}$/, {
      message:
        "Invalid phone. Use +212XXXXXXXXX or 0XXXXXXXXX (Moroccan numbers start with 5/6/7).",
    }),
  email: z.email({message: "Email address is required"}),
  password: z.string().optional(),
  gender: z.enum(["male","female"], {message: "please provide a valid gender type"}),

})
export const DeleteProductSchema = z.object({
  productId: z.string().min(1, {message: "Product ID is required"})
})
export const EditUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  profilePic: z.url().optional(),
  email: z
    .string()
    .email("Invalid email address"),

  gender: z.enum(["male", "female"]),

  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(20, "Phone number is too long"),

  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .max(100)
    .optional(),
});
export const trackProductViewSchema = z.object({
  userId: z.string().min(1,'userId is required'),
  productId: z.string().min(1,'productId is required'),
  productTags: z.array(z.string().min(1))
})
export const UpdateUserInterestsSchema = z.object({
  interests: z
    .array(z.string().min(1))
    .min(1, "Select at least one interest")
    .max(20, "Too many interests"),
});

export type UpdateUserInterestsParams = z.infer<
  typeof UpdateUserInterestsSchema
>;


export const CreateReviewSchema = z.object({
  productId: z.string().min(1, {message: "product ID is required"}),
  rating: z.number().min(1).max(5),
  headline: z.string().min(3, {message: "review headline is required"}).max(120),
  comment: z.string().min(10, {message: "review body must be at least 10 characters long"}).max(5000),

  images: z.array(ReviewImageSchema).max(5, {message: "review images should not exeed 5"}).optional(),

  isRecommendedByBuyer: z.boolean().optional().default(false),
  variantSnapshot: VariantSnapshotSchema.optional(),
});



export type CreateReviewParams = z.infer<typeof CreateReviewSchema>;
export type AddAddressInput = z.infer<typeof AddAddressSchema>;

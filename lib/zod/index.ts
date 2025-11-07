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

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),

  basePrice: z
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
 
  fullName: z.string().min(1, { message: "lastName is required!" }),
 
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

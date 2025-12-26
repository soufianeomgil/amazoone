"use server"

import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error"
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { EditUserProfileSchema, ToggleWishlistSchema, UpdateUserInterestsParams, UpdateUserInterestsSchema } from "@/lib/zod";
import { auth } from "@/auth"
import { Product } from "@/models/product.model";
import User, { IUser } from "@/models/user.model";
import { ToggleWishlistParams } from "@/types/actionTypes";
import bcrypt from "bcryptjs";
import z from "zod";
import { IAddress } from "@/models/address.model";
export async function getCurrentUser(): Promise<ActionResponse<{user: IUser | null}>>{
  const currentUser = await auth()
 if(!currentUser?.user)  return {
   success: false,
   data: {user: null}
 }
     try {
        await connectDB()
        const user = await User.findById(currentUser?.user.id)
        .populate("wishLists")
        if(!user) throw new NotFoundError('User')
          return {
            success: true,
            data:  {user: JSON.parse(JSON.stringify(user))}
          }
     } catch (error) {
        return handleError(error) as ErrorResponse
     }
}
export async function toggleAddToWishlist(params: ToggleWishlistParams): Promise<ActionResponse> {
  const validatedResult = await action({ params, schema: ToggleWishlistSchema, authorize: true });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const userId = validatedResult.session?.user.id;
  const { productId } = validatedResult.params!;

  try {
    await connectDB();

    // find product & user
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product");

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User");

    // normalize IDs to string for comparison
    const pidStr = String(product._id);
    const wishListIds = (user.wishLists || []).map((id: any) => String(id));

    let wishlisted = false;
    if (wishListIds.includes(pidStr)) {
      // remove from wishlist
      user.wishLists = (user.wishLists || []).filter((id: any) => String(id) !== pidStr);
      wishlisted = false;
    } else {
      // add to wishlist
      user.wishLists = [...(user.wishLists || []), product._id];
      wishlisted = true;
    }

    await user.save();

    return {
      success: true,
      message: wishlisted ? "Product added to wishlist." : "Product removed from wishlist.",
    //   data: {
    //     productId: pidStr,
    //     wishlisted,
    //     wishlistsCount: user.wishLists.length,
    //   },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
interface EditProfileParams {
  name:string;
  email: string;
  profilePic?: string;
  gender: 'male' | "female"
  phone:string;
  password?:string
}
export async function editUserProfile(
  params: EditProfileParams
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: EditUserProfileSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const session = validatedResult.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { name, email, password, phone, gender, profilePic } = validatedResult.params!;

  try {
    await connectDB();

    const user = (await User.findById(session.user.id)) 
    if (!user) throw new NotFoundError("User");

    /* -------------------- EMAIL UNIQUENESS -------------------- */
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        throw new Error("Email is already in use");
      }
      user.email = email;
    }

    /* -------------------- BASIC PROFILE UPDATES -------------------- */
    if (name && name !== user.fullName) {
      user.fullName = name;
    }

    if(profilePic && profilePic !== user.profilePictureUrl) {
       user.profilePictureUrl = profilePic;
    }

    if (phone !== undefined && phone !== user.phoneNumber) {
      user.phoneNumber = phone;
    }

    if (gender && gender !== user.gender) {
      user.gender = gender;
    }

    /* -------------------- PASSWORD UPDATE (OPTIONAL) -------------------- */
    if (password) {
      const hashed = await bcrypt.hash(password,12); // 🔐 your existing util
      user.hashedPassword = hashed;
    }

    await user.save();

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



export async function updateUserInterests(
  params: { interests: string[] }
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: z.object({
      interests: z.array(z.string().min(1)).max(20),
    }),
    authorize: true,
  })

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse

  const session = validated.session
  if (!session?.user?.id) throw new UnAuthorizedError("")

  try {
    await connectDB()

    const user = await User.findById(session.user.id)
    if (!user) throw new NotFoundError("User")

    const now = new Date()

    /** ✅ Merge with existing interests (DON’T wipe scores) */
    const existingMap = new Map(
      user.interests.map((i: any) => [i.tag, i])
    )

    const updatedInterests = params.interests.map(tag => {
      const existing = existingMap.get(tag)

      if (existing) {
        const rawExisting = (existing && typeof (existing as any).toObject === "function")
          ? (existing as any).toObject()
          : (existing as any)

        return {
          ...rawExisting,
          updatedAt: now,
          source: "manual",
        }
      }

      return {
        tag,
        score: 50,
        source: "manual",
        updatedAt: now,
      }
    })

    user.interests = updatedInterests
    await user.save()

    return { success: true }
  } catch (err) {
    return handleError(err) as ErrorResponse
  }
}

export async function getAdminUsersOverview(): Promise<
  ActionResponse<{
    users: {
      _id: string
      fullName: string
      email: string
      isVerified: boolean
      createdAt: Date
      totalSpent: number
      ordersCount: number
      defaultAddress: IAddress | null
    }[]
  }>
> {
  try {
    await connectDB()

    const users = await User.aggregate([
      // 1️⃣ Join orders by userId (CORRECT)
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },

      // 2️⃣ Join addresses
      {
        $lookup: {
          from: "addresses",
          localField: "addresses",
          foreignField: "_id",
          as: "addresses",
        },
      },

      // 3️⃣ Filter paid / delivered orders (REAL revenue)
      {
        $addFields: {
          paidOrders: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: {
                $in: ["$$order.status", ["PAID", "DELIVERED"]],
              },
            },
          },
        },
      },

      // 4️⃣ Compute metrics
      {
        $addFields: {
          ordersCount: { $size: "$paidOrders" },
          totalSpent: {
            $sum: "$paidOrders.total",
          },
          defaultAddress: {
            $first: {
              $filter: {
                input: "$addresses",
                as: "addr",
                cond: { $eq: ["$$addr.isDefault", true] },
              },
            },
          },
        },
      },

      // 5️⃣ Shape admin response
      {
        $project: {
          fullName: 1,
          email: 1,
          isVerified: 1,
          createdAt: 1,
          ordersCount: 1,
          totalSpent: { $ifNull: ["$totalSpent", 0] },
          defaultAddress: {
            name: 1,
            city: 1,
            addressLine1: 1,
            phone: 1,
          },
        },
      },

      // 6️⃣ Sort by value
      {
        $sort: { totalSpent: -1 },
      },
    ])

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

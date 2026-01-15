"use server"
import { ROUTES } from "@/constants/routes";
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { CreateListSchema, EditWishlistSchema } from "@/lib/zod";
import { IVariant, Product } from "@/models/product.model";
import SavedList, { ISavedItem, ISavedList } from "@/models/savedList.model";
// server/actions/createSavedListAction.ts
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";





type CreateListParams = z.infer<typeof CreateListSchema>;

export async function createSavedListAction(
  params: CreateListParams
): Promise<ActionResponse<{ list: ISavedList }>> {
  const validated = await action({
    params,
    schema: CreateListSchema,
    authorize: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { name, isPrivate, isDefault } = validated.params as CreateListParams;

  try {
    await connectDB();

    // limit lists
    const existingCount = await SavedList.countDocuments({
      userId: session.user.id,
      archived: { $ne: true },
    });

    if (existingCount >= 20) {
      throw new Error("Max saved lists reached");
    }

    const mongoSession = await mongoose.startSession();
    let created: ISavedList | null = null;

    await mongoSession.withTransaction(async () => {
      // 👇 determine final default value
      const shouldBeDefault = existingCount === 0 || isDefault === true;

      // If this list should be default → unset others
      if (shouldBeDefault) {
        await SavedList.updateMany(
          { userId: session.user.id, isDefault: true },
          { $set: { isDefault: false } },
          { session: mongoSession }
        );
      }

      created = (
        await SavedList.create(
          [
            {
              userId: session.user.id,
              name,
              isPrivate,
              isDefault: shouldBeDefault,
            },
          ],
          { session: mongoSession }
        )
      )[0];
    });

    mongoSession.endSession();

    revalidatePath(ROUTES.mywishlist);

    return {
      success: true,
      data: { list: JSON.parse(JSON.stringify(created)) },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}


const ToggleItemSchema = z.object({
  listId: z.string().min(1),
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  priceSnapshot: z.number().optional(),
  thumbnail: z.string().optional(),
  note: z.string().max(300).optional(),
});

type ToggleItemParams = z.infer<typeof ToggleItemSchema>;

export default async function toggleSavedListItemAction(params: ToggleItemParams): Promise<ActionResponse> {
  const validated = await action({ params, schema: ToggleItemSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("")

  const { listId, productId, variantId, priceSnapshot, thumbnail, note } = validated.params as ToggleItemParams;

  try {
    await connectDB();

    // basic validation of ObjectId shape is left to Mongoose
    const mongoSession = await mongoose.startSession();
    let result: { added: boolean; list: any } | null = null;
     
    await mongoSession.withTransaction(async () => {
      const list = await SavedList.findOne({ _id: listId, userId: session.user.id }).session(mongoSession) 
      if (!list) throw new NotFoundError("Saved list");

      // optional guard: max items per list, e.g., 500
      if (!list.hasItem(productId, variantId) && list.items.length >= 500) {
        throw new Error("Saved list reached maximum items");
      }

      const exists = list.hasItem(productId, variantId);
      if (exists) {
        await list.removeItem(productId, variantId);
        result = { added: false, list };
      } else {
        await list.addItem({ productId, variantId, priceSnapshot, thumbnail, note });
        result = { added: true, list };
      }
    });

    mongoSession.endSession();

    return { success: true, data: result }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

const DeleteListSchema = z.object({
  listId: z.string().min(1),
  soft: z.boolean().optional().default(true), // default to soft-delete (archive)
});

type DeleteListParams = z.infer<typeof DeleteListSchema>;

export  async function deleteSavedListAction(params: DeleteListParams): Promise<ActionResponse> {
  const validated = await action({ params, schema: DeleteListSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("")

  const { listId, soft } = validated.params as DeleteListParams;

  try {
    await connectDB();

    const mongoSession = await mongoose.startSession();

    await mongoSession.withTransaction(async () => {
      const list = await SavedList.findOne({ _id: listId, userId: session.user.id }).session(mongoSession);
      if (!list) throw new NotFoundError("Saved list");

      if (soft) {
        list.archived = true;
        await list.save({ session: mongoSession });
      } else {
        await SavedList.deleteOne({ _id: listId, userId: session.user.id }).session(mongoSession);
      }
    });

    mongoSession.endSession();

    return { success: true, message: "Saved list removed" }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}


const GetListsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  includeArchived: z.boolean().optional().default(false),
});

type GetListsParams = z.infer<typeof GetListsSchema>;


type GetSavedListsData = {
  lists: ISavedList[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};
export async function getSavedListsAction(params: GetListsParams): Promise<ActionResponse<GetSavedListsData>> {
  const validated = await action({ params, schema: GetListsSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError('')

  const { page, limit, includeArchived } = validated.params as GetListsParams;

  try {
    await connectDB();

    const query: any = { userId: session.user.id };
    if (!includeArchived) query.archived = { $ne: true };

    const skip = Math.max(0, page - 1) * limit;
    const [lists, total] = await Promise.all([
      SavedList.find(query)
      .populate({path: "items.productId", model: Product})
      .sort({ isDefault: -1, updatedAt: -1 })
      .skip(skip).limit(limit),
      SavedList.countDocuments(query),
    ]);

    return { success: true, data: { lists: JSON.parse(JSON.stringify(lists)), meta: { total, page, limit } } }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}




interface AddToListParams {
  listId: string;
  productId: string;
  variantId?: string;
  variant?: IVariant;
  thumbnail?: string;
}

// export async function addItemToSavedListAction(params: AddToListParams): Promise<ActionResponse> {
//    const validatedResult = await action({params,schema:AddItemToListSchema,authorize:true})
//    if(validatedResult instanceof Error) {
//      return handleError(validatedResult) as ErrorResponse;
//    }
//   try {
//     await connectDB()

//     const { listId, productId, variantId, thumbnail, variant } = validatedResult.params!;

//     const list = await SavedList.findById(listId) 

//     if (!list) throw new NotFoundError("List")

//     // Prevent duplicates
//     const alreadyExists = list.items.some(
//       (i) =>
//         String(i.productId) === String(productId) &&
//         (!variantId || i.variantId === variantId)
//     );

//     if (alreadyExists) {
//       return { success: true, message: "Item already in list" };
//     }

//     list.items.push({
//       productId: new mongoose.Types.ObjectId(productId),
//       variantId,
//       variant,
//       thumbnail,
//       addedAt: new Date(),
//     });

//     await list.save();

//     revalidatePath("/lists"); // or wherever you show the lists

//     return { success: true, message: "Item added to list" };
//   } catch (err) {
//     console.error(err);
//     return handleError(err) as ErrorResponse
//   }
// }
interface paramsProps  {
   listId: string;
  variant: IVariant;
  productId: string;
  variantId?: string | null;
  priceSnapshot?: number;
  thumbnail?: string;
  note?: string;
}
// export async function addItemToListAction(params:paramsProps): Promise<ActionResponse<{list: ISavedList}>> {
//   const validatedResult = await action({params, authorize: true})
//   if(validatedResult  instanceof Error) {
//     return handleError(validatedResult) as ErrorResponse
//   }

//   // come back to validation
//   const userId = validatedResult.session?.user.id
//   if(!userId) throw new UnAuthorizedError("User")
//   try {
//     await connectDB()
    
//     const { listId,variant, variantId, priceSnapshot, thumbnail, note, productId } = validatedResult.params!
//     const list = await SavedList.findOne({ _id: listId, userId }) 

//     if (!list) throw new NotFoundError("List")

//     await list.addItem({
//       productId,
//       variantId,
//       priceSnapshot,
//       variant,
//       thumbnail,
//       note,
//     });

//     revalidatePath("/profile/lists");
//     return { success: true, data: {list: JSON.parse(JSON.stringify(list))}};

//   } catch (err) {
//     console.error("ADD ITEM ERROR:", err);
//     return handleError(err) as ErrorResponse;
//   }
// }
type ParamsProps = {
  listId: string;
  productId: string;
  variant?: IVariant | null;
  variantId?: string | null;
  priceSnapshot?: number;
  thumbnail?: string;
  note?: string;
};




// server/action (updated)
export async function addItemToListAction(params: ParamsProps): Promise<
  ActionResponse<{ list: ISavedList; added: boolean; item?: ISavedItem }>
> {
  // validate & auth
  const validatedResult = await action({ params, authorize: true });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const userId = validatedResult.session?.user.id;
  if (!userId) throw new UnAuthorizedError("User");

  try {
    await connectDB();

    const {
      listId,
      variant,
      variantId,
      priceSnapshot,
      thumbnail,
      note,
      productId,
    } = validatedResult.params as ParamsProps;

    // load list as full document (so methods available)
    const list = await SavedList.findOne({ _id: listId, userId }).exec();
    if (!list) throw new NotFoundError("List");

    // matching logic (same as schema)
    const pid = String(productId);

    const existingIndex = list.items.findIndex((it: ISavedItem) => {
      const sameProduct = String(it.productId) === pid;
      if (!sameProduct) return false;
      if (variantId == null) return true;
      if (it.variantId && String(it.variantId) === String(variantId)) return true;
      if (it.variant && (it.variant as any)._id && String((it.variant as any)._id) === String(variantId)) return true;
      if (it.variant && (it.variant as any).sku && String((it.variant as any).sku) === String(variantId)) return true;
      return false;
    });

    // Populate helper - choose which product fields to include
    const populateOptions = { path: "items.productId", select: "_id name basePrice thumbnail brand slug" };

    if (existingIndex !== -1) {
      // Populate the list so the existing item has product info
      await list.populate(populateOptions);

      const existingItem = list.items[existingIndex];

      return {
        success: true,
        data: {
          list: JSON.parse(JSON.stringify(list)),
          added: false,
          item: JSON.parse(JSON.stringify(existingItem)),
        },
      };
    }

    // Not present => add item (uses instance method which saves)
    await list.addItem({
      productId,
      variantId: variantId ?? null,
      variant: variant ?? undefined,
      priceSnapshot,
      thumbnail,
      note,
    });

    // reload the list and populate the product references
    const updated = await SavedList.findById(list._id).populate(populateOptions).exec();

    // find the newly inserted item (should be first because addItem unshifts)
    const updatedDoc = updated ?? list;
    const newItem = (updatedDoc.items || []).find((it: ISavedItem) => {
      const sameProduct = String(it.productId && (it.productId as any)._id ? (it.productId as any)._id : it.productId) === pid;
      if (!sameProduct) return false;
      if (variantId == null) return true;
      if (it.variantId && String(it.variantId) === String(variantId)) return true;
      if (it.variant && (it.variant as any)._id && String((it.variant as any)._id) === String(variantId)) return true;
      if (it.variant && (it.variant as any).sku && String((it.variant as any).sku) === String(variantId)) return true;
      return false;
    }) as ISavedItem | undefined;

    // revalidate client-side path
    
      revalidatePath(ROUTES.mywishlist);
   

    return {
      success: true,
      data: {
        list: JSON.parse(JSON.stringify(updatedDoc)),
        added: true,
        item: newItem ? JSON.parse(JSON.stringify(newItem)) : undefined,
      },
    };
  } catch (err) {
    console.error("ADD ITEM ERROR:", err);
    return handleError(err) as ErrorResponse;
  }
}
interface EditWishlistParams {
  id: string;
  name: string;
}

export async function editWishlistAction(
  params: EditWishlistParams
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: EditWishlistSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { id, name } = validatedResult.params!;
  const session = validatedResult.session;

  try {
    if (!session) {
      throw new UnAuthorizedError("User is not authorized");
    }

    await connectDB();

    const updated = await SavedList.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { name: name.trim() } },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundError("List not found or access denied");
    }

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

interface EmptyWishlistParams  {
  id: string;
}
const EmptyWishlistSchema = z.object({
  id: z.string().min(1, "List ID is required")
})
export async function EmptyWishlistAction(params: EmptyWishlistParams): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: EmptyWishlistSchema,
    authorize: true,
  })

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse
  }

  const { id } = validated.params!
  const session = validated.session

  try {
    if (!session) throw new UnAuthorizedError("Unauthorized")

    await connectDB()

    const updated = await SavedList.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
        "items.0": { $exists: true },
      },
      { $set: { items: [] } },
      { new: true }
    )

    if (!updated) {
      throw new NotFoundError("List not found or already empty")
    }
   revalidatePath("/account/wishlist/list")
    return {
      success: true,
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
const DeleteWishlistSchema = z.object({
   id: z.string().min(1, "wishlist ID is required")
})

export async function deleteWishlistAction(params: {
  id: string;
}): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: DeleteWishlistSchema,
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const { id } = validated.params!;
  const session = validated.session;

  try {
    if (!session?.user?.id) {
      throw new UnAuthorizedError("Unauthorized");
    }

    await connectDB();

    const list = await SavedList.findById(id);

    if (!list) {
      throw new NotFoundError("Wishlist not found");
    }

    if (list.userId.toString() !== session.user.id) {
      throw new UnAuthorizedError("You do not own this wishlist");
    }

    if (list.isDefault) {
      throw new Error("Default wishlist cannot be deleted");
    }

    await SavedList.deleteOne({ _id: id });
    revalidatePath(ROUTES.mywishlist)
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



 const SetDefaultWishlistSchema = z.object({
  id: z.string().min(1, "Wishlist id is required"),
});

export type SetDefaultWishlistParams = z.infer<
  typeof SetDefaultWishlistSchema
>;


export async function setDefaultWishlistAction(
  params: { id: string }
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: SetDefaultWishlistSchema,
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const { id } = validated.params!;
  const session = validated.session;

  try {
    if (!session?.user?.id) {
      throw new UnAuthorizedError("Unauthorized");
    }

    await connectDB();

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const list = await SavedList.findById(id).session(dbSession);

      if (!list) {
        throw new NotFoundError("Wishlist not found");
      }

      if (list.userId.toString() !== session.user.id) {
        throw new UnAuthorizedError("You do not own this wishlist");
      }

      // If already default → idempotent success
      if (list.isDefault) {
        await dbSession.commitTransaction();
        return { success: true };
      }

      // 1️⃣ Unset any existing default list for this user
      await SavedList.updateMany(
        {
          userId: session.user.id,
          isDefault: true,
        },
        { $set: { isDefault: false } },
        { session: dbSession }
      );

      // 2️⃣ Set selected list as default
      await SavedList.updateOne(
        { _id: id },
        { $set: { isDefault: true } },
        { session: dbSession }
      );

      await dbSession.commitTransaction();
      revalidatePath(ROUTES.mywishlist)
      return { success: true };
    } catch (err) {
      await dbSession.abortTransaction();
      throw err;
    } finally {
      dbSession.endSession();
    }

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



const AddToDefaultListSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  priceSnapshot: z.number().optional(),
  thumbnail: z.string().optional(),
  note: z.string().max(300).optional(),
});

type AddToDefaultListParams = z.infer<typeof AddToDefaultListSchema>;

export async function addItemToDefaultListAction(
  params: AddToDefaultListParams
): Promise<ActionResponse<{ added: boolean }>> {
  const validated = await action({
    params,
    schema: AddToDefaultListSchema,
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const {
    productId,
    variantId = null,
    priceSnapshot,
    thumbnail,
    note,
  } = validated.params!;

  try {
    await connectDB();

    const mongoSession = await mongoose.startSession();
    let added = false;

    await mongoSession.withTransaction(async () => {
      /** 1️⃣ Get default list */
      let list = await SavedList.findOne({
        userId: session.user.id,
        isDefault: true,
        archived: { $ne: true },
      }).session(mongoSession);

      /** 2️⃣ Auto-create default list */
      if (!list) {
        list = await SavedList.create(
          [
            {
              userId: session.user.id,
              name: "Wishlist",
              isDefault: true,
              isPrivate: true,
            },
          ],
          { session: mongoSession }
        ).then(docs => docs[0]);
      }

      /** 3️⃣ TOGGLE LOGIC */
      const exists = list?.hasItem(productId, variantId);

      if (exists) {
        // 🔴 REMOVE
        await list?.removeItem(productId, variantId);
        added = false;
      } else {
        // 🟢 ADD
        await list?.addItem({
          productId,
          variantId,
          priceSnapshot,
          thumbnail,
          note,
        });
        added = true;
      }
    });

    mongoSession.endSession();

    revalidatePath(ROUTES.mywishlist);

    return {
      success: true,
      data: { added },
      message: added
        ? "Item added to wishlist"
        : "Item removed from wishlist",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function removeItemFromSavedListAction(
  params: {
    listId: string;
    productId: string;
    variantId?: string | null;
  }
): Promise<ActionResponse<{ removed: boolean }>> {
  const validated = await action({
    params,
    schema: z.object({
      listId: z.string(),
      productId: z.string(),
      variantId: z.string().nullable().optional(),
    }),
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, productId, variantId = null } = validated.params!;

  try {
    await connectDB();

    const list = await SavedList.findOne({
      _id: listId,
      userId: session.user.id,
      archived: { $ne: true },
    });

    if (!list) throw new NotFoundError("List")

    const before = list.items.length;
    await list.removeItem(new mongoose.Types.ObjectId(productId),variantId)
    const after = list.items.length;
   
    revalidatePath(ROUTES.mywishlist);

    return {
      success: true,
      data: { removed: after < before },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}



"use server";

import { ROUTES } from "@/constants/routes";
import connectDB from "@/database/db";
import { cache } from "@/lib/cache";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { isSameItem } from "@/lib/savedList/match";
import { CreateListSchema, EditWishlistSchema } from "@/lib/zod";
import { IVariant, Product } from "@/models/product.model";
import SavedList, { ISavedItem, ISavedList } from "@/models/savedList.model";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

/** ---------------------------------------------------------
 * ✅ SINGLE SOURCE OF TRUTH: matching logic
 * --------------------------------------------------------*/


function touchTagAndPath(userId: string) {
  revalidateTag(`savedlists:${userId}`);
  revalidatePath(ROUTES.mywishlist);
}

/** ---------------------------------------------------------
 * ✅ CREATE LIST
 * --------------------------------------------------------*/
type CreateListParams = z.infer<typeof CreateListSchema>;

export async function createSavedListAction(
  params: CreateListParams
): Promise<ActionResponse<{ list: ISavedList }>> {
  const validated = await action({
    params,
    schema: CreateListSchema,
    authorize: true,
  });

  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { name, isPrivate, isDefault } = validated.params as CreateListParams;

  try {
    await connectDB();

    const existingCount = await SavedList.countDocuments({
      userId: session.user.id,
      archived: { $ne: true },
    });

    if (existingCount >= 20) throw new Error("Max saved lists reached");

    const mongoSession = await mongoose.startSession();
    let created: any = null;

    await mongoSession.withTransaction(async () => {
      const shouldBeDefault = existingCount === 0 || isDefault === true;

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
              meta: { count: 0 },
            },
          ],
          { session: mongoSession }
        )
      )[0];
    });

    mongoSession.endSession();

    touchTagAndPath(session.user.id);

    return {
      success: true,
      data: { list: JSON.parse(JSON.stringify(created)) },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ TOGGLE ITEM IN ANY LIST (your "save for later" foundation)
 * default export
 * --------------------------------------------------------*/


const ToggleItemSchema = z.object({
  listId: z.string().min(1),
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  priceSnapshot: z.number().optional(),
  thumbnail: z.string().optional(),
  note: z.string().max(300).optional(),
});

type ToggleItemParams = z.infer<typeof ToggleItemSchema>;

function buildElemMatch(productId: mongoose.Types.ObjectId, variantId?: string | null) {
  // If variantId is null => treat ANY variant as match (remove/add product-level)
  if (variantId == null) return { productId };
  return { productId, variantId: String(variantId) };
}

export default async function toggleSavedListItemAction(
  params: ToggleItemParams
): Promise<ActionResponse<{ added: boolean }>> {
  const validated = await action({
    params,
    schema: ToggleItemSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, productId, variantId, priceSnapshot, thumbnail, note } =
    validated.params as ToggleItemParams;

  try {
    await connectDB();

    const uid = new mongoose.Types.ObjectId(session.user.id);
    const pid = new mongoose.Types.ObjectId(productId);

    // 1) 🔴 Attempt to remove first (atomic)
    // If item exists, remove it and we're done.
    const pullMatch =
      variantId == null
        ? { productId: pid } // remove all variants for that product
        : { productId: pid, variantId: String(variantId) }; // exact variant

    const pullRes = await SavedList.updateOne(
      { _id: listId, userId: uid, archived: { $ne: true } },
      {
        $pull: { items: pullMatch },
        $set: { "meta.lastRemovedAt": new Date() },
      }
    );

    // If it actually removed something -> return added:false
    if (pullRes.modifiedCount > 0) {
      // update meta.count cheaply (optional but nice)
      await SavedList.updateOne(
        { _id: listId, userId: uid },
        [{ $set: { "meta.count": { $size: "$items" } } }]
      );

      revalidateTag(`savedlists:${session.user.id}`);
      revalidatePath(ROUTES.mywishlist);

      return { success: true, data: { added: false } };
    }

    // 2) 🟢 Not removed => add, but ONLY if not already exists (race-safe)
    const elemMatch = buildElemMatch(pid, variantId);

    const itemToAdd: ISavedItem = {
      productId: pid,
      variantId: variantId == null ? null : String(variantId),
      addedAt: new Date(),
      priceSnapshot,
      thumbnail,
      note,
    };

    const addRes = await SavedList.updateOne(
      {
        _id: listId,
        userId: uid,
        archived: { $ne: true },
        items: { $not: { $elemMatch: elemMatch } }, // ✅ prevents duplicates under race
      },
      {
        $push: { items: { $each: [itemToAdd], $position: 0 } },
        $set: { "meta.lastAddedAt": new Date() },
      }
    );

    const added = addRes.modifiedCount > 0;

    // update meta.count cheaply (optional)
    if (added) {
      await SavedList.updateOne(
        { _id: listId, userId: uid },
        [{ $set: { "meta.count": { $size: "$items" } } }]
      );
    }

    revalidateTag(`savedlists:${session.user.id}`);
    revalidatePath(ROUTES.mywishlist);

    return { success: true, data: { added } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}


/** ---------------------------------------------------------
 * ✅ DELETE LIST (archive by default)
 * --------------------------------------------------------*/
const DeleteListSchema = z.object({
  listId: z.string().min(1),
  soft: z.boolean().optional().default(true),
});

type DeleteListParams = z.infer<typeof DeleteListSchema>;

export async function deleteSavedListAction(
  params: DeleteListParams
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: DeleteListSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, soft } = validated.params as DeleteListParams;

  try {
    await connectDB();

    const mongoSession = await mongoose.startSession();
    await mongoSession.withTransaction(async () => {
      const list: ISavedList = await SavedList.findOne({
        _id: listId,
        userId: session.user.id,
      }).session(mongoSession);

      if (!list) throw new NotFoundError("Saved list");

      if (soft) {
        list.archived = true;
        await list.save({ session: mongoSession });
      } else {
        await SavedList.deleteOne({ _id: listId, userId: session.user.id }).session(
          mongoSession
        );
      }
    });

    mongoSession.endSession();
    touchTagAndPath(session.user.id);

    return { success: true, message: "Saved list removed" };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ GET LISTS
 * --------------------------------------------------------*/
const GetListsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  includeArchived: z.boolean().optional().default(false),
});

type GetListsParams = z.infer<typeof GetListsSchema>;

type GetSavedListsData = {
  lists: ISavedList[];
  meta: { total: number; page: number; limit: number };
};

export async function getSavedListsAction(
  params: GetListsParams
): Promise<ActionResponse<GetSavedListsData>> {
  const validated = await action({
    params,
    schema: GetListsSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { page, limit, includeArchived } = validated.params as GetListsParams;

  try {
    await connectDB();

    const query: any = { userId: session.user.id };
    if (!includeArchived) query.archived = { $ne: true };

    const skip = Math.max(0, page - 1) * limit;

    const [lists, total] = await Promise.all([
      SavedList.find(query)
        .populate({ path: "items.productId", model: Product })
        .sort({ isDefault: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      SavedList.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        lists: JSON.parse(JSON.stringify(lists)),
        meta: { total, page, limit },
      },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ EDIT LIST NAME
 * --------------------------------------------------------*/
export async function editWishlistAction(params: {
  id: string;
  name: string;
}): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: EditWishlistSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { id, name } = validated.params!;

  try {
    await connectDB();

    const updated = await SavedList.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { name: name.trim() } },
      { new: true }
    );

    if (!updated) throw new NotFoundError("List");

    touchTagAndPath(session.user.id);
    return { success: true };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ EMPTY LIST
 * --------------------------------------------------------*/
const EmptyWishlistSchema = z.object({
  id: z.string().min(1, "List ID is required"),
});

export async function EmptyWishlistAction(params: {
  id: string;
}): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: EmptyWishlistSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { id } = validated.params!;

  try {
    await connectDB();

    const updated = await SavedList.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { items: [], meta: { count: 0, lastRemovedAt: new Date() } } },
      { new: true }
    );

    if (!updated) throw new NotFoundError("List");

    touchTagAndPath(session.user.id);
    return { success: true };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ DELETE LIST (hard delete, not default)
 * --------------------------------------------------------*/
const DeleteWishlistSchema = z.object({
  id: z.string().min(1, "wishlist ID is required"),
});

export async function deleteWishlistAction(params: {
  id: string;
}): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: DeleteWishlistSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { id } = validated.params!;

  try {
    await connectDB();

    const list: ISavedList | null = await SavedList.findById(id);
    if (!list) throw new NotFoundError("Wishlist");
    if (String(list.userId) !== String(session.user.id)) throw new UnAuthorizedError("");
    if (list.isDefault) throw new Error("Default wishlist cannot be deleted");

    await SavedList.deleteOne({ _id: id });

    touchTagAndPath(session.user.id);
    return { success: true };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ SET DEFAULT LIST
 * --------------------------------------------------------*/
const SetDefaultWishlistSchema = z.object({
  id: z.string().min(1, "Wishlist id is required"),
});

export async function setDefaultWishlistAction(params: { id: string }): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: SetDefaultWishlistSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { id } = validated.params!;

  try {
    await connectDB();

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const list: any = await SavedList.findById(id).session(dbSession);
      if (!list) throw new NotFoundError("Wishlist");
      if (String(list.userId) !== String(session.user.id)) throw new UnAuthorizedError("");

      if (list.isDefault) {
        await dbSession.commitTransaction();
        touchTagAndPath(session.user.id);
        return { success: true };
      }

      await SavedList.updateMany(
        { userId: session.user.id, isDefault: true },
        { $set: { isDefault: false } },
        { session: dbSession }
      );

      await SavedList.updateOne(
        { _id: id },
        { $set: { isDefault: true } },
        { session: dbSession }
      );

      await dbSession.commitTransaction();
      touchTagAndPath(session.user.id);
      return { success: true };
    } catch (err) {
      await dbSession.abortTransaction();
      throw err;
    } finally {
      dbSession.endSession();
    }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

/** ---------------------------------------------------------
 * ✅ TOGGLE IN DEFAULT LIST
 * --------------------------------------------------------*/
const AddToDefaultListSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  priceSnapshot: z.number().optional(),
  thumbnail: z.string().optional(),
  note: z.string().max(300).optional(),
});

type AddToDefaultListParams = z.infer<typeof AddToDefaultListSchema>;

function normalizeVariantId(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export async function addItemToDefaultListAction(
  params: AddToDefaultListParams
): Promise<ActionResponse<{ added: boolean }>> {
  const validated = await action({
    params,
    schema: AddToDefaultListSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { productId, priceSnapshot, thumbnail, note } = validated.params!;
  const variantId = normalizeVariantId(validated.params?.variantId);

  try {
    await connectDB();

    const uid = new mongoose.Types.ObjectId(session.user.id);
    const pid = new mongoose.Types.ObjectId(productId);

    // ✅ Ensure default list exists (safe under concurrency)
    // Uses your unique index (userId + name) to avoid duplicates.
    const list = await SavedList.findOneAndUpdate(
      { userId: uid, isDefault: true, archived: { $ne: true } },
      {
        $setOnInsert: {
          userId: uid,
          name: "Wishlist",
          isDefault: true,
          isPrivate: true,
          archived: false,
          items: [],
          meta: { count: 0 },
        },
      },
      { new: true, upsert: true }
    ).exec();

    // -----------------------------
    // 1) 🔴 Try remove first (atomic)
    // -----------------------------
    const pullMatch =
      variantId == null
        ? { productId: pid } // product-level (remove all variants for that product)
        : { productId: pid, variantId }; // exact variant

    const pullRes = await SavedList.updateOne(
      { _id: list._id, userId: uid, archived: { $ne: true } },
      {
        $pull: { items: pullMatch },
        $set: { "meta.lastRemovedAt": new Date() },
      }
    );

    if (pullRes.modifiedCount > 0) {
      // recompute count cheaply (optional but correct)
      await SavedList.updateOne(
        { _id: list._id, userId: uid },
        [{ $set: { "meta.count": { $size: "$items" } } }]
      );

      touchTagAndPath(session.user.id);

      return {
        success: true,
        data: { added: false },
        message: "Item removed from wishlist",
      };
    }

    // -----------------------------------
    // 2) 🟢 Not removed => add (race-safe)
    // Only add if it doesn't already exist
    // -----------------------------------
    const elemMatch =
      variantId == null ? { productId: pid } : { productId: pid, variantId };

    const itemToAdd = {
      productId: pid,
      variantId: variantId ?? null,
      addedAt: new Date(),
      priceSnapshot,
      thumbnail,
      note,
    };

    const addRes = await SavedList.updateOne(
      {
        _id: list._id,
        userId: uid,
        archived: { $ne: true },
        items: { $not: { $elemMatch: elemMatch } }, // ✅ blocks duplicates under race
      },
      {
        $push: { items: { $each: [itemToAdd], $position: 0 } },
        $set: { "meta.lastAddedAt": new Date() },
      }
    );

    const added = addRes.modifiedCount > 0;

    if (added) {
      await SavedList.updateOne(
        { _id: list._id, userId: uid },
        [{ $set: { "meta.count": { $size: "$items" } } }]
      );
    }

    touchTagAndPath(session.user.id);

    return {
      success: true,
      data: { added },
      message: added ? "Item added to wishlist" : "Wishlist unchanged",
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}


/** ---------------------------------------------------------
 * ✅ REMOVE ITEM FROM ANY LIST (exact match logic)
 * --------------------------------------------------------*/
export async function removeItemFromSavedListAction(params: {
  listId: string;
  productId: string;
  variantId?: string | null;
}): Promise<ActionResponse<{ removed: boolean }>> {
  const validated = await action({
    params,
    schema: z.object({
      listId: z.string(),
      productId: z.string(),
      variantId: z.string().nullable().optional(),
    }),
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, productId, variantId = null } = validated.params!;

  try {
    await connectDB();

    const uid = new mongoose.Types.ObjectId(session.user.id);
    const pid = new mongoose.Types.ObjectId(productId);

    const pullMatch =
      variantId == null ? { productId: pid } : { productId: pid, variantId: String(variantId) };

    const res = await SavedList.updateOne(
      { _id: listId, userId: uid, archived: { $ne: true } },
      { $pull: { items: pullMatch }, $set: { "meta.lastRemovedAt": new Date() } }
    );

    await SavedList.updateOne(
      { _id: listId, userId: uid },
      [{ $set: { "meta.count": { $size: "$items" } } }]
    );

    revalidateTag(`savedlists:${session.user.id}`);
    revalidatePath(ROUTES.mywishlist);

    return { success: true, data: { removed: res.modifiedCount > 0 } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}


/** ---------------------------------------------------------
 * ✅ HEADER COUNT (sum items across all lists)
 * cached (20s) + tag invalidation
 * --------------------------------------------------------*/
async function _getSavedListsCount(userId: string): Promise<{ totalItems: number }> {
  await connectDB();

  const uid = new mongoose.Types.ObjectId(userId);

  const result = await SavedList.aggregate([
    { $match: { userId: uid, archived: { $ne: true } } },
    { $project: { itemsCount: { $size: "$items" } } },
    { $group: { _id: null, totalItems: { $sum: "$itemsCount" } } },
  ]);

  return { totalItems: result?.[0]?.totalItems ?? 0 };
}

const getSavedListsCountCached = (userId: string) =>
  cache(() => _getSavedListsCount(userId), ["savedlists:count", userId], {
    revalidate: 20,
    tags: [`savedlists:${userId}`],
  })();

export async function getSavedListsCountAction(): Promise<
  ActionResponse<{ totalItems: number }>
> {
  const validated = await action({ authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) return { success: false };

  try {
    const data = await getSavedListsCountCached(session.user.id);
    return { success: true, data };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

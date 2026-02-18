"use server";

import connectDB from "@/database/db";
import mongoose from "mongoose";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { z } from "zod";
import SavedList from "@/models/wishlist.model";

const ToggleDefaultSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  priceSnapshot: z.number().optional(),
  variantSnapshot: z.any().optional(),
  thumbnail: z.string().optional(),
  note: z.string().max(300).optional(),
});

type ToggleDefaultParams = z.infer<typeof ToggleDefaultSchema>;

function isSameItem(it: any, productId: string, variantId?: string | null) {
  const sameProduct = String(it.productId) === String(productId);
  if (!sameProduct) return false;

  const a = it.variantId ? String(it.variantId) : null;
  const b = variantId ? String(variantId) : null;

  return a === b; // null === null => same base product item
}
function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export async function toggleDefaultSavedItemAction(
  params: ToggleDefaultParams
): Promise<ActionResponse<{ added: boolean; count: number }>> {
  const validated = await action({
    params,
    schema: ToggleDefaultSchema,
    authorize: true,
  });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { productId, variantId = null, priceSnapshot, thumbnail, note, variantSnapshot } = validated.params!;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const pidObj = new mongoose.Types.ObjectId(productId);

    const mongoSession = await mongoose.startSession();

    let added = false;
    let finalCount = 0;

    await mongoSession.withTransaction(async () => {
      // 1) find default list
      let list: any = await SavedList.findOne({
        userId,
        isDefault: true,
        archived: { $ne: true },
      }).session(mongoSession);

      // 2) create default list if missing
      if (!list) {
        list = await SavedList.create(
          [
            {
              userId,
              name: "Wishlist",
              isDefault: true,
              isPrivate: true,
              archived: false,
              items: [],
              meta: { count: 0 },
            },
          ],
          { session: mongoSession }
        ).then((docs) => docs[0]);
      }

      // 3) toggle (NEVER duplicates)
      const before = Array.isArray(list.items) ? list.items : [];

      const exists = before.some((it: any) => isSameItem(it, productId, variantId));

      // ALWAYS remove all matches first (kills duplicates forever)
      const cleaned = before.filter((it: any) => !isSameItem(it, productId, variantId));

      if (exists) {
        list.items = cleaned;
        added = false;
      } else {
        list.items = [
          {
            productId: pidObj,
            variantId: variantId ?? null,
            addedAt: new Date(),
            priceSnapshot,
            variantSnapshot,
            thumbnail,
            note,
          },
          ...cleaned,
        ];
        added = true;
      }

      // update meta
      finalCount = list.items.length;
      list.meta = {
        ...(list.meta || {}),
        count: finalCount,
        ...(added ? { lastAddedAt: new Date() } : { lastRemovedAt: new Date() }),
      };

      await list.save({ session: mongoSession });
    });

    mongoSession.endSession();

    revalidateTag(`savedlists:${session.user.id}`);
    revalidatePath(ROUTES.mywishlist);

    return { success: true, data: { added, count: finalCount } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}



const CreateSavedListSchema = z.object({
  name: z
    .string()
    .min(2, "List name is too short")
    .max(120, "List name is too long")
    .transform((v) => v.trim()),
  isPrivate: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
});

type CreateSavedListParams = z.infer<typeof CreateSavedListSchema>;

export async function createSavedListAction(
  params: CreateSavedListParams
): Promise<ActionResponse<{ list: any }>> {
  const validated = await action({
    params,
    schema: CreateSavedListSchema,
    authorize: true,
  });

  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { name, isPrivate, isDefault } = validated.params!;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // ✅ Max lists per user
    const existingCount = await SavedList.countDocuments({
      userId,
      archived: { $ne: true },
    });

    if (existingCount >= 20) {
      throw new ForbiddenError("You reached the maximum number of wishlists (20).");
    }

    // ✅ Prevent duplicate names (case-insensitive)
    const exists = await SavedList.findOne({
      userId,
      archived: { $ne: true },
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    }).lean();

    if (exists) {
      throw new ForbiddenError("A wishlist with this name already exists.");
    }

    const mongoSession = await mongoose.startSession();
    let createdList: any = null;

    await mongoSession.withTransaction(async () => {
      const shouldBeDefault = existingCount === 0 || isDefault === true;

      if (shouldBeDefault) {
        await SavedList.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } },
          { session: mongoSession }
        );
      }

      const docs = await SavedList.create(
        [
          {
            userId,
            name,
            isPrivate,
            isDefault: shouldBeDefault,
            archived: false,
            items: [],
            meta: { count: 0 },
          },
        ],
        { session: mongoSession }
      );

      createdList = docs?.[0];
    });

    mongoSession.endSession();

    // ✅ Revalidate wishlist pages + header count tag
    revalidatePath(ROUTES.mywishlist);
    revalidateTag(`savedlists:${session.user.id}`);

    return {
      success: true,
      data: { list: JSON.parse(JSON.stringify(createdList)) },
      message: "Wishlist created",
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}




const EmptyListItemsSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
});

type EmptyListItemsParams = z.infer<typeof EmptyListItemsSchema>;

export async function emptySavedListItemsAction(
  params: EmptyListItemsParams
): Promise<ActionResponse<{ emptied: boolean }>> {
  const validated = await action({
    params,
    schema: EmptyListItemsSchema,
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId } = validated.params as EmptyListItemsParams;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const _id = new mongoose.Types.ObjectId(listId);

    // Only empty lists owned by the user, and not archived
    const list = await SavedList.findOne({
      _id,
      userId,
      archived: { $ne: true },
    }).select("_id items meta");

    if (!list) throw new NotFoundError("Saved list");

    const hadItems = Array.isArray(list.items) && list.items.length > 0;

    if (!hadItems) {
      // idempotent success
      return { success: true, data: { emptied: false } };
    }

    list.items = [];
    list.meta = {
      ...(list.meta || {}),
      count: 0,
      lastRemovedAt: new Date(),
    };

    await list.save();

    // Update UI + cached badge count
    revalidatePath(ROUTES.mywishlist);
    revalidateTag(`savedlists:${session.user.id}`);

    return { success: true, data: { emptied: true } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}




const EditSavedListNameSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  name: z
    .string()
    .min(2, "Name is too short")
    .max(120, "Name is too long")
    .transform((v) => v.trim()),
});

type EditSavedListNameParams = z.infer<typeof EditSavedListNameSchema>;

export async function editSavedListNameAction(
  params: EditSavedListNameParams
): Promise<ActionResponse<{ listId: string; name: string }>> {
  const validated = await action({
    params,
    schema: EditSavedListNameSchema,
    authorize: true,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, name } = validated.params as EditSavedListNameParams;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const _id = new mongoose.Types.ObjectId(listId);

    // 1) Ensure list exists & owned by user
    const list = await SavedList.findOne({ _id, userId, archived: { $ne: true } }).select("_id name");
    if (!list) throw new NotFoundError("Saved list");

    // If no change => idempotent success
    if (String(list.name).trim().toLowerCase() === name.toLowerCase()) {
      return { success: true, data: { listId: String(list._id), name: list.name } };
    }

    // 2) Prevent duplicates: same user cannot have 2 active lists with same name
    const already = await SavedList.exists({
      userId,
      archived: { $ne: true },
      _id: { $ne: _id },
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    });

    if (already) {
      return handleError(new Error("You already have a list with this name.")) as ErrorResponse;
    }

    // 3) Update
    list.name = name;
    await list.save();

    // 4) Revalidate UI + cached counts
    revalidatePath(ROUTES.mywishlist);
    revalidateTag(`savedlists:${session.user.id}`);

    return { success: true, data: { listId: String(list._id), name: list.name } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}




const SetDefaultListSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
});

type SetDefaultListParams = z.infer<typeof SetDefaultListSchema>;

export async function setDefaultSavedListAction(
  params: SetDefaultListParams
): Promise<ActionResponse<{ listId: string }>> {
  const validated = await action({
    params,
    schema: SetDefaultListSchema,
    authorize: true,
  });

  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId } = validated.params as SetDefaultListParams;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const targetId = new mongoose.Types.ObjectId(listId);

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        // 1) Ensure list exists & owned by user
        const target = await SavedList.findOne({
          _id: targetId,
          userId,
          archived: { $ne: true },
        }).session(dbSession);

        if (!target) throw new NotFoundError("Saved list");

        // idempotent
        if (target.isDefault === true) return;

        // 2) Unset any previous default (only active lists)
        await SavedList.updateMany(
          { userId, archived: { $ne: true }, isDefault: true },
          { $set: { isDefault: false } },
          { session: dbSession }
        );

        // 3) Set target as default
        await SavedList.updateOne(
          { _id: targetId, userId },
          { $set: { isDefault: true } },
          { session: dbSession }
        );
      });
    } finally {
      dbSession.endSession();
    }

    // 4) Revalidate UI + cached counts
    revalidatePath(ROUTES.mywishlist);
    revalidateTag(`savedlists:${session.user.id}`);

    return { success: true, data: { listId } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}




const DeleteSavedListSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  soft: z.boolean().optional().default(true), // soft delete = archive
});

type DeleteSavedListParams = z.infer<typeof DeleteSavedListSchema>;

export async function deleteSavedListAction(
  params: DeleteSavedListParams
): Promise<ActionResponse<{ deleted: boolean; listId: string; newDefaultId?: string }>> {
  const validated = await action({
    params,
    schema: DeleteSavedListSchema,
    authorize: true,
  });

  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const { listId, soft } = validated.params as DeleteSavedListParams;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const targetId = new mongoose.Types.ObjectId(listId);

    let newDefaultId: string | undefined;

    const dbSession = await mongoose.startSession();
    try {
      await dbSession.withTransaction(async () => {
        const target = await SavedList.findOne({
          _id: targetId,
          userId,
          archived: { $ne: true },
        }).session(dbSession);

        if (!target) throw new NotFoundError("Saved list");

        // Prevent deleting the default list (Amazon-like behavior)
        if (target.isDefault) {
          throw new Error("Default wishlist cannot be deleted. Set another list as default first.");
        }

        if (soft) {
          target.archived = true;
          target.isDefault = false;
          await target.save({ session: dbSession });
        } else {
          await SavedList.deleteOne({ _id: targetId, userId }).session(dbSession);
        }

        // Safety: if somehow no default exists (edge case), promote one.
        const anyDefault = await SavedList.findOne({
          userId,
          archived: { $ne: true },
          isDefault: true,
        }).session(dbSession);

        if (!anyDefault) {
          const candidate = await SavedList.findOne({
            userId,
            archived: { $ne: true },
            _id: { $ne: targetId },
          })
            .sort({ updatedAt: -1 })
            .session(dbSession);

          if (candidate) {
            candidate.isDefault = true;
            await candidate.save({ session: dbSession });
            newDefaultId = String(candidate._id);
          }
        }
      });
    } finally {
      dbSession.endSession();
    }

    revalidatePath(ROUTES.mywishlist);
    revalidateTag(`savedlists:${session.user.id}`);

    return {
      success: true,
      data: { deleted: true, listId, ...(newDefaultId ? { newDefaultId } : {}) },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

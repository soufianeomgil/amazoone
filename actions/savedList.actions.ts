"use server"
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import SavedList, { ISavedList } from "@/models/savedList.model";
// server/actions/createSavedListAction.ts
import mongoose from "mongoose";
import { z } from "zod";



const CreateListSchema = z.object({
  name: z.string().min(1).max(120).optional().default("Wishlist"),
  isPrivate: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
});

type CreateListParams = z.infer<typeof CreateListSchema>;

export  async function createSavedListAction(params: CreateListParams): Promise<ActionResponse<{list: ISavedList}>> {
  const validated = await action({ params, schema: CreateListSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError('')

  const { name, isPrivate, isDefault } = validated.params as CreateListParams;

  try {
    await connectDB();

    // limit: avoid too many lists per user (example cap 20)
    const existingCount = await SavedList.countDocuments({ userId: session.user.id, archived: { $ne: true } });
    if (existingCount >= 20) throw new Error("Max saved lists reached")

    const mongoSession = await mongoose.startSession();
    let created: any = null;

    await mongoSession.withTransaction(async () => {
      // if isDefault, unset other default lists
      if (isDefault) {
        await SavedList.updateMany({ userId: session.user.id, isDefault: true }, { $set: { isDefault: false } }, { session: mongoSession });
      }

      created = await SavedList.create(
        [
          {
            userId: session.user.id,
            name,
            isPrivate,
            isDefault,
          },
        ],
        { session: mongoSession }
      ).then((docs) => docs[0]);
    });

    mongoSession.endSession();

    return { success: true, data: { list: created } }
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
      SavedList.find(query).sort({ isDefault: -1, updatedAt: -1 }).skip(skip).limit(limit),
      SavedList.countDocuments(query),
    ]);

    return { success: true, data: { lists: JSON.parse(JSON.stringify(lists)), meta: { total, page, limit } } }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}
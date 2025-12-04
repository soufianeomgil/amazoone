"use server"
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { CreateListSchema } from "@/lib/zod";
import { IVariant } from "@/models/product.model";
import SavedList, { ISavedItem, ISavedList } from "@/models/savedList.model";
// server/actions/createSavedListAction.ts
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";





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

    return { success: true, data: { list: JSON.parse(JSON.stringify(created))} }
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
    try {
      revalidatePath("/profile/lists");
    } catch (e) {
      console.warn("revalidatePath failed", e);
    }

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


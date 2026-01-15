"use server"

import connectDB from "@/database/db"
import { action } from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import mongoose from "mongoose"
import { ForbiddenError, NotFoundError, UnAuthorizedError } from "@/lib/http-errors"
import { AddAddressSchema, EditAddressSchema, GetAddressDetailsSchema } from "@/lib/zod"
import Address, {IAddress} from "@/models/address.model"

import User, {IUser} from "@/models/user.model"
import { AddAddressParams, EditAddressParams, GetAddressDetailsParams } from "@/types/actionTypes"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { ROUTES } from "@/constants/routes"
import { cache } from "@/lib/cache"
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config"

export default async function addAddressAction(
  params: AddAddressParams
): Promise<ActionResponse> {
  // 1) validate + authorize via shared 'action' helper
  const validatedResult = await action({
    params,
    schema: AddAddressSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const sessionData = validatedResult.session;
  if (!sessionData?.user?.id) {
    return {
      success: false,
    }
  }

  // destructure validated & sanitized params (use names from your zod schema)
  const {
    phone,
    name,
    addressLine1,
    addressLine2,
    state,
    city,
   
    DeliveryInstructions, // prefer camelCase from schema
    postalCode,
    isDefault = false,
  } = validatedResult.params!;

  // small sanitization
  const clean = {
    phone: String(phone).trim(),
    name: String(name).trim(),
    addressLine1: String(addressLine1).trim(),
    addressLine2: addressLine2 ? String(addressLine2).trim() : "",
    state: String(state).trim(),
    city: String(city).trim(),
   
    DeliveryInstructions: DeliveryInstructions ? String(DeliveryInstructions).trim() : "",
    postalCode: String(postalCode).trim(),
    isDefault: !!isDefault,
  };

  try {
    await connectDB();

    // start mongoose session for transaction (if your MongoDB setup supports transactions)
    const mongoSession = await mongoose.startSession();
    let createdAddress: IAddress | null = null;

    await mongoSession.withTransaction(async () => {
      // load user inside transaction
      const user = await User.findById(sessionData.user.id).session(mongoSession);
      if (!user) throw new NotFoundError("User");

      // if isDefault, clear other addresses' isDefault flag
      if (clean.isDefault) {
        // assuming addresses are stored as subdocs or refs; adjust update accordingly
        // if addresses are refs, update Address collection; if subdocs, update user.addresses
        // Here we handle both common cases:

        // If addresses are separate docs:
        await Address.updateMany(
          { userId: user._id, isDefault: true },
          { $set: { isDefault: false } },
          { session: mongoSession }
        ).catch(() => {
          /* ignore if collection doesn't exist or no-op */
        });

        // If addresses are embedded subdocs on user (uncommon), clear flags:
        if (Array.isArray(user.addresses) && user.addresses.length) {
          user.addresses = user.addresses.map((a: any) => {
            if (a.isDefault) a.isDefault = false;
            return a;
          });
        }
      }

      // create address document
      createdAddress = await Address.create(
        [
          {
            name: clean.name,
            addressLine1: clean.addressLine1,
            addressLine2: clean.addressLine2,
            state: clean.state,
            city: clean.city,
           
            DeliveryInstructions: clean.DeliveryInstructions,
            isDefault: clean.isDefault,
            zipCode: clean.postalCode,
            phone: clean.phone,
            userId: user._id,
          },
        ],
        { session: mongoSession }
      ).then((docs) => (docs.length ? docs[0] : null));

      if (!createdAddress) throw new Error("Failed to create address");

      // link to user
      // If user.addresses is an array of ObjectId refs:
      if (user.addresses && Array.isArray(user.addresses)) {
        // push only the id
        user.addresses.push(createdAddress._id);
      } else {
        // fallback: ensure addresses exists and push
        user.addresses = [createdAddress._id];
      }

      await user.save({ session: mongoSession });
    });

      mongoSession.endSession();
      revalidatePath(ROUTES.addresses)
    return {
      success: true,
    } 
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



interface GetUserAddressesParams {
  userId: string;
}
export const getUserAddresses: (params:GetUserAddressesParams) => Promise<ActionResponse<{ addresses: IAddress[] }>> = cache(async (params:GetUserAddressesParams) => {
    const {userId} = params
    if(!userId) return {
       success: false
    }
  try {
     await connectDB()
     const user = await User.findById(userId)
     if(!user) throw new NotFoundError("User")
      const addresses = await Address.find({userId: user._id})
     .sort({isDefault: -1 , createdAt: -1})
    return {
      success: true,
      data: {addresses: JSON.parse(JSON.stringify(addresses))}
    }
  } catch (error) {
     return handleError(error) as ErrorResponse
  }
}, [ROUTES.addresses, "getUserAddresses"], {revalidate: 60 * 60 * 24})

export async function getAddressDetails(params:GetAddressDetailsParams) : Promise<ActionResponse<{address: IAddress}>> {
   const validatedResult = await action({params,schema:GetAddressDetailsSchema,authorize:true})
   if(validatedResult instanceof Error) {
     return handleError(validatedResult) as ErrorResponse
   }
   const {id} = validatedResult.params!
   try {
      await connectDB()
      const address = await Address.findById(id)
      if(!address) throw new NotFoundError("Address")
        return {
           success: true,
           data: { address: JSON.parse(JSON.stringify(address))}
        }
   } catch (error) {
      return handleError(error) as ErrorResponse
   }
}




export async function editAddressAction(params: EditAddressParams): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: EditAddressSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const session = validatedResult.session;
  if (!session?.user?.id) throw new UnAuthorizedError('')

  // destructure validated params (names match your zod schema)
  const {
    id,
    name,
    city,
    
    phone,
    state,
    addressLine1,
    addressLine2,
    isDefault = false,
    DeliveryInstructions,
    postalCode,
  } = validatedResult.params!

  // small sanitization
  const clean = {
    name: typeof name === "string" ? name.trim() : undefined,
    city: typeof city === "string" ? city.trim() : undefined,
   
    phone: typeof phone === "string" ? phone.trim() : undefined,
    state: typeof state === "string" ? state.trim() : undefined,
    addressLine1: typeof addressLine1 === "string" ? addressLine1.trim() : undefined,
    addressLine2: typeof addressLine2 === "string" ? addressLine2.trim() : undefined,
    DeliveryInstructions:
      typeof DeliveryInstructions === "string" ? DeliveryInstructions.trim() : undefined,
    postalCode: typeof postalCode === "string" ? postalCode.trim() : undefined,
  };

  try {
    await connectDB();

    // start transaction if possible
    const mongoSession = await mongoose.startSession();

    let updatedAddress: IAddress | null = null;

    await mongoSession.withTransaction(async () => {
      const address = await Address.findById(id).session(mongoSession);
      if (!address) throw new NotFoundError("Address");

      // Ownership check: ensure the address belongs to the current user
      if (!address.userId || String(address.userId) !== String(session.user.id)) {
        throw new Error("You are not authorized to edit this address");
      }

      // If isDefault is set to true, clear other defaults for this user
      if (isDefault) {
        await Address.updateMany(
          { userId: address.userId, isDefault: true, _id: { $ne: address._id } },
          { $set: { isDefault: false } },
          { session: mongoSession }
        );
      }

      // Apply updates only if provided
      if (typeof clean.name !== "undefined") address.name = clean.name;
      if (typeof clean.city !== "undefined") address.city = clean.city;
     
      if (typeof clean.phone !== "undefined") address.phone = clean.phone; // keep as string
      if (typeof clean.state !== "undefined") address.state = clean.state;
      if (typeof clean.postalCode !== "undefined") address.postalCode = clean.postalCode;
      if (typeof isDefault !== "undefined") address.isDefault = !!isDefault;
      if (typeof clean.DeliveryInstructions !== "undefined")
        address.DeliveryInstructions = clean.DeliveryInstructions;
      if (typeof clean.addressLine1 !== "undefined") address.addressLine1 = clean.addressLine1;
      if (typeof clean.addressLine2 !== "undefined") address.addressLine2 = clean.addressLine2;

      updatedAddress = await address.save({ session: mongoSession });
    });

    mongoSession.endSession();
    revalidatePath(ROUTES.addresses)

    return {
      success: true,
      message: "Address updated successfully",
    } 
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



type RemoveAddressParams = {
  id: string;
};

export async function removeAddressAction(
  params: RemoveAddressParams
): Promise<ActionResponse<{removedAddressId:string | null}>> {
  // 1) Validate + authorize (no schema needed besides having params.id)
  const validated = await action({ params, authorize: true });
  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("")

  const { id } = validated.params as RemoveAddressParams;
  if (!id || typeof id !== "string" || !id.trim()) throw new Error("Id is required")

  try {
    await connectDB();

    // start mongoose session for transaction (if supported)
    const mongoSession = await mongoose.startSession();
    let removedId: string | null = null;

    await mongoSession.withTransaction(async () => {
      // Attempt to find address as a separate doc
      const addressDoc = await Address.findById(id).session(mongoSession);
      if (addressDoc) {
        // ownership check
        if (!addressDoc.userId || String(addressDoc.userId) !== String(session.user.id)) {
          throw new Error("You are not authorized to delete this address");
        }

        const wasDefault = !!addressDoc.isDefault;
        // delete the address doc
        await Address.deleteOne({ _id: addressDoc._id }).session(mongoSession);

        // remove reference from user.addresses if it exists as refs
        const user = await User.findById(session.user.id).session(mongoSession);
        if (user) {
          if (Array.isArray(user.addresses) && user.addresses.length) {
            user.addresses = user.addresses.filter((a:IAddress) => {
              // handle ObjectId or string
              const aid = a && a._id ? String(a._id) : String(a);
              return aid !== String(id);
            });
            await user.save({ session: mongoSession });

            // if removed address was default, try to promote another address for the user
            if (wasDefault) {
              // try to set first remaining address as default (Address collection)
              const other = await Address.findOne({ userId: user._id }).session(mongoSession);
              if (other) {
                other.isDefault = true;
                await other.save({ session: mongoSession });
              } else if (Array.isArray(user.addresses) && user.addresses.length) {
                // if addresses are embedded subdocs (rare if we reached here), set first to default
                // fetch embedded one and set isDefault
                // but normally embedded case is handled in the other branch below
              }
            }
          }
        }

        removedId = String(id);
        return;
      }

      // If not a separate Address doc, maybe addresses are embedded subdocs in User
      const user = await User.findById(session.user.id).session(mongoSession);
      if (!user) {
        throw new NotFoundError("User");
      }

      // find embedded address
      const embeddedIndex = Array.isArray(user.addresses)
        ? user.addresses.findIndex((a: any) => String(a._id) === String(id) || String(a.id) === String(id))
        : -1;

      if (embeddedIndex === -1) {
        // no address found anywhere
        throw new NotFoundError("Address");
      }

      // remove the embedded subdoc
      const removed = user.addresses.splice(embeddedIndex, 1)[0];
      const wasDefaultEmbedded = !!removed?.isDefault;
      await user.save({ session: mongoSession });

      // if removed was default, promote another embedded address (if any)
      if (wasDefaultEmbedded && Array.isArray(user.addresses) && user.addresses.length) {
        user.addresses[0].isDefault = true;
        await user.save({ session: mongoSession });
      }

      removedId = String(id);
    });

    mongoSession.endSession();
    revalidatePath(ROUTES.addresses)

    return {
      success: true,
      data: { removedAddressId: removedId },
    } 
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

type SetDefaultParams = {
  id: string;
};

export  async function setDefaultAddressAction(
  params: SetDefaultParams
): Promise<ActionResponse<{wasAlreadyDefault:boolean,addressId:string | null}>> {
  // 1) auth + basic validation via shared helper (no schema required here)
  const validated = await action({ params, authorize: true });
  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("")

  const { id } = validated.params as SetDefaultParams;
  if (!id || typeof id !== "string" || !id.trim()) throw new Error("Id is required")

  try {
    await connectDB();

    // Use mongoose session/transaction if supported
    const mongoSession = await mongoose.startSession();
    let resultAddressId: string | null = null;
    let wasAlreadyDefault = false;
       
    await mongoSession.withTransaction(async () => {
      // Try find address as separate doc
      const addressDoc = await Address.findById(id).session(mongoSession);
      if (addressDoc) {
        // ownership check
        if (!addressDoc.userId || String(addressDoc.userId) !== String(session.user.id)) {
          throw new Error("You are not authorized to change this address");
        }

        // If already  default, short-circuit (idempotent)
        if (addressDoc.isDefault) {
          resultAddressId = String(addressDoc._id);
          wasAlreadyDefault = true;
          return;
        }

        // Clear other defaults for this user (addresses collection)
        await Address.updateMany(
          { userId: addressDoc.userId, isDefault: true, _id: { $ne: addressDoc._id } },
          { $set: { isDefault: false } },
          { session: mongoSession }
        );

        // Set this one to default
        addressDoc.isDefault = true;
        await addressDoc.save({ session: mongoSession });

        // Also ensure user's addresses refs reflect this if applicable
        const user = await User.findById(session.user.id).session(mongoSession);
        if (user && Array.isArray(user.addresses) && user.addresses.length) {
          // If user.addresses holds embedded objects -> set flags there
          const firstIsEmbedded = typeof user.addresses[0] === "object" && user.addresses[0]._id;
          if (firstIsEmbedded) {
            user.addresses = user.addresses.map((a: any) => {
              a.isDefault = String(a._id) === String(addressDoc._id);
              return a;
            });
            await user.save({ session: mongoSession });
          } else {
            // If refs, nothing more to do (Address collection is the source of truth)
          }
        }

        resultAddressId = String(addressDoc._id);
        return;
      }

      // Not a separate doc - try embedded address in User
      const user = await User.findById(session.user.id).session(mongoSession);
      if (!user) throw new NotFoundError("User");

      if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
        throw new NotFoundError("Address");
      }

      // find target embedded address
      const idx = user.addresses.findIndex(
        (a: any) => String(a._id) === String(id) || String(a.id) === String(id)
      );
      if (idx === -1) throw new NotFoundError("Address");

      // If already default, short-circuit
      if (user.addresses[idx].isDefault) {
        resultAddressId = String(user.addresses[idx]._id ?? user.addresses[idx].id);
        wasAlreadyDefault = true;
        return;
      }

      // Clear other embedded flags and set this one
      user.addresses = user.addresses.map((a: any, i: number) => {
        a.isDefault = i === idx;
        return a;
      });

      await user.save({ session: mongoSession });

      resultAddressId = String(user.addresses[idx]._id ?? user.addresses[idx].id);
    });

    mongoSession.endSession();
    revalidatePath(ROUTES.addresses)
    revalidatePath('/cart')
    revalidatePath("/checkout")
    return {
      success: true,
      data: {
        addressId: resultAddressId,
        wasAlreadyDefault,
      },
    }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

interface GetUserDefaultAddressParams {
  userId:string
}
// Response: { success: true, data: { address?: AddressObj | null } }
export const  getDefaultUserAddressAction :(params:GetUserDefaultAddressParams)=> Promise<ActionResponse<{ address?: IAddress }>> = cache (async(params:GetUserDefaultAddressParams) => {
  // 1) authorize + get session via shared action helper
  
  const  { userId } = params;
  if(!userId) return {
      success: false
  }
  try {
    // 2) DB connect
    await connectDB();

    // 3) load user and only addresses (lean for safe, plain JSON)
     const userAddress = await Address.findOne({userId, isDefault: true})
    if(!userAddress) throw new NotFoundError("Address default")

    // 5) return
    return {
      success: true,
      data: {
        address: JSON.parse(JSON.stringify(userAddress))
      },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}, ["GetDeafultUserAddress", "getDefaultUserAddressAction"], {revalidate: 60 * 60 * 24})

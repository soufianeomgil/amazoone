import connectDB from "@/database/db";
import handleError from "@/lib/handlers/error";
import { auth } from "@/auth";
import SavedList from "@/models/savedList.model";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";


export async function GET(_:Request, {params}: {params: Promise<{id:string}>}) {
  const id = (await params).id

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnAuthorizedError("Unauthorized");
    }

    await connectDB();

    const list = await SavedList.findById(id)
    .populate("items.productId")

    if (!list) {
      throw new NotFoundError("Wishlist not found");
    }

    // 🔐 Ownership check
    if (list.userId.toString() !== session.user.id) {
      throw new UnAuthorizedError("You do not own this wishlist");
    }

    return Response.json(
      {
        success: true,
        data: {
          list: JSON.parse(JSON.stringify(list)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error) as APIErrorResponse;
  }
}

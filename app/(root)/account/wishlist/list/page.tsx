import { auth } from "@/auth";
import connectDB from "@/database/db";
import { Product } from "@/models/product.model";
import WishlistClient from "./_components/WishlistClient";
import SavedList from "@/models/wishlist.model";

type PageProps = {
  searchParams: Promise<{list:string}>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();

  // If user not logged in => show empty client or redirect (your choice)
  if (!session?.user?.id) {
    return (
      <WishlistClient
        session={session}
        lists={[]}
        initialProducts={[]}
        initialList={null}
      />
    );
  }

  await connectDB();

  const listIdFromQuery = (await searchParams)?.list;

  // ✅ fetch all lists (populate products)
  const lists = await SavedList.find({
    userId: session.user.id,
    archived: { $ne: true },
  })
    .populate({
      path: "items.productId",
      model: Product,
      // keep it light (header + wishlist grid)
      select: "_id name basePrice thumbnail brand images variants category tags",
    })
    .sort({ isDefault: -1 })
    .lean();

  // ✅ choose initial list:
  // 1) query param list
  // 2) default list
  // 3) first list
  const initialList =
    (listIdFromQuery
      ? lists.find((l: any) => String(l._id) === String(listIdFromQuery))
      : null) ||
    lists.find((l: any) => l.isDefault) ||
    lists[0] ||
    null;

  // ✅ products come from list.items populated productId
  const initialProducts = initialList?.items ?? [];

  return (
    <WishlistClient
      session={session}
      lists={JSON.parse(JSON.stringify(lists))}
      initialProducts={JSON.parse(JSON.stringify(initialProducts))}
      initialList={JSON.parse(JSON.stringify(initialList))}
    />
  );
}

import { auth } from "@/auth"
import WishlistClient from "./_components/WishlistClient"
import { getSavedListsAction } from "@/actions/savedList.actions"



const page = async () => {
  const session = await auth()

  const listsResult = await getSavedListsAction({
    page: 1,
    limit: 10,
    includeArchived: true,
  })

  const lists = listsResult.data?.lists ?? []

  const defaultList =
    lists.find(list => list.isDefault) ?? lists[0]

  const products = defaultList?.items ?? []
  console.log(listsResult.data?.meta.total, "TOTAL")
  return (
    <WishlistClient
      session={session}
      lists={lists}
      initialProducts={products}
      initialList={defaultList} // ✅ FIX
    />
  )
}

export default page

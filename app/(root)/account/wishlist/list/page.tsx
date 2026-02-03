import { auth } from "@/auth"
import WishlistClient from "./_components/WishlistClient"




const page = async () => {
  const session = await auth()

 

  return (
    <WishlistClient
      session={session}
      lists={[]}
      initialProducts={[]}
      initialList={{}} // ✅ FIX
    />
  )
}

export default page

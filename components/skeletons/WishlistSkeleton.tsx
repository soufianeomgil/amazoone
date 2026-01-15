// RULES TO FOLLOW FOR APP PERFORMANCE AND SPEED;
//  RULE 1 - CACHE READS.
// { RULE 2 :
    // Your app should be:70–80% Server Components
    // 20–30% Client Components }

// RULE 3: INDEX YOUR DATABASE
// RULE 4: REMOVE router.refresh() ABUSE ❌ REVALIDATE INSTEAD
// RULE 5 : Never populate what you don’t render
// RULE 6: DATA FETCHING & SERVER RENDERING (BIGGEST WIN)
// RULE 7: MAGE OPTIMIZATION (YOU ARE LEAVING SPEED ON THE TABLE) USE NEXT/IMAGE + CLOUDINARY
// RULE 8 : CLIENT JS BUNDLE REDUCTION =>>>  Lazy load heavy components
// RULE 9: Add instant feedback
// Skeletons (already done 👍)
// Optimistic UI (wishlist heart)
// Disable buttons during pending
// User FEELS app is fast even if DB is slow.
// RULE 10: Session fetched ONCE Create one helper
const WishlistSkeleton = () => {
  return (
    <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[280px] rounded-lg bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  )
}

export default WishlistSkeleton

// "use client"

// import { useState, useMemo } from "react"
// import { InterestCard } from "./InterestCard"

// import { toast } from "sonner"
// import { SpinnerIcon } from "@/components/shared/icons"
// import { updateUserInterests } from "@/actions/user.actions"

// const INTERESTS = [
//   { tag: "handbags", label: "Handbags", icon: "👜" },
//   { tag: "footwear", label: "Footwear", icon: "👟" },
//   { tag: "beauty", label: "Beauty", icon: "💄" },
//   { tag: "makeup", label: "Makeup", icon: "💄" },
//   { tag: "suitcases", label: "Suitcases", icon: "🧳" },
//   { tag: "fitness", label: "Fitness", icon: "🏋️" },
//   { tag: "clothes", label: "Clothes", icon: "👕" },
//   { tag: "electronics", label: "Electronics", icon: "🎧" },
// ]

// export const InterestsSection = ({userSavedInterests}: {
//   userSavedInterests: {
//   tag: string;
//   score: number;
//   source: 'manual' | 'auto';
//   updatedAt: Date;
// }[] | []
// }) => {
//   // 👉 later you’ll hydrate this from DB
//   const [userInterests, setUserInterests] = useState<string[]>([])

//   const onToggle = (tag: string) => {
//     setUserInterests((prev) =>
//       prev.includes(tag)
//         ? prev.filter((i) => i !== tag)
//         : [...prev, tag]
//     )
//   }

//   const isDisabled = useMemo(
//     () => userInterests.length === 0,
//     [userInterests]
//   )
//   const [loading,setLoading] = useState(false)
//   const onSave = async () => {
//      setLoading(true)
//      try {
//       const { error, success } = await updateUserInterests({interests: userInterests})
//       if(error)  {
//         return toast.error(error.message)
//       }else if(success) {
//         toast.success("thanks for helping us personalize your recommendation")
//         return
//       }
//      } catch (error) {
//        console.log(error)
//      }finally {
//       setLoading(false)
//      }
//   }

//   return (
//     <section className="space-y-4 mt-5">
//        <div className="flex flex-col space-y-3">
//            <h3 className="text-base font-semibold">Your interests</h3>
//  <div className="flex flex-wrap items-center gap-3 sm:gap-5">
//         {userSavedInterests.map((i) => (
//           <InterestCard
//             key={i.tag}
//             label={i.tag}
//             selected={userInterests.includes(i.tag)}
//             onToggle={() => onToggle(i.tag)}
//           />
//         ))}
//       </div>
//        </div>
//       <div className="flex sm:flex-row flex-col sm:items-center gap-1">
//         <h2 className="text-base font-semibold">Suggested interests</h2>
//         <span className="text-xs text-gray-600">
//           Based on your Amazon activity and popular interests. Select to get
//           personalized recommendations.
//         </span>
//       </div>

//       <div className="flex flex-wrap items-center gap-3 sm:gap-5">
//         {INTERESTS.map((i) => (
//           <InterestCard
//             key={i.tag}
//             label={i.label}
//             icon={i.icon}
//             selected={userInterests.includes(i.tag)}
//             onToggle={() => onToggle(i.tag)}
//           />
//         ))}
//       </div>

//       <button
//         type="button"
//         disabled={isDisabled || loading}
//         onClick={onSave}
//         className="
//           text-sm px-4 py-2 max-sm:w-full rounded-full
//           bg-[#ffce12] text-gray-800
//           disabled:bg-[#ffed94] disabled:text-gray-400
//           disabled:border disabled:border-orange-100
//         "
//       >
//         {loading ? <div className="flex items-center gap-1"><SpinnerIcon /> <span>Saving...</span></div>  : "Save"}
//       </button>
//     </section>
//   )
// }
"use client"

import { useState, useMemo } from "react"
import { InterestCard } from "./InterestCard"
import { toast } from "sonner"
import { SpinnerIcon } from "@/components/shared/icons"
import { updateUserInterests } from "@/actions/user.actions"

const INTERESTS = [
  { tag: "handbags", label: "Handbags", icon: "👜" },
  { tag: "footwear", label: "Footwear", icon: "👟" },
  { tag: "beauty", label: "Beauty", icon: "💄" },
  { tag: "makeup", label: "Makeup", icon: "💄" },
  { tag: "suitcases", label: "Suitcases", icon: "🧳" },
  { tag: "fitness", label: "Fitness", icon: "🏋️" },
  { tag: "clothes", label: "Clothes", icon: "👕" },
  { tag: "electronics", label: "Electronics", icon: "🎧" },
]

type SavedInterest = {
  tag: string
  score: number
  source: "manual" | "auto"
  updatedAt: Date
}

export const InterestsSection = ({
  userSavedInterests,
}: {
  userSavedInterests: SavedInterest[]
}) => {
  /** ✅ hydrate from DB */
  const initialTags = useMemo(
    () => userSavedInterests.map(i => i.tag),
    [userSavedInterests]
  )

  const [userInterests, setUserInterests] = useState<string[]>(initialTags)
  const [loading, setLoading] = useState(false)

  const onToggle = (tag: string) => {
    setUserInterests(prev =>
      prev.includes(tag)
        ? prev.filter(i => i !== tag)
        : [...prev, tag]
    )
  }

  /** ✅ detect changes only */
  const hasChanges = useMemo(() => {
    if (initialTags.length !== userInterests.length) return true
    return initialTags.some(t => !userInterests.includes(t))
  }, [initialTags, userInterests])

  const onSave = async () => {
    setLoading(true)
    try {
      const { error, success } = await updateUserInterests({
        interests: userInterests,
      })

      if (error) return toast.error(error.message)

      if (success) {
        toast.success("Your interests have been updated")
      }
    } finally {
      setLoading(false)
    }
  }

  /** ✅ remove already-selected interests from suggestions */
  const suggestedInterests = INTERESTS.filter(
    i => !userInterests.includes(i.tag)
  )

  return (
    <section className="space-y-5 mt-5">
      {/* Saved */}
      {userInterests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Your interests</h3>

          <div className="flex flex-wrap gap-3">
            {userInterests.map(tag => {
              const meta = INTERESTS.find(i => i.tag === tag)
              return (
                <InterestCard
                  key={tag}
                  label={meta?.label ?? tag}
                  icon={meta?.icon}
                  selected
                  onToggle={() => onToggle(tag)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Suggested */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold">Suggested interests</h3>
        <p className="text-xs text-gray-600">
          Based on your activity and popular interests
        </p>

        <div className="flex flex-wrap gap-3">
          {suggestedInterests.map(i => (
            <InterestCard
              key={i.tag}
              label={i.label}
              icon={i.icon}
              selected={false}
              onToggle={() => onToggle(i.tag)}
            />
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        type="button"
        disabled={!hasChanges || loading}
        onClick={onSave}
        className="
          text-sm px-4 py-2 rounded-full max-sm:w-full
          bg-[#ffce12] text-gray-800
          disabled:bg-[#ffed94] disabled:text-gray-400
          disabled:border disabled:border-orange-100
        "
      >
        {loading ? (
          <div className="flex items-center gap-1">
            <SpinnerIcon /> Saving…
          </div>
        ) : (
          "Save"
        )}
      </button>
    </section>
  )
}

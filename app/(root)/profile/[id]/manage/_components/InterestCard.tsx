import { Plus, Check } from "lucide-react"

interface InterestCardProps {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onToggle: () => void
}

export const InterestCard = ({
  label,
  icon,
  selected,
  onToggle,
}: InterestCardProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        px-3 py-1.5 rounded-full border flex items-center gap-2
        text-sm transition
        ${
          selected
            ? "border-orange-400 bg-orange-50 text-orange-700"
            : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
        }
      `}
    >
      <span>{icon}</span>

      <span className="font-normal">{label}</span>

      {selected ? (
        <Check size={14} />
      ) : (
        <Plus size={14} />
      )}
    </button>
  )
}

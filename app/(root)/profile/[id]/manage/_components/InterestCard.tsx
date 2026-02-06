import { cn } from "@/lib/utils"
import { Plus, Check } from "lucide-react"

interface InterestCardProps {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onToggle: () => void
}

export const InterestCard = ({ label, icon, selected, onToggle }: InterestCardProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
        selected 
          ? "bg-yellow-100 border-yellow-400 text-yellow-800 shadow-sm" 
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      {selected ? (
        <Check size={14} className="text-yellow-700" />
      ) : (
        <Plus size={14} className="text-gray-400 group-hover:text-gray-600" />
      )}
    </button>
  );
};
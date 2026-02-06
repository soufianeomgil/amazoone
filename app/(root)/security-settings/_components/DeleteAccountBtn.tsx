"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import { signOut } from "next-auth/react"
import { deleteAccountAction } from "@/actions/user.actions"

export default function DeleteAccountBtn() {
  const [isConfirming, setIsConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteAccountAction()
      if (result.success) {
        toast.success("Account deleted. We're sorry to see you go.")
        // Sign out and redirect to home
        await signOut({ callbackUrl: "/" })
      } else {
        toast.error(result.message || "Failed to delete account")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg animate-in fade-in zoom-in duration-200">
        <p className="text-red-700 text-sm font-semibold mb-3">
          Are you absolutely sure? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button 
          className="w-fit text-red-500 font-medium text-sm cursor-pointer hover:underline"
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Forever"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsConfirming(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="w-fit text-red-500 font-medium text-sm cursor-pointer hover:underline" 
      type="button"
    >
      Delete your account
    </button>
  )
}
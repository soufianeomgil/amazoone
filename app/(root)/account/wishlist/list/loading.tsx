import React from 'react'

const loading = () => {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
      {/* Image */}
      <div className="h-[165px] bg-gray-100 flex items-center justify-center">
        <div className="w-[70%] h-[70%] rounded-md bg-gray-200 animate-pulse" />
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <div className="h-4 w-[95%] rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-[70%] rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-[45%] rounded bg-gray-200 animate-pulse" />

        <div className="flex items-center gap-2 pt-1">
          <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-10 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

export default loading


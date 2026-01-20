"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";


import { Edit, CircleCheck, HeartMinus } from "lucide-react";
import { TrashIcon, DotsVerticalIcon } from "@/components/shared/icons";
import BottomSheet from "../../../../../../components/shared/Sheet";

export default function WishlistMoreMenu({
  setOpen,
  publicSharing,
  setPublicSharing,
  isDefault,
  hasItems,
  handleSwitchDefault,
  handleEmpty,
  handleDelete,
}: {
  setOpen: (v: boolean) => void;
  publicSharing: boolean;
  setPublicSharing: (v: boolean) => void;
  isDefault: boolean;
  hasItems: boolean;
  handleSwitchDefault: () => void;
  handleEmpty: () => void;
  handleDelete: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const Actions = ({ isMobile }: { isMobile: boolean }) => (
    <div className={`${isMobile ? "px-2" : ""}`}>
      {/* Edit */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          if (isMobile) setSheetOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 ${
          isMobile ? "" : "text-left"
        }`}
      >
        <Edit color="#00afaa" size={18} />
        <span className="text-sm font-medium text-gray-900">Edit</span>
      </button>

      <div className="h-px bg-gray-100 my-1" />

      {/* Public sharing toggle */}
      <div className="w-full flex items-center justify-between px-3 py-3 rounded-xl">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">Public sharing</span>
          <span className="text-xs text-gray-500">
            {publicSharing ? "Anyone can view" : "Only you"}
          </span>
        </div>

        <Switch
          checked={publicSharing}
          onCheckedChange={(v) => setPublicSharing(v)}
          className="
            data-[state=unchecked]:bg-gray-300
            data-[state=checked]:bg-[hsl(178,100%,34%)]
          "
        />
      </div>

      <div className="h-px bg-gray-100 my-1" />

      {/* Make default */}
      {!isDefault && (
        <button
          type="button"
          onClick={() => {
            handleSwitchDefault();
            if (isMobile) setSheetOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100"
        >
          <CircleCheck color="gray" size={18} />
          <span className="text-sm font-medium text-gray-900">
            Make this default wishlist
          </span>
        </button>
      )}

      {!isDefault && <div className="h-px bg-gray-100 my-1" />}

      {/* Empty / Delete */}
      {hasItems ? (
        <button
          type="button"
          onClick={() => {
            handleEmpty();
            if (isMobile) setSheetOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100"
        >
          <HeartMinus color="gray" size={18} />
          <span className="text-sm font-medium text-gray-900">Empty wishlist</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            handleDelete();
            if (isMobile) setSheetOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 active:bg-red-100"
        >
          <TrashIcon />
          <span className="text-sm font-semibold text-red-600">Delete</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ✅ Mobile: Bottom sheet */}
      <div className="md:hidden">
        <Button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="px-3 cursor-pointer rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-100 text-gray-600"
        >
          <DotsVerticalIcon />
        </Button>

        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Wishlist options"
        >
          <Actions isMobile />
        </BottomSheet>
      </div>

      {/* ✅ Desktop: Dropdown menu */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="px-3 w-[120px] cursor-pointer flex items-center justify-center bg-gray-200 hover:bg-gray-100 text-gray-600">
              <DotsVerticalIcon />
              <span className="ml-2">More</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[320px] bg-white">
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="flex border-b border-gray-100 items-center gap-2 cursor-pointer"
            >
              <Edit color="#00afaa" size={16} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex border-b border-gray-100 items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-sm">Public sharing</span>
                <span className="text-xs text-gray-500">
                  {publicSharing ? "Anyone can view" : "Only you"}
                </span>
              </div>

              <Switch
                checked={publicSharing}
                onCheckedChange={setPublicSharing}
                className="
                  data-[state=unchecked]:bg-gray-300
                  data-[state=checked]:bg-[hsl(178,100%,34%)]
                "
              />
            </DropdownMenuItem>

            {!isDefault && (
              <DropdownMenuItem
                onClick={handleSwitchDefault}
                className="flex items-center border-b border-gray-100 gap-2 text-gray-700 cursor-pointer"
              >
                <CircleCheck color="gray" size={16} />
                Make this default wishlist
              </DropdownMenuItem>
            )}

            {hasItems ? (
              <DropdownMenuItem
                onClick={handleEmpty}
                className="flex items-center gap-2 text-gray-700 cursor-pointer"
              >
                <HeartMinus color="gray" size={16} />
                Empty wishlist
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-500! cursor-pointer"
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

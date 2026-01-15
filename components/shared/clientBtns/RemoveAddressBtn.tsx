"use client";

import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import React, { useState } from "react";
import { IAddress } from "@/models/address.model";
import { removeAddressAction, setDefaultAddressAction } from "@/actions/address.actions";
import { toast } from "sonner";
import { useConfirmStore } from "@/lib/store/confirm.store";
import { Loader2 } from "lucide-react";

const RemoveAddressBtn = ({ address }: { address: IAddress }) => {
  const [pending, setPending] = useState<"remove" | "default" | null>(null);
  const confirm = useConfirmStore((s) => s.confirm);

  const removeAddress = async () => {
    try {
      setPending("remove");
      const { error, success } = await removeAddressAction({ id: address._id });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (success) {
        toast.success("Address removed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setPending(null);
    }
  };

  const handleDeleteAddress = async () => {
    const ok = await confirm({
      title: "Remove address",
      description: "This address will be permanently removed.",
      confirmText: "Remove",
    });

    if (!ok) return;
    await removeAddress();
  };

  const handleSetToDefault = async (id: string) => {
    try {
      setPending("default");
      const { error } = await setDefaultAddressAction({ id });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Default address updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setPending(null);
    }
  };

  const isRemoving = pending === "remove";
  const isSettingDefault = pending === "default";
  const disabled = pending !== null;

  return (
    <div className="mt-4 pt-4 flex items-center space-x-3 text-sm">
      {/* Edit */}
      <Link
        href={ROUTES.editAddress(address._id)}
        className={`text-blue-600 hover:text-orange-600 hover:underline ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        Edit
      </Link>

      <span className="text-gray-300">|</span>

      {/* Remove */}
      <button
        onClick={handleDeleteAddress}
        disabled={disabled}
        className="flex items-center gap-1 text-blue-600 hover:text-orange-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRemoving && <Loader2 className="w-3 h-3 animate-spin" />}
        Remove
      </button>

      {!address.isDefault && (
        <>
          <span className="text-gray-300">|</span>

          {/* Set Default */}
          <button
            onClick={() => handleSetToDefault(address._id)}
            disabled={disabled}
            className="flex items-center gap-1 text-blue-600 hover:text-orange-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettingDefault && <Loader2 className="w-3 h-3 animate-spin" />}
            Set as Default
          </button>
        </>
      )}
    </div>
  );
};

export default RemoveAddressBtn;

"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationIcon, SpinnerIcon } from "../icons";
import { CheckIcon } from "lucide-react";
import { IAddress } from "@/models/address.model";
import { useDispatch, useSelector } from "react-redux";
import { AddAddressModal } from "./AddAddressMdel";
import { selectAddress } from "@/lib/store/addressSlice";
import { setDefaultAddressAction } from "@/actions/address.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddressModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: IAddress[] | [];
}) {
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter()
  const [loading,setLoading] = useState<boolean>(false)
  // read currently selected address id from redux
  const selectedAddress = useSelector((state: any) => state?.address?.selectedAddress);
  
  async function handlePick(address: IAddress) {
    setLoading(true)
    try {
      const { error, success } = await setDefaultAddressAction({ id: address._id });
      if (success) {
        // update redux to avoid race with server re-fetch
        dispatch(selectAddress({ address }));
        setOpen(false);
        router.refresh()
        // Optionally show toast / close modal
        toast.success("success");
      } else {
        console.error(error?.message);
        toast.error(error?.message);
      }
    } catch (err) {
      console.error(err);
    }finally {
       setLoading(false)
    }
  }

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <form>
          <DialogContent className="sm:max-w-[550px]  border border-gray-300 shadow bg-white">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center ">
                    <SpinnerIcon />
                </div>
              )}
            <DialogTitle className="text-lg font-semibold">Choisir une adresse de livraison</DialogTitle>

            <div className="mt-6 flex flex-col gap-4">
              {data.length === 0 && (
                <div className="text-sm text-gray-500">Vous n'avez pas encore d'adresse enregistrée.</div>
              )}

              {data.map((a) => {
                const isSelected = selectedAddress._id === a._id;
                return (
                  <button
                    key={a._id}
                    type="button"
                    onClick={() => handlePick(a)}
                    className={`w-full text-left border cursor-pointer rounded-lg p-4 flex items-start gap-3 transition
                      ${isSelected || a.isDefault ? "border-[hsl(178,100%,34%)] bg-[hsl(180,69%,97%)]" : "border-gray-200 bg-white hover:shadow-sm"}
                    `}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(178,100%,34%)]">
                          <CheckIcon size={14} className="text-white" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-gray-400">
                          <CheckIcon size={12} />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-black text-sm">{a.name}</p>
                        {a.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Default</span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700">+212{a.phone}</p>

                      <div className="text-sm text-gray-500">
                        <p>{a.addressLine1} {a.zipCode} {a.city}</p>
                        {a.addressLine2 && <p>{a.addressLine2}</p>}
                        {a.DeliveryInstructions && <p className="mt-1">{a.DeliveryInstructions}</p>}
                      </div>
                    </div>
                  </button>
                );
              })}

              <div
                onClick={() => {
                 
                  setOpenAddressModal(true)
                  
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenAddressModal(true)}
                className="w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer hover:border-[hsl(178,100%,34%)]"
              >
                <LocationIcon />
                <p className="font-medium text-sm text-gray-700">Ajouter une nouvelle adresse</p>
              </div>

             

              <AddAddressModal open={openAddressModal} setOpen={setOpenAddressModal} />
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default AddressModal;

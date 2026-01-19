"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import EditAddressBtn from "@/components/shared/clientBtns/EditAddressBtn";
import { LocationIcon } from "@/components/shared/icons";
import { IAddress } from "@/models/address.model";
import { AddAddressModal } from "../shared/modals/AddAddressMdel";



type ApiResponse = {
  success: boolean;
  data?: { address?: IAddress };
  message?: string;
};

export default function AddressCard() {
  const [address, setAddress] = useState<IAddress | null>(null);
   const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allAddresses, setAllAddresses] = useState<IAddress[] | []>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) get default address
        const r = await fetch("/api/address/default", { method: "GET" });
        const json: ApiResponse = await r.json();

        if (!r.ok || !json.success) {
          // show message if present, otherwise generic
          const msg = json?.message || "Could not load address";
          if (!mounted) return;
          setError(msg);
          setAddress(null);
        } else {
          if (!mounted) return;
          setAddress(json.data?.address ?? null);
        }

        // 2) optionally fetch all addresses for the Edit button menu
        // (the real endpoint may differ — replace with your addresses endpoint)
        try {
          const all = await fetch("/api/address/list", { method: "GET" });
          if (all.ok) {
            const allJson = await all.json();
            // expecting { success: true, data: { addresses: [...] } }
            if (allJson?.success && allJson.data?.addresses) {
              if (mounted) setAllAddresses(allJson.data.addresses as IAddress[]);
            }
          }
        } catch (e) {
          // ignore silently — it's optional
          console.warn("Could not load addresses list:", e);
        }
      } catch (err: any) {
        console.error("AddressCard fetch error", err);
        if (!mounted) return;
        setError(err?.message || "Unexpected error");
        setAddress(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="border border-gray-300 bg-white rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-60 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    );
  }



  // If no saved addresses -> show empty, actionable state
  if (!address || error) {
    return (
      <div
        style={{ borderStyle: "dashed" }}
        className="border-2 text-gray-600 cursor-pointer hover:border-[hsl(178,100%,34%)] flex items-center justify-center gap-2.5 rounded-lg p-6"
      >
        <LocationIcon />
        <div>
          <p onClick={()=> setOpen(true)} className="font-medium text-sm">Add a new address</p>
          <Link href="/account/addresses" className="text-xs text-blue-600 hover:underline">
            Manage your addresses
          </Link>
        </div>
        <AddAddressModal redirect={false} open={open} setOpen={setOpen} />
      </div>
    );
  }

  // Normal display
  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 max-sm:w-[97%] max-sm:mx-auto ">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <LocationIcon />
            <h3 className="font-bold text-black text-base lg:text-lg">Delivery address</h3>
          </div>

          {/* Pass addresses to the Edit button if you want a dropdown */}
          <EditAddressBtn data={allAddresses || []} />
        </div>

        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">{address.name}</span>{" "}
            <span className="text-gray-500">+{address.phone}</span>
          </p>

          <p className="text-gray-500">{address.addressLine1}</p>
          {address.addressLine2 && <p className="text-gray-500">{address.addressLine2}</p>}
          <p className="text-gray-500">
            {address.zipCode} {address.city}
            {address.state ? `, ${address.state}` : ""}
          </p>
          {address.DeliveryInstructions && (
            <p className="text-gray-500">Notes: {address.DeliveryInstructions}</p>
          )}
        </div>
      </div>
    </div>
  );
}

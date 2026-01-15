"use client";

import { hardDeleteProduct, restoreProduct } from "@/actions/product.actions";
import { IProduct } from "@/models/product.model";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

export default function TrashProductRow({ product }: {product: IProduct}) {
  // ensure we always have a valid Date (fallback to now if deletedAt is null/undefined)
  const deletedAtRaw = product.deletedAt ?? Date.now();
  const deletedAtDate = deletedAtRaw instanceof Date ? deletedAtRaw : new Date(deletedAtRaw);

  const daysLeft =
    30 -
    Math.floor(
      (Date.now() - deletedAtDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  const handleRestoreProduct = async () => {
    try {
    const {error,success} =  await restoreProduct({productId: product._id});
    if(error)  {
        toast.error(error.message)
        return
    }else if(success) {
        return toast.success("product has been restored successfuly")
    }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHardDelete = async () => {
    try {
     const  {error,success} =  await hardDeleteProduct({productId: product._id})
     if(error) {
        toast.error(error.message)
        return
     }else if(success) {
        return toast.success("product has been deleted permenently")
     }
      console.log("hard delete", product._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div key={product._id} className="flex items-center justify-between p-4 border-b bg-gray-50">
      <div className="flex items-center gap-4">
        <Image
         width={64} height={64}
          src={product.images?.[0]?.url || ''}
          className="w-16 h-16 rounded object-cover"
          alt={product.name ?? ""}
        />

        <div>
          <p className="font-medium line-clamp-1">{product.name}</p>
          <p className="text-xs text-gray-500">
            Deleted {formatDistanceToNowStrict(deletedAtDate)} ago
          </p>

          <p className="text-xs text-red-600">
            Permanently deletes in {daysLeft} days
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleRestoreProduct}
          className="px-3 py-1 text-sm rounded border hover:bg-white"
        >
          Restore
        </button>

        <button
          onClick={handleHardDelete}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete forever
        </button>
      </div>
    </div>
  );
}

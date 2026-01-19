
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { getOrCreateGuestId, resetGuestId, setGuestId, syncWithUser } from "@/lib/store/cartSlice";
import { syncCarts } from "@/actions/cart.actions";
import { useDispatch } from "react-redux";

const CartSyncHandler = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  // 🟢 Fix: Hydrate guestId on client mount
  useEffect(() => {
    const guestId = getOrCreateGuestId();
    dispatch(setGuestId(guestId));
  }, [dispatch]);

  useEffect(() => {
    const handleSync = async () => {
      if (status === "loading" || status === "unauthenticated") return;

      const guestId = getOrCreateGuestId();
      const { success } = await syncCarts(guestId);

      if (success) {
        console.log("✅ Cart sync complete.");
        localStorage.removeItem("guest_id");
        dispatch(resetGuestId());
        dispatch(syncWithUser() as any);
      }
    };

    handleSync();
  }, [status, dispatch]);

  return null;
};

export default CartSyncHandler;


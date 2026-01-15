"use client";
import React, { useState } from "react";
import { ProfileItems as Items } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { clearCart } from "@/lib/store/cartSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import Image from "next/image";


const RightSidebar = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    setLoading(true);
    try {
      if (session.status === "authenticated") {
        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.data.user.id }),
        });
      }

      dispatch(clearCart());
      localStorage.removeItem("guest_cart");

      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_API_ENDPOINT });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="hidden lg:block sticky! top-4  w-[300px]">
      <div className="sticky top-4 self-start">
           <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* TITLE */}
        <div className="px-5 flex items-center space-x-2 py-4 border-b border-gray-200">
                  <Image
                          src={session.data?.user.image || "/profile.png"}
                          alt="Profile picture"
                          width={55}
                          height={55}
                          className="w-[55px] h-[55px] 
                          rounded-full object-cover border border-gray-200"
                        />
          <div className="flex flex-col">
            <h2 className="text-[20px] font-semibold text-gray-900 tracking-tight">
            Hala !
          </h2>
           <p className="text-xs font-medium text-gray-700">
             {session.data?.user.email}
           </p>
          </div>
         
        </div>

        {/* LIST ITEMS */}
        <div className="flex flex-col">
          {Items.map((item, index) => {
            const isActive = item.pathname === pathname;
            const isLast = index === Items.length - 1;

           if (item.pathname.includes("edit")) {
  item.pathname = `/customer/account/edit/${session.data?.user.id}`;
}  
 else if (item.pathname.includes("profile")) {
  item.pathname = `/profile/${session.data?.user.id}`;
}
  


            return (
              <Link key={index} href={item.pathname} className="group">
                <div
                  className={`
                    px-5 py-4 flex items-center justify-between 
                    transition-all duration-300 cursor-pointer 
                    border-b border-gray-100
                    ${isLast ? "border-b-0" : ""}

                    ${
                      isActive
                        ? "bg-linear-to-r from-[#FFEDD5] to-[#FFF8F0] text-[#C05621]"
                        : "bg-white text-gray-700 group-hover:bg-gray-50"
                    }
                  `}
                >
                  <p className="text-sm text-black  font-bold">
                    {item.name}
                  </p>

                  {/* Accent visual */}
                  <span
                    className={`
                      h-5 w-1 rounded-full transition-all duration-300
                      ${isActive ? "bg-[#F97316]" : "bg-transparent group-hover:bg-gray-300"}
                    `}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogOut}
           aria-label="Log out from your account"
      title={"Log out"}
          className="
            w-full px-5 py-4 flex items-center justify-between
            text-gray-700 border-t border-gray-200  cursor-pointer
            hover:bg-gray-50 transition-all duration-300
          "
        >
          <span className="text-sm font-bold">
            {loading ? "Logging out..." : "Logout"}
          </span>

          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            <LogOut className="text-orange-500 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
      </div>
      </div>
    
    </aside>
  

  );
};

export default RightSidebar;

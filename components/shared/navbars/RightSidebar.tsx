// "use client";
// import React, { useState } from "react";
// import { ProfileItems as Items } from "@/constants";
// import {ROUTES} from "@/constants/routes"
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { clearCart } from "@/lib/store/cartSlice";

// import { signOut } from "next-auth/react";
// import { LogOut } from "lucide-react";
// import { useDispatch } from "react-redux";


// const RightSidebar = () => {
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(false);
//   const session = useSession();
//   const dispatch = useDispatch();

//   const handleLogOut = async () => {
//     setLoading(true);
//     try {
//       // Call server API to update user lastSeen
//       if (session.status === "authenticated") {
//         await fetch("/api/logout", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: session.data.user.id }),
//         });
//       }

//       dispatch(clearCart());
//      //  dispatch(clearShippingAddress())
//       localStorage.removeItem("guest_cart");
//       await signOut({ callbackUrl: process.env.NEXT_PUBLIC_API_ENDPOINT });
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="lg:block hidden w-[300px]">
//       {loading && <p>pending...</p>}
//       <div className="flex flex-col border border-gray-200 rounded-lg">
//         {Items.map((item, index) => {
//           const isActive = item.pathname === pathname;
//           const isFirst = index === 0;
//           const isLast = index === Items.length - 1;
//            if(item.pathname.includes("edit") || item.pathname === "/customer/account/edit") {
//               item.pathname = "/"
//            }
//           return (
//             <Link key={index} href={item.pathname} className="block">
//               <div
//                 className={`p-4 border-b border-gray-200 transition-all duration-300
//                   ${isActive ? "bg-light_blue text-white font-semibold" : "text-[#333]"}
//                   ${isActive && isFirst ? "rounded-tl-lg rounded-tr-lg" : ""}
//                   ${isActive && isLast ? "rounded-bl-lg rounded-br-lg" : ""}
//                   ${isLast ? "border-b-0" : ""}
//                 `}
//               >
//                 <p className="text-[18px] capitalize font-semibold">{item.name}</p>
//               </div>
//             </Link>
//           );
//         })}

//         <div
//           onClick={handleLogOut}
//           className="p-4 border-t flex items-center gap-2 border-gray-200 transition-all duration-300 text-[#333] cursor-pointer"
//         >
         
//           <p className="text-[18px] font-semibold">LogOut</p>
//           <LogOut className="text-light_blue" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

"use client";
import React, { useState } from "react";
import { ProfileItems as Items } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { clearCart } from "@/lib/store/cartSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

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
    <aside className="hidden lg:block w-[300px]">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* TITLE */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-[20px] font-semibold text-gray-800 tracking-tight">
            Your Account
          </h2>
        </div>

        {/* LIST ITEMS */}
        <div className="flex flex-col">
          {Items.map((item, index) => {
            const isActive = item.pathname === pathname;
            const isLast = index === Items.length - 1;

            if (
              item.pathname.includes("edit") ||
              item.pathname === "/customer/account/edit"
            ) {
              item.pathname = "/";
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
                        ? "bg-gradient-to-r from-[#FFEDD5] to-[#FFF8F0] text-[#C05621]"
                        : "bg-white text-gray-700 group-hover:bg-gray-50"
                    }
                  `}
                >
                  <p className="text-[17px] font-medium">
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
          className="
            w-full px-5 py-4 flex items-center justify-between
            text-gray-700 border-t border-gray-200 
            hover:bg-gray-50 transition-all duration-300
          "
        >
          <span className="text-[17px] font-semibold">
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
    </aside>
  );
};

export default RightSidebar;

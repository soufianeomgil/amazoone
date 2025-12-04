
"use client";

import React, { useEffect, useRef, useState } from "react";
import { DotsVerticalIcon, LockClosedIcon } from "@/components/shared/icons";
import { CogIcon, ShareIcon, TrashIcon, PencilIcon } from "lucide-react";
import CreateListModal from "@/components/shared/modals/CreateListModal";

/**
 * Types
 */
interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price?: number;
}

interface Wishlist {
  id: number;
  name: string;
  privacy: "Private" | "Public";
  itemCount: number;
  createdAt: string;
  description?: string;
  items: WishlistItem[];
}

/**
 * Mock data — richer, Amazon-like
 */
const mockWishlists: Wishlist[] = [
  {
    id: 1,
    name: "Birthday & Gift ideas",
    privacy: "Private",
    itemCount: 6,
    createdAt: "2025-09-12",
    description: "Electronics, kitchen gear and little luxuries for the family.",
    items: [
      {
        id: "w1-i1",
        name: "Sony WH-1000XM5 Wireless Headphones",
        image: "https://images-na.ssl-images-amazon.com/images/I/51pw9250rTL._AC_UL165_SR165,165_.jpg",
        price: 349.99,
      },
      {
        id: "w1-i2",
        name: "Kindle Paperwhite (2023)",
        image: "https://images-na.ssl-images-amazon.com/images/I/71nDSK9wVoL._AC_UL165_SR165,165_.jpg",
        price: 139.99,
      },
      {
        id: "w1-i3",
        name: "Le Creuset Enameled Cast Iron",
        image: "https://images-na.ssl-images-amazon.com/images/I/71hF2P9R1LL._AC_UL165_SR165,165_.jpg",
        price: 199.0,
      },
      {
        id: "w1-i4",
        name: "Apple AirTag (4-pack)",
        image: "https://images-na.ssl-images-amazon.com/images/I/71JV9arSeSL._AC_UL165_SR165,165_.jpg",
        price: 99.0,
      },
      {
        id: "w1-i5",
        name: "Philips Hue White Starter Kit",
        image: "https://images-na.ssl-images-amazon.com/images/I/71aSmObQ36L._AC_UL165_SR165,165_.jpg",
        price: 69.99,
      },
      {
        id: "w1-i6",
        name: "Stanley Vacuum Bottle 1L",
        image: "https://images-na.ssl-images-amazon.com/images/I/61TOfbZV5pL._AC_UL165_SR165,165_.jpg",
        price: 44.99,
      },
    ],
  },
  {
    id: 2,
    name: "Books to Read",
    privacy: "Public",
    itemCount: 3,
    createdAt: "2025-05-05",
    description: "Sci-fi and personal growth reading list.",
    items: [
      {
        id: "w2-i1",
        name: "Dune by Frank Herbert",
        image: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UY218_.jpg",
        price: 14.99,
      },
      {
        id: "w2-i2",
        name: "Project Hail Mary by Andy Weir",
        image: "https://m.media-amazon.com/images/I/91BdMBWd2bL._AC_UY218_.jpg",
        price: 18.0,
      },
      {
        id: "w2-i3",
        name: "Atomic Habits by James Clear",
        image: "https://m.media-amazon.com/images/I/5148Hh0QfLL._AC_UY218_.jpg",
        price: 16.5,
      },
    ],
  },
  {
    id: 3,
    name: "Home Improvement",
    privacy: "Private",
    itemCount: 0,
    createdAt: "2024-11-01",
    description: "Tools and fixtures to compare.",
    items: [],
  },
];

/**
 * Helper: format currency/date
 */
const formatCurrency = (v?: number) =>
  v == null ? "" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

/**
 * Component
 */
const Wishlist: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open,setOpen] = useState(false)

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!(menuRef.current as HTMLDivElement).contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Your Lists</h1>
          <p className="text-sm text-gray-600 mt-1">Manage lists you created, or those shared with you.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
            Import a list
          </button>
          <button onClick={()=> setOpen(true)} className="px-4 py-2 rounded-md bg-[#FF9900] hover:bg-[#e68800] text-white text-sm font-medium">
            Create a List
          </button>
        </div>
      </div>
<CreateListModal open={open} setOpen={setOpen} />
      {/* tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-6 px-1">
          <button className="pb-2 border-b-4 border-[#FF9900] text-[#FF9900] font-semibold text-sm">Your Lists</button>
          <button className="pb-2 border-b-4 border-transparent text-gray-600 hover:text-gray-900 text-sm">Idea Lists</button>
          <button className="pb-2 border-b-4 border-transparent text-gray-600 hover:text-gray-900 text-sm">Friends</button>
        </nav>
      </div>

      {/* lists */}
      <div className="space-y-4">
        {mockWishlists.map((list) => (
          <div
            key={list.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-sm transition-shadow"
          >
            {/* preview grid */}
            <div className="w-full md:w-56 shrink-0">
              {list.items.length > 0 ? (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded overflow-hidden bg-gray-50 p-1">
                  {list.items.slice(0, 4).map((it) => (
                    <div key={it.id} className="bg-white p-1 flex items-center justify-center">
                      <img src={it.image} alt={it.name} className="object-contain h-20 w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-28 rounded bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                  No items yet
                </div>
              )}
            </div>

            {/* details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <a href="#" className="text-lg font-semibold text-gray-900 hover:underline">
                      {list.name}
                    </a>
                    {list.description && <div className="text-sm text-gray-500 mt-1">{list.description}</div>}
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs">
                          {list.itemCount}
                        </span>
                        <span>{list.itemCount === 1 ? "item" : "items"}</span>
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <LockClosedIcon className="text-gray-500" />
                        <span>{list.privacy}</span>
                      </span>

                      <span className="text-sm text-gray-500">Created {formatDate(list.createdAt)}</span>
                    </div>
                  </div>

                  {/* action menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === list.id ? null : list.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                      aria-haspopup="true"
                      aria-expanded={openMenuId === list.id}
                    >
                      <DotsVerticalIcon />
                    </button>

                    {openMenuId === list.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <CogIcon size={16} /> Manage list
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <ShareIcon size={16} /> Share
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                          <TrashIcon size={16} /> Delete list
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* footer CTAs */}
              <div className="mt-4 flex items-center justify-between md:justify-end gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
                  <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50 border border-gray-200">View</button>
                  <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50 border border-gray-200">Add item</button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-md bg-[#FF9900] hover:bg-[#e68800] text-white text-sm font-medium">View List</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-600">
        Tip: Use lists to remember items for later — share them or import lists from other sites.
      </div>
    </div>
  );
};

export default Wishlist;

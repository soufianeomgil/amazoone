
import { getAllProducts } from '@/actions/product.actions'
import { getSavedListsAction } from '@/actions/savedList.actions'
import MainCard from '@/components/cards/MainCard'

import OpenListModelBtn from '@/components/shared/clientBtns/OpenListModelBtn'
import { DotsVerticalIcon } from '@/components/shared/icons'

import { CogIcon, ShareIcon, TrashIcon } from 'lucide-react'
import React from 'react'
// Home page interactivity | finish list fns
const page = async() => {
    //  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    //   const menuRef = useRef<HTMLDivElement | null>(null);
     const result = await getAllProducts()
        console.log(result.data?.products)
      const { data } = await getSavedListsAction({page: 1, limit: 10, includeArchived: true})
      console.log(data, "data here")
  return (
    <div className="bg-white w-full">
        <div className='flex flex-col gap-5 max-w-[1400px] px-3 mx-auto py-5 '>
 <div className="flex  w-full items-center justify-between">
                <h2 className='font-bold text-2xl text-black '>Your Lists</h2>
            <OpenListModelBtn />
          </div>
         <div className="flex w-full sm:hidden gap-3 overflow-x-auto no-scrollbar py-3 px-2">
  {data?.lists.map((list, index) => (
    <div
      key={index}
      className="
        shrink-0 w-[180px] 
        bg-white 
        rounded-lg 
        border border-gray-200 
        shadow-sm 
        hover:shadow-md 
        transition-all 
        active:scale-[0.97]
        flex items-center gap-3 p-2
      "
    >
      {/* Image */}
      <div className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-contain"
          src={list.items?.[0]?.variant?.images?.[0]?.url ?? "https://m.media-amazon.com/images/I/41qmXnVZFmL.jpg"}
          alt="list preview"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-gray-800 truncate">
          {list.name}
        </p>
        <p className="text-[12px] text-gray-500">{list.items.length} </p>
      </div>
    </div>
  ))}
</div>

          
         
          <div className='border sm:flex  gap-5 p-3 border-gray-700 w-full '>
            <div className="sm:flex hidden flex-col  ">
 {data?.lists.map((list,index) => (
             
<div key={index} className={`${index === 0 ? "bg-[#f3f3f3]" : "bg-transparent"} 
 cursor-pointer group w-[250px]  flex flex-col p-3 `}>
                 <div className="flex items-center justify-between">
                    <h4 className='text-sm group-hover:underline group-hover:text-yellow-500 text-black font-bold'>
                       {list.name}
                    </h4>
                    <p className='text-xs group-hover:text-yellow-500 text-gray-700 font-normal  '>
                       {list.isPrivate ? "Private" : "Public"}
                    </p>
                 </div>
                {list.isDefault && <p className='text-xs text-gray-500 font-normal'>Default List</p>} 
              </div>
             

             ))}
            </div>
            
              
              <div className='flex-1 flex border-b border-gray-200 pb-1.5 flex-col w-full'>
                 <div className='w-full flex items-center justify-between'>
                   <div className='flex items-center space-x-2'>
                      <h2 className="text-md font-bold text-black">luxury bags</h2>
                      <p className='text-gray-500 font-medium text-sm'>Public</p>
                   </div>
                   <div className='flex items-center spece-x-3'>
                     <button className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50 border border-gray-200">Add item</button>
                                        <div className="relative" 
                                        //ref={menuRef}
                                        >
                                          <button
                                          //  onClick={() => setOpenMenuId(openMenuId === 1 ? null : 1)}
                                            className="p-1 w-10 ml-3 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-100 text-gray-600"
                                            aria-haspopup="true"
                                            // aria-expanded={openMenuId === list.id}
                                          >
                                            <DotsVerticalIcon />
                                          </button>
                      
                                          {false && (
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
                 <div className='flex items-center justify-between'>
                    <div />
                    <div className="flex flex-wrap items-center mt-2 gap-3 w-full p-2 bg-white border border-gray-200 rounded-md">
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search this list"
    className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
  />

  {/* Filter Dropdown */}
  <select
    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-yellow-500"
  >
    <option value="all">Show: All items</option>
    <option value="purchased">Purchased</option>
    <option value="unpurchased">Unpurchased</option>
  </select>

  {/* Sort Dropdown */}
  <select
    defaultValue="recent"
    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-yellow-500"
  >
    <option value="recent">Sort by: Most recently added</option>
    <option value="priority">Priority</option>
    <option value="price-high">Price: High to Low</option>
    <option value="price-low">Price: Low to High</option>
  </select>
</div>

                 </div>
                 <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                          {/* {products.map((product) => (
                            <ProductCard onQuickViewClick={()=> handleQuickView(product)} key={product.id} product={product} />
                          ))} */}
                          {result.data?.products.map((product,index) => (
                           
                            <MainCard   key={index}  product={product} />
                          ))}
                        </div>
              </div>
          </div>
        </div>
         
    </div>
  )
}

export default page
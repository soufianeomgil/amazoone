"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronRight, Loader, LoaderIcon, Search, SearchIcon, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { getSuggestionResult } from "@/actions/product.actions"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { IProduct } from "@/models/product.model"
import { CaretDownIcon, SpinnerIcon } from "./icons"


const SearchInput = () => {
  const [value,setValue] = useState<string>('')
  const [open,setOpen] = useState<boolean>(false)
  const [pending,setPending] = useState<boolean>(false)
  const [suggestions,setSuggestions] = useState<IProduct[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const searchContainerRef = useRef(null)
  const handleSearch = ()=> {
    if(value.trim()) {
       router.push(`/search?q=${value}`)
    }else {
       router.push("/")
    }
  }
  useEffect(() => {
    setOpen(false)
    setValue("")
  },[pathname])


  useEffect(() => {
      const fetchResult = async()=> {
        setSuggestions([])
        setPending(true)
        try {
           const {success, data} = await getSuggestionResult({
              query: value,
              limit: 3
           })
           if(success)  {
              setSuggestions(data?.products || [])
              setPending(false)
           }
        } catch (error) {
           console.log(error)
        }finally {
           setPending(false)
        }
      }
      const delayDebouncedFunction = setTimeout(() => {
          if(value) {
             fetchResult()
          }
      }, 500)
      return ()=> {
        clearTimeout(delayDebouncedFunction)
      }
  }, [value])
useEffect(() => {
  const handleOutSideClick = (event:any)=> {
    // @ts-ignore
     if(searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setOpen(false)
        setValue('')
     }
  }
  document.addEventListener('click', handleOutSideClick)
  return ()=> {
     document.removeEventListener('click', handleOutSideClick)
  }
}, [])
  return (
    <>
    {open && (
       <div style={{backgroundColor: "rgba(0, 0, 0, .3)"}} className="fixed  top-0 left-0 inset-0 h-full w-full " />
    )}
    
  <div ref={searchContainerRef} className={` relative ${open && "z-[999999999999999999999999999999999999999]!"} flex-1 flex grow sm:mx-4`}>
        <div className="flex w-full">
                                <button className="bg-gray-200 text-gray-700 text-xs px-3 rounded-l-md border-r border-gray-300 flex items-center space-x-1">
                                    <span>All</span>
                                    <CaretDownIcon />
                                </button>
                                <input 
                                value={value} onChange={(e) => {
          setValue(e.target.value)
          if(!open) setOpen(true)
          if(e.target.value === "" && open) setOpen(false)
       }} 
                                  onKeyPress={(e)=> {
         if(e.key === "Enter") {
          handleSearch()
         } 
       }}
        type="text"
         className="w-full bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search Amazon" />
                                <button className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md">
                                    <SearchIcon />
                                </button>
                            </div>

        {/* {value &&  <X onClick={() => setValue("")} className="text-white rounded-full bg-black cursor-pointer"  size={22}/>} */}
        {value !== "" &&  open && (
  <div className="absolute  shadow-md bg-white rounded-xl
   !z-[999999999999999999999999999999999999999] top-[40px] left-0 right-0 flex-col mt-4 w-full pt-3 flex  ">
     {/* <Link href={`/search?q=${value}`} className="px-3 mb-4 flex items-center gap-2">
     <SearchIcon  color="gray" size={18} />
     <p className="text-red-700 font-medium text-base  ">{value} </p>
     </Link> */}
     <div className="px-4 py-2 text-xs text-gray-500">
  Showing results for <span className="font-medium text-gray-800">"{value}"</span>
</div>
  <div className="px-3">
       <h2 className="text-[#000] mb-3 capitalize text-[20px] font-semibold ">
         research suggestions
       </h2>
  </div>
  {/* https://photos-de.starshiners.ro/109144/707899-56x84-lo.jpg */}
 
  <div className='w-full   h-[10px] bg-gray-100  ' />
  <div className="w-full px-3 flex items-center justify-between mt-2">
           <p className="font-semibold text-[#222] text-xs ">Products</p>
           <Link className='font-semibold flex items-center gap-2 text-[#222] text-sm ' href={`/search?q=${value}`}>
               <span className="underline">See All</span>
               <ChevronRight size={16} /> 
           </Link> 
      </div>
 { suggestions.length  > 0 ? (
   

     
  <div className="flex flex-col divide-y divide-gray-100">
  {suggestions.map((item) => (
    <Link
      key={item._id}
      href={`/products/${item._id}`}
      className="
        group flex gap-4 px-4 py-3 
        hover:bg-gray-50 
        transition-colors
      "
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 flex items-center justify-center shrink-0 bg-gray-50 rounded-md overflow-hidden">
        <img
          src={item.thumbnail?.url}
          alt={item.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Name */}
        <p className="
          text-sm text-gray-900 font-medium
          line-clamp-2
          group-hover:underline
        ">
          {item.name}
        </p>

        {/* Price row */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[hsl(178,100%,34%)]">
            {formatPrice(item.basePrice)}
          </span>

          <span className="text-xs text-gray-400 line-through">
            {formatPrice(item.basePrice + 50)}
          </span>
        </div>
      </div>

      {/* Arrow / affordance */}
      <div className="flex items-center text-gray-300 group-hover:text-gray-500 transition">
        →
      </div>
    </Link>
  ))}
</div>

  
 ): (
     <div className="px-3 w-full my-2">
      {pending ? (
        <div className="w-full flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
        </div>
      ): (
         <div className="px-6 py-10 text-center text-sm text-gray-500">
  No results found for <span className="font-medium text-gray-700">"{value}"</span>
</div>
      )}  
    </div>
 )}
 
  
  

</div>
        )}
    </div>
    </>
  
  )
}

export default SearchInput


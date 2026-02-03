"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner"; // optional, remove if not in your project
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CreateListSchema } from "@/lib/zod";



type WishlistItemInput = {
  id: string;
  name: string;
  image?: string;
  price?: number | null;
};

export type CreateListPayload = {
  name: string;
  description?: string;
  privacy: "Private" | "Public";
  items: WishlistItemInput[];
};

export type CreateListModalProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCreate?: (payload: CreateListPayload) => Promise<void>;
  defaultName?: string;
};




/* -----------------------
   Component
   ----------------------- */
const CreateListModal: React.FC<CreateListModalProps> = ({ open, setOpen, defaultName = "" }) => {


  const modalRef = useRef<HTMLDivElement | null>(null);
 

  
  const form = useForm({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      name: defaultName || "",
      isDefault: false,
      isPrivate: false
    }
  });

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof CreateListSchema>) {
     
  }



  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setOpen(false)} />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-[550px] bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="flex bg-[#f3f3f3] items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Create a new list or registry</h3>
           
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Close"
              onClick={() => !isSubmitting && setOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X />
            </button>
          </div>
        </div>
          
        {/* Content */}
          <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                       {/* Full name */}
                     
       
                       {/* Gender — simple inline radios to match Amazon small style */}
                     
       
                       {/* Email */}
                     
       
                       {/* Password */}
                       <FormField
                         control={form.control}
                         name="name"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel className="text-sm font-medium text-gray-700">List name (required)</FormLabel>
                             <FormControl>
                               <Input
                                 {...field}
                                 id="name"
                                 type="text"
                                 placeholder="Enter a list name"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                 disabled={isSubmitting}
                               />
                             </FormControl>
                             <FormMessage className="text-xs text-red-600" />
                             <p className="text-xs text-gray-600 mt-1 flex items-center">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                               </svg>
                               Use lists to save items for later. All lists are private unless you share them with others.
                             </p>
                             
                           </FormItem>
                         )}
                       />
       
                       {/* Password confirm */}
                      
       
                       {/* Amazon-style primary button */}
                       <div className="flex items-center space-x-3 justify-end w-full">
                         <Button
                           type="button"
                           onClick={() => setOpen(false)}
                           disabled={isSubmitting}
                           className=" bg-transparent hover:bg-[#F7CA00] cursor-pointer w-[150px] active:bg-[#F2B600]
                            text-black font-semibold border border-[#FCD200] rounded-full py-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                           Cancel
                         </Button>
                         <Button
                           type="submit"
                           disabled={isSubmitting}
                           className=" bg-[#FFD814]  cursor-pointer  w-[150px] active:bg-[#F2B600]
                            text-black font-semibold border border-[#FCD200] rounded-full
                             py-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                           {isSubmitting ? "Creating ..." : "Create"}
                         </Button>
                         
                       </div>
                     </form>
                   </Form>
      </div>
    </div>
  );
};

export default CreateListModal;

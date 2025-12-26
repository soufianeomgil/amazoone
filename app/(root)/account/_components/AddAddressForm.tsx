"use client";

// handle language part
// handle address header open modal click
// finish the profile page
// handle image profile pic;

import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui components (adjust import paths to your project)
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LocateIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AddAddressSchema } from "@/lib/zod";
import addAddressAction from "@/actions/address.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/spinner";
import React from "react";






const AddAddressForm = () => {
  const moroccoRegions = [
  "Tanger-Tétouan-Al Hoceima",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakesh-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
];








 
  const form = useForm<z.infer<typeof AddAddressSchema>>({
      resolver: zodResolver(AddAddressSchema) as Resolver<z.infer<typeof AddAddressSchema>>,
      defaultValues: {
       
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "" ,
        city: "",
        state: "",
        postalCode: "",
        deliveryInstructions: "",
        isDefault: false,
      },
    });
 const router = useRouter()
  const onSubmit = async(values: z.infer<typeof AddAddressSchema>) => {
    try {
     const { error, success } =   await addAddressAction(values)
     if(error) {
        toast.error((error.message))
        return
     }else if(success) {
       toast.success("Adress has been added successfuly")
       form.reset()
       router.push(ROUTES.addresses)
       return
     }

    } catch (error) {
        console.log(error)
    }
  };
  return (
    <div className="bg-white">
      <div className="container mx-auto  max-w-[560px] ">
       
        <h1 className="text-2xl flex items-center gap-1 md:text-3xl font-bold text-gray-800 mb-6">
           <img src="/location.png" alt="location icon" className="w-[22px] object-contain " />  <span>Add a new address</span>
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              
              

              {/* Full name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name (First and Last name)</FormLabel>
                    <FormControl>
                      <Input className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " {...field} placeholder="John Doe" />
                    </FormControl>
                     <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " {...field} placeholder="+212 6 12 34 56 78" />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      May be used to assist delivery
                    </p>
                     <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Address lines */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " {...field} placeholder="Street address or P.O. Box" />
                    </FormControl>
                     <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Apt, suite, unit, building, floor, etc. (optional)"
                        className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        "
                      />
                    </FormControl>
                     <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* City / State(Region) / Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " {...field} placeholder="Agadir city" />
                        </FormControl>
                         <FormMessage className="text-red-500 text-sm font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={(val) => field.onChange(val)}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full border border-gray-100 bg-gray-50">
                              <SelectValue className="text-gray-700 font-medium text-sm" placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {moroccoRegions.map((r) => (
                                <SelectItem className="hover:bg-gray-100" key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                         <FormMessage className="text-red-500 text-sm font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " placeholder="50 000" {...field}  />
                        </FormControl>
                         <FormMessage className="text-red-500 text-sm font-medium" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-start">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                      />
                    </FormControl>
                    <div className="ml-3">
                      <label className="text-sm">Make this my default address</label>
                    </div>
                     <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              {/* Delivery instructions */}
              <details className="mt-4">
                <summary className="text-sm text-blue-600 hover:text-orange-600 hover:underline cursor-pointer font-semibold">
                  Add delivery instructions (optional)
                </summary>
                <div className="mt-2 p-4 rounded-md bg-gray-50 text-sm">
                  
                     <FormField
                    control={form.control}
                    name="deliveryInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                           Delivery Instuctions
                        </FormLabel>
                        <FormControl>
                          <Textarea className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-700
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        " rows={4} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm font-medium" />
                        <FormDescription className="text-sm text-gray-700 font-medium">
 Delivery instructions can help drivers find your address and deliver your
                    packages. However, they may not always be followed.
                        </FormDescription>
                       
                      </FormItem>
                    )}
                  />
                </div>
              </details>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6"
                >
                {form.formState.isSubmitting ? <Spinner /> : "Add address"}  
                </Button>

               
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddAddressForm
"use client"
import React from 'react'
import {  EditAddressSchema } from "@/lib/zod";
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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { IAddress } from '@/models/address.model';
import z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { editAddressAction } from '@/actions/address.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Spinner } from '@/components/ui/spinner';
const EditAddressForm = ({address}: {address:IAddress}) => {
  const router = useRouter()
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
 

  const form = useForm<z.infer<typeof EditAddressSchema>>({
   resolver: zodResolver(EditAddressSchema) as Resolver<z.infer<typeof EditAddressSchema>>,
         defaultValues: {
          
           id: address._id,
           name: address.name || "",
           phone: String(address.phone) || "",
           addressLine1: address.addressLine1 || "",
           addressLine2: address.addressLine2 || "" ,
           city: address.city ||  "",
           state: address.state || "",
           postalCode: address.zipCode || "",
           deliveryInstructions: address.DeliveryInstructions || "",
           isDefault: address.isDefault || false,
         },
  });

  const onSubmit = async(values: z.infer<typeof EditAddressSchema>) => {
      try {
         const  {error,success,message} = await editAddressAction(values)
         if(error) {
            toast.error(error.message)
            return
         }else if(success) {
           toast.success(message)
           router.push(ROUTES.addresses)
           return

         }
      } catch (error) {
         console.log(error)
      }
  };

  return (
    <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                   
                   
        
                    {/* Full name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name (First and Last name)</FormLabel>
                          <FormControl>
                            <Input className="input_styles" {...field} />
                          </FormControl>
                          <FormMessage />
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
                            <Input className="input_styles" {...field} />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            May be used to assist delivery
                          </p>
                          <FormMessage />
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
                            <Input className="input_styles" {...field} placeholder="Street address or P.O. Box" />
                          </FormControl>
                          <FormMessage />
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
                              placeholder="Apt, suite, unit, building, floor, etc. (optional)"
                              className="input_styles"
                              name={field.name}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
        
                    {/* City / Region / Postal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input className="input_styles" {...field} />
                              </FormControl>
                              <FormMessage />
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
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select region" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#f3f3f3]">
                                    {moroccoRegions.map((r) => (
                                      <SelectItem className="hover:bg-gray-200 " key={r} value={r}>
                                        {r}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
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
                                <Input className="input_styles" {...field} />
                              </FormControl>
                              <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                                  <Textarea className="input_styles" rows={4} {...field} />
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
                    <div className="pt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button type="submit" className="bg-yellow-400 w-[200px] hover:bg-yellow-500 text-black px-6">
                          {form.formState.isSubmitting ? <Spinner /> : "Save changes"} 
                        </Button>
                       
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
    </div>
  )
}

export default EditAddressForm
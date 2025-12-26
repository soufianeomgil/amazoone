"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Camera, MessageCircleWarning } from "lucide-react"

import { EditProfileSchema } from "@/lib/zod"
import { editUserProfile } from "@/actions/user.actions"
import { toast } from "sonner"
import { SpinnerIcon } from "../shared/icons"
import { IUser } from "@/models/user.model"
import { CldUploadWidget } from "next-cloudinary"




export function EditProfileForm({user}: {user:IUser}) {
    const widgetOptions = {
    multiple: false,
    maxFiles: 1,
    singleUploadAutoClose: false,
    showCompletedButton: true,
    showUploadMoreButton: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };
  // 1. Define your form.
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || '',
      gender : user.gender || undefined,
      password:"",
      phone: user.phoneNumber || "",
      profilePic: user.profilePictureUrl || ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
   try {
     const {error,success} = await editUserProfile({
       name: values.fullName,
       email: values.email,
       phone: values.phone,
       gender: values.gender,
       password: values.password ?? values.password,
       profilePic: values.profilePic
     })
     if(error) {
       toast.error(error.message)
       return
     }else if(success) {
       toast.success("Your Profile has been updated successfully")
       return
     }
   } catch (error) {
     console.log(error)
   }
  }
  const loading = form.formState.isSubmitting;
  const className = "bg-gray-100  outline-none w-full px-3 text-sm font-normal text-gray-800 rounded-lg focus:border border-yellow-400 py-1.5"
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-[450px] ">
     <FormField
  control={form.control}
  name="profilePic"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium">Profile Picture</FormLabel>

      <FormControl>
        <CldUploadWidget
          uploadPreset="amazone-clone" // 👈 REQUIRED
          options={widgetOptions}
          onSuccess={(result: any) => {
            const url = result?.info?.secure_url
            if (url) {
              field.onChange(url)
            }
          }}
        >
          {(widget) => (
            <div
              onClick={() => widget.open()}
              className="relative w-fit cursor-pointer group"
            >
              {/* Avatar */}
              <img
                src={field.value || user.profilePictureUrl || "/avatar-placeholder.png"}
                alt="Profile picture"
                className="sm:w-[100px] w-[70px] h-[70px] sm:h-[100px]
                rounded-full object-cover border border-gray-200"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 rounded-full bg-black/60
                opacity-0 group-hover:opacity-100 transition
                flex items-center justify-center"
              >
                <div className="flex flex-col items-center text-white text-xs">
                  <Camera size={18} />
                  <span className="mt-1">Edit</span>
                </div>
              </div>
            </div>
          )}
        </CldUploadWidget>
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>




        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-800">Name</FormLabel>
              <FormControl>
                <Input disabled={loading} className={className} placeholder="John smith" {...field} />
              </FormControl>
              
              <FormMessage className="font-medium text-xs text-red-500" />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-800">Email</FormLabel>
              <FormControl>
                <Input disabled={loading} className={className} placeholder="John@gmail.com" {...field} />
              </FormControl>
              
              <FormMessage className="font-medium text-xs text-red-500" />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-800">Primary mobile number</FormLabel>
              <FormControl>
                <Input disabled={loading} className={className} type="number"
                 placeholder="Enter your Primary PhoneNumber" {...field} />
              </FormControl>
              <FormDescription className="flex items-start gap-x-1">
                <MessageCircleWarning size={20} /> <span className="text-gray-800 text-xs font-normal">For stronger account security, add your mobile number. If there’s an unusual sign-in, we'll text you and verify that it’s really you.</span>
              </FormDescription>
            <FormMessage className="font-medium text-xs text-red-500" />
            </FormItem>
          )}
        />
      <FormField
  control={form.control}
  name="gender"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium text-gray-800">Gender</FormLabel>

      <FormControl>
        <div className="flex items-center gap-6">
          {/* Male */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              disabled={loading}
              value="male"
              checked={field.value === "male"}
              onChange={() => field.onChange("male")}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-800">Male</span>
          </label>

          {/* Female */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              disabled={loading}
              value="female"
              checked={field.value === "female"}
              onChange={() => field.onChange("female")}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-800">Female</span>
          </label>
        </div>
      </FormControl>

    <FormMessage className="font-medium text-xs text-red-500" />
    </FormItem>
  )}
/>


         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-800">Password</FormLabel>
              <FormControl>
                <Input className={className}  disabled={loading} type="password" placeholder="Enter a strong password" {...field} />
              </FormControl>
              
             <FormMessage className="font-medium text-xs text-red-500" />
            </FormItem>
          )}
        />
        <Button  disabled={loading} type="submit" className="text-sm w-[120px] disabled:text-gray-400 disabled:bg-[#ffed94] disabled:border disabled:border-orange-100 px-4 py-2 rounded-full bg-[#ffce12] text-gray-800">
           {loading ? <div className="flex items-center gap-1">
             <SpinnerIcon /> Loading...
           </div> : "Save"} 
        </Button>
         
      </form>
    </Form>
  )
}
 
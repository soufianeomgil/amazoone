"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
 // if you have radio; otherwise we'll use native inputs

import { ResetPasswordSchema } from "@/lib/zod";

import { SpinnerIcon } from "@/components/shared/icons";
import { resetPasswordAction } from "@/actions/auth.actions";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Image from "next/image";


type SignUpValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  
 

  const [error, setError] = useState<string | undefined>(undefined);
 

  const form = useForm<SignUpValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
     
      password: "",
      passwordCheck: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting
  async function onSubmit(values: SignUpValues) {
    setError(undefined);

    try {
      const {error,success, data} = await resetPasswordAction(values)
      if(error) {
         setError(error.message)
         return
      }else if(success) {
      
         toast.success("your password has been changed successfully")
         router.replace("/")
         return
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 pb-16 px-4">
      {/* Top logo */}
      <Link href="/" className="mb-4 ">
                             <Image
                                src="/ij.png"
                                alt="OMGIL Logo" 
                                priority
                                height={80}
                                width={140}
                                className="  object-contain" 
                            />
                        </Link>

      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="px-8 py-7">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create new password</h1>
            <p className="text-sm text-gray-600 mb-6">
              We'll ask for this password whenever you Sign-In using Credentials.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               
               

               

               

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="At least 6 characters"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Passwords must be at least 6 characters.
                      </p>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Password confirm */}
                <FormField
                  control={form.control}
                  name="passwordCheck"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Re-enter password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="passwordCheck"
                          type="password"
                          placeholder="Re-enter password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Amazon-style primary button */}
                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F2B600] text-black font-semibold border border-[#FCD200] rounded-sm py-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <SpinnerIcon /> : "Save changes and Sign-In"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* small copy under form */}
           
          </div>

        
        </div>


     
        {/* footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 1996–2024, Amazon.com, Inc. or its affiliates</p>
        </div>
      </div>
    </div>
  );
}

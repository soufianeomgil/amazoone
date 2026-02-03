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

import { SignUpValidationSchema } from "@/lib/zod";
import { signUpWithCredentials } from "@/actions/auth.actions";
import AuthFormBtns from "./AuthFormBtns";
import Image from "next/image";
import OptModal from "../shared/modals/OptModal";

type SignUpValues = z.infer<typeof SignUpValidationSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [openOpt,setOpenOpt] = useState(false)
  const searchParams = useSearchParams();
  const isShipping = searchParams?.get?.("shipping");
  const redirect = isShipping ? "/checkout/shipping" : "/";

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: undefined,
      password: "",
      phoneNumber: "",
      passwordCheck: "",
    },
  });
 const [destination,setDestination] = useState("")
  const isSubmitting = form.formState.isSubmitting || loading;

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    setLoading(true);
    try {
      const { success, message, error, data } = await signUpWithCredentials(values);
      setLoading(false);

      if (success) {
        form.reset();
        // mimic Amazon: after signup they often redirect to home or to verify step
        //router.push(redirect);
        setDestination(data?.email as string)
        setOpenOpt(true)
        return;
      }

      setError(error?.message ?? message ?? "An error occurred");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create account</h1>
            <p className="text-sm text-gray-600 mb-6">
              Create your Amazon account to enjoy fast checkout and order tracking.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Your name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="fullName"
                          placeholder="First and last name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Gender — simple inline radios to match Amazon small style */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Gender</FormLabel>
                      <div className="flex items-center gap-4 mt-1">
                        <label className="inline-flex items-center text-sm">
                          <input
                            type="radio"
                            value="male"
                            checked={field.value === "male"}
                            onChange={() => field.onChange("male")}
                            className="h-4 w-4 accent-yellow-500"
                            disabled={isSubmitting}
                          />
                          <span className="ml-2">Male</span>
                        </label>
                        <label className="inline-flex items-center text-sm">
                          <input
                            type="radio"
                            value="female"
                            checked={field.value === "female"}
                            onChange={() => field.onChange("female")}
                            className="h-4 w-4 accent-yellow-500"
                            disabled={isSubmitting}
                          />
                          <span className="ml-2">Female</span>
                        </label>
                      
                      </div>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
                   <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="phoneNumber"
                          type="number"
                          placeholder="+212653698840"
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
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
                    {isSubmitting ? "Creating account..." : "Create your account"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* small copy under form */}
            <p className="text-xs text-gray-600 mt-4">
              By creating an account, you agree to Amazon's{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Conditions of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Notice
              </a>
              .
            </p>
          </div>

          <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
            <p className="text-sm text-gray-700">
              Already have an account?{" "}
              <Link href={isShipping ? `/login?shipping=true` : "/login"} className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
 <div className="flex items-center justify-center mx-auto w-full max-w-sm gap-2 mt-7 mb-2">
        <div className="flex-1 h-px bg-gray-500" />
        <span className="text-xs text-black">or</span>
        <div className="flex-1 h-px bg-gray-500" />
      </div>

      <AuthFormBtns isSubmitting={isSubmitting} />
        {/* footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2015–2026, Omgil, Inc. or its affiliates</p>
        </div>
      </div>
      <OptModal email={destination}  open={openOpt} setOpen={setOpenOpt} />
    </div>
  );
}


// 15 23 42
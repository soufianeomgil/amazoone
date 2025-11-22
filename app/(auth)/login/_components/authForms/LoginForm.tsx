"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { signInWithCredentials } from "@/actions/auth.actions";
import { LoginValidationSchema } from "@/lib/zod";
import { syncWithUser } from "@/lib/store/cartSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

type LoginFormValues = z.infer<typeof LoginValidationSchema>;

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [openOtp, setOpenOtp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginValidationSchema),
    defaultValues: { email: "", password: "" },
  });
  const dispatch = useDispatch()
  const session = useSession()

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    setVerificationError(null);

    try {
      const { success, error: apiError } = await signInWithCredentials({
        email: values.email,
        password: values.password,
      });

      if (success) {
        reset();
        toast.success("You're logged in — welcome back!");
        // small delay so toast shows briefly, then navigate
        setTimeout(() => router.push("/"), 300);
        return;
      }

      // verification flow
      if (apiError?.message?.includes?.("before logging in.")) {
        setVerificationError(apiError.message);
        setOpenOtp(true);
        toast("Please verify your email before logging in.", { icon: "ℹ️" });
        return;
      }

      setError(apiError?.message ?? "Sign in failed");
      toast.error(apiError?.message ?? "Sign in failed");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }
   useEffect(() => {
    if (session?.data?.user) {
      dispatch(syncWithUser() as any)
    }
  }, [session, syncWithUser])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 pb-16 px-4">
      {/* Logo */}
      <Link href="/" className="mb-6">
        <img
          src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
          alt="Amazon Logo"
          className="h-8 invert"
        />
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="px-8 py-7">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Sign in</h1>
            <p className="text-sm text-gray-600 mb-6">
              Sign in to continue to your account.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" role="form" noValidate>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or mobile phone number
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
                {errors.password?.message ? (
                  <p className="text-xs mt-1 text-red-600">{errors.password.message}</p>
                ) : (
                  <p className="text-xs mt-1 text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Passwords must be at least 6 characters.
                  </p>
                )}
              </div>

              {verificationError && (
                <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {verificationError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-semibold border border-[#FCD200] rounded-sm py-2 transition-colors duration-150 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </Button>
            </form>

            <div className="mt-4 text-sm">
              <Link href="#" className="text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <p className="text-xs mt-5 text-gray-600">
              By continuing, you agree to Amazon's{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Notice
              </Link>
              .
            </p>
          </div>

          <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
            <p className="text-sm text-gray-700">
              New to Amazon?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Create your Amazon account
              </Link>
            </p>
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

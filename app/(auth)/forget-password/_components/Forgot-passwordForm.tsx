"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SpinnerIcon } from "@/components/shared/icons";
import { Form } from "@/components/ui/form";

import { useCooldown } from "@/hooks/useCooldown";
import { ForgotPasswordSchema } from "@/lib/zod";
import {
  forgotPasswordAction,
  verifyResetCodeAction,
} from "@/actions/auth.actions";
import Image from "next/image";

/**
 * INPUT type (before Zod transform)
 */
type ForgotPasswordInput = z.input<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [pending,setPending] = useState(false)
  const [step, setStep] = useState<"identifier" | "verify">("identifier");
  const [error, setError] = useState<string | null>(null);
  const [maskedDestination, setMaskedDestination] = useState<string>("");

  const [identifierPayload, setIdentifierPayload] =
    useState<z.infer<typeof ForgotPasswordSchema> | null>(null);

  const [code, setCode] = useState("");

  const cooldown = useCooldown(60);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema) as any,
    defaultValues: {
      identifier: "",
    },
  });

  /**
   * STEP 1 — Submit email or phone
   */
  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setError(null);

    const res = await forgotPasswordAction(data);

    if (res?.error) {
      setError(res.error.message);
      return;
    }

    if (res?.success) {
      setIdentifierPayload(data); // store for verify + resend
      setMaskedDestination(res.maskedDestination ?? "");
      setStep("verify");
      cooldown.start();
    }
  };

  /**
   * STEP 2 — Verify code
   */
  const handleVerifyCode = async () => {
    if (!identifierPayload) return;
   setPending(true)
    setError(null);
   try {
      const res = await verifyResetCodeAction({type: identifierPayload.type as any,identifier:identifierPayload.value,code});

    if (res?.error) {
      setError(res.error.message);
      return;
    }

    router.push("/reset-password");
   } catch (error) {
     console.log(error)
   }finally {
    setPending(false)
   }
  
  };

  /**
   * Resend code
   */
  const handleResend = async () => {
    if (!identifierPayload) return;

    setError(null);
    cooldown.start();

    await forgotPasswordAction(identifierPayload);
  };

  /**
   * STEP 2 UI — Verification
   */
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-10 pb-16 px-4">
        <Link href="/" className="mb-6">
          <Image 
           width={48}
           height={48}
            src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
            alt="Amazon Logo"
            className="h-12 invert"
          />
        </Link>

        <div className="w-full max-w-sm">
          <div className="bg-white border border-gray-200 rounded-md shadow-sm">
            <div className="px-8 py-7">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Enter verification code
              </h1>

              <p className="text-sm text-gray-600 mb-6">
                For your security, we've sent a verification code to{" "}
                <span className="font-medium">{maskedDestination}</span>.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
                  {error}
                </div>
              )}

              <Input
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-4"
              />

              <Button
                onClick={handleVerifyCode}
                disabled={!code || pending}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-semibold border border-[#FCD200] rounded-sm py-2"
              >
              {pending ? <SpinnerIcon /> : 'Submit code'}  
              </Button>

              <div className="mt-4 text-xs text-gray-600 space-y-2">
                <button
                  type="button"
                  disabled={cooldown.isActive}
                  onClick={handleResend}
                  className="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {cooldown.isActive
                    ? `Resend code in ${cooldown.timeLeft}s`
                    : "Resend code"}
                </button>

                <p>
                  If you don’t receive the code, check your spam folder or try
                  again.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          © 1996–2024, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    );
  }

  /**
   * STEP 1 UI — Identifier
   */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 pb-16 px-4">
      <Link href="/" className="mb-6">
        <Image 
         width={48}
         height={48}
          src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
          alt="Amazon Logo"
          className="h-12 invert"
        />
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="px-8 py-7">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Password assistance
            </h1>

            <p className="text-sm text-gray-600 mb-6">
              Enter the email address or mobile phone number associated with your
              account.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
               // @ts-ignore
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div>
                  <Label
                    htmlFor="identifier"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email or mobile phone number
                  </Label>

                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    disabled={form.formState.isSubmitting}
                    {...form.register("identifier")}
                    aria-invalid={!!form.formState.errors.identifier}
                  />

                  {form.formState.errors.identifier?.message && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.identifier.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-semibold border border-[#FCD200] rounded-sm py-2"
                >
                  {form.formState.isSubmitting ? (
                    <SpinnerIcon />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © 1996–2024, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
}

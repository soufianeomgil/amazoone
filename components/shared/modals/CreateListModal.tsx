"use client";

import React, { useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateListSchema } from "@/lib/zod";
import { createSavedListAction } from "@/actions/savedList.actions";
import type { z } from "zod";

export type CreateListModalProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  defaultName?: string;
};

const CreateListModal: React.FC<CreateListModalProps> = ({
  open,
  setOpen,
  defaultName = "",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const form = useForm({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      name: defaultName || "",
      isDefault: false,
      isPrivate: true,
    },
  } as const);

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof CreateListSchema>) {
    try {
      const res = await createSavedListAction({
        name: values.name,
        isPrivate: values.isPrivate,
        isDefault: values.isDefault,
      });

      if (res?.error) {
        toast.error(res.error.message);
        return;
      }

      toast.success("List created!");
      setOpen(false);
      form.reset({
        name: "",
        isDefault: false,
        isPrivate: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isSubmitting && setOpen(false)}
      />

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
            <h3 className="text-lg font-semibold text-gray-900">
              Create a new list
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Save items for later. You can keep it private or make it public.
            </p>
          </div>

          <button
            aria-label="Close"
            onClick={() => !isSubmitting && setOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6 py-4"
          >
            {/* List name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    List name (required)
                  </FormLabel>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Lists are private by default unless you make them public.
                  </p>
                </FormItem>
              )}
            />

            {/* Privacy + Default */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
              {/* isPrivate */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        Privacy
                      </FormLabel>
                      <p className="text-xs text-gray-600 mt-1">
                        Private: only you can see it. Public: anyone with the link can view.
                      </p>
                    </div>

                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            field.value ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          Private
                        </span>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => field.onChange(!field.value)}
                          className={[
                            "relative inline-flex h-6 w-11 items-center rounded-full transition",
                            field.value ? "bg-gray-900" : "bg-gray-300",
                            isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                          ].join(" ")}
                          aria-pressed={!field.value}
                          aria-label="Toggle privacy"
                        >
                          <span
                            className={[
                              "inline-block h-5 w-5 transform rounded-full bg-white transition",
                              field.value ? "translate-x-1" : "translate-x-5",
                            ].join(" ")}
                          />
                        </button>

                        <span
                          className={`text-xs font-medium ${
                            !field.value ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          Public
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="h-px bg-gray-200" />

              {/* isDefault */}
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        Make default wishlist
                      </FormLabel>
                      <p className="text-xs text-gray-600 mt-1">
                        New “save” actions will go to this list by default.
                      </p>
                    </div>

                    <FormControl>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => field.onChange(!field.value)}
                        className={[
                          "h-9 px-3 rounded-full border text-sm font-semibold transition",
                          field.value
                            ? "bg-white border-[hsl(178,100%,34%)] text-[hsl(178,100%,34%)]"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
                          isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                        ].join(" ")}
                      >
                        {field.value ? "Default ✓" : "Set as default"}
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center space-x-3 justify-end w-full pt-1">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="bg-transparent hover:bg-[#F7CA00] cursor-pointer w-[150px] active:bg-[#F2B600]
                text-black font-semibold border border-[#FCD200] rounded-full py-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFD814] cursor-pointer w-[150px] active:bg-[#F2B600]
                text-black font-semibold border border-[#FCD200] rounded-full py-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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


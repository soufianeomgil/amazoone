"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileUploadCloudinary as FileUpload } from "@/components/ui/file-upload";
import {
  Plus,
  Minus,
  Package,
  Image as ImageIcon,
  Tag,
  Settings,
  Save,
  Sparkles,
  X,
} from "lucide-react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { productSchema } from "@/lib/zod";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { CreateProductAction } from "@/actions/product.actions";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import Editor from "../editor/Editor";
import { MDXEditorMethods } from "@mdxeditor/editor";

// --- Types ---
// interface ImageState {
//   file?: File | null;
//   preview?: string;
//   url?: string;
//   publicId?: string;
//   alt?: string;
// }
 interface ImageObject {
  preview?: string, // data URL / blob URL or remote preview
  public_id?: string,
  url?: string,
}
interface Variant {
  sku: string;
  priceModifier: number | string;
  stock: number | string;
  attributes: { name: string; value: string }[];
  images: ImageObject[];
}

interface Attribute {
  name: string;
  value: string;
}

interface IProductFormState {
  name: string;
  description: string;
  brand: string;
  category: string;
  basePrice: number | string;
  imageUrl: ImageObject;
  images: ImageObject[];
  stock: number | string;
  tags: string;
  isFeatured: boolean;
  status: "ACTIVE" | "DRAFT" | "INACTIVE" | "OUT OF STOCK";
  variants: Variant[];
  attributes: Attribute[];
}

/* ------------------------- Component ------------------------- */
// const ImageObject = z.object({
//   file: (() => {
//     if (typeof File !== "undefined") {
//       return z.instanceof(File).optional().nullable();
//     }
//     return z.any().optional().nullable();
//   })(),
//   preview: z.string().optional(),
//   url: z.string().optional(),
//   alt: z.string().optional(),
// });

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState<IProductFormState>({
    name: "",
    description: "",
    brand: "",
    category: "",
    basePrice: "",
    imageUrl: { url: "", public_id: "", preview: "" } as any,
    images: [{ url: "", public_id: "", preview: "" }],
    stock: 0,
    tags: "",
    isFeatured: false,
    status: "DRAFT",
   variants: [{
  sku: "",
  priceModifier: 0,
  stock:0,
  attributes: [],
  images: [{ url: "", public_id: "", preview: "" }],
    }],

    attributes: [{name: "", value: ""}],
  });

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      imageUrl: {},
      images: [],
      variants: [{
      sku: "",
  priceModifier: 0,
  stock:0,
  attributes: [],
  images: [{ url: "", public_id: "", preview: "" }],
    }],
      attributes: [],
      basePrice: '',
      stock: "",
      tags: [],
      isFeatured: false,
      status: undefined,
    },
    mode: "onTouched",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;



  /* ---------- Local handlers ---------- */


  const handleSelectChange = (name: keyof IProductFormState, value: any) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProduct((prev) => ({ ...prev, isFeatured: checked }));
  };
const handleVariantAttributeChange = (vIndex: number, aIndex: number, field: keyof Attribute, value: string) => {
  setProduct((prev) => {
    const newVariants = [...prev.variants];
    const target = { ...(newVariants[vIndex] || {}) };
    target.attributes = (target.attributes || []).map((att, i) => (i === aIndex ? { ...att, [field]: value } : att));
    newVariants[vIndex] = target;
    // sync to RHF
    setValue(
      "variants",
      newVariants.map((v) => ({
        ...v,
        images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
      })),
      { shouldValidate: true }
    );
    return { ...prev, variants: newVariants };
  });
};
  const handleMainImageSelect = (file: File) => {
    setProduct((prev) => {
      if (prev.imageUrl.preview) URL.revokeObjectURL(prev.imageUrl.preview);
      const newPreview = URL.createObjectURL(file);
      return { ...prev, imageUrl: { ...prev.imageUrl, file, preview: newPreview } as any };
    });
  };

  const removeMainImage = () => {
    setProduct((prev) => {
      if (prev.imageUrl.preview) URL.revokeObjectURL(prev.imageUrl.preview);
      return { ...prev, imageUrl: { public_id: null, preview: "", url: "" } as any };
    });
  };

  const handleGalleryImageSelect = (index: number, file: File) => {
    setProduct((prev) => {
      const newImages = [...prev.images];
      if (newImages[index]?.preview) URL.revokeObjectURL(newImages[index].preview);
      const newPreview = URL.createObjectURL(file);
      newImages[index] = { ...newImages[index], preview: newPreview };
      return { ...prev, images: newImages };
    });
  };

  const addGalleryImage = () =>
    setProduct((prev) => ({ ...prev, images: [...prev.images, { file: null, preview: "" }] }));

  const removeGalleryImage = (index: number) => {
    setProduct((prev) => {
      const newImages = [...prev.images];
      const imageToRemove = newImages[index];
      if (imageToRemove?.preview) URL.revokeObjectURL(imageToRemove.preview);
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    setProduct((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

 

  const handleVariantImageSelect = (vIndex: number, imgIndex: number, file: File) => {
    setProduct((prev) => {
      const newVariants = [...prev.variants];
      const images = [...(newVariants[vIndex].images || [])];
      if (images[imgIndex]?.preview) URL.revokeObjectURL(images[imgIndex].preview);
      images[imgIndex] = { ...images[imgIndex], preview: URL.createObjectURL(file) };
      newVariants[vIndex].images = images;
      return { ...prev, variants: newVariants };
    });
  };

  // const addVariantImage = (vIndex: number) =>
  // setProduct((prev) => {
  //   const newVariants = [...prev.variants];
  //   newVariants[vIndex].images = [...(newVariants[vIndex].images || []), { public_id: "", url: "", preview: "" }];
  //   // sync to RHF
  //   setValue(
  //     "variants",
  //     newVariants.map((v) => ({
  //       ...v,
  //       images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
  //     })),
  //     { shouldValidate: true }
  //   );
  //   return { ...prev, variants: newVariants };
  // });
const addVariantImage = (vIndex: number) =>
  setProduct((prev) => {
    const newVariants = [...prev.variants];
    const images = [...(newVariants[vIndex]?.images || [])];

    const now = Date.now();
    const last = images[images.length - 1];

    // If last item is an empty placeholder created very recently, ignore the click
    if (
      last &&
      !last.url &&
      !last.preview &&
      !last.public_id &&
      (last as any)._createdAt &&
      now - (last as any)._createdAt < 500
    ) {
      return { ...prev, variants: newVariants };
    }

    // push a new placeholder (with a timestamp to help avoid immediate duplicates)
    images.push({ public_id: "", url: "", preview: "", _createdAt: now } as any);
    newVariants[vIndex] = { ...newVariants[vIndex], images };

    // sync to RHF
    setValue(
      "variants",
      newVariants.map((v) => ({
        ...v,
        images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
      })),
      { shouldValidate: true }
    );

    return { ...prev, variants: newVariants };
  });


const removeVariantImage = (vIndex: number, imgIndex: number) =>
  setProduct((prev) => {
    const newVariants = [...prev.variants];
    const imageToRemove = newVariants[vIndex].images[imgIndex];
    if (imageToRemove?.preview) URL.revokeObjectURL(imageToRemove.preview);
    newVariants[vIndex].images = newVariants[vIndex].images.filter((_, i) => i !== imgIndex);
    // sync to RHF
    setValue(
      "variants",
      newVariants.map((v) => ({
        ...v,
        images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
      })),
      { shouldValidate: true }
    );
    return { ...prev, variants: newVariants };
  });


 const addVariant = () => {
  setProduct((prev) => {
    const newVariants = [
      ...prev.variants,
      {
        sku: "",
        priceModifier: 0,
        stock: 0,
        attributes: [{ name: "Color", value: "" }, { name: "Size", value: "" }],
        images: [],
      },
    ];
    // sync to RHF
    setValue(
      "variants",
      newVariants.map((v) => ({
        ...v,
        images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
      })),
      { shouldValidate: true }
    );
    return { ...prev, variants: newVariants };
  });
};

 const removeVariant = (index: number) =>
  setProduct((prev) => {
    const newVariants = prev.variants.filter((_, i) => i !== index);
    // revoke previews from removed variant
    // (you already revoke earlier but keep safe)
    // sync to RHF
    setValue(
      "variants",
      newVariants.map((v) => ({
        ...v,
        images: (v.images || []).map((img) => ({ url: img.url ?? "", public_id: img.public_id ?? "" })),
      })),
      { shouldValidate: true }
    );
    return { ...prev, variants: newVariants };
  });

  const addAttribute = () =>
    setProduct((prev) => ({ ...prev, attributes: [...prev.attributes, { name: "", value: "" }] }));

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
  setProduct((prev) => {
    const newAttributes = [...prev.attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setValue("attributes", newAttributes.map((a) => ({ name: a.name ?? "", value: a.value ?? "" })), {
      shouldValidate: true,
    });
    return { ...prev, attributes: newAttributes };
  });
};
  /* ------------------------- Submission ------------------------- */
  const onValidatedSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
       const { error, success } = await CreateProductAction({
         name: data.name,
         description: data.description,
         isFeatured: data.isFeatured,
         category: data.category,
         tags: data.tags,
         brand: data.brand,
         imageUrl: data.imageUrl,
         images: data.images,
         status: data.status,
         stock: data.stock,
         variants: data.variants,
         attributes: data.attributes,
         basePrice: data.basePrice,
       })
       if(success) {
          router.push(ROUTES.admin.products)
          toast("product has been created successfuly")
          return;
       }else if(error) {
          toast(error.message)
          return;
       }
    } catch (error) {
      console.log(error);
    }
  };
   const widgetOptions = {
    multiple: false,
    maxFiles: 1,
    singleUploadAutoClose: false,
    showCompletedButton: true,
    showUploadMoreButton: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };
const handleMainImageUpload = (result: any) => {
  alert("trigger works")
    console.log(result, "result from cloudinary")
    // && result?.info?.secure_url && result?.info?.public_id
  if (  typeof result.info === "object" &&
      "secure_url" in result.info &&
      "public_id" in result.info) {
    const newImage = {
      url: result.info.secure_url,
      public_id: result.info.public_id,
      preview: result.info.secure_url,
    };
        
    // Save to form state (ensure keys match the schema: url and public_id)
    form.setValue("imageUrl", newImage, { shouldValidate: true });
     setProduct((prev) => ({ ...prev, imageUrl: newImage }));
  }
};
const handleGalleryImageUpload = (index: number, result: any) => {
  if (result?.info?.secure_url && result?.info?.public_id) {
    const uploaded = {
      url: result.info.secure_url,
      public_id: result.info.public_id,
      preview: result.info.secure_url,
    };

    setProduct((prev) => {
      const newImages = [...prev.images];
      newImages[index] = uploaded;

      // Sync with RHF using a mapped shape that guarantees required string fields
      const rhfImages = newImages.map((img) => ({
        url: img.url ?? "",
        public_id: img.public_id ?? "",
      }));
      form.setValue("images", rhfImages, { shouldValidate: true });

      return { ...prev, images: newImages };
    });
  }
};
const handleVariantImageUpload = (vIndex: number, imgIndex: number, result: any) => {
  console.log(result, "resulta");
  if (result?.info?.secure_url && result?.info?.public_id) {
    setProduct((prev) => {
      const newVariants = [...prev.variants];
      const images = [...(newVariants[vIndex].images || [])];

      // Ensure the index exists
      while (images.length <= imgIndex) {
        images.push({ url: "", public_id: "", preview: "" });
      }

      images[imgIndex] = {
        url: result.info.secure_url,
        // public_id: result.info.public_id,
         public_id: "https://res.cloudinary.com/djadlnbfq/image/upload/v1762472054/pbetjmrukunria4yetuo.jpg",
        preview: result.info.secure_url,
      };

      newVariants[vIndex].images = images;

      // Sync cleaned variants to RHF
      const cleanedVariants = newVariants.map((v) => ({
        ...v,
        images: (v.images || [])
          .filter((img) => !!img.url)
          .map((img) => ({ url: img.url!, public_id: img.public_id ?? "" })),
      }));

      form.setValue("variants", cleanedVariants, { shouldValidate: true });

      return { ...prev, variants: newVariants };
    });
  }
};



  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "OUT OF STOCK":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // useful watcher for debugging if needed: console.log(watch());
  // console.log(watch(), "form watch");
const isSubmitting = form.formState.isSubmitting === true;
console.log(form.formState.errors, "errors")
   const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Create New Product
                </h1>
                <p className="text-gray-600 mt-1">Add a new product to your inventory</p>
              </div>
            </div>
            <Badge className={`px-3 py-1 ${getStatusColor("")}`}>DRAFT</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onValidatedSubmit)} className="space-y-6">
            {/* Basic Info Card */}
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Basic Information</CardTitle>
                    <CardDescription>Essential details about your product</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Product Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="Enter Product Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                        <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Brand Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="Enter Product Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                  
                       {/* <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Product Description</FormLabel>
                          <FormControl>
                            <Textarea
                            rows={4}
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="Enter Product Description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}
                    {/* Product Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Product Description</FormLabel>
              <FormControl>
              <Editor
                  value={field.value}
                  disabled={isSubmitting}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
                  </div>

                  <div className="space-y-2">
                       <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Product Category</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="Enter Product Category"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                       <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Base Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              type="number"
                              min={0}
                              className="text-sm font-medium text-gray-700"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                   <Controller
  control={control}
  name="status"
  render={({ field }) => (
    <Select
      value={field.value} // RHF current value
      defaultValue="DRAFT"
      onValueChange={(val) => {
        field.onChange(val);               // update RHF
        handleSelectChange("status", val); // keep local product state in sync
      }}
    >
      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DRAFT">Draft</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="INACTIVE">Inactive</SelectItem>
        <SelectItem value="OUT OF STOCK">Out of Stock</SelectItem>
      </SelectContent>
    </Select>
  )}
/>

                    {errors.status && (
                      <p className="text-xs text-red-600 mt-1">{(errors.status as any)?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                       <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Product QTY</FormLabel>
                          <FormControl>
                            <Input
                            type="number"
                            min={0}
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="Enter Product stock"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                     <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Tags</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              className="text-sm font-medium text-gray-700"
                              placeholder="electronics,gaming,luxury"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                             Separate tags with commas 
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                </div>

               <div className="flex items-center space-x-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
  <Controller
    control={control}
    name="isFeatured"
    render={({ field }) => (
      <Switch
        id="isFeatured"
        // RHF value -> Switch checked prop
        checked={!!field.value}
        // When toggled, update RHF and local product state
        onCheckedChange={(val: boolean) => {
          field.onChange(val);
          handleSwitchChange(val);
        }}
      />
    )}
  />
  <div>
    <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
      Featured Product
    </Label>
    <p className="text-xs text-gray-500">Highlight this product on your store</p>
  </div>
</div>

              </CardContent>
            </Card>

            {/* Images Card */}
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-linear-to-br from-purple-400 to-purple-600 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Product Images</CardTitle>
                    <CardDescription>Upload high-quality images of your product</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                       
<FormField
  control={form.control}
  name="imageUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Main Product Image</FormLabel>
      <FormControl>
        <CldUploadWidget
         // uploadPreset="amazone-clone"
          
          options={widgetOptions}
           onSuccess={(results) => handleMainImageUpload(results)}
         
         
        >
          {( widget ) => {
            const open = widget?.open
            return (
  <div
             onClick={() => {
      if (typeof open === "function") {
        open();
      } else {
        console.warn("Cloudinary widget not ready yet");
      }
    }}
              className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"
            >
              {field.value?.preview ? (
                <img src={field.value.preview} className="h-full object-contain" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload</p>
                </>
              )}
            </div>
            )
           
          }}
        </CldUploadWidget>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

                

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">Gallery Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGalleryImage}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Image
                    </Button>
                  </div>

                  {product.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {product.images.map((image, index) => (
  <CldUploadWidget
    key={index}
  //   uploadPreset="amazone-clone"
    options={widgetOptions}
    onSuccess={(results) => handleGalleryImageUpload(index, results)}
  >
    {( widget ) => {
      const open = widget?.open;
      return (
        <div className="relative">
   <div 
       onClick={() => {
      if (typeof open === "function") {
        open();
      } else {
        console.warn("Cloudinary widget not ready yet");
      }
    }}
        className="w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"
      >
        {image.preview ? (
          <img src={image.preview} className="h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
            <p className="text-xs text-gray-500">Click to upload</p>
          </div>
        )}
      </div>
      <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don't open widget
            removeGalleryImage(index)
          }}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200 hover:bg-red-50"
          aria-label="Remove image"
        >
          <X className="w-3 h-3 text-red-600" />
        </button>
        </div>
       
      )
    }}
  </CldUploadWidget>
))}

                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Variants Card */}
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Product Variants</CardTitle>
                      <CardDescription>Different versions of your product (size, color, etc.)</CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Variant
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {product.variants.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No variants added yet. Click "Add Variant" to create different versions of your product.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.variants.map((variant, vIndex) => (
                      <Card key={vIndex} className="bg-linear-to-br from-gray-50 to-white border border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-800">Variant #{vIndex + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(vIndex)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">SKU</Label>
                              <Input
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(vIndex, "sku", e.target.value)}
                                placeholder="SKU-001"
                                className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Price Modifier ($)</Label>
                              <Input
                                type="number"
                                value={variant.priceModifier as any}
                                onChange={(e) => handleVariantChange(vIndex, "priceModifier", e.target.value)}
                                placeholder="0.00"
                                className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Stock</Label>
                              <Input
                                type="number"
                                value={variant.stock as any}
                                onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
                                placeholder="0"
                                className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Attributes</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {variant.attributes.map((attr, aIndex) => (
                                <div key={aIndex} className="flex space-x-2">
                                  <Input
                                    value={attr.name}
                                    onChange={(e) =>
                                      handleVariantAttributeChange(vIndex, aIndex, "name", e.target.value)
                                    }
                                    placeholder="Attribute name"
                                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                                  />
                                  <Input
                                    value={attr.value}
                                    onChange={(e) =>
                                      handleVariantAttributeChange(vIndex, aIndex, "value", e.target.value)
                                    }
                                    placeholder="Value"
                                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-700">Variant Images</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addVariantImage(vIndex)}
                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                              >
                                <Plus className="w-4 h-4 mr-2" /> Add Image
                              </Button>
                            </div>

                            {variant.images && variant.images.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                               {variant.images.map((img, imgIndex) => (
  <CldUploadWidget
    key={imgIndex}
   //  uploadPreset="amazone-clone"
    options={widgetOptions}
    onSuccess={(results) => handleVariantImageUpload(vIndex, imgIndex, results)}
   
  >
    {( widget ) => {
      const open = widget?.open;
      return (
        <div className="relative">
  <div
       onClick={() => {
      if (typeof open === "function") {
        open();
      } else {
        console.warn("Cloudinary widget not ready yet");
      }
    }}
        className="w-full h-24 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50"
      >
        {img.preview ? (
          
           
 <img src={img.preview} className="h-full object-contain" />
         
         
        ) : (
          <div className="flex  flex-col items-center">
            
            <ImageIcon className="w-5 h-5 text-gray-400" />
            <p className="text-xs text-gray-500">Click to upload</p>
          </div>
        )}
      </div>
       <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don't open widget
            removeVariantImage(vIndex, imgIndex);
          }}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200 hover:bg-red-50"
          aria-label="Remove image"
        >
          <X className="w-3 h-3 text-red-600" />
        </button>
        </div>
        
      )
    }}
  </CldUploadWidget>
))}

                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attributes Card */}
            <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-linear-to-br from-teal-400 to-teal-600 rounded-lg">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">General Attributes</CardTitle>
                      <CardDescription>Additional properties and specifications</CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAttribute}
                    className="text-teal-600 border-teal-200 hover:bg-teal-50"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Attribute
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {product.attributes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No attributes added yet. Click "Add Attribute" to include additional product specifications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <Input
                            value={attr.name}
                            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                            placeholder="Attribute name"
                            className="border-gray-200 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            placeholder="Attribute value"
                            className="border-gray-200 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProduct((prev) => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end pt-6">
              <Button
                disabled={isSubmitting}
                type="submit"
                size="lg"
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3"
              >
                <Save className="w-5 h-5 mr-2" /> {isSubmitting ? "Loading..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;


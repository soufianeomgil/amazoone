import { IVariant } from "@/models/product.model";

export function isSameItem(
  it: {
    productId: any;
    variantId?: string | null;
    variant?: IVariant | null;
  },
  productId: string,
  variantId?: string | null
) {
  if (String(it.productId) !== String(productId)) return false;

  if (variantId == null) return true;

  if (it.variant?._id && String(it.variant._id) === String(variantId)) return true;

  return false;
}

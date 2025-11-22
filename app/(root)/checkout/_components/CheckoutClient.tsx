"use client";

import React, { useMemo, useState, useEffect } from "react";

import { ChevronDown, ChevronUp, CreditCard, Lock as LockIcon } from "lucide-react";
import NiceCheckbox from "@/components/ui/NiceCheckbox";
import AddressCard from "@/components/cards/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, setPaymentMethod } from "@/lib/store/cartSlice";
import { ICart } from "@/models/cart.model";
import { Button } from "@/components/ui/button";
import { createOrderAction } from "@/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



type CartItemShape = NonNullable<ICart["items"]>[number];

type Props = {
  cartItems: ICart; // single cart document with items: ICartItem[]
  onQuantityChange?: (id: string | number, qty: number) => void;
  onDelete?: (id: string | number) => void;
  onToggleGift?: (id: string | number, next: boolean) => void;
  onPlaceOrder?: (paymentMethod: string) => void;
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const CheckoutClient: React.FC<Props> = ({ cartItems, onQuantityChange, onDelete, onToggleGift, onPlaceOrder }) => {
  const dispatch = useDispatch();

  // read payment method from redux store (defensive)
  const paymentMethodFromStore = useSelector((state: any) => state?.cart?.paymentMethod ?? null);

  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
   const [pending,setPending] = useState(false)
  const shipping = 0;
  const tax = 0;

  // Helpers: safely read product data whether productId is populated object or just an id
  const getProduct = (item: CartItemShape) => {
    const pid: any = item?.productId;
    if (!pid) return null;
    // if populated product object (has name or basePrice or thumbnail)
    if (typeof pid === "object" && (pid.name || pid.basePrice || pid.thumbnail || pid.images)) {
      return pid as any;
    }
    // not populated (ObjectId string) => no product metadata available
    return null;
  };

  const getName = (item: CartItemShape) => {
    const product = getProduct(item);
    if (product) return product.name ?? product.title ?? "Product";
    // fallback to productId string or placeholder
    if (typeof item.productId === "string") return item.productId;
    return "Product";
  };

  const getUnitPrice = (item: CartItemShape) => {
    const variant = (item as any).variant;
    if (variant && typeof variant.price === "number") return variant.price;
    if (variant && typeof variant.priceModifier === "number") {
      const product = getProduct(item);
      const base = Number(product?.basePrice ?? 0);
      return base + variant.priceModifier;
    }
    const product = getProduct(item);
    return Number(product?.basePrice ?? 0);
  };

  const getImage = (item: CartItemShape) => {
    const variant = (item as any).variant;
    if (variant && (variant.image || variant.images?.[0]?.url)) return variant.image ?? variant.images?.[0]?.url;
    const product = getProduct(item);
    if (product) {
      if (product.thumbnail?.url) return product.thumbnail.url;
      if (Array.isArray(product.images) && product.images.length) return product.images[0].url ?? product.images[0];
    }
    return "/placeholder.png";
  };

  // totals and counts (defensive: cartItems or cartItems.items may be undefined)
  const subtotal = useMemo(() => {
    if (!cartItems?.items?.length) return 0;
    return cartItems.items.reduce((acc, it) => {
      const price = Number(getUnitPrice(it) ?? 0);
      const qty = Number(it.quantity ?? 0);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    if (!cartItems?.items?.length) return 0;
    return cartItems.items.reduce((acc, it) => acc + Number(it.quantity ?? 0), 0);
  }, [cartItems]);

  const total = subtotal + shipping + tax;

  // local UI selection follows store but can be updated locally
  const [localPayment, setLocalPayment] = useState<string>(paymentMethodFromStore ?? "card");
  useEffect(() => {
    if (paymentMethodFromStore && paymentMethodFromStore !== localPayment) setLocalPayment(paymentMethodFromStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethodFromStore]);

  const choosePayment = (method: "STRIPE" | "CASH_ON_DELIVERY") => {
    setLocalPayment(method);
    dispatch(setPaymentMethod(method));
  };
   const selectedAddress = useSelector((state: any) => state?.address?.selectedAddress);
   console.log(selectedAddress, "here here here")
   const router = useRouter()
  const placeOrder = async() => {
    setPending(true)
      try {
        // client: ensure productId is a string id
const payload = {
  items: cartItems.items.map((i) => {
    // i.productId may be an ObjectId, populated product object, or string
    const pid =
      typeof i.productId === "string"
        ? i.productId
        // @ts-ignore
        : (i.productId && (i.productId._id || i.productId.id)) // populated doc
        // @ts-ignore
        ? String(i.productId._id ?? i.productId.id)
        : String(i.productId); // fallback to toString()

    return {
      productId: pid,
      quantity: i.quantity,
      variantId: i.variantId ?? null,
      variant: i.variant ?? null,
      meta: {},
    };
  }),
  billingAddress: selectedAddress.address,
  shippingAddress: selectedAddress.address,
  payment: { method: paymentMethodFromStore },
  shippingCost: 15,
};

         const {error,success,data} = await createOrderAction(payload)
         if(error) {
            toast.error(error.message)
            return
         }else if(success) {
            dispatch(clearCart())
            toast.success('order has been placed successfuly')
            router.push(`/success/order-summary/${data?.order?.id}`)  
            return
         }
      } catch (error) {
         console.log(error)
      }finally {
        setPending(false)
      }
  };

  const safeOnQty = onQuantityChange ?? (() => {});
  const safeOnDelete = onDelete ?? (() => {});
  const safeOnToggleGift = onToggleGift ?? (() => {});

  // first item (for mobile mini-summary) — guard for empty cart
  const firstItem: CartItemShape | null = cartItems?.items?.length ? cartItems.items[0] : null;

  return (
    <>
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
          

            <AddressCard />

            <div className="border flex flex-col gap-5 rounded-lg border-gray-300 p-4 shadow bg-white ">
              {/* Payment by card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => choosePayment("STRIPE")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && choosePayment("STRIPE")}
                className={`border-2 rounded-lg cursor-pointer p-4 flex items-center justify-between transition
                  ${localPayment === "STRIPE" ? "border-[hsl(178,100%,34%)] bg-[rgba(0,0,0,0.02)]" : "border-gray-300 hover:border-gray-400"}`}
              >
                <div className="flex items-center gap-3">
                  <NiceCheckbox
                    checked={localPayment === "STRIPE"}
                    onChange={(next) => next && choosePayment("CASH_ON_DELIVERY")}
                    size="md"
                    label={
                      <div className="flex flex-col">
                        <span className="font-medium text-base text-gray-900">Paiement par carte bancaire</span>
                        <span className="text-xs text-gray-500">Secure card processing — not saved</span>
                      </div>
                    }
                  />
                </div>

                <CreditCard color="hsl(178,100%,34%)" />
              </div>

              {/* Cash on delivery */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => choosePayment("CASH_ON_DELIVERY")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && choosePayment("CASH_ON_DELIVERY")}
                className={`border-2 rounded-lg cursor-pointer p-4 flex items-center justify-between transition
                  ${localPayment === "CASH_ON_DELIVERY" ? "border-[hsl(178,100%,34%)] bg-[rgba(0,0,0,0.02)]" : "border-gray-300 hover:border-gray-400"}`}
              >
                <div className="flex items-center gap-3">
                  <NiceCheckbox
                    checked={localPayment === "CASH_ON_DELIVERY"}
                    onChange={(next) => next && choosePayment("CASH_ON_DELIVERY")}
                    size="md"
                    label={
                      <div className="flex flex-col">
                        <span className="font-medium text-base text-gray-900">En espèces lors de la livraison</span>
                        <span className="text-xs text-gray-500">Pay with cash when the courier arrives</span>
                      </div>
                    }
                  />
                </div>

                <img className="w-[35px] object-contain" src="https://static.thenounproject.com/png/2526085-200.png" alt="cash icon" />
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg bg-white">
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Estimated delivery: Monday, October 28</h3>
                <p className="text-sm text-gray-500 mb-4">Items dispatched by Amazon</p>

                <div className="space-y-6">
                  {cartItems?.items?.length ? (
                    cartItems.items.map((item) => {
                      const key = (item as any)._id ?? (typeof item.productId === "string" ? item.productId : JSON.stringify(item));
                      const name = getName(item);
                      const unitPrice = getUnitPrice(item);
                      const image = getImage(item);
                      return (
                        <div key={key} className="flex flex-col sm:flex-row gap-3">
                          <img src={image} alt={name} className="w-24 h-24 object-contain self-center sm:self-start mr-4 mb-0" />
                          <div className="grow">
                            <h4 className="font-semibold text-gray-800">{name}</h4>
                            <p className="text-lg font-bold text-red-700">{currency(unitPrice)}</p>

                            <div className="mt-2 flex items-center gap-3">
                              <label className="flex items-center gap-2 text-sm">
                                <select
                                  value={item.quantity}
                                  onChange={(e) => safeOnQty((item as any)._id ?? (item as any).productId ?? key, Number(e.target.value))}
                                  className="text-sm p-1 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  {[...Array(item.productId && (item as any).productId?.stock && (item as any).productId.stock > 0 ? Math.min(10, (item as any).productId.stock) : 10).keys()].map((n) => (
                                    <option key={n + 1} value={n + 1}>
                                      Qty: {n + 1}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <button onClick={() => safeOnDelete((item as any)._id ?? (item as any).productId ?? key)} className="text-sm text-blue-600 hover:underline">
                                Delete
                              </button>
                            </div>

                            {(item as any).giftable !== undefined && (
                              <div className="mt-2">
                                <NiceCheckbox
                                  id={`gift-${(item as any)._id ?? (item as any).productId ?? key}`}
                                  checked={Boolean((item as any).giftable)}
                                  size="sm"
                                  onChange={(v) => safeOnToggleGift((item as any)._id ?? (item as any).productId ?? key, v)}
                                  label={<span className="text-sm text-gray-700">This is a gift</span>}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-600">No items in your cart</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column / order summary visible on md+ */}
          <div className="lg:col-span-1">
            <div className="border bg-white border-gray-300 rounded-lg p-4 sticky top-4 hidden sm:block">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({totalItems}):</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & handling:</span>
                  <span>{currency(shipping)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Total before tax:</span>
                  <span>{currency(subtotal + shipping)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Estimated tax to be collected:</span>
                  <span>{currency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-red-700 mt-4 pt-4 border-t border-gray-300">
                <h3>Order total:</h3>
                <h3>{currency(total)}</h3>
              </div>

              <Button
                className="w-full bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-lg mt-4 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center gap-2"
                onClick={placeOrder}
              >
                <span>Place your order</span>
              </Button>

              <div className="text-xs text-gray-500 mt-4 flex items-start">
                <LockIcon className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                <span>By placing your order, you agree to Amazon's privacy notice and conditions of use.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE CTA */}
      <div className="sm:hidden">
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-3 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileSummaryOpen((s) => !s)}
              aria-expanded={mobileSummaryOpen}
              className="flex items-center gap-3 text-sm text-gray-700"
            >
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-500">Total</span>
                <span className="font-semibold text-lg">{currency(total)}</span>
                <span className="text-xs text-gray-500">({totalItems} item{totalItems > 1 ? "s" : ""})</span>
              </div>

              <div className="p-2 rounded-md bg-gray-100">
                {mobileSummaryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </div>
            </button>

            <Button onClick={placeOrder} className="flex-1 ml-2 cursor-pointer inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow">
              Place your order
            </Button>
          </div>

          <div className={`max-w-6xl mx-auto px-3 overflow-hidden transition-all duration-200 ${mobileSummaryOpen ? "max-h-56 py-3" : "max-h-0"}`} aria-hidden={!mobileSummaryOpen}>
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-inner">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{currency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currency(tax)}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-start gap-2">
                  {firstItem ? (
                    <>
                      <div className="w-12">
                        <img src={getImage(firstItem)} alt={getName(firstItem) || "item"} className="w-12 h-12 object-contain rounded-sm" />
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">{getName(firstItem) ?? "—"}</div>
                        <div className="text-xs text-gray-500">
                          {cartItems.items.length} item{cartItems.items.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="text-right font-semibold">{currency(subtotal)}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">Your cart is empty</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-28" />
      </div>
    </>
  );
};

export default CheckoutClient;

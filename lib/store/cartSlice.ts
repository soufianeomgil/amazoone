import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  addToCart,
  removeFromCart,
  syncCarts,
  updateCartItemQuantity,
} from '@/actions/cart.actions';

// -------------------- Types --------------------
export type VariantSelection = {
  variantId?: string; // id of the product variant (if your product has variants in DB)
  // optional free-form object with chosen attributes for the variant (color, size...)
  variant?: Record<string, any>;
};

export type CartItem = {
  _id: string; // unique id for cart item: `${productId}:${variantId || ''}`
  productId: string; // actual product id
  brand: string;
  name: string;
  imageUrl: {
    url?: string;
    public_id?: string;
    preview?: string;
  };
  basePrice: number;
  quantity: number;
  variantId?: string | null; // optional variant id
  variant?: Record<string, any> | null; // optional variant metadata (attributes)
};
type PaymentMethod =  'cod' | 'Stripe' | string;
interface CartState {
  items: CartItem[];
  isLoaded: boolean;
  isOrderDetailsOpened: boolean;
  orderId: string | null;
  loadOrderDetails: boolean;
  isAdminSidebarOpen: boolean;
  isOpen: boolean;
  cartId: string | null;
  guestId: string | null;
   paymentMethod: PaymentMethod; // <- added
}

const initialState: CartState = {
  items: [],
  isLoaded: false,
  isAdminSidebarOpen: false,
  loadOrderDetails: false,
  orderId: null,
  isOrderDetailsOpened: false,
  isOpen: false,
  cartId: null,
  guestId: typeof window !== 'undefined' ? localStorage.getItem('guest_id') : null,
   paymentMethod:
    typeof window !== 'undefined'
      ? (localStorage.getItem('payment_method') as PaymentMethod) ?? "cod"
      : "cod",
};

// -------------------- Helpers --------------------
export const getOrCreateGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  let guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guest_id', guestId);
  }
  return guestId;
};

const makeCartItemId = (productId: string, variantId?: string | null) =>
  `${productId}:${variantId ?? ''}`;

// -------------------- Thunks --------------------
// The item passed to addItemAsync now supports variantId & variant object
export const addItemAsync = createAsyncThunk(
  'cart/addItem',
  async (
    item: {
      productId: string;
      brand: string;
      name: string;
      imageUrl: CartItem['imageUrl'];
      basePrice: number;
      quantity: number;
      variantId?: string | null;
      variant?: Record<string, any> | null;
    },
    { getState }
  ) => {
    const state = getState() as { cart: CartState };
    const guestId = state.cart.guestId || getOrCreateGuestId();

    // send variant data to server if your server supports it
    await addToCart({
      guestId,
      item: {
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId,
        variant: item.variant,
      } as any,
    } as any);

    // Create CartItem shaped payload for reducer
    const cartItem: CartItem = {
      _id: makeCartItemId(item.productId, item.variantId),
      productId: item.productId,
      brand: item.brand,
      name: item.name,
      imageUrl: item.imageUrl,
      basePrice: item.basePrice,
      quantity: item.quantity,
      variantId: item.variantId ?? null,
      variant: item.variant ?? null,
    };

    return cartItem;
  }
);

export const removeItemAsync = createAsyncThunk(
  'cart/removeItem',
  async (
    payload: { productId: string; variantId?: string | null },
    { getState }
  ) => {
    const state = getState() as { cart: CartState };
    const guestId = state.cart.guestId || getOrCreateGuestId();
    const id = makeCartItemId(payload.productId, payload.variantId);

    await removeFromCart({
      guestId,
      productId: payload.productId,
      variantId: payload.variantId,
    } as any);

    return id;
  }
);

// export const updateQuantityAsync = createAsyncThunk(
//   'cart/updateQuantity',
//   async (
//     {
//       productId,
//       variantId,
//       quantity,
//     }: { productId: string; variantId?: string | null; quantity: number },
//     { getState }
//   ) => {
//     const state = getState() as { cart: CartState };
//     const guestId = state.cart.guestId || getOrCreateGuestId();
//     const id = makeCartItemId(productId, variantId);

//     await updateCartItemQuantity({
//       guestId,
//       productId,
//       quantity,
//       variantId,
//     } as any);

//     return { id, quantity };
//   }
// );

// Replace or update your createAsyncThunk to pass variantId consistently (null for no variant)
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      productId,
      variantId,
      quantity,
    }: { productId: string; variantId?: string | null; quantity: number },
    { getState }
  ) => {
    const state = getState() as { cart: CartState };
    const guestId = state.cart.guestId || getOrCreateGuestId();
    // normalize variantId here as well: empty string -> null
    const normalizedVariantId = variantId && String(variantId).trim() !== "" ? String(variantId) : null;
    const id = makeCartItemId(productId, normalizedVariantId);

    await updateCartItemQuantity({
      guestId,
      productId,
      quantity,
      variantId: normalizedVariantId,
    } as any);

    return { id, quantity };
  }
);

export const syncWithUser = createAsyncThunk(
  'cart/syncWithUser',
  async (_, { getState }) => {
    const state = getState() as { cart: CartState };
    const guestId = state.cart.guestId;
    console.log(guestId , "guest ID here here !!")
    if (!guestId) return [];

    const { data } = await syncCarts(guestId);
    localStorage.removeItem('guest_id');

    // Expect server to return array of cart items — ensure they contain variant info if applicable.
    // Here we pass through whatever server returned.
    // On client side we normalize items to our CartItem shape if needed.
    return data?.mergedCart || [];
  }
);

// -------------------- Slice --------------------
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGuestId: (state, action: PayloadAction<string>) => {
      state.guestId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_id', action.payload);
      }
    },
    resetGuestId: (state) => {
      state.guestId = null;
    },
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    openOrderDetails: (state) => {
      state.isOrderDetailsOpened = true;
    },
    startLoadingOrderDetails: (state) => {
      state.loadOrderDetails = true;
    },
    endLoadingOrderDetails: (state) => {
      state.loadOrderDetails = false;
    },
    closeOrderDetails: (state) => {
      state.isOrderDetailsOpened = false;
    },
    saveOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('payment_method', action.payload);
        } catch (e) {
          // ignore storage errors
          console.warn('Could not persist payment method', e);
        }
      }
    },
    toggleAdminSidebar: (state) => {
      state.isAdminSidebarOpen = !state.isAdminSidebarOpen;
    },
    clearCart: (state) => {
      state.items = [];
      state.cartId = null;
    },
    // local-only add/remove/update reducers (useful for immediate UI updates)
    addLocalItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeLocalItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    updateLocalQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemAsync.fulfilled, (state, action) => {
        const existing = state.items.find(i => i._id === action.payload._id);
        if (existing) {
          existing.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const item = state.items.find(i => i._id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(syncWithUser.fulfilled, (state, action) => {
        // If server returns normalized cart items shape matching CartItem, use directly.
        // Otherwise you may need to map server format -> CartItem.
        state.items = Array.isArray(action.payload)
          ? action.payload.map((it: any) => {
              // If server item already has productId and variant info, create normalized CartItem
              if (it.productId) {
                const variantId = it.variantId ?? it.variant?._id ?? null;
                return {
                  _id: makeCartItemId(it.productId, variantId),
                  productId: it.productId,
                  brand: it.brand ?? it.title ?? '',
                  name: it.name ?? it.title ?? '',
                  imageUrl: it.image || it.imageUrl || { url: '' },
                  basePrice: it.price ?? it.basePrice ?? 0,
                  quantity: it.quantity ?? 1,
                  variantId: variantId,
                  variant: it.variant ?? null,
                } as CartItem;
              }
              // Fallback if server returned a simple item
              return {
                _id: it._id ?? makeCartItemId(it.productId ?? it._id, it.variantId ?? null),
                productId: it.productId ?? it._id,
                brand: it.brand ?? '',
                name: it.title ?? it.name ?? '',
                imageUrl: it.image ?? { url: '' },
                basePrice: it.price ?? it.basePrice ?? 0,
                quantity: it.quantity ?? 1,
                variantId: it.variantId ?? null,
                variant: it.variant ?? null,
              } as CartItem;
            })
          : [];
        state.guestId = null;
      });
  },
});

// -------------------- Selectors --------------------
export const getTotalItems = (state: { cart: CartState }): number => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};
export const getPaymentMethod = (state: { cart: CartState }): PaymentMethod => state.cart.paymentMethod;
interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

export const getTotalPrice = (
  cart: CartState,
  coupon?: Coupon
): number => {
  const subtotal = cart.items.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  );

  if (!coupon) return subtotal;

  if (coupon.discountType === 'percentage') {
    return subtotal - (subtotal * coupon.value) / 100;
  }

  if (coupon.discountType === 'fixed') {
    return Math.max(0, subtotal - coupon.value);
  }

  return subtotal;
};

// -------------------- Exports --------------------
export const {
  setGuestId,
  startLoadingOrderDetails,
  endLoadingOrderDetails,
  open,
  close,
  clearCart,
  saveOrderId,
  resetGuestId,
  toggleAdminSidebar,
  setLoaded,
  openOrderDetails,
  closeOrderDetails,
  setPaymentMethod,
  addLocalItem,
  removeLocalItem,
  updateLocalQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

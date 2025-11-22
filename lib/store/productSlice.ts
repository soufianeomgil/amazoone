import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductState = {
  selectedVariant: {
    [productId: string]: number; // productId → variant index
  };
};

const initialState: ProductState = {
  selectedVariant: {},
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    selectVariant: (
      state,
      action: PayloadAction<{ productId: string; variantIndex: number }>
    ) => {
      const { productId, variantIndex } = action.payload;
      state.selectedVariant[productId] = variantIndex;
    },
    clearSelectedVariant: (state, action: PayloadAction<{ productId: string }>) => {
      delete state.selectedVariant[action.payload.productId];
    },
  },
});

export const { selectVariant, clearSelectedVariant } = productSlice.actions;
export default productSlice.reducer;

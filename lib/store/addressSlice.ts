// store/addressSlice.ts
import { IAddress } from "@/models/address.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddressState = {
  // currently selected address id (or null if none)
  selectedAddress: {}
};

const initialState: AddressState = {
  selectedAddress: {},
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // select an address by id
    selectAddress: (state, action: PayloadAction<{ address: IAddress }>) => {
      state.selectedAddress = action.payload
    },

    // clear the selected address
    clearSelectedAddress: (state) => {
      state.selectedAddress = {};
    },
  },
});

export const { selectAddress, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;

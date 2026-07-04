import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 🔄 replace whole cart (from MongoDB)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // ➕ add item locally
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        (i) => i.product._id === action.payload.product._id
      );

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
    },

    // 🔢 update quantity
    updateQty: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.product._id === action.payload.productId
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    // ❌ remove all items
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addItem, updateQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
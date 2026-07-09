import { configureStore } from "@reduxjs/toolkit";
import interactionReducer from "./slices/interactionSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    interactions: interactionReducer,
    chat: chatReducer,
  },
});

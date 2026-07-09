import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, conversationId }) => {
    const res = await axios.post("http://localhost:8000/api/chat/", {
      message,
      conversation_id: conversationId,
    });
    return res.data;
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    conversationId: null,
    loading: false,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.conversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.conversation_id;
        state.messages.push({
          role: "assistant",
          content: action.payload.response,
        });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.messages.push({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        });
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;

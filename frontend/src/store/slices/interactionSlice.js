import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8000/api/interactions";

export const fetchInteractions = createAsyncThunk(
  "interactions/fetchAll",
  async () => {
    const res = await axios.get(API);
    return res.data;
  },
);

export const createInteraction = createAsyncThunk(
  "interactions/create",
  async (data) => {
    const res = await axios.post(API, data);
    return res.data;
  },
);

export const updateInteraction = createAsyncThunk(
  "interactions/update",
  async ({ id, data }) => {
    const res = await axios.put(`${API}/${id}`, data);
    return res.data;
  },
);

export const deleteInteraction = createAsyncThunk(
  "interactions/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  },
);

const interactionSlice = createSlice({
  name: "interactions",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const idx = state.list.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload);
      });
  },
});

export default interactionSlice.reducer;

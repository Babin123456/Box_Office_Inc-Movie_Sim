/**
 * @fileoverview Redux Toolkit slice for Contract Management & Negotiations
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchPendingContracts = createAsyncThunk("contract/fetchPending", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/contracts");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch contracts");
  }
});

export const buyoutContractAction = createAsyncThunk("contract/buyout", async (contractId, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/contracts/buyout", { contractId });
    return { contractId, data: response.data.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to buyout contract");
  }
});

export const renegotiateContractAction = createAsyncThunk("contract/renegotiate", async ({ contractId, newOffer }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/contracts/renegotiate", { contractId, newOffer });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to renegotiate contract");
  }
});

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contracts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchPendingContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(buyoutContractAction.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter(c => c._id !== action.payload.contractId);
      })
      .addCase(renegotiateContractAction.fulfilled, (state, action) => {
        const index = state.contracts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      });
  },
});

export default contractSlice.reducer;


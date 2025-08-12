import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
  
    const res = await axiosClient.post("/auth/signin", credentials);
    
    return res;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
        localStorage.setItem("token", payload.token);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Login failed";
      });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

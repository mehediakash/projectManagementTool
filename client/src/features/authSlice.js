import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// backend uses /auth/signin and returns { token, user }
export const signin = createAsyncThunk("auth/signin", async (payload) => {
  const res = await axiosClient.post("/auth/signin", payload);
  return res;
});

export const signup = createAsyncThunk("auth/signup", async (payload) => {
  const res = await axiosClient.post("/auth/signup", payload);
  return res;
});

const token = localStorage.getItem("token");
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: { user, token, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null;
      localStorage.removeItem("token"); localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (s)=>{s.loading=true; s.error=null;})
      .addCase(signin.fulfilled, (s,{payload})=>{
        s.loading=false; s.user=payload.user; s.token=payload.token;
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
      })
      .addCase(signin.rejected, (s,{error})=>{s.loading=false; s.error=error.message;})
      .addCase(signup.fulfilled, (s,{payload})=>{
        // optional autologin
        s.user=payload.user; s.token=null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

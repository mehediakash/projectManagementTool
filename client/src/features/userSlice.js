import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  return await axiosClient.get("/users"); // returns array
});

const slice = createSlice({
  name: "users",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchUsers.pending, (s)=>{s.loading=true;})
     .addCase(fetchUsers.fulfilled, (s,{payload})=>{s.loading=false; s.list=payload;})
     .addCase(fetchUsers.rejected, (s)=>{s.loading=false;});
  }
});

export default slice.reducer;

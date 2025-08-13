import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const res = await axiosClient.get("/projects");
  return res.rows ?? res; // service returns { total, page, limit, rows }
});

export const createProject = createAsyncThunk("projects/create", async (payload) => {
  return await axiosClient.post("/projects", payload);
});

export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  await axiosClient.delete(`/projects/${id}`);
  return id;
});

const slice = createSlice({
  name: "projects",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProjects.pending, (s)=>{s.loading=true;})
     .addCase(fetchProjects.fulfilled, (s,{payload})=>{s.loading=false; s.list=payload;})
     .addCase(fetchProjects.rejected, (s)=>{s.loading=false;})
     .addCase(createProject.fulfilled, (s,{payload})=>{s.list.unshift(payload);})
     .addCase(deleteProject.fulfilled, (s, { payload: id }) => {
        s.list = s.list.filter(p => p._id !== id);
     });
  }
});
export default slice.reducer;

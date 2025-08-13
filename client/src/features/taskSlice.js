import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (params={}) => {
  const query = new URLSearchParams(params).toString();
  return await axiosClient.get(`/tasks${query ? `?${query}` : ""}`);
});

export const fetchAllTasks = createAsyncThunk("tasks/fetchAll", async (params={}) => {
  const query = new URLSearchParams(params).toString();
  return await axiosClient.get(`/tasks/all${query ? `?${query}` : ""}`);
});

export const createTask = createAsyncThunk("tasks/create", async (payload) => {
  return await axiosClient.post("/tasks", payload);
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }) => {
  return await axiosClient.put(`/tasks/${id}`, data);
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await axiosClient.delete(`/tasks/${id}`);
  return id;
});

export const assignTask = createAsyncThunk("tasks/assign", async ({ id, assigneeId }) => {
  return await axiosClient.post(`/tasks/${id}/assign`, { assigneeId });
});

const slice = createSlice({
  name: "tasks",
  initialState: { list: [], allTasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchTasks.pending, (s)=>{s.loading=true;})
     .addCase(fetchTasks.fulfilled, (s,{payload})=>{s.loading=false; s.list=Array.isArray(payload)?payload:payload.rows||[];})
     .addCase(fetchTasks.rejected, (s,{error})=>{s.loading=false; s.error=error.message;})
     .addCase(fetchAllTasks.pending, (s)=>{s.loading=true;})
     .addCase(fetchAllTasks.fulfilled, (s,{payload})=>{s.loading=false; s.allTasks=Array.isArray(payload)?payload:payload.rows||[];})
     .addCase(fetchAllTasks.rejected, (s,{error})=>{s.loading=false; s.error=error.message;})
     .addCase(createTask.fulfilled, (s,{payload})=>{s.list.unshift(payload);})
     .addCase(updateTask.fulfilled, (s,{payload})=>{
        s.list = s.list.map(t=> t._id===payload._id ? payload : t);
        s.allTasks = s.allTasks.map(t=> t._id===payload._id ? payload : t);
     })
     .addCase(deleteTask.fulfilled, (s,{payload:id})=>{
        s.list = s.list.filter(t=> t._id!==id);
        s.allTasks = s.allTasks.filter(t=> t._id!==id);
     })
     .addCase(assignTask.fulfilled, (s,{payload})=>{
        s.list = s.list.map(t=> t._id===payload._id ? payload : t);
        s.allTasks = s.allTasks.map(t=> t._id===payload._id ? payload : t);
     });
  }
});

export default slice.reducer;

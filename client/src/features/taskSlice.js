import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    return await axiosClient.get("/tasks");
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (payload, { rejectWithValue }) => {
  try {
    return await axiosClient.post("/tasks", payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await axiosClient.put(`/tasks/${id}`, data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const assignTask = createAsyncThunk("tasks/assignTask", async ({ id, assigneeId }, { rejectWithValue }) => {
  try {
    return await axiosClient.post(`/tasks/${id}/assign`, { assigneeId });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createTask.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(createTask.rejected, (s, a) => { s.error = a.payload; })

      .addCase(updateTask.fulfilled, (s, a) => {
        s.list = s.list.map(t => (t._id === a.payload._id ? a.payload : t));
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.list = s.list.filter(t => t._id !== a.payload);
      })
      .addCase(assignTask.fulfilled, (s, a) => {
        // API returns updated task
        s.list = s.list.map(t => (t._id === a.payload._id ? a.payload : t));
      });
  }
});

export default taskSlice.reducer;

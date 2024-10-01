import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:5000';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get(baseUrl);
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (text) => {
  const response = await axios.post(`${baseUrl}/save`, { text });
  return response.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, text }) => {
  const response = await axios.post(`${baseUrl}/updates`, { _id: id, text });
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  const response = await axios.post(`${baseUrl}/delete`, { _id: id });
  return response.data;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        state.todos[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload._id);
      });
  },
});

export default todoSlice.reducer;

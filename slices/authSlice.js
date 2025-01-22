import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null, // Set user data here
    token: "",
    base_url: "http://192.168.29.244:8080",
 
    }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state, action) {
      state.user = null;
      state.token = null;
    },
  
  },
})

//selectors

export const { login, logout, getToken, storeUserID } = authSlice.actions
export const userInfo = (state) => state.auth.user
export const tokenInfo = (state) => state.auth.token
export const base_url = (state) => state.auth.base_url

export default authSlice.reducer
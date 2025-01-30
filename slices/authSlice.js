import { createSlice } from '@reduxjs/toolkit'

const productionUrl = "https://instagram-clone-qoyv.onrender.com"
const vercelProductionUrl = "https://instagram-clone-expo.vercel.app"
const localHostUrl = "http://192.168.29.244:8080"

const initialState = {
    user: null,
    base_url: localHostUrl,
    }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
    },
  },
})

export const { login } = authSlice.actions
export const base_url = (state) => state.auth.base_url
export default authSlice.reducer
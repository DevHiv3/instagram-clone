import { createSlice } from '@reduxjs/toolkit'

const productionUrl = "https://instagram-clone-qoyv.onrender.com"
const vercelProductionUrl = "https://instagram-clone-expo.vercel.app"
const localHostUrl = "http://192.168.216.222:8080"
const appLink = "instagramclone://"

const initialState = {
    user: null,
    base_url: localHostUrl,
    applink: appLink
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
export const applink = (state) => state.auth.applink
export default authSlice.reducer
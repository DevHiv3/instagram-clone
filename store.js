import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"

export const store = configureStore({

    reducer: {
        auth: authReducer
    }
})

/*
[
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/1.jpg?alt=media&token=63304587-513b-436d-a228-a6dc0680a16a',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/2.mp4?alt=media&token=fcd41460-a441-4841-98da-d8f9a714dd4d',
          type: 'video',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/3.jpg?alt=media&token=326c1809-adc2-4a23-b9c3-8995df7fcccd',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/4.jpg?alt=media&token=e9c5bead-4d9f-40d9-b9fa-c6bc12dd6134',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/5.jpg?alt=media&token=7dcb6c3a-8080-4448-bb2c-c9594e70e572',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/6.jpg?alt=media&token=1121dc71-927d-4517-9a53-23ede1e1b386',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/7.jpg?alt=media&token=7e92782a-cd84-43b6-aba6-6fe6269eded6',
          type: 'image',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/8.mp4?alt=media&token=5b6af212-045b-4195-9d65-d1cab613bd7f',
          type: 'video',
          finish: 0,
        },
        {
          content:
            'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/9.jpg?alt=media&token=0a382e94-6f3f-4d4e-932f-e3c3f085ebc3',
          type: 'image',
          finish: 0,
        },
      ]
        */
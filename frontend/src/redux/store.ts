import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import commonReducer from './commonSlice';
import loginSlice from './loginSlice';
export const store = configureStore({
    reducer:{
        common: commonReducer,
        login: loginSlice
    },   
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

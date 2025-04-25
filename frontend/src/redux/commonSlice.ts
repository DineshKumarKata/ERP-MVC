import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TypeOFinitialState {
    PopupMemory: any,
    Loading: any,
}

const initialState: TypeOFinitialState = {
    PopupMemory: {
        enable: false,
        message: "",
        type: "",
        redirectOnSuccess: ""
    },
    Loading: {
        enable: false
    }   
}
export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        PopupAction: (state, action: PayloadAction<any>) => {
            state.PopupMemory = action.payload;
        },
        LoadingAction: (state, action: PayloadAction<any>) => {
            state.Loading = action.payload;
        }
    }
})

export const { PopupAction, LoadingAction} = commonSlice.actions;
export default commonSlice.reducer;
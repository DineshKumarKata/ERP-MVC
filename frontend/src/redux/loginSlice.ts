import { createSlice, PayloadAction } from "@reduxjs/toolkit"
interface TypeOFinitialState {
    loginDetails:any
}

const initialState: TypeOFinitialState = {
    loginDetails:{
        loginId: '',
        loginEmail: '',
        loginName: '',
        lastLogin:'',
        token: '',
        loginType: '',
        role:'',
    },
}
export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        saveLoginDetails: (state, action: PayloadAction<any>) => {
            state.loginDetails = action.payload;
        },
    }
})

export const { saveLoginDetails } = loginSlice.actions;
export default loginSlice.reducer;
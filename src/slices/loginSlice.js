import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
	name: "login",
	initialState: {value: []},
	reducers: {
		newUser(state, action) {
			state.value = action.payload
		}
	}
});


export const { newUser } = loginSlice.actions;
export default loginSlice.reducer;
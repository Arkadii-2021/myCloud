import { createSlice } from "@reduxjs/toolkit";

const userlistSlice = createSlice({
	name: "userlist",
	initialState: {value: []},
	reducers: {
		newUserList(state, action) {
			state.value = action.payload
		}
	}
});


export const { newUserList } = userlistSlice.actions;
export default userlistSlice.reducer;
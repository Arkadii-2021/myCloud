import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
	name: "list",
	initialState: {value: []},
	reducers: {
		newList(state, action) {
			state.value = action.payload
		}
	}
});


export const { newList } = listSlice.actions;
export default listSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const infoSlice = createSlice({
	name: "list",
	initialState: {allInfoUser: []},
	reducers: {
		newInfo(state, action) {
			state.allInfoUser = action.payload
		}
	}
});


export const { newInfo } = infoSlice.actions;
export default infoSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import listSlice from "./slices/listSlice";
import loginSlice from "./slices/loginSlice";
import infoSlice from "./slices/infoSlice";


const store = configureStore({
	reducer: {
		list: listSlice,
		user: loginSlice,
		userInfo: infoSlice
	}
});

export default store;
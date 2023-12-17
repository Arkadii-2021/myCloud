import { configureStore } from "@reduxjs/toolkit";
import listSlice from "./slices/listSlice";
import userlistSlice from "./slices/userlistSlice";
import loginSlice from "./slices/loginSlice";
import infoSlice from "./slices/infoSlice";


const store = configureStore({
	reducer: {
		list: listSlice,
		userlist: userlistSlice,
		user: loginSlice,
		userInfo: infoSlice
	}
});

export default store;
import { Outlet} from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useEffect } from 'react';


export const PrivateRoute = () => {
		const nav = useNavigate()
		const isUserLogin = useSelector(state => state.userInfo);
		const auth = isUserLogin.allInfoUser.auth;
		const authLocal = JSON.parse(localStorage.getItem("newInfo"));
		const RedirectToLogin = () => {
		useEffect(() => {
			toast.error(`Не авторизированный пользователь`);
			nav("/");
		}, []);
	}
	return (
		auth && authLocal.auth ? <Outlet /> : <RedirectToLogin />
	)
}

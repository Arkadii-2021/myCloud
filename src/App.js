import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Services from "./components/Services";
import RegisterUser from "./components/RegisterNewUser";
import FolderList from "./components/FolderList";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Outlet} from 'react-router-dom';


const PrivateRoute = () => {
	const isUserLogin = useSelector(state => state.userInfo);
	const auth = isUserLogin.allInfoUser.auth;
	const authLocal = JSON.parse(localStorage.getItem("newInfo"));
	return (
		auth && authLocal.auth ? <Outlet /> : <Navigate to="/" />
	)
}

export default function App() {
	const isUserLogin = useSelector(state => state.userInfo);
	
    return (
        <>
		<ToastContainer hideProgressBar={true} newestOnTop={true} />
			<nav className="menu">
				<NavLink to="/" className="menu__link">Вход</NavLink>
				<NavLink to="/register" className="menu__link">Регистрация</NavLink>
				<NavLink to="/dashboard" className="menu__link">Dashboard</NavLink>
				<NavLink to="/list" className="menu__link">Список файлов</NavLink>
				<NavLink to="/exit" className="menu__link">Выйти</NavLink>
			</nav>
			<Routes>
				<Route path="/" element={<Services />}/>		
				<Route path="/register" element={<RegisterUser />}/>	
				<Route path="/exit" element={<Logout />}/>
				<Route element={<PrivateRoute />}>
				    <Route path="/dashboard" element={<Dashboard />}/>	
					<Route path="/list" element={<FolderList />}/>
				</Route>
			</Routes>
	    </>
    );
}

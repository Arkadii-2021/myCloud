import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Services from "./components/Services";
import RegisterUser from "./components/RegisterNewUser";
import FolderList from "./components/FolderList";
import Dashboard from "./components/Dashboard";
import { PrivateRoute } from "./utils/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";


export default function App() {	
    return (
        <>
		<ToastContainer hideProgressBar={true} newestOnTop={true} />
			<nav className="menu">
				<NavLink to="/" className="menu__link">Вход</NavLink>

				<NavLink to="/dashboard" className="menu__link">Dashboard</NavLink>
				<NavLink to="/list" className="menu__link">Список файлов</NavLink>
			</nav>
			<Routes>
				<Route path="/" element={<Services />}/>		
				<Route path="/register" element={<RegisterUser />}/>	
				<Route element={<PrivateRoute />}>
				    <Route path="/dashboard" element={<Dashboard />}/>	
					<Route path="/list" element={<FolderList />}/>
				</Route>
			</Routes>
	    </>
    );
}

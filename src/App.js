import React from 'react';
import { Routes, Route } from "react-router-dom";
import Services from "./components/Services";
import RegisterUser from "./components/RegisterNewUser";
import FolderList from "./components/FolderList";
import { ToastContainer } from "react-toastify";


export default function App() {
    return (
        <>
		<ToastContainer hideProgressBar={true} newestOnTop={true} />
			<Routes>
				<Route path="/" element={<Services />}/>		
				<Route path="/register" element={<RegisterUser />}/>			
				<Route path="/list" element={<FolderList />}/>		
			</Routes>
	    </>
    );
}

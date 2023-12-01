import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { newUser } from "../slices/loginSlice";
import { newInfo } from "../slices/infoSlice";
import { useDispatch } from "react-redux";


export default function Logout() {
	const nav = useNavigate();
	const dispatch = useDispatch();
	
	useEffect(() => {
      dispatch(newUser());
	  dispatch(newInfo());
	  localStorage.clear();
    }, []);
    
	toast.success("Успешный выход");
	nav("/");
	return (
		<div>
			Вы вышли из системы
		</div>
  );	
};
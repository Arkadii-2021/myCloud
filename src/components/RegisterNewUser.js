import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";


export default function RegisterUser() {
	const [checked, setChecked] = useState(false);
	const [newUserData, setNewUserData] = useState({user: "", password: "", email: ""});
	const [error, setError] = useState('');
	const [state, setState] = useState();

    const onChangeUser = ({target}) => {
	    const {name, value} = target;
	    setNewUserData(prevForm => ({...prevForm, [name]: value}));
    };
	  
    const nav = useNavigate();
    
	const onSignupClick = (evt) => {
	    evt.preventDefault();

		const userData = {
			username: newUserData.user,
			password: newUserData.password,
			email: newUserData.email,
			is_superuser: +checked
		};

		axios
		  .post("http://127.0.0.1:8000/api/users/", userData)
			.then(response => {
				setError('');
				setState(response.data.results);
				toast.success("Пользователь добавлен!");
				nav("/");
			})
			.catch(error => {
				setError(error.response.data.message);
				console.log(error);
				toast.error("Ошибка!");
				});
				
	console.log(userData)
    };
		

	return (
    <div> 
		<form onSubmit={ onSignupClick }>
			<div className="form_item">
				<div className="new_date">
					<label className="title_items" htmlFor="username">Логин</label>
					<input type="text" className="field_to_new_item" id='user' name='user' placeholder="username..." onChange={onChangeUser} />
				</div>
				<div className="new_duration">
					<label className="title_items" htmlFor="distance">Пароль</label>
					<input type="password" className="field_to_new_item" id='password' name='password' placeholder="Enter password" onChange={onChangeUser} />
				</div>			
				<div className="new_duration">
					<label className="title_items" htmlFor="email">Электронный адрес</label>
					<input type="text" className="field_to_new_item" id='email' name='email' placeholder="email..." onChange={onChangeUser} />
				</div>
				<div className="new_duration">
				    <label className="title_items" htmlFor="is_superuser">Админ</label>
					<input type="checkbox" className="field_to_new_checkbox" id='is_superuser' name="is_superuser" onChange={() => setChecked(!checked)} />
				</div>
			<button className="btn_ok" type="submit">Добавить</button>
			<ToastContainer />
			</div>
		</form>
		<h4 ><Link to="/" className="title__new_user">На главную</Link></h4>
    </div>
  );
};
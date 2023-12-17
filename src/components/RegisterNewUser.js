import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";


export default function RegisterUser() {
	const [newUserData, setNewUserData] = useState({user: "", password: "", email: "", first_name: "", last_name: ""});
	const [error, setError] = useState('');
	const [state, setState] = useState();

    const onChangeUser = ({target}) => {
	    const {name, value} = target;
	    setNewUserData(prevForm => ({...prevForm, [name]: value}));
    };
	  
    const nav = useNavigate();
    
	const onSignupClick = (evt) => {
	    evt.preventDefault();
		let patternLogin = new RegExp(/^([A-Za-z]{1,})+(\d){1,}([a-zA-Z1-9])*$/g);
		let patternEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
		let patternPassword = new RegExp(/^(?=.*[A-Za-z0-9!@#$%^&*(),.=+-]$)[A-Za-z][A-Za-z\d=.,!@#$%^&*()=+_-]{5,256}$/g);
		
		const userData = {
			username: newUserData.user,
			first_name: newUserData.first_name,
			last_name: newUserData.last_name,
			password: newUserData.password,
			email: newUserData.email
		};
		
		if (patternLogin.test(userData.username) && patternPassword.test(userData.password) && (patternEmail.test(userData.email) || !userData.email)) {
			console.log("Login OK!")
			axios
			  .post(`${process.env.REACT_APP_SERVER_URL}api/users/`, userData)
				.then(response => {
					setError('');
					setState(response.data.results);
					toast.success("Пользователь добавлен!");
					nav("/");
				})
				.catch(error => {
					setError(error.response.data.message);
					toast.error(`Ошибка!. ${JSON.parse(error.request.response).username[0]}`);
					console.log(error);
					});
		} else {
          toast.error(`Неверно придуманы логин/пароль/email`);
        }

	console.log(userData)
    };
		

	return (
    <div> 
		<form onSubmit={ onSignupClick }>
			<div className="form_register_item">
				<div className="new_date">
					<label className="title_items" htmlFor="username">Логин<span style={{color: "red"}}>*</span></label>
					<input type="text" className="field_to_new_item" id='user' name='user' placeholder="username..." onChange={onChangeUser} required minlength="4" maxlength="20"/>
				</div>
				<div className="new_duration">
				    <label className="title_items" htmlFor="first_name">Имя</label>
					<input type="text" className="field_to_new_item" id='first_name' name="first_name" placeholder="Ваше имя..." onChange={onChangeUser} />
				</div>				
				<div className="new_duration">
				    <label className="title_items" htmlFor="last_name">Фамилия</label>
					<input type="text" className="field_to_new_item" id='last_name' name="last_name" placeholder="Ваша фамилия..." onChange={onChangeUser} />
				</div>
				<div className="new_duration">
					<label className="title_items" htmlFor="distance">Пароль<span style={{color: "red"}}>*</span></label>
					<input type="password" className="field_to_new_item" id='password' name='password' placeholder="Enter password" onChange={onChangeUser} required  minlength="6" maxlength="256"/>
				</div>			
				<div className="new_duration">
					<label className="title_items" htmlFor="email">Электронный адрес</label>
					<input type="text" className="field_to_new_item" id='email' name='email' placeholder="email..." onChange={onChangeUser} />
				</div>
			<button className="btn-register" type="submit">Добавить</button>
			<ToastContainer />
			</div>
		</form>
		<div className="important-border">
		<ul style={{paddingLeft: "12px"}}>
				<li><b>&#129191; Логин</b> должен содержать только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов</li>
				<li><b>&#129191; Email</b> должен соответствовать формату адресов электронной почты</li>
				<li><b>&#129191; Пароль</b> — не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ</li>
				<li><b>&#129191; </b><span style={{color: "red"}}>*</span> — поля, обязательные к заполнению</li>
		</ul></div>
		<h4 ><Link to="/" className="title__new_user">На главную</Link></h4>
    </div>
  );
};
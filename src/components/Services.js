import React from 'react';
import { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { newUser } from "../slices/loginSlice";
import { newInfo } from "../slices/infoSlice";


export default function Services() {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const dispatch = useDispatch();
	const [userData, setUserData] = useState({user: "", password: ""});
    const [error, setError] = useState('');
	const csrftoken = Cookies.get('csrftoken');
	const [state, setState] = useState();
	const [isLoading, setIsLoading] = useState(false)
	const isUserLogin = useSelector(state => state.userInfo);

    const onChangeUser = ({target}) => {
	    const {name, value} = target;
	    setUserData(prevForm => ({...prevForm, [name]: value}));
		console.log(name, value)
		//let patternLogin = new RegExp(/^([A-Za-z]{1,})+(\d){1,}([a-zA-Z1-9_])*/g);
		//let patternEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
		
		let patternPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/g);
		if (name === "password" && patternPassword.test(value)) {
			console.log("OK")
		}
    };
  
    const nav = useNavigate();
	const loginData = (evt) => {
	  evt.preventDefault();
	  setIsLoading(true);
	  axios.get(`http://127.0.0.1:8000/login/`, 
		{
		  auth: {
			username: userData.user,
			password: userData.password,
		},
		  headers: { "Content-Type": "application/json" }
		})
		  .then(response => {
			setError('');
			setState(response.data.results);
			dispatch(newUser(userData));			
			dispatch(newInfo(response.data));	
			localStorage.setItem('newUser', JSON.stringify(userData));
			localStorage.setItem('newInfo', JSON.stringify(response.data));
			setIsLoading(false);
			toast.success("Успешный вход");
			nav("/dashboard");
		})
		  .catch(error => {
			setError(error.response.data.message);
			toast.error("Ошибка входа! " + error.response.data.detail);
			console.log(error) });
		};
		
	return (
		<div> 
			{!isUserLogin.allInfoUser.auth ? <FormLogin loginData={loginData} onChangeUser={onChangeUser} />: <LogoutClick />}
		</div>
  );
};


function LogoutClick() {
	const dispatch = useDispatch();
	const clearDataLogin = () => {
		dispatch(newUser(''));
		dispatch(newInfo(''));
		localStorage.clear();
	}
	return (
		<>
			<h4>Вы уже зашли в систему</h4>
			<button className="btn-new" onClick={clearDataLogin}>Выйти</button>
		</>
	)
};

function FormLogin({loginData, onChangeUser}) {
	return (
		<>
			<form onSubmit={ loginData }>
				<div className="form_item">
					<div className="new_date">
						<label className="title_items" htmlFor="date">Логин</label>
						<input className="field_to_new_item" id='user' name='user' placeholder="Enter username" onChange={onChangeUser} />
					</div>
					<div className="new_duration">
						<label className="title_items" htmlFor="distance">Пароль</label>
						<input type="password" className="field_to_new_item" id='password' name='password' placeholder="Enter password" onChange={onChangeUser} />
					</div>
				<button className="btn-login" type="submit">Login</button>
				</div>
			</form> 
			<h4 ><Link to="/register" className="title__new_user">Регистрация нового пользователя</Link></h4>
		</>
	)
}

//{!isLoading && state && <FolderList isLoading={isLoading} state={state} />}
//{headers: {'X-CSRFToken': csrftoken}}
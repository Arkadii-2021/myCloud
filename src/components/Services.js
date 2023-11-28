import React from 'react';
import { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom"


export default function Services() {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const [userData, setUserData] = useState({user: "", password: ""});
    const [error, setError] = useState('');
	const csrftoken = Cookies.get('csrftoken');
	const [state, setState] = useState();
	const [isLoading, setIsLoading] = useState(false)
	
    const onChangeUser = ({target}) => {
	    const {name, value} = target;
	    setUserData(prevForm => ({...prevForm, [name]: value}));
    };
  
    const nav = useNavigate();
	const loginData = (evt) => {
	  evt.preventDefault();
	  setIsLoading(true);
	  axios.get(`http://127.0.0.1:8000/folder/list/`, 
		{
		  auth: {
			username: userData.user,
			password: userData.password,
		}})
		  .then(response => {
			setError('');
			setState(response.data.results);
			window.localStorage.setItem('responseDataResults', JSON.stringify(response.data.results));
			setIsLoading(false);
			nav("/list");
		})
		  .catch(error => {
			setError(error.response.data.message);
			console.log(error) });
		};

	return (
    <div> 
		<h1>MyCloud</h1>
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
			<button className="btn_ok" type="submit">Login</button>
			</div>
		</form>
		<h4 ><Link to="/register" className="title__new_user">Регистрация нового пользователя</Link></h4>
    </div>
  );
	
};

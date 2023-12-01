import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";


export default function Dashboard() {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const authUserInfo = useSelector(state => state.userInfo);
	const [userData, setUserData] = useState({user: "", password: ""});
    const [error, setError] = useState('');
	const csrftoken = Cookies.get('csrftoken');
	const [state, setState] = useState();
	const [isLoading, setIsLoading] = useState(false)
	
    const onChangeUser = ({target}) => {
	    const {name, value} = target;
	    setUserData(prevForm => ({...prevForm, [name]: value}));
    };
  
    //const nav = useNavigate();
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
			setIsLoading(false);
		})
		  .catch(error => {
			setError(error.response.data.message);
			console.log(error) });
		};
		
		const { userInfo: {admin, name, email, lastLogin} } = authUserInfo['allInfoUser'];
		const date = new Date(lastLogin);
	
		
	return (
		<div>
			<div>{!isLoading && authUserInfo['allInfoUser']['auth'] && <h3 className="">Здравствуйте, {name}</h3>}</div>
			<ul>
				<li><b>Имя:</b> {name}</li>
				<li><b>Статус:</b> {admin ? "Администратор" : "Пользователь"}</li>
				<li><b>e-mail:</b> {email}</li>
				<li><b>Дата последнего посещения:</b> {date.toLocaleString()}</li>
			</ul>
		</div>
  );	
};
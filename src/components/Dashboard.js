import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import AllUsersInfo from "./dashboardInfo/AllUsersInfo";


export default function Dashboard() {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const authUserInfo = useSelector(state => state.userInfo);
    const [error, setError] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const newLoginUser = useSelector(state => state.user);
	const [countFileUser, setCountFilesUser] = useState();

	const { userInfo: {admin, name, email, lastLogin} } = authUserInfo['allInfoUser'];
	const date = new Date(lastLogin);
	
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_SERVER_URL}folder/list/count/`, 
		  {auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		  headers: { "Content-Type": "application/json" }
	    })
		  .then(response => {
			setCountFilesUser(response.data.count_files);
		})
		  .catch(error => {
			console.log(error) });
    }, []);
	
	return (
		<div>
			<div>{!isLoading && authUserInfo['allInfoUser']['auth'] && <h3 className="">Здравствуйте, {name}</h3>}</div>
			<ul>
				<li><b style={{color: "#4ab4ff"}}>&#11201; Имя: </b>{name}</li>
				<li><b style={{color: "#4ab4ff"}}>&#11201; Статус: </b>{admin ? "Администратор" : "Пользователь"}</li>
				<li><b style={{color: "#4ab4ff"}}>&#11201; Email: </b>{email}</li>
				<li><b style={{color: "#4ab4ff"}}>&#11201; Количество файлов: </b>{countFileUser}</li>
				<li><b style={{color: "#4ab4ff"}}>&#11201; Дата последнего посещения: </b>{date.toLocaleString()}</li>
			</ul>
			<div>{!isLoading && admin ? <AllUsersInfo /> : null }</div>
		</div>
    );	
};

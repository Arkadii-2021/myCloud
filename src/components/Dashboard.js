import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import { newInfo } from "../slices/infoSlice";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';


export default function Dashboard() {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const authUserInfo = useSelector(state => state.userInfo);
	const [userData, setUserData] = useState({user: "", password: ""});
    const [error, setError] = useState('');
	const csrftoken = Cookies.get('csrftoken');
	const [isLoading, setIsLoading] = useState(false);
	const newLoginUser = useSelector(state => state.user);
	
    useEffect(() => {
		setIsLoading(true);
	    axios.get(`http://127.0.0.1:8000/usersinfo/`, 
		{
		  auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		  headers: { "Content-Type": "application/json" }
		})
		  .then(response => {
			setError('');
			localStorage.setItem('allInfoUser', JSON.stringify(response.data));
			setIsLoading(false);
		})
		  .catch(error => {
			setError(error.response.data.message);
			console.log(error) });
	}, [])    
  	
	const { userInfo: {admin, name, email, lastLogin, userId} } = authUserInfo['allInfoUser'];
	const date = new Date(lastLogin);
	const usersList = authUserInfo.allInfoUser.allUsers.filter(function (el) {return el.id !== userId});
	console.log(usersList);
	console.log(JSON.parse(localStorage.getItem('allInfoUser')));

	return (
		<div>
			<div>{!isLoading && authUserInfo['allInfoUser']['auth'] && <h3 className="">Здравствуйте, {name}</h3>}</div>
			<ul>
				<li><b>Имя:</b> {name}</li>
				<li><b>Статус:</b> {admin ? "Администратор" : "Пользователь"}</li>
				<li><b>e-mail:</b> {email}</li>
				<li><b>Дата последнего посещения:</b> {date.toLocaleString()}</li>
			</ul>
			<div>{!isLoading && admin ? <AllUsersInfo usersList={usersList} userData={userData} /> : null }</div>
		</div>
  );	
};

function AllUsersInfo({ usersList, userData }) {
	const [userListData, setUserListData] = useState(usersList);
	const newLoginUser = useSelector(state => state.user);
	const [error, setError] = useState('');
	
	const dateLastLogin = (lastLoginUser) => {
	    const dateLogin = new Date(lastLoginUser);
		return dateLogin.toLocaleString();
	}
	
	const deleteUser = (ids) => {
		axios.delete(`http://127.0.0.1:8000/user/${ids}/`,
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  toast.success("Пользователь удалён");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Не удалось удалить пользователя");
			  });
    }	

	
	return (
	<>
		<div className="tbl-header">
				<table cellPadding="0" cellSpacing="0" border="0">
				  <thead>
					<tr>
					  <th>Логин</th>
					  <th>First-name</th>
					  <th>Last-name</th>
					  <th>E-mail</th>
					  <th>Дата последнего входа</th>
					  <th>Роль администратора</th>
					  <th>Список файлов</th>
					</tr>
				  </thead>
				</table>
			  </div>
		<div className="tbl-content">
			<table cellPadding="0" cellSpacing="0" border="0">
				<tbody>
				  {userListData.map((user, userIndex) => 
					<tr key={user.id}>
						<td><div className="file-info"><button style={{cursor: "pointer"}} onClick={() => { deleteUser(user.id) }} className="btn-new" >X</button>{user.username}</div></td>
						<td><span className="list-group-item" >{user.first_name}</span></td>
						<td><span className="list-group-item" >{user.last_name}</span></td>
						<td><span className="list-group-item" >{user.email}</span></td>
						<td><span className="list-group-item" >{dateLastLogin(user.last_login) !== "01.01.1970, 07:00:00" ? dateLastLogin(user.last_login) : "Нет"}</span></td>
						<td><span className="list-group-item" ></span><ChangeAdmin isSuperUser={user.is_superuser} ids={user.id} /></td>
						<td><span className="list-group-item" ></span>Перейти</td>
					</tr>)}
				</tbody>
			</table>
		</div>
	</>
	)
}


function ChangeAdmin({ isSuperUser, ids }) {
	const newLoginUser = useSelector(state => state.user);
	const [error, setError] = useState('');
    const [userChange, setChange] = useState(isSuperUser);
	
	const changeUserRole = () => {
		axios.put(`http://127.0.0.1:8000/user/${ids}/`, {"is_superuser": !userChange},
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  setChange(!userChange);

			  toast.success("Статус пользователя изменён");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Не удалось изменить статус пользователя");
			  });
    }
    
	return (
		<>
			<button style={{cursor: "pointer"}} onClick={() => { changeUserRole() }} className="btn-new" >{userChange ? "Да" : "Нет"}</button>
		</>
	)
}
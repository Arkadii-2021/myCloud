import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import ChangeAdmin from "./ChangeAdmin";
import StorageListUser from "./StorageListUser";


export default function AllUsersInfo() {
	const authUserInfo = useSelector(state => state.userInfo);
	const [usersListData, setUsersList] = useState(authUserInfo.allInfoUser.allUsers.filter(function (el) {
		return el.id !== authUserInfo.allInfoUser.userInfo.userId
	}));
	const newLoginUser = useSelector(state => state.user);
	const [error, setError] = useState('');
	
	const dateLastLogin = (lastLoginUser) => {
	    const dateLogin = new Date(lastLoginUser);
		return dateLogin.toLocaleString();
	}
		
	const deleteUser = (ids) => {
		axios.delete(`${process.env.REACT_APP_SERVER_URL}user/${ids}/`,
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  setUsersList(usersListData.filter(function (el) {return el.id !== ids}));
			  toast.success("Пользователь удалён");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Не удалось удалить пользователя");
			  });
    }	

	
	return (
	<>  <article style={{fontSize: 16, textTransform: "uppercase", marginBottom: "-18px"}}><b>👨👦 Управление пользователями</b></article>
		<div className="tbl-header">
				<table cellPadding="0" cellSpacing="0" border="0">
				  <thead>
					<tr>
					  <th>Логин</th>
					  <th>Имя</th>
					  <th>Фамилия</th>
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
				  {usersListData.map((user, userIndex) => 
					<tr key={user.id}>
						<td><div className="file-info"><button style={{cursor: "pointer", marginTop: "0"}} onClick={() => { deleteUser(user.id) }} className="btn-new" >X</button>{user.username}</div></td>
						<td><span className="list-group-item" >{user.first_name}</span></td>
						<td><span className="list-group-item" >{user.last_name}</span></td>
						<td><span className="list-group-item" >{user.email}</span></td>
						<td><span className="list-group-item" >{dateLastLogin(user.last_login) !== "01.01.1970, 07:00:00" ? dateLastLogin(user.last_login) : "Нет"}</span></td>
						<td><span className="list-group-item" ></span><ChangeAdmin isSuperUser={user.is_superuser} ids={user.id} usersListData={usersListData} setUsersList={setUsersList} /></td>
						<td><span className="list-group-item" ></span><StorageListUser userNameList={user.username} /></td>
					</tr>)}
				</tbody>
			</table>
		</div>
	</>
	)
}
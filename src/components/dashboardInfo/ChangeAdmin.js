import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";


export default function ChangeAdmin({ isSuperUser, ids, usersListData, setUsersList }) {
	const newLoginUser = useSelector(state => state.user);
	const [error, setError] = useState('');
    const [userChange, setChange] = useState(isSuperUser);
	
	const changeUserRole = () => {
		axios.put(`${process.env.REACT_APP_SERVER_URL}user/${ids}/`, {"is_superuser": !userChange},
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  setChange(!userChange);
			  //setUsersList(usersListData);
 			  //let copyUsersListData = { ...usersListData };
			  //let index = usersListData.findIndex((o) => o.id === ids);
			  //setUsersList([...usersListData, usersListData[index].is_superuser=true]);
			  //copyUsersListData[index].is_superuser = true;
			  toast.success("Статус пользователя изменён");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  console.log(error.response.data.message)
			  toast.error("Не удалось изменить статус пользователя");
			  });
    }
	
	return (
		<>
			<button style={{cursor: "pointer"}} onClick={() => { changeUserRole() }} className="btn-new" >{userChange ? "Да" : "Нет"}</button>
		</>
	)
}
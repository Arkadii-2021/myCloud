import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { newUserList } from "../slices/userlistSlice";


export default function RemoveFile({newLoginUser, ids, userNameList}) {
	const dispatch = useDispatch();
	const fileList = useSelector(state => state.userlist);
	const [error, setError] = useState('');
	
	const handleDeleteClick = (e) => {
		axios.delete(`${process.env.REACT_APP_SERVER_URL}file/user/${ids}/?user_list=${userNameList}`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  const { value } = fileList;
			  const filteredNumbers = value.filter((number) => number.id !== ids);
			  dispatch(newUserList(filteredNumbers));
			  toast.success("Файл удалён");
			  });
        }	

	return (
		<>
			<button onClick={(e) => { handleDeleteClick(e) }} className="btn-new" >&#10008;</button>
		</>
	)
}
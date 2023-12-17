import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { newUserList } from "../slices/userlistSlice";

export default function RemoveShareUserURLFile({ url, ids, loc }) {
	const dispatch = useDispatch();
	const newLoginUser = useSelector(state => state.user);
	const [error, setError] = useState('');

	
	const handleDeleteClick = (e) => {
		axios.put(`${process.env.REACT_APP_SERVER_URL}file/${ids}/remove_share/`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  updatePageListFiles();
			  toast.success("Общая ссылка на файл удалена");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Не удалось удалить общую ссылку на файл");
			  });
    }
	
	let pageNumber = localStorage.getItem('pageNum');
	
	const updatePageListFiles = () => {
			axios.get(`${process.env.REACT_APP_SERVER_URL}folder/user/list/${pageNumber}&username=${loc}`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');

			  dispatch(newUserList(response.data.results));

		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Ошибка получения списка! " + error.response.data.detail);
			  console.log(error) });
	}
	
	return (
		<>
			<button onClick={(e) => { handleDeleteClick(e) }} className="btn-new" >&#10008;</button>
		</>
	)
}
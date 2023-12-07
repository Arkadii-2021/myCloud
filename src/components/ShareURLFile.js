import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { newList } from "../slices/listSlice";


export default function ShareURLFile({newLoginUser, ids}) {
	const dispatch = useDispatch();
	const [error, setError] = useState('');
	
	const handleDeleteClick = (e) => {
		axios.put(`http://127.0.0.1:8000/file/${ids}/share/`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  updatePageListFiles();
			  toast.success("Общая ссылка на файл создана");
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Не удалось сгенерировать ссылку");
			  });
        }	
    
	let pageNumber = localStorage.getItem('pageNum');
		
    const updatePageListFiles = () => {
			axios.get(`http://127.0.0.1:8000/folder/list/${pageNumber}`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  dispatch(newList(response.data.results));
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Ошибка получения списка! " + error.response.data.detail);
			  console.log(error) });
	}
	return (
		<>
			<button onClick={(e) => { handleDeleteClick(e) }} className="btn-new" >&#8734; поделиться</button>
		</>
	)
}
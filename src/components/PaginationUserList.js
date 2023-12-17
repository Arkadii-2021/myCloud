import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { newUserList } from "../slices/userlistSlice";


export default function PaginationList({newLoginUser, newFileListP}) {
	const dispatch = useDispatch();
	const [error, setError] = useState('');
	const [newFileList, setNewFileList] = useState(newFileListP);
	const handlePageClick = (handlePage) => {
		axios.get(handlePage, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  setNewFileList(response.data);
			  dispatch(newUserList(response.data.results));
			  const url = new URL(handlePage);
			  localStorage.setItem('pageNum', url.search || '?page=1');
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Ошибка получения списка! " + error.response.data.detail);
			  console.log(error) });
    }	

	return (
		<>
			{newFileList.hasOwnProperty("previous") && newFileList.previous != null ? <button onClick={() => { handlePageClick(newFileList.previous) }} className="btn-new" >&#9668; Назад</button> : null}
			{newFileList.hasOwnProperty("next") && newFileList.next != null ? <button onClick={() => { handlePageClick(newFileList.next) }} className="btn-new" id="nextButton">Вперёд 	&#9658;</button> : null}
		</>
	)
}

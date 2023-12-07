import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { newList } from "../slices/listSlice";


export default function RemoveFile({newLoginUser, ids}) {
	const dispatch = useDispatch();
	const fileList = useSelector(state => state.list);
	const [error, setError] = useState('');
	
	const handleDeleteClick = (e) => {
		axios.delete(`http://127.0.0.1:8000/file/${ids}/`, 
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
			  dispatch(newList(filteredNumbers));
			  toast.success("Файл удалён");
			  });
        }	

	return (
		<>
			<button onClick={(e) => { handleDeleteClick(e) }} className="btn-new" >&#10008;</button>
		</>
	)
}
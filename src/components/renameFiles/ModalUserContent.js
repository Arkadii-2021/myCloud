import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import axios from 'axios';
import { newUserList } from "../../slices/userlistSlice";


export default function ModalUserContent({ isfileName, isfileComment, ids, folderId, newLoginUser, setModal, userNameList }) {
	const dispatch = useDispatch();
	const [error, setError] = useState('');
	const [userData, setUserData] = useState({filename: "", comment: ""});
	
	const onChangeFile = ({target}) => {
	    const {name, value} = target;
	    setUserData(prevForm => ({...prevForm, [name]: value}));
    };
	
	const onSignupRenameFileClick = (evt) => {
		evt.preventDefault();
		
		axios.put(`${process.env.REACT_APP_SERVER_URL}file/user/${ids}/?user_list=${userNameList}`, {
			"label": userData.filename || isfileName,
			"comment": userData.comment || isfileComment,
			"folder": folderId
		  },
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  updatePageListFiles();
			  setModal(false);
			  if (userData.filename) {
				 toast.success("Файл переименован"); 
			  } 
			  if (userData.comment) {
				  toast.success("Комментарий к файлу создан/изменён");
			  }
		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Ошибка переименования файла");
			  console.log(error);
			  });
    }
	
    let pageNumber = localStorage.getItem('pageNum');
		
    const updatePageListFiles = () => {
			axios.get(`http://127.0.0.1:8000/folder/user/list/${pageNumber}&username=${userNameList}`, 
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
		<form onSubmit={ onSignupRenameFileClick }>
			<div className="form_file__item">
					<label className="title_items" htmlFor="filename">Новое имя файла</label>
					<input className="field_to_form_file" id='filename' name='filename' defaultValue={isfileName} onChange={onChangeFile} />
				<div className="new_duration">
					<label className="title_items" htmlFor="comment">Комментарий</label>
					<input type="text" className="field_to_form_file" id='comment' name='comment' defaultValue={isfileComment} onChange={onChangeFile} />
				</div>
			<button className="btn-login" type="submit">OK</button>
			</div>
		</form>
	)
}
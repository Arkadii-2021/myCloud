import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";

	
export default function FolderList() {
  const fileList = useSelector(state => state.list);
  const newLoginUser = useSelector(state => state.user);
  
  const [file, setFile] = useState('');
  const [data, getFile] = useState({ name: "", path: "" });

  const [progress, setProgess] = useState(0);
  const el = useRef();
  const csrftoken = Cookies.get('csrftoken');
  const sessionID = Cookies.get('sessionid');

  const handleChange = (e) => {
    setProgess(0)
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadFile = () => {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';

	const headers = {
	  'Content-Type': 'multipart/form-data'
	};
	
    const formData = new FormData();
    formData.append('file', file);
	formData.append('user', 1);
	formData.append('folder', 1);
    axios.post("http://127.0.0.1:8000/folder/list/", formData, {
		  auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		  headers: headers,
		  credentials: 'include', 
		  onUploadProgress: (ProgressEvent) => {
			let progress = Math.round(
			  ProgressEvent.loaded / ProgressEvent.total * 100
			) + '%';
			setProgess(progress);
		  }
		  }).then(res => {
		  console.log(res);
		  getFile({
			name: res.data.name,
			path: 'http://127.0.0.1:8000/' + res.data.path
		  })
		  }).catch(err => console.log(err))
		  console.log(file);
	  }
  
	const state = fileList.value;

	return (
		<>
			<div className="tbl-header">
				<table cellPadding="0" cellSpacing="0" border="0">
				  <thead>
					<tr>
					  <th>Имя файла</th>
					  <th>Размер</th>
					  <th>Общая ссылка</th>
					  <th>Комментарий</th>
					  <th>Переименовать</th>
					  <th>Удалить</th>
					</tr>
				  </thead>
				</table>
			  </div>
			  <div className="tbl-content">
				<table cellPadding="0" cellSpacing="0" border="0">
				  <tbody>
				  {state.map(filename => 
					  <tr key={filename.id}>
						  <td><a href={filename.file} className="list-group-item" >{filename.label}</a></td>
						  <td><span className="list-group-item" >{filename.filesize}</span></td>
						  <td><span className="list-group-item" >{filename.url}</span></td>
						  <td><span className="list-group-item" >{filename.comment}</span></td>
						  <td><span className="list-group-item" >X</span></td>
						  <td><span className="list-group-item" >X</span></td>
					  </tr>)}
				  </tbody>
				</table>
			  </div>

			<h4 className="title__new_user">Загрузить новый файл</h4>
			<div className="file-upload">
			<input type="file" ref={el} onChange={handleChange} />
			<div className="progessBar" style={{ width: progress }}>
			  {progress}
			</div>
			<button onClick={uploadFile} className="upbutton">
			  Upload
			</button>
			<hr />
			{data.path && <img src={data.path} alt={data.name} />}
		  </div>
		</>
	)
}

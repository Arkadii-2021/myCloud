import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import { newList } from "../slices/listSlice";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';

	
export default function FolderList() {
  const fileList = useSelector(state => state.list);
  const newLoginUser = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [state, setState] = useState();
  const dispatch = useDispatch();
  
  // для хранения загруженного файла
  const [file, setFile] = useState('');
  
  // для хранения ответа от бекенда
  const [data, getFile] = useState({ name: "", path: "" });

  const [progress, setProgess] = useState(0); // progessbar
  const el = useRef(); // для доступа к инпуту
  
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  const csrftoken = Cookies.get('csrftoken');

  setIsLoading(true);
	
  useEffect(() => {
	axios.get(`http://127.0.0.1:8000/folder/list/`, 
	  {
		auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		headers: { "Content-Type": "application/json" }
	  })
		.then(response => {
	      setError('');
		  setState(response.data.results);
	      dispatch(newList(response.data.results));			
		  setIsLoading(false);
		})
		  .catch(error => {
			setError(error.response.data.message);
			toast.error("Ошибка входа! " + error.response.data.detail);
			console.log(error) });
  }, []);

  const handleChange = (e) => {
    setProgess(0)
    const file = e.target.files[0]; // доступ к файлу
    setFile(file); // сохранение файла
  };

  const uploadFile = () => {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	
    const formData = new FormData();
    formData.append('file', file); // добавление файла
	formData.append('user', 1);
	formData.append('folder', 1);
    axios.post("http://127.0.0.1:8000/folder/list/", formData, {
		  auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		  headers: {'Content-Type': 'multipart/form-data'},
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
  
	const fileListResult = fileList.value;

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
				  {fileListResult.map(filename => 
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



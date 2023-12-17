import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from "react-redux";
import { newList } from "../slices/listSlice";
import { newUserList } from "../slices/userlistSlice";
import PaginationUserList from "./PaginationUserList";
import RemoveUserFile from "./RemoveUserFile";
import ShareUserURLFile from "./ShareUserURLFile";
import CopyShareUserURLFile from "./CopyShareUserURLFile";
import RenameUserFile from "./renameFiles/RenameUserFile";
import fileSizeFormat from "../utils/fileSizeFormat";
import { useLocation } from "react-router-dom";
import FileInfoDetail from "./fileUserInfo/FileInfoDetail";


export default function FolderUserListData() {
  const fileList = useSelector(state => state.userlist);
  const newLoginUser = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newFileList, setNewFileList] = useState();
  const dispatch = useDispatch();
  const loc = useLocation();
  const [file, setFile] = useState('');
  const [data, getFile] = useState({ name: "", path: "" });
  const [progress, setProgess] = useState(0);
  const el = useRef();
  const imageFileType = ['jpg', 'jpeg', 'png'];
  
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  const csrftoken = Cookies.get('csrftoken');

  useEffect(() => {
	setIsLoading(true);
	axios.get(`${process.env.REACT_APP_SERVER_URL}folder/user/list/?username=${loc.state.usrNamelist}`, 
	  {
		auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		headers: { "Content-Type": "application/json" }
	  })
		.then(response => {
	      setError('');
		  setNewFileList(response.data);
	      dispatch(newUserList(response.data.results));	
		  localStorage.setItem('pageNum', '?page=1');
		  setIsLoading(false);
		})
		  .catch(error => {
			setError(error.response.data.message);
			toast.error("Ошибка входа! " + error.response.data.detail);
			console.log(error) });
  }, []);
  
  const handleChange = (e) => {
    setProgess(0)
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadFile = () => {
	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const formData = new FormData();
    formData.append('file', file);
	formData.append('user', 1);
	formData.append('folder', 1);
    axios.post(`${process.env.REACT_APP_SERVER_URL}folder/user/list/?username=${loc.state.usrNamelist}`, formData, {
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
		  updatePageListFiles();
		  getFile({
			name: res.data.label,
			path: res.data.file
		  })
		  toast.success(`Файл загружен`);
		  }).catch(err => {
			  console.log(err);
			  toast.error(`Ошибка загрузки файла!`);
		  })
	}
  
    let pageNumber = localStorage.getItem('pageNum');
	
	const updatePageListFiles = () => {
			axios.get(`${process.env.REACT_APP_SERVER_URL}folder/user/list/${pageNumber}&username=${loc.state.usrNamelist}`, 
		  {
			auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
			headers: { "Content-Type": "application/json" }
		  })
			.then(response => {
			  setError('');
			  setNewFileList(response.data);
			  dispatch(newUserList(response.data.results));	

		  })
			.catch(error => {
			  setError(error.response.data.message);
			  toast.error("Ошибка получения списка! " + error.response.data.detail);
			  console.log(error) });
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
				  {fileListResult.map((filename, idx) => 
					  <tr key={filename.id}>
						  <td><div className="file-info"><FileInfoDetail idx={idx} /><a href={filename.file} className="list-group-item" >{filename.label}</a></div></td>
						  <td><span className="list-group-item" >{fileSizeFormat(filename.filesize)}</span></td>
						  <td><span className="list-group-item" >{filename.url ? <CopyShareUserURLFile url={filename.url} ids={filename.id} newFileListP={newFileList} loc={loc.state.usrNamelist} /> : <ShareUserURLFile ids={filename.id} newLoginUser={newLoginUser} newFileListP={newFileList} loc={loc.state.usrNamelist} />}</span></td>
						  <td><span className="list-group-item" >{filename.comment}</span></td>
						  <td><span className="list-group-item" >{newFileList ? <RenameUserFile newLoginUser={newLoginUser} newFileListP={newFileList} ids={filename.id} folderId={filename.folder} isfileName={filename.label} isfileComment={filename.comment} userNameList={loc.state.usrNamelist} /> : null}</span></td>
						  <td><span className="list-group-item" >{newFileList ? <RemoveUserFile newLoginUser={newLoginUser} newFileListP={newFileList} ids={filename.id} userNameList={loc.state.usrNamelist} /> : null}</span></td>
					  </tr>)}
				  </tbody>
				</table>
			  </div>
			  {newFileList ? <PaginationUserList newLoginUser={newLoginUser} newFileListP={newFileList} /> : null}

			<h4 className="title__new_user">Загрузить новый файл</h4>
			<div className="file-upload">

            <div className="file-uploads" style={{marginBottom: "20px"}}>
               <span>&#11179; Загрузить файл</span>
              <input type="file" ref={el} onChange={handleChange}/>
            </div>
			<div className="progessBar" style={{ width: progress }}>
			  {progress}
			</div>
			<button onClick={uploadFile} className="btn-new">
			  &#128427; Загрузить
			</button>
			<hr />
			{data.path && imageFileType.includes(/[^.]+$/.exec(data.name)[0]) && <img src={data.path} alt={data.name} />}
				{data.path && imageFileType.includes(/[^.]+$/.exec(data.name)[0]) && <span style={{marginTop: '12px'}}>{data.name}</span>}
		  </div>
		</>
	)
}







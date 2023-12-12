import { ToastContainer, toast } from 'react-toastify';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from "react-redux";
import { newList } from "../slices/listSlice";
import PaginationList from "./PaginationList";
import RemoveFile from "./RemoveFile";
import ShareURLFile from "./ShareURLFile";
import CopyShareURLFile from "./CopyShareURLFile";
import RenameFile from "./renameFiles/RenameFile";
import fileSizeFormat from "../utils/fileSizeFormat";


export default function FolderList() {
  const fileList = useSelector(state => state.list);
  const newLoginUser = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [newFileList, setNewFileList] = useState();
  const dispatch = useDispatch();

  const [file, setFile] = useState('');
  

  const [data, getFile] = useState({ name: "", path: "" });

  const [progress, setProgess] = useState(0);
  const el = useRef();
  
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  const csrftoken = Cookies.get('csrftoken');
	
  useEffect(() => {
	setIsLoading(true);
	axios.get(`http://127.0.0.1:8000/folder/list/`, 
	  {
		auth: {username: newLoginUser['value'].user, password: newLoginUser['value'].password},
		headers: { "Content-Type": "application/json" }
	  })
		.then(response => {
	      setError('');
		  setNewFileList(response.data);
	      dispatch(newList(response.data.results));	
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
		  updatePageListFiles();
		  getFile({
			name: res.data.name,
			path: 'http://127.0.0.1:8000/' + res.data.path
		  })
		  }).catch(err => console.log(err))
		  console.log(file);
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
			  setNewFileList(response.data);
			  dispatch(newList(response.data.results));

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
						  <td><div className="file-info"><FileInfoDetail idx={idx}/><a href={filename.file} className="list-group-item" >{filename.label}</a></div></td>
						  <td><span className="list-group-item" >{fileSizeFormat(filename.filesize)}</span></td>
						  <td><span className="list-group-item" >{filename.url ? <CopyShareURLFile url={filename.url} ids={filename.id} newFileListP={newFileList}/> : <ShareURLFile ids={filename.id} newLoginUser={newLoginUser} newFileListP={newFileList} />}</span></td>
						  <td><span className="list-group-item" >{filename.comment}</span></td>
						  <td><span className="list-group-item" >{newFileList ? <RenameFile newLoginUser={newLoginUser} newFileListP={newFileList} ids={filename.id} folderId={filename.folder} isfileName={filename.label} isfileComment={filename.comment} /> : null}</span></td>
						  <td><span className="list-group-item" >{newFileList ? <RemoveFile newLoginUser={newLoginUser} newFileListP={newFileList} ids={filename.id}/> : null}</span></td>
					  </tr>)}
				  </tbody>
				</table>
			  </div>
			  {newFileList ? <PaginationList newLoginUser={newLoginUser} newFileListP={newFileList} /> : null}

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
			{data.path && <img src={data.path} alt={data.name} />}
		  </div>
		</>
	)
}

function FileInfoDetail({ idx }) {
	const [isModal, setModal] = useState(false)
    const onClose = () => setModal(false)
	
	return (
		<>
			<button onClick={() => setModal(true)} className="btn-new" >&#128459;</button>
			<ModalFileInfo
                visible={isModal}
                title="Информация о файле"
                content={ <ModalContentInfoFile setModal={setModal} idx={idx}/> }
                footer={<button className="btn-new" onClick={onClose}>Закрыть</button>}
                onClose={onClose}
            />
		</>
	)
}


const ModalFileInfo = ({
                   visible = false,
                   title = '',
                   content = '',
                   footer = '',
                   onClose,
               }: ModalProps) => {

    const onKeydown = ({key}: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose()
                break
			default: 
                break
        }
    }

    React.useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })

    if (!visible) return null;

    return <div className="modal" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <span className="modal-close" onClick={onClose}>
            &times;
          </span>
            </div>
            <div className="modal-body">
                <div className="modal-content">{content}</div>
            </div>
            {footer && <div className="modal-footer">{footer}</div>}
        </div>
    </div>
};


interface ModalProps {
    visible: boolean,
    title: string,
    content: ReactElement | string,
    footer: ReactElement | string,
    onClose: () => void
}

function ModalContentInfoFile({ idx }) {
	const dispatch = useDispatch();
    const fileList = useSelector(state => state.list);
	const {value} = fileList;

	return (
			<div className="form_file__item">
				<span><b>Файл: </b>{value[idx].label}</span>
				<span><b>Дата и время загрузки: </b>{value[idx].date}</span>
				<span><b>Размер: </b>{fileSizeFormat(value[idx].filesize)}</span>
				<span><b>Комментарий: </b>{value[idx].comment || <span>отсутствует</span>}</span>
				<span><b>Общая ссылка: </b>{value[idx].url || <span>отсутствует</span>}</span>
			</div>

	)
}
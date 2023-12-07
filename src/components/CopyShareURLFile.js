import { ToastContainer, toast } from 'react-toastify';
import RemoveShareURLFile from "./RemoveShareURLFile";


export default function CopyShareURLFile({ url, ids, newFileListP }) {
	
	const handleDeleteClick = (e) => {
		navigator.clipboard.writeText(url)
		  .then(() => {
            toast.success("Общая ссылка скопирована");
          })
          .catch(err => {
             console.log('Something went wrong', err);
			 toast.success("Ошибка при копировании ссылки." + err);
       });
    }	

	return (
		<>
			<button onClick={(e) => { handleDeleteClick(e) }} className="btn-new" >&#128461; скопировать</button><RemoveShareURLFile ids={ids} newFileListP={newFileListP} />
		</>
	)
}
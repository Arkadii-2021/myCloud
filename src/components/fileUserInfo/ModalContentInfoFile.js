import { useSelector, useDispatch } from "react-redux";
import fileSizeFormat from "../../utils/fileSizeFormat";


export default function ModalContentInfoFile({ idx }) {
	const fileList = useSelector(state => state.userlist);
	const fileListResult = fileList.value[idx];

	return (
			<div className="form_file__item">
				<span><b>Файл: </b>{fileListResult.label}</span>
				<span><b>Дата и время загрузки: </b>{fileListResult.date}</span>
				<span><b>Размер: </b>{fileSizeFormat(fileListResult.filesize)}</span>
				<span><b>Комментарий: </b>{fileListResult.comment || <span>отсутствует</span>}</span>
				<span><b>Общая ссылка: </b>{fileListResult.url || <span>отсутствует</span>}</span>
			</div>
	)
}
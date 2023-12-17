import { useSelector, useDispatch } from "react-redux";
import fileSizeFormat from "../../utils/fileSizeFormat";


export default function ModalContentInfoFile({ idx }) {
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
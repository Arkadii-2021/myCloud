import React, { useState } from 'react';
import ModalContentInfoFile from "./ModalContentInfoFile";
import { ModalFileInfo } from "./ModalFileInfo";


export default function FileInfoDetail({ idx }) {
	const [isModal, setModal] = useState(false)
    const onClose = () => setModal(false)
	
	return (
		<>
			<button onClick={() => setModal(true)} className="btn-new" >&#128459;</button>
			<ModalFileInfo
                visible={isModal}
                title="Информация о файле"
                content={ <ModalContentInfoFile setModal={setModal} idx={idx} /> }
                footer={<button className="btn-new" onClick={onClose}>Закрыть</button>}
                onClose={onClose}
            />
		</>
	)
}

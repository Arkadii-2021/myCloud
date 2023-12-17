import React, { useState } from 'react';
import ModalUserContent from "./ModalUserContent";
import { Modal } from "./Modal";


export default function RenameUserFile({ newLoginUser, newFileListP, ids, folderId, isfileName, isfileComment, userNameList }) {
	const [isModal, setModal] = useState(false)
    const onClose = () => setModal(false)
	
	return (
		<>
			<button onClick={() => setModal(true)} className="btn-new" >&#9998;</button>
			<Modal
                visible={isModal}
                title="Переименовать файл"
                content={ <ModalUserContent isfileName={isfileName} isfileComment={isfileComment} ids={ids} folderId={folderId} newLoginUser={newLoginUser} newFileListP={newFileListP} setModal={setModal} userNameList={userNameList} /> }
                footer={<button className="btn-new" onClick={onClose}>Закрыть</button>}
                onClose={onClose}
            />
		</>
	)
}
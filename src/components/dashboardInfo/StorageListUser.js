import React from 'react';
import { useNavigate } from "react-router-dom";

export default function StorageListUser({ userNameList }) {
	const nav = useNavigate();
	
	const browserList = () => {
		nav("/userlist", { replace: true, state: { usrNamelist: userNameList }})
    }	
	
	return (
		<>
			<button style={{cursor: "pointer"}} className="btn-new" onClick={() => { browserList() }}>&#128449; Обзор</button>
		</>
	)
}
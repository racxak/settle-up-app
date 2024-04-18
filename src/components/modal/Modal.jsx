import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import './Modal.css'
import IconButtonClose from '../../assets/icon-button-close.png' 

const Modal = forwardRef(function Modal(
	{ children, onClose },
	ref
) {
  const dialog = useRef();
	useImperativeHandle(ref, ()=>{
		return{
			open(){
				 dialog.current.showModal();
			}
		}
	});


	return createPortal(
		<dialog ref={dialog} className="modal-external" onClose={onClose}
		>
		<div className="modal-internal">
		{children}
		</div>	
      <form method="dialog" onSubmit={onClose}>
				<button className="button-close"><img className="btn-close" src={IconButtonClose} alt="icon-button-close" /></button>
			</form>
		</dialog>
,
		document.getElementById('modal')
	);
});

export default Modal;
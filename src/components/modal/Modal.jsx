import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import './Modal.css'
import IconButtonClose from '../../assets/icon-button-close.png' 

const Modal = forwardRef(function Modal(
	{ children, onClose },
	ref
) {
  const dialog = useRef();
	
  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
    close() {
      dialog.current.close();
    }
  }));



	return createPortal(
		<dialog ref={dialog} className="modal-external" onClose={onClose}
		>
		<div id="scrollbar" className="modal-internal ">
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
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal(){
    const { store } = useContext(GlobalStoreContext);

    const id = store.listMarkedForDeletion;
    const name = store.listnameMarked;

    function handleConfirmDeleteList () {
        store.deleteList(id);
        store.closeModal("delete-list-modal");
    }

    function handleCancelDeleteListModal () {
        store.closeModal("delete-list-modal");
    }

        return (
            <div
                id="delete-list-modal"
                className={"modal "}
                data-animation="slideInOutLeft">
                <div
                    id='delete-list-root'
                    className="modal-root">
                    <div
                        id="delete-list-modal-header"
                        className="modal-north">
                            Delete Song</div>
                    <div
                        id="delete-list-modal-content"
                        className="modal-center"> Are you sure you wish to permanently delete {name} from the playlist?
                    </div>
                    <div className="modal-south">
                        <input type="button" id="delete-list-confirm-button" className="modal-button" value='Confirm' onClick={handleConfirmDeleteList} />
                        <input type="button" id="delete-list-cancel-button" className="modal-button" value='Cancel' onClick={handleCancelDeleteListModal} />
                    </div>
                </div>
            </div>
        );
}

export default DeleteListModal
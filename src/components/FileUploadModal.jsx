import { useState } from 'react';
import { T } from '../i18n.js';

// shared
import { useSharedState } from '../SharedStateContext.jsx';
import { importCharacterFromFile } from '../SharedStorage.js';

export default function FileUploadModal() {

    const {
        setModalHeader,
        setModalMsg,
        setShowModal,
        setCharName,
        setIsChecked,
        setMAX_XP,
        setTableData,
        setShowUploadModal,
        setSelectedBasicSkill,
        setSelectedExtraSkill
    } = useSharedState();

    const [selectedFile, setSelectedFile] = useState(null);

    // Werk bestand info mbij
    const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };
    const closeModal = () => { setShowUploadModal(false); }

    // Oppakken van het aangewezen bestand, uitlezen en nakijken of het matcht.
    // Daarna de juiste velden en tabel updaten.
    function handleUpload() {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const rawData = e.target.result;
                try {
                    if (rawData) {
                        const charData = importCharacterFromFile(rawData);
                        if (charData) {
                            setCharName(charData.name || "Mr/Mrs Smith");
                            setIsChecked(charData.is_checked);
                            setMAX_XP(charData.max_xp);
                            setTableData(charData.Skills);
                            setSelectedBasicSkill(null);
                            setSelectedExtraSkill(null);
                            setSelectedFile(null);
                            closeModal();
                        }
                        else {
                            setModalHeader(T("generic.oops"));
                            const msg = T("fileupload_modal.modals.cant_load_version");
                            setModalMsg(msg);
                            setShowModal(true);
                            console.error(msg, selectedFile, charData);
                        }
                    }
                } catch (error) {
                    setModalHeader(T("generic.oops"));
                    const msg = "fileupload_modal.modals.unknown_error";
                    setModalMsg(T(msg));
                    setShowModal(true);
                    console.error(msg, error);
                }
            };

            reader.readAsText(selectedFile);
            closeModal();

            setSelectedFile(null);
        }
    }

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="upload-modal" onClick={e => e.stopPropagation()}>
                <h3>{T("fileupload_modal.labels.upload_file")}</h3>
                <div className="upload-modal-block center-content">
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className="upload-modal-block">
                    <button className="btn-primary" onClick={handleUpload}>{T("generic.upload")}</button>
                    <button className="btn-primary" onClick={closeModal}>{T("generic.cancel")}</button>
                </div>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
        </div>
    );
}